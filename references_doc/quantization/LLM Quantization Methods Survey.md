# Large Language Model (LLM) Quantization: Comprehensive Survey & Engineering Guide

> A structured, practical guide to quantization methods across model training, fine-tuning, and inference — from foundational integer arithmetic to modern FP4 architectures and hardware implementations.

---

## Table of Contents

1. [Mathematical Foundations of Quantization](#1-mathematical-foundations-of-quantization)
2. [Quantization Strategies: PTQ vs. QAT](#2-quantization-strategies-ptq-vs-qat)
3. [Weight & Activation Quantization Algorithms](#3-weight--activation-quantization-algorithms)
4. [Modern Low-Bit Floating-Point Formats](#4-modern-low-bit-floating-point-formats)
5. [Frontier Case Study: DeepSeek-V3 FP8 Pre-Training](#5-frontier-case-study-deepseek-v3-fp8-pre-training)
6. [KV Cache Quantization](#6-kv-cache-quantization)
7. [Local & Edge Inference: MLX & GGUF](#7-local--edge-inference-mlx--gguf)
8. [Practical Decision Guide: Which Format Should You Use?](#8-practical-decision-guide-which-format-should-you-use)
9. [Key References & Seminal Papers](#9-key-references--seminal-papers)

---

## Executive Summary & Quick Selection Matrix

Quantization addresses the fundamental bottleneck of small-batch LLM inference: **memory bandwidth**. At low batch sizes, autoregressive token generation is memory-bandwidth bound rather than compute-bound — arithmetic intensity is roughly constant per weight, so loading billions of parameters from High-Bandwidth Memory (HBM) into compute cores at every decoding step dominates latency and energy consumption. Above a hardware-specific batch threshold (typically **≳32–64 concurrent tokens** on H100/H200/B200), decode transitions into the **compute-bound** regime, which is precisely why low-bit *floating-point* formats with higher Tensor Core throughput (FP8, NVFP4 in §4) remain valuable even after memory savings plateau.

**Notation used throughout:** **WxAy** denotes *x*-bit weights and *y*-bit activations (e.g., W8A8 = 8-bit weights + 8-bit activations; W4A16 = 4-bit weights + 16-bit activations). A third dimension, **KVn**, denotes KV-cache precision where relevant.

| Use Case / Target Hardware | Recommended Method | Typical Precision | Format / Ecosystem | Accuracy Retention |
| :--- | :--- | :--- | :--- | :--- |
| **Consumer GPU (VRAM-Constrained, e.g. 24GB RTX 4090)** | **AWQ / GPTQ** | 3.5 – 4.5 bpw | vLLM, AutoAWQ | Excellent (within 1% perplexity) |
| **Consumer CPU / Apple Silicon (MacBook, Edge)** | **GGUF (K-Quants)** | Q4_K_M (~4.85 bpw), Q5_K_M (~5.6 bpw) | llama.cpp, Ollama | Near-lossless for Q5, minimal loss for Q4 |
| **Production Serving (NVIDIA Ada / Hopper / Blackwell)** | **FP8 (W8A8) / NVFP4** [1](#fn1) | 8-bit FP / 4-bit FP | vLLM, TensorRT-LLM, SGLang | 99.5%+ baseline accuracy; 2–4× throughput |
| **Consumer Fine-Tuning (Single GPU)** | **QLoRA (NF4)** | 4-bit weights + FP16 LoRA | bitsandbytes, PEFT | Matches full 16-bit fine-tuning |
| **Extreme Compression (< ~3.1 bpw)** | **GGUF I-Matrix** | 2.2 – 3.1 bpw | llama.cpp (`IQ3_XXS`, `IQ2_S`) | Usable 70B+ models in < 24GB VRAM |
| **Pre-training / Large-Scale Post-Training** | **Tile-wise FP8** | FP8 (E4M3 / E5M2) | DeepGEMM, Megatron-LM | Full training stability (DeepSeek-V3) |
| **Ternary / Extreme Weight-Only (research)** | **BitNet b1.58 (W1.58A8)** | 1.58-bit weights | bitnet.cpp (CPU), llama.cpp | Requires from-scratch training, not PTQ |

<a name="fn1"></a>**[1]** FP8 (W8A8) is supported on Ada and Hopper; **NVFP4 is Blackwell-only** (5th-gen Tensor Cores). Do not select FP4 kernels for L40S/H100 fleets.

---

## 1. Mathematical Foundations of Quantization

Quantization maps continuous real numbers $X \in \mathbb{R}$ to a discrete set of low-bit integers $Q \in \mathbb{Z}$.

### 1.1 Uniform Affine (Asymmetric) Quantization
Maps values to an arbitrary asymmetric range using a scale factor $S$ and an integer zero-point $Z$:

$$Q = \text{clip}\left(\left\lfloor \frac{X}{S} \right\rceil + Z, \; q_{\min}, \; q_{\max}\right)$$

Dequantization reconstructs the approximate real value $\hat{X}$:

$$\hat{X} = S \cdot (Q - Z)$$

- **Scale ($S$):** $S = \frac{\max(X) - \min(X)}{q_{\max} - q_{\min}}$
- **Zero-Point ($Z$):** $Z = \text{round}\left(- \frac{\min(X)}{S}\right) + q_{\min}$
- **Pros/Cons:** Better captures skewed, non-zero-centered distributions, but adds runtime latency due to zero-point offsets in matrix multiply operations.

### 1.2 Symmetric Quantization
Constrains the zero-point to zero ($Z = 0$), centering the range symmetrically around zero:

$$Q = \text{clip}\left(\left\lfloor \frac{X}{S} \right\rceil, \; -2^{b-1}, \; 2^{b-1} - 1\right), \quad S = \frac{\max(|X|)}{2^{b-1} - 1}$$

$$\hat{X} = S \cdot Q$$

- **Pros/Cons:** Eliminates zero-point subtraction, enabling hardware-native integer GEMM (General Matrix Multiply). Maximum rounding error is bounded by $\frac{S}{2}$.
- **Implementation note:** The clip range $[-2^{b-1}, 2^{b-1}-1]$ is asymmetric by one code point, while $S$ is derived from $2^{b-1}-1$. Consequently the most-negative representable code is never produced by this scale. This is harmless for inference but must be accounted for when reasoning about the worst-case representable magnitude.

### 1.3 Quantization Granularity
- **Per-Tensor:** One scale factor $S$ for the entire weight/activation matrix. Lowest memory overhead, highest quantization error.
- **Per-Channel (Row/Column):** Each row or output channel receives an independent scale factor. Standard for weights.
- **Block/Group-wise:** Contiguous groups of elements (e.g., $g=32, 64, 128$) share a scale. Balances memory overhead and dynamic range preservation.

**Budgeting scale overhead (the bpw you actually pay):**

$$\text{effective bpw} = b + \frac{\text{bits(scale)} + \text{bits(zero-point)}}{g}$$

| Scheme | Element bits $b$ | Scale metadata | Group $g$ | **Effective bpw** |
| :--- | :--- | :--- | :--- | :--- |
| INT4 + FP16 scale (no ZP) | 4 | 16 | 128 | 4.125 |
| INT4 + FP16 scale + ZP | 4 | 32 | 128 | 4.25 |
| INT4 + INT8 scale (double quant.) | 4 | 8 | 64 | 4.125 |
| MXFP4 (E8M0 scale) | 4 | 8 | 32 | **4.25** |
| NVFP4 (E4M3 scale + FP32 outer) | 4 | ~8 | 16 | **~4.5** |
| GGUF Q4_K_M (mixed 4/5/6-bit) | 4–6 | 6-bit superblock scale/min | 32 | **~4.85** |

Per-tensor INT4 is exactly 4.0 bpw; per-channel INT4 trends toward 4.0 bpw only for very wide rows. Quoting "4-bit" without the granularity is therefore incomplete for VRAM sizing.

---

## 2. Quantization Strategies: PTQ vs. QAT

```
                          ┌───────────────────────────┐
                          │     High-Precision Model  │
                          │        (FP16 / BF16)      │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
    ┌─────────────────────────┐                   ┌─────────────────────────┐
    │ Post-Training (PTQ)     │                   │ Quant-Aware (QAT)       │
    ├─────────────────────────┤                   ├─────────────────────────┤
    │ • Calibration set only  │                   │ • Retraining / fine-tune│
    │ • No backpropagation    │                   │ • Fake-quant nodes      │
    │ • Minutes to hours      │                   │ • STE gradient updates  │
    │ • Standard for 8b & 4b  │                   │ • High compute/memory   │
    │ • Risk: error cascade   │                   │ • Essential for < 3-bit │
    │   below 4-bit           │                   │ • Modern: PE-QAT / LoRA │
    └─────────────────────────┘                   └─────────────────────────┘
```

- **PTQ (Post-Training Quantization):** Requires only a forward pass on a small calibration set (128–512 samples) to compute statistical ranges. Dominates deployment due to zero retraining compute.
- **QAT (Quantization-Aware Training):** Simulates quantization noise in the forward pass using straight-through estimators (STE) while updating high-precision weights during backpropagation.
- **Parameter-Efficient QAT (PE-QAT / ZeroQAT):** Freezes base weights and trains low-rank adapters (LoRA) or clipping boundaries under simulated quantization, preserving accuracy down to 2–3 bits with < 2% trainable parameters.

#### Calibration & Evaluation Practice (the part that decides success)
- **Calibration corpus:** The single largest source of PTQ variance. Generic choices (WikiText-2, C4) are convenient but mismatch domain-specific deployments; prefer 128–512 samples drawn from *in-domain* text at the model's native sequence length (e.g., 2048–4096 tokens). Longer sequences surface activation outliers that short samples miss.
- **Calibration must match deployment.** AWQ/GPTQ quality depends on the observed activation distribution, so calibrate under the same attention implementation (eager vs. FlashAttention) and precision you will actually serve with.
- **Evaluate task accuracy, not only perplexity.** Causal-LM perplexity frequently stays flat while downstream reasoning, long-context, and structured-output tasks degrade. Report a task suite (e.g., MMLU / GSM8K / long-context retrieval) alongside PPL before shipping.

---

## 3. Weight & Activation Quantization Algorithms

### 3.1 LLM.int8() — Mixed-Precision Outlier Decomposition
- **The Insight:** Transformer activations naturally exhibit massive outlier features (magnitude $> 6.0$) in ~0.1%–1% of channels across all tokens. Uniform INT8 stretches the scale factor, destroying precision in the remaining 99% of values.
- **The Mechanism:**
  1. Decomposes input activation matrix $X$ and weight matrix $W$ along outlier channels.
  2. Multiplies outlier columns in native **FP16**.
  3. Multiplies normal columns in **INT8**.
  4. Sums the resulting outputs: $Y = X_{\text{outlier}} W_{\text{outlier}} + S_X S_W (X_{\text{int8}} W_{\text{int8}})$.
- **Trade-off:** Halves VRAM usage with zero degradation, but mixed routing induces runtime latency penalties (often slower than native FP16).

---

### 3.2 QLoRA & NF4 (NormalFloat4)
Designed to fine-tune massive LLMs on a single consumer GPU without quality loss.

```
QLoRA Architecture (two parallel paths rejoin at the output add)

   Input X ──┬──► [ Dequant NF4 ──► FP16 ] ──► Frozen Base Linear ──┐
             │          ▲                                          │
             │          └── Frozen NF4 weights + double-quant scales
             │                                                     ▼
             └──► [ LoRA A (FP16) ] ──► [ LoRA B (FP16) ] ─────────► (+)
```

- **NF4 (NormalFloat4):** Pre-trained neural network weights follow a zero-mean normal distribution $\mathcal{N}(0, \sigma^2)$. Linear quantization bins waste representation capacity at the distribution tails. NF4 constructs an information-theoretically optimal 4-bit data type where each of the 16 quantization bins has **equal probability area**, maximizing theoretical entropy.
- **Double Quantization (DQ):** Quantizes the quantization scale factors themselves (e.g., quantizing 32-bit float scale factors to 8-bit FP with a block size of 256), saving ~0.37 bits per parameter.
- **Paged Optimizers:** Uses CUDA Unified Memory to automatically page optimizer states to CPU RAM during memory spikes, preventing out-of-memory crashes.

---

### 3.3 Second-Order vs. Activation-Aware Methods: GPTQ vs. AWQ

When quantizing weights to 4-bit or 3-bit, simple Round-to-Nearest (RTN) collapses. Modern methods use either Hessian error compensation or activation salience preservation.

```
┌────────────────────────────────────────────────────────────────────────┐
│ GPTQ: Hessian Error Compensation                                       │
│                                                                        │
│   Quantize column w_q  ──► Calculate error e = w_q - round(w_q)        │
│                                  │                                     │
│   Update remaining columns: W_remaining -= e * (H^{-1})_col / H^{-1}_qq│
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ AWQ: Salient Channel Protection via Equivalent Scaling                 │
│                                                                        │
│   Identify top 1% salient activation channels                          │
│   Scale salient weights UP by s, scale activations DOWN by s           │
│   Y = (X · diag(s)^{-1}) · (diag(s) · W)  ──► Quantize to uniform INT4 │
└────────────────────────────────────────────────────────────────────────┘
```

#### GPTQ (Generative Pre-trained Transformer Quantization)
- **Mathematical Principle:** Formulates quantization as layer-wise reconstruction error minimization:
  
  $$\min_{\hat{W}} \| W X - \hat{W} X \|_2^2$$

- **Hessian Formulation:** Using a second-order Taylor expansion, error compensation is governed by the inverse Hessian $H^{-1} = (2 X X^T + \lambda I)^{-1}$.
- **Speed Optimizations:**
  1. *Fixed Quantization Order:* Column-wise quantization allows sharing a single inverse Hessian decomposition across all matrix rows.
  2. *Lazy Batch Updates:* Accumulates error updates in fast L2/SRAM cache over blocks of columns (e.g., 128) before performing a global DRAM write.
  3. *Cholesky Decomposition:* Numerically stable computation with diagonal dampening ($\lambda = 0.01 \cdot \text{diag\_mean}$).
- **Result:** Quantizes 175B parameter models in under 4 hours on a single A100.

#### AWQ (Activation-Aware Weight Quantization)
- **The Observation:** Not all weights are equally important. Protecting just **1% of salient weights** eliminates almost all quantization degradation.
- **Defining Salience:** Salient weights are those connected to **high-magnitude activation channels**, not necessarily the largest weights in magnitude.
- **Per-Channel Scaling Trick:** To avoid mixed-precision hardware inefficiency, AWQ searches for an optimal per-channel scale factor $s > 1$:
  
  $$W' = W \cdot \text{diag}(s), \quad X' = X \cdot \text{diag}(s)^{-1}$$

  By scaling up salient weights before quantization, their relative rounding error is suppressed. The inverse scale is absorbed into the preceding activation layer (e.g., LayerNorm or Linear bias).
- **Advantage over GPTQ:** Does not fit directly to the calibration dataset via Hessian inversion, making AWQ less prone to overfitting and faster to calibrate.

#### Summary Comparison: GPTQ vs. AWQ

| Metric | GPTQ | AWQ |
| :--- | :--- | :--- |
| **Core Idea** | Invert Hessian to compensate neighbor weights | Scale salient channels to protect critical weights |
| **Calibration Speed** | Moderate (minutes to hours depending on model) | Very Fast (minutes) |
| **Generalization** | Can overfit to calibration domain | Exceptional domain generalization |
| **Inference Support** | Universal (AutoGPTQ, vLLM) | Universal (vLLM, TensorRT-LLM, TGI) |
| **Serving Kernel Speed**| High | Extremely High (Marlin & FlashInfer optimized) |

---

### 3.4 Activation Outlier Handling: SmoothQuant, QuaRot, SpinQuant

When targeting **W8A8** (both weights and activations in 8-bit) or **W4A4**, activations become the primary point of failure.

#### SmoothQuant: Difficulty Migration
- **Insight:** Activations have extreme outliers; weights are uniform and smooth.
- **Mechanism:** Migrates quantization difficulty from activations to weights via an equivalent mathematical transformation:
  
  $$Y = (X \cdot \text{diag}(s)^{-1}) \cdot (\text{diag}(s) \cdot W) = \hat{X} \hat{W}$$

- **Balancing Factor:** The scale $s_j$ for channel $j$ is calculated as:
  
  $$s_j = \frac{\max(|X_j|)^\alpha}{\max(|W_j|)^{1-\alpha}}$$
  
  Setting $\alpha = 0.5$ evenly splits difficulty between activations and weights, allowing standard INT8 GEMMs on both tensors with zero accuracy degradation on 100B+ models.

#### QuaRot & SpinQuant: Orthogonal Rotation
For ultra-low precision (W4A4), channel-scaling breaks down because the 4-bit dynamic range is too narrow.
- **QuaRot (Randomized Hadamard Rotation):** Multiplies activations and weights by an orthogonal matrix $R$ ($R^T R = I$):
  
  $$Y = (X R) (R^T W)$$
  
  Because orthogonal transformations preserve Euclidean lengths and angles, they **disperse activation outliers** across all channels, driving each channel's marginal distribution much closer to a Gaussian with heavy tails suppressed. The transformation does *not* make channels statistically independent — rotated correlated channels remain dependent; the guarantee is *incoherence* (outliers no longer concentrated in a few fixed channels), not independence.
- **SpinQuant (Learned Orthogonal Rotations):** Replaces fixed Hadamard matrices with layer-specific learned rotation matrices optimized via Cayley SGD on calibration data, closing the accuracy gap on W4A4 down to < 3% perplexity delta.

---

## 4. Modern Low-Bit Floating-Point Formats

FP formats provide superior dynamic range compared to fixed-point integers due to their floating exponent structure.

```
FP8 Formats:
E4M3: [ Sign (1b) | Exponent (4b) | Mantissa (3b) ]  ──► High precision, range [-448, 448] (Weights/Activations)
E5M2: [ Sign (1b) | Exponent (5b) | Mantissa (2b) ]  ──► Wide dynamic range, range [-57344, 57344] (Gradients)

Microscaling Formats (MX):
┌────────────────────────┬────────────────────────────────────────────────────────┐
│ Shared Scale (E8M0)    │ 32 Elements: e.g., FP4 (E2M1) or FP8 (E4M3)            │
└────────────────────────┴────────────────────────────────────────────────────────┘

NVFP4 (NVIDIA Blackwell Two-Level Scaling):
┌────────────────────────┬───────────────────────────────┬────────────────────────┐
│ Outer Scale (FP32)     │ Inner Scale (E4M3 per 16 el)  │ 16 Elements (E2M1 FP4) │
└────────────────────────┴───────────────────────────────┴────────────────────────┘
```

### 4.1 FP8 in Production Serving (vLLM / TensorRT-LLM)
- **E4M3 vs. E5M2:** E4M3 is used for forward GEMMs (weights & activations) where precision dominates. E5M2 is used for backward passes and gradients where wide dynamic range prevents underflow.
- **Dynamic Per-Token Activation Scaling:** Compute engines dynamically calculate a separate scale factor for each incoming token activation vector on the fly, absorbing prompt-dependent outlier bursts.

### 4.2 OCP Microscaling Formats (MXFP8, MXFP6, MXFP4)
- Developed by the Open Compute Project (AMD, Arm, Intel, Meta, Microsoft, NVIDIA, Qualcomm).
- Partitions tensors into fixed blocks of **32 elements** that share a common **8-bit exponent-only scale factor (E8M0)**.
- **MXFP4** carries an effective bitrate of **~4.25 bits per element** (4-bit payload + 8-bit scale shared across 32 elements). Multiplying this out is a free arithmetic identity; by contrast, the commonly quoted throughput multiplier over BF16 is **kernel- and hardware-specific** (vendor demos cite ~2–2.7× on supporting accelerators) and should not be read as an architectural constant.
- MX is a **weight-and-activation (WxA) format**, not weight-only: the shared E8M0 block scale applies to both operands. **MXFP6** (E3M2 / E2M3) spends ~1.7 more bpw for materially better accuracy than MXFP4 at well under MXFP8 cost.

### 4.3 NVIDIA NVFP4 (Blackwell Architecture)
NVIDIA's proprietary format for 5th-generation Tensor Cores on Blackwell (B100, B200):
- **Problem with standard FP4:** Pure E2M1 FP4 has only 1 sign bit, 2 exponent bits, and 1 mantissa bit (representable dynamic range between $-6.0$ and $+6.0$).
- **Blackwell Two-Level Scaling Solution:**
  1. *Inner Scale:* Every **16 elements** share a high-precision **E4M3 FP8** micro-scale factor. E4M3 has 256 code points, yielding roughly two orders of magnitude of fine-grained scale resolution (note E4M3 defines no infinities — an all-ones mantissa with exponent 15 encodes NaN).
  2. *Outer Scale:* A tensor-wide **FP32** scale factor prevents saturation across the entire tensor.
- **Throughput:** Blackwell-class parts reach on the order of **9 PFLOPS dense FP4** (~2× dense FP8, ~4× dense BF16). NVIDIA's larger ~18 PFLOPS headline assumes **2:4 sparsity**; both figures are per-GPU peaks achievable only with large GEMMs and FP4-native kernels.
- **Capacity:** At ~4.5 bpw including scales, 70B-class *weights* fit comfortably on a single **96GB+ Blackwell** part with headroom for KV cache and activation buffers. There is no 40GB Blackwell SKU, and a 40GB A100 is Hopper — it cannot execute NVFP4 kernels at all.

---

## 5. Frontier Case Study: DeepSeek-V3 FP8 Pre-Training

While most quantization is applied post-training, **DeepSeek-V3** successfully pre-trained a 671-billion parameter Mixture-of-Experts (MoE) model from scratch in FP8 mixed precision.

```
DeepSeek-V3 Fine-Grained Quantization Scheme:
Activations: Sliced into [1 × 128] token-channel tiles  ──► Tile-wise scale
Weights:     Blocked into [128 × 128] GEMM tiles        ──► Block-wise scale
Execution:   Custom DeepGEMM (CUDA C++) kernels keeping GEMM inside Hopper Tensor Cores
```

- **Overcoming Hardware Truncation:** Per the DeepSeek-V3 report, the FP8 GEMM accumulation path offers only a limited accumulator mantissa width (the report cites roughly 13–14 effective bits, versus ~23 for FP32 accumulation); NVIDIA has not published an ISA-level guarantee. This width risks progressive precision loss and divergence across long reductions. Mitigations:
  - **Tile-wise Activation Quantization:** Quantized at a granularity of $1 \times 128$ (per-token along 128-channel slices), confining outlier shocks strictly to local tiles.
  - **Block-wise Weight Quantization:** Quantized in blocks of $128 \times 128$ parameters, matching hardware GEMM chunk sizes.
- **DeepGEMM Kernels:** DeepSeek's open-source **CUDA C++** library (CUTLASS-style, hand-tuned `wgmma` paths) bypassing general-purpose library overhead to run fine-grained tile scaling directly within Tensor Core registers. It is *not* a Triton project — do not go looking for Triton sources.

---

## 6. KV Cache Quantization

During long-context autoregressive generation (e.g., 32k–128k tokens), Key-Value (KV) cache memory dominates GPU VRAM, surpassing the model weights themselves.

$$\text{KV Cache (Bytes)} = 2 \cdot n_{\text{layers}} \cdot n_{\text{kv\_heads}} \cdot d_{\text{head}} \cdot L_{\text{context}} \cdot B \cdot \frac{\text{bits/elem}}{8}$$

The two "2"s in naive formulas are folded into this form: the leading factor of 2 is the Key+Value pair, and `bits/elem ÷ 8` is the storage precision. **The head count must be the number of *KV heads*, not query heads.** Under Grouped-Query Attention (GQA) — used by essentially every modern serving model (Llama-3, Qwen, Mistral, DeepSeek) — `n_kv_heads ≪ n_heads`. For Llama-3-70B (64 query heads, 8 KV heads), using `n_heads` **overstates the cache by 8×** and will badly mis-size a host for 128k-context serving.

### Optimization Techniques
- **FP8 KV Cache:** Enabled via `--kv-cache-dtype fp8` in vLLM. Reduces KV cache memory by **50%** with virtually zero accuracy degradation.
- **Sub-4-bit KV with residual windows (KIVI, KVQuant):** Quantize **Keys per-channel** and **Values per-token** — the axes along which each is actually skewed — while keeping a small recent-token window (e.g., 32–128 tokens) in full precision. This reaches ~2-bit KV with sub-0.1 perplexity degradation and is the practical route below 4-bit. (Earlier drafts of this survey referred loosely to "FlashQ" here; the verifiable literature is the KIVI / KVQuant line.)
- **Why per-tensor INT4 KV fails:** The failures are driven by a few *outlier channels* that dominate softmax logits. Choosing the right grouping axis (per-head / per-channel / per-token) to isolate those channels — not approximating attention itself — is what preserves accuracy.
- **Impact:** Increases serving batch size by **2×–4×** at FP8 and **4×–8×** at ~2-bit KV, dramatically lowering inference cost per token on long context windows.

---

## 7. Local & Edge Inference: MLX & GGUF

### Apple MLX Framework (Apple Silicon Native)
Apple's MLX framework provides highly optimized, native execution specifically designed for Apple Silicon (M1 through M4) via its Metal backend.

- **Metal Quantization Architecture:** MLX performs affine quantization using custom Metal kernels that fuse dequantization and matrix multiplication. Weights are packed into uint32 tensors alongside per-group scales and biases.
- **Precision & Granularity:** The framework natively supports 2-bit, 4-bit, and 8-bit precision configurations, utilizing a default group size of 64 (configurable to 32/128).
- **Hardware Execution:** The fused kernels keep memory usage low by executing inference entirely on the GPU without requiring CPU round-trips.
- **Performance Dynamics:** For 4-bit quantized models in the 7B to 30B parameter range, MLX typically achieves faster token generation speeds than llama.cpp during standard generation phases. However, on older Apple Silicon architectures (M1 and M2), MLX can suffer severe prefill latency bottlenecks during long-context tasks. This occurs because MLX models default to bf16 data types, which lack native hardware support on pre-M3 chips, whereas llama.cpp uses natively supported fp16.

---

### GGUF & llama.cpp (Universal Edge)

- **GGUF Structure:** Self-contained binary format storing model architecture, hyper-parameters, tokenizers, and tensor weights in a single file with native `mmap` (memory-mapping) for instantaneous loading.
- **K-quants Superblock Architecture:**
  - Organizes matrices into **Superblocks of 256 weights**, divided into 8 sub-blocks of 32 weights.
  - Each superblock carries a **6-bit shared scale and 6-bit shared minimum** (the "6/8-bit" metadata) plus per-sub-block micro-scale/min offsets. This is fixed per-superblock overhead paid by every K-quant type — it is not a per-tensor precision.
  - **Q4_K_M (Gold Standard, ~4.85 bpw):** Uses 4-bit *data* blocks for most tensors, while the `_M` ("medium") tensor-type policy promotes the sensitive tensors: **`attn_v` and `ffn_down` to Q6_K**, and **`attn_output` (plus fused `attn_qkv`) to Q5_K**. Note `attn_q`/`attn_k` are **not** promoted, and GGUF tensors use the `attn_*`/`ffn_*` names — *not* the HuggingFace `wq`/`wk`/`wv` names used in earlier drafts. Confirm the exact set against `llama_tensor_get_type()` in `llama.cpp` before quoting it.
- **I-quants (Importance Matrix):** Computes weight sensitivity via `llama-imatrix` from a calibration dataset. Enables viable inference at extreme sub-3-bit levels (`IQ2_XXS`, `IQ3_XXS`, `IQ3_M`).
- **CPU SIMD Optimization:** Hand-written assembly kernels leveraging **ARM NEON/SVE** (Apple Silicon) and **AVX-512 VNNI** (Intel/AMD), executing **8-bit** integer dot products at full hardware wire speed. There is no native 16-bit integer dot-product instruction on AVX-512: the 8-bit VNNI path (`vpdpbusd`) is the fast one, while 16-bit integer work must decompose into separate multiply/accumulate sequences (`vdpbf16ps` is bf16 *floating-point*, not integer).

---

## 8. Practical Decision Guide: Which Format Should You Use?

```
Do you have an enterprise GPU cluster (H100 / H200 / B200)?
├── YES ──► Use FP8 (vLLM / TensorRT-LLM) or NVFP4 (Blackwell)
└── NO  ──► Are you deploying on consumer GPUs or CPUs?
            ├── Consumer GPU (NVIDIA RTX 3090 / 4090 / 5090)
            │   └── High throughput / server ──► AWQ or GPTQ (vLLM, TensorRT-LLM)
            └── CPU / Apple Silicon / Mobile
                ├── Balanced 4-bit (recommended) ──► GGUF Q4_K_M (llama.cpp)
                ├── Near-lossless 5-bit          ──► GGUF Q5_K_M (llama.cpp)
                └── VRAM-constrained (< ~3.1 bpw) ──► GGUF IQ3_XXS / IQ2_S (imatrix)
```

---

## 9. Key References & Seminal Papers

1. **AWQ:** Lin et al. (2023) — *AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration*. [arXiv:2306.00978](https://arxiv.org/abs/2306.00978)
2. **GPTQ:** Frantar et al. (2022) — *GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers*. [arXiv:2210.17323](https://arxiv.org/abs/2210.17323)
3. **QLoRA:** Dettmers et al. (2023) — *QLoRA: Efficient Finetuning of Quantized LLMs*. [arXiv:2305.14314](https://arxiv.org/abs/2305.14314)
4. **LLM.int8():** Dettmers et al. (2022) — *LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale*. [arXiv:2208.07339](https://arxiv.org/abs/2208.07339)
5. **SmoothQuant:** Xiao et al. (2022) — *SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models*. [arXiv:2211.10438](https://arxiv.org/abs/2211.10438)
6. **QuaRot:** Ashkboos et al. (2024) — *QuaRot: Outlier-Free 4-Bit Inference in Large Language Models via Rotations*. [arXiv:2404.00456](https://arxiv.org/abs/2404.00456)
7. **SpinQuant:** Liu et al. (2024) — *SpinQuant: LLM Quantization with Learned Rotations*. [arXiv:2405.16406](https://arxiv.org/abs/2405.16406)
8. **DeepSeek-V3:** DeepSeek-AI (2024) — *DeepSeek-V3 Technical Report (FP8 Training)*. [arXiv:2412.19437](https://arxiv.org/abs/2412.19437)
9. **KIVI:** Liu et al. (2024) — *KIVI: A Tuning-Free Asymmetric 2bit Quantization for KV Cache*. [arXiv:2402.02750](https://arxiv.org/abs/2402.02750)
10. **KVQuant:** Hooper et al. (2024) — *KVQuant: Towards 10 Million Context Length LLM Inference with KV Cache Quantization*. [arXiv:2401.18079](https://arxiv.org/abs/2401.18079)
11. **BitNet b1.58:** Ma et al. (2024) — *The Era of 1-bit LLMs: All Large Language Models are in 1.58 Bits*. [arXiv:2402.17764](https://arxiv.org/abs/2402.17764)
12. **OCP Microscaling Formats:** Open Compute Project (2023) — *Microscaling Data Formats for Deep Learning* (OCP MX Specification v1.0). [OCP MX v1.0 (PDF)](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)
13. **llama.cpp:** Gerganov et al. — *GGUF & K-Quants Specification*; current tensor-type table lives in the `ggml` source. [GitHub: ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)