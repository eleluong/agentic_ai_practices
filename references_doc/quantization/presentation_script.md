# LLM Quantization — Presentation Script & Slide Outline

> Companion presentation script for [`LLM Quantization Methods Survey.md`](LLM%20Quantization%20Methods%20Survey.md).
> Tailored for **AI Engineers, MLOps, and Infrastructure Leads**: minimal formula overhead, focused on architectural ideas, practical serving trade-offs, and deployment reality checks.
>
> Each slide ends with an italic *Speaker note* (the one thing to say out loud) and a 📊 **Diagram** pointer into [`quantization_visuals.md`](quantization_visuals.md) (Mermaid). Slides marked **[Backup]** are not part of the main run-of-show.

---

## Deck Architecture at a Glance

| Module | Slides | Theme | Engineering Focus |
| :--- | :--- | :--- | :--- |
| **0. Overview** | 1–2 | Why Quantize & The Trilemma | Memory, speed, TCO; selection guide |
| **1. Foundations** | 3 | Empirical Footprint & Quality Frontier | Real footprint vs. accuracy & KL divergence |
| **2. Strategy** | 4–5 | PTQ vs QAT & Calibration | Zero-cost PTQ, PE-QAT, calibration & eval traps |
| **3. Algorithms** | 6–8 | Weight & Activation Methods | Outliers, QLoRA, GPTQ, AWQ, SmoothQuant, Rotations |
| **4. Formats** | 9 | FP8, OCP MX, NVFP4 | Microscaling, exponent shifts, Blackwell FP4 |
| **5. Production** | 10–12 | DeepSeek, KV Cache, Local/Edge | Long-context serving, GQA trap, Apple Silicon, GGUF |
| **6. Summary** | 13 | Decision Flowchart + Rules | Production flowchart with rules of thumb |
| **Backup** | B1–B2 | References & Fact Checks | Hardware compatibility and field guide |

---

# Module 0 — Opening

## Slide 1 — Why Quantize: Memory, Speed, TCO

- **Subtitle**: From Integer Arithmetic to FP4: Architectural Paradigms, Real Memory Costs, and Hardware Realities
- **1. Memory — the enabler of frontier scale**
  - 16-bit weights alone cost **~800GB–2TB+** for 405B–1T+ models — warehouse-scale clusters before a single KV token.
  - Low precision (FP8, NVFP4, INT4) collapses footprints **2×–4×**, turning impossible clusters into single-rack nodes.
  - Also compresses KV cache: at 32k–128k context it **outgrows model weights**.
- **2. Speed — match the bottleneck**
  - *Low batch (chat/agents)*: memory-bandwidth bound → weight-only quant (W4A16).
  - *High batch (serving)*: compute bound → low-bit GEMMs (FP8, NVFP4).
  - Also unlocks **1-GPU fine-tuning** (QLoRA) and **FP8 pre-training** (DeepSeek-V3).
- **3. Economics & democratization — TCO**
  - Cuts energy ($/token) and hosting cost **3×–5×**; shrinks container cold starts and checkpoint sync.
  - Runs production models locally: Apple Silicon (MLX), CPUs (GGUF), consumer GPUs (RTX 3090/4090).
- **⚠ The Engineering Trap**: Nominal "4-bit" misleads. Always account for **metadata overhead** (scales/zero-points) and **hardware ISA support** (what executes natively).

*Speaker note: Quantization is not a compression trick for small models — it is the enabler of frontier-scale AI. Three payoffs: memory, speed, TCO. But headline bit-widths lie.*

📊 **Diagram:** [Universal Quantization Pipeline + Granularity](quantization_visuals.md#1-the-universal-quantization-pipeline)

---

## Slide 2 — The Engineering Trilemma: Memory, Speed, and Accuracy

```
                         [ MEMORY ]
                   (VRAM & Hosting Cost)
                              /\
                             /  \
                            /    \
                           /      \
                          /        \
            [ SPEED ] ────────────── [ ACCURACY ]
     (Latency & Throughput)         (Reasoning & Task Quality)
```

- **1. Memory (VRAM Footprint & Capacity)**:
  - *Frontier Scale (405B–1T+ parameters)*: At 16-bit, weights alone demand **800GB to 2+ TB** of VRAM. FP8/FP4 collapses these models to fit inside a single 8-GPU node (**8xH200/B200**), eliminating inter-node tensor-parallel bottlenecks.
  - *Workstation / Single-Node Scale (70B)*: Compresses 140GB down to <40GB, running on 1 GPU instead of 2–4.
  - Reserves critical VRAM headroom for KV cache at long context (32k–128k tokens).
- **2. Speed (Latency vs. Throughput)**:
  - *Low Batch (Chat / Agents / Concurrency 1–16):* **Memory-bandwidth bound** — compute cores sit idle waiting for weights to transfer from VRAM. Cutting weight bit-width (W4A16, AWQ, GPTQ) directly cuts memory bus transfer time.
  - *High Batch (Throughput Serving / Concurrency ≳32–64 tokens):* **Compute bound** — Tensor Cores run at peak capacity; requires low-bit GEMMs (FP8, NVFP4) to multiply arithmetic operations per clock cycle.
  - *⚠ Overhead Alert:* Dequantization is not free. Naive routing (e.g. LLM.int8) saves VRAM but *slows down* inference relative to FP16.
- **3. Performance / Accuracy (Capability Retention)**:
  - **The 4-Bit Threshold:** ≥4-bit retains 99%+ accuracy via PTQ; below 4-bit, reasoning, math, and code degrade rapidly without advanced methods (PE-QAT, I-Matrix, Rotations).
  - **Silent Failures:** Perplexity can remain perfectly stable while strict JSON schemas and multi-step logic break completely.

*Speaker note: You can't maximize all three. Cutting VRAM does not guarantee speedups — first know whether you are bandwidth-bound or compute-bound.*

📊 **Diagram:** [Quantization Granularity](quantization_visuals.md#2-quantization-granularity-where-the-error-comes-from)

---

# Module 1 — Foundations: Real VRAM Cost

## Slide 3 — Empirical Trade-Offs: Footprint vs. Accuracy & Tail Divergence

| quant | GB | top-1 (%) | mean KLD | 99.9% KLD |
| :--- | :--- | :--- | :--- | :--- |
| **UD-IQ1_S** | 72.5 | 77.325 | 0.396070 | 7.2126 |
| **UD-Q4_K_XL** | 111.3 | 92.255 | 0.046893 | 1.5468 |
| **UD-Q6_K_XL** | 169.2 | 94.089 | 0.027091 | 0.8416 |
| **Q8_0** | 188.2 | 94.122 | 0.026574 | 0.8118 |

- **1. The Near-Zero Loss Plateau (5-bit to 8-bit)**:
  - `UD-Q6_K_XL` (169.2 GB) retains **94.089%** top-1 (matching `Q8_0` at 94.122%), saving ~19 GB with virtually zero distribution shift (mean KLD 0.027 vs. 0.026).
- **2. The Production Sweet Spot (4-bit)**:
  - `UD-Q4_K_XL` (111.3 GB) delivers **92.255%** top-1 with tightly bounded divergence (mean KLD 0.047, 99.9% tail KLD 1.5468).
  - Slashes footprint by **41% compared to Q8_0** while keeping high reasoning fidelity.
- **3. The Sub-4-Bit Cliff & Tail Blowup (1-bit to 3-bit)**:
  - Diminishing returns: stepping down from `UD-Q4_K_XL` (111.3 GB) to `UD-IQ1_S` (72.5 GB) saves only ~39 GB, but catastrophic error cascades occur.
  - Mean KLD degrades by **8.4×** (0.047 → 0.396), while **99.9% tail KLD explodes to 7.2126**.
- **4. Production Takeaway: Why 99.9% KLD Matters**:
  - Top-1 accuracy hides rare but fatal failure modes. High **99.9% tail KLD** correlates with real breakdowns: hallucinated syntax, loop traps, malformed JSON.
  - *Full 10-row table in [Backup Slide B2](#backup-slide-b2--full-empirical-table).*

*Speaker note: 4-bit is the sweet spot: 41% smaller than Q8 with high fidelity. Below 4-bit the tail blows up — and the tail is where production breaks.*

📊 **Diagram:** [Universal Quantization Pipeline](quantization_visuals.md#1-the-universal-quantization-pipeline)

---

# Module 2 — Strategy: PTQ vs QAT & Calibration

## Slide 4 — PTQ vs. QAT (and PE-QAT)

```
                    Base High-Precision Model (BF16 / FP16)
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│     Post-Training Quant (PTQ)         │   │     Quant-Aware Training (QAT)        │
├───────────────────────────────────────┤   ├───────────────────────────────────────┤
│ • Forward pass only on ~128–512 texts │   │ • Retraining / fine-tuning with backprop│
│ • No gradient computation; 5–60 mins  │   │ • Simulates quantization noise        │
│ • Zero training GPU compute cost      │   │ • Expensive cluster compute required  │
│ • Standard for 8-bit & 4-bit serving  │   │ • Essential below 3-bit precision     │
│ • ⚠ Risk: Error cascades below 4-bit  │   │ • Modern fix: PE-QAT (LoRA adapters)  │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
```

- **PTQ Advantage**: Zero backpropagation and zero training GPU compute cost; statistics come from a small calibration set. Dominates ~95% of deployments down to 4-bit.
- **QAT Advantage**: Inserts fake-quantization nodes to model rounding noise, updating high-precision weights via straight-through estimators.
- **PE-QAT (Parameter-Efficient QAT / ZeroQAT)**: Freeze the base model; train **only LoRA adapters or clipping bounds (<2% parameters)** under simulated quantization noise.
  - Achieves near-QAT accuracy at 2–3 bits on a **single developer node in hours**, bridging 'free PTQ' (fails below 4-bit) and 'full QAT' (cost-prohibitive).
- **The Rule**: Use **PTQ** down to 4-bit (AWQ, GPTQ, GGUF). Switch to **PE-QAT/QAT or rotation methods** only for 2–3 bit.

*Speaker note: PTQ is free and covers 95% of deployments down to 4-bit. Below that, PE-QAT buys near-QAT quality for <2% of a cluster bill.*

📊 **Diagram:** [PTQ vs. QAT (and PE-QAT)](quantization_visuals.md#3-strategy-ptq-vs-qat-and-pe-qat)

---

## Slide 5 — Calibration & Evaluation: The Production Gotchas

- **1. The Calibration Corpus Trap**:
  - Generic corpora (WikiText-2, C4) cause severe **domain mismatch** in production.
  - *Practice:* Use **128–512 domain-specific samples** (code, medical, legal, agent logs).
  - *Native Length:* Calibrate at **2048–4096 tokens**, not short 512 snippets; long context exposes activation outliers that short samples miss.
- **2. Kernel & Precision Parity**:
  - Calibration must match the serving runtime:
    - Same attention implementation (Eager vs. FlashAttention-2 / FlashInfer).
    - Same precision and data types (FP16 vs. BF16 vs. FP8).
- **3. The Evaluation Trap: Perplexity Lies**:
  - Perplexity (PPL) frequently stays flat while **code generation, math reasoning, and structured JSON collapse**.
  - *Gate Check:* Always benchmark task suites (**GSM8K, MMLU, JSON schema compliance**) before promoting a quantized model to production.

*Speaker note: Calibration corpus is the #1 source of PTQ variance — use in-domain data at native length. And never ship on PPL alone; run a task suite.*

📊 **Diagram:** [PTQ vs. QAT](quantization_visuals.md#3-strategy-ptq-vs-qat-and-pe-qat)

---

# Module 3 — Weight & Activation Algorithms

## Slide 6 — Outliers & Fine-Tuning: LLM.int8() and QLoRA/NF4

- **LLM.int8() — Outlier Channels**:
  - *Discovery*: In LLMs above 6.7B, **~0.1% of activation channels spike to extreme magnitudes** (>6.0) across all tokens; uniform INT8 stretches the scale and destroys precision for the other 99.9%.
  - *Fix*: Decompose the matrix — outlier columns in native **FP16**, normal columns in **INT8**, then sum.
  - *⚠ Reality*: Halves VRAM with zero accuracy loss, but mixed-precision routing adds latency — **often slower than native FP16**. Use for memory fitting, not speedups.
- **QLoRA & NF4 — Fine-Tuning on One GPU**:
  - *NF4*: Weights are roughly Gaussian, so NF4 sets bin thresholds with **equal probability mass** per bin (information-theoretically optimal for a bell curve).
  - *Double Quantization*: Quantizes the scales themselves (32-bit → 8-bit, block 256), saving **~0.37 bpw**.
  - *Paged Optimizers*: Page optimizer states to CPU RAM during allocation spikes, preventing OOM.
  - *Impact*: Fine-tune a **65B model on a single 48GB GPU** with zero quality loss vs. full 16-bit fine-tuning.

*Speaker note: Outliers are why naive INT8 fails — and why LLM.int8() trades speed for memory. QLoRA/NF4 is how you fine-tune a 65B model on one workstation.*

📊 **Diagrams:** [LLM.int8() Outlier Decomposition](quantization_visuals.md#4-llmint8-outlier-channel-decomposition) · [QLoRA & NF4](quantization_visuals.md#5-qlora--nf4-fine-tuning-on-a-single-gpu)

---

## Slide 7 — GPTQ vs. AWQ: The Production Face-Off

- **GPTQ — Second-Order Error Compensation**: Quantize weights column by column; measure each rounding error and **subtract it from adjacent unquantized weights** (guided by the inverse Hessian). Fixed column ordering + lazy batch updates quantize a 175B model in **under 4 hours on one A100**.
- **AWQ — Activation-Aware Weight Quantization**: Protect the **salient ~1%** of weights (those tied to high-magnitude activation channels). Scale salient weights UP by `s` and activations DOWN by `1/s` — an **exactly equivalent transform** — then quantize everything to uniform INT4. The `1/s` folds into the preceding LayerNorm/Linear bias, so runtime is **pure INT4 with zero overhead**.

| Dimension | GPTQ | AWQ | Winner / Recommendation |
| :--- | :--- | :--- | :--- |
| **Core Method** | Hessian error compensation | Salient channel weight scaling | Different paths to ~4 bpw |
| **Calibration Speed** | Moderate (30–60 mins for 70B) | **Extremely Fast** (5–10 mins) | **AWQ** |
| **Domain Generalization** | Prone to overfitting calibration data | **Superior robustness** across domains | **AWQ** |
| **Serving Kernel Support** | Universal (vLLM, TensorRT-LLM, AutoGPTQ) | Universal (vLLM, TensorRT-LLM, TGI) | **Tie** |
| **Kernel Performance** | High (Marlin kernels) | **Highest** (Marlin / FlashInfer optimized) | **AWQ** |

- **Production Verdict**: Standardize on **AWQ** for new vLLM/TensorRT-LLM deployments; use GPTQ mainly for legacy repos or unsupported custom architectures.

*Speaker note: Both reach ~4 bpw. AWQ wins on calibration speed, domain robustness, and kernel performance — default to it unless you have a legacy GPTQ repo.*

📊 **Diagrams:** [GPTQ Error Compensation](quantization_visuals.md#6-gptq-second-order-error-compensation) · [AWQ Salient Scaling](quantization_visuals.md#7-awq-activation-aware-weight-quantization)

---

## Slide 8 — Activation Outliers: SmoothQuant & Layer Rotations

- **The problem for W8A8 / W4A4**: At 8-bit (and especially 4-bit) activations become the point of failure — the same outlier channels seen in LLM.int8().

- **SmoothQuant — Difficulty Migration**:
  - *Insight*: Activations have extreme outliers; weights are uniform and smooth.
  - *Mechanism*: An equivalent transform migrates quantization difficulty from activations to weights:
    `Y = (X · diag(s)⁻¹) · (diag(s) · W) = X̂ Ŵ`
  - *Balancing*: `sⱼ = max(|Xⱼ|)^α / max(|Wⱼ|)^(1−α)`; with **α = 0.5** difficulty is split evenly, enabling standard INT8 GEMMs on both tensors with no accuracy loss on 100B+ models.

- **QuaRot & SpinQuant — Orthogonal Rotation**:
  - For W4A4, per-channel scaling breaks down (4-bit range is too narrow). Instead, multiply activations and weights by an orthogonal matrix `R` (`RᵀR = I`): `Y = (X R)(Rᵀ W)`.
  - Orthogonal transforms preserve lengths/angles and **disperse outliers across channels** — guaranteeing *incoherence* (outliers no longer concentrated in a few channels), not statistical independence.
  - *QuaRot* uses a fixed randomized Hadamard rotation; *SpinQuant* learns layer-specific rotations (Cayley SGD), closing the W4A4 gap to **<3% perplexity delta**.

*Speaker note: To quantize activations you must kill outliers. SmoothQuant shifts the difficulty into the weights; rotations spread outliers across channels for W4A4.*

📊 **Diagrams:** [SmoothQuant Difficulty Migration](quantization_visuals.md#8-smoothquant-migrating-difficulty-from-activations-to-weights) · [QuaRot & SpinQuant Rotations](quantization_visuals.md#9-quarot--spinquant-orthogonal-rotations-for-w4a4)

---

# Module 4 — Modern Low-Bit Floating-Point Formats

## Slide 9 — FP8, OCP MX, and NVFP4

- **FP8 — the cloud production standard**:
  - `E4M3` (4 exp / 3 mantissa, range ±448): precision-first → inference weights, activations, KV cache.
  - `E5M2` (5 exp / 2 mantissa, range ±57344): range-first → training gradients (prevents underflow).
  - Floating exponents absorb outliers naturally; **dynamic per-token scaling** prevents prompt-dependent clipping.
  - Supported in `vLLM` (`--kv-cache-dtype fp8`), `TensorRT-LLM`, `SGLang` on **Ada (RTX 4090, L40S)** and **Hopper (H100, H200)**.
- **OCP Microscaling (MX) — the cross-vendor standard**:
  - A block of **32 elements** shares one **8-bit exponent-only scale (E8M0)** — a pure power-of-two bit-shift.
  - Effective bitrate: **MXFP4 ≈ 4.25 bpw**; **MXFP6 ≈ 6.25 bpw** (near-lossless bridge toward FP8).
  - ⚠ A weight-and-activation standard; real speedups depend on native instructions in upcoming accelerators.
- **NVFP4 — NVIDIA's dual-level scaling (Blackwell)**:
  - Raw E2M1 FP4 only spans **−6.0 to +6.0**, so it saturates immediately.
  - Two-tier fix: an **E4M3 inner scale per 16 elements** + a **tensor-wide FP32 outer scale**.
  - Real footprint **~4.5 bpw**; ~2× dense FP8 and ~4× dense BF16 throughput on 5th-gen Tensor Cores.
  - ⚠ **Requires Blackwell (B100, B200)** — cannot execute on Hopper, Ada, or Ampere.

*Speaker note: FP8 is the safe cloud default today. MX is the open cross-vendor bet. NVFP4 is the fastest but Blackwell-only — check your fleet before promising it.*

📊 **Diagrams:** [FP8 E4M3 vs. E5M2](quantization_visuals.md#10-fp8-e4m3-vs-e5m2) · [OCP MX](quantization_visuals.md#11-ocp-microscaling-mx-one-scale-per-32-elements) · [NVFP4](quantization_visuals.md#12-nvfp4-two-level-scaling-on-blackwell)

---

# Module 5 — Production Case Studies & Realities

## Slide 10 — DeepSeek-V3: Pre-Training 671B Parameters in FP8

```
Activations: Sliced into [1 × 128] token-channel tiles  ──► Dynamic Tile Scale
Weights:     Blocked into [128 × 128] GEMM tiles        ──► Block Scale
Execution:   DeepGEMM (Custom CUDA C++ kernels, hand-tuned Hopper wgmma)
```

- **The Milestone**: 671B Mixture-of-Experts trained **from scratch in FP8 mixed precision** — not post-training quantization.
- **The Engineering Risk**: FP8 accumulation paths have narrow mantissa width (~13–14 effective bits vs. 23 for FP32). Over long reduction dimensions, rounding error compounds, risking divergence during training.
- **The Architectural Fix**:
  - *Tile-wise activation scaling (1 × 128)*: Confines outlier shocks strictly to small local tiles.
  - *Block-wise weight scaling (128 × 128)*: Aligns directly with hardware GEMM chunk sizes to keep accumulations short.
- **DeepGEMM**: Custom open-source CUDA C++ library (**not Triton**) maximizing Hopper memory overlap with hand-tuned `wgmma` instructions.

*Speaker note: Proof that FP8 works for pre-training, not just inference. The trick is fine-grained tiling to keep the short FP8 accumulator honest.*

📊 **Diagram:** [DeepSeek-V3 Fine-Grained FP8](quantization_visuals.md#13-deepseek-v3-fine-grained-fp8-pre-training)

---

## Slide 11 — KV Cache: Size It Right, Then Quantize It

```
KV Cache Memory Per Token = 2 × (Layers) × (KV Heads) × (Head Dim) × (Bytes Per Elem)
```

**Right column — Size it right**
- **The Long-Context Reality**: At 32k–128k context, **KV cache consumes more VRAM than the model weights themselves**.
- **⚠ The GQA Sizing Trap**:
  - Size using **KV heads**, NOT query heads!
  - Under Grouped-Query Attention, modern models (Llama 3, Qwen 2.5, Mistral) share KV heads across query groups.
  - **Llama-3-70B has 64 query heads but only 8 KV heads** → using query heads overstates the cache by **8×**.
  - Always read `num_key_value_heads` in `config.json`.

**Then quantize it**
- **Tier 1 — FP8 KV Cache (immediate win)**: `--kv-cache-dtype fp8` in vLLM. **Halves** KV memory with <0.1% accuracy loss; doubles concurrency or context length on the existing fleet.
- **Tier 2 — Sub-4-bit (KIVI / KVQuant)**: Quantize **Keys per-channel**, **Values per-token** (matching their outlier axes); keep the recent **32–128 tokens** in FP16. Reaches **~2-bit KV** with <0.1 perplexity loss.
- **Production Impact**: **2×–4×** more concurrent serving capacity at long context.

*Speaker note: Two moves. First size it correctly with KV heads — the 8× GQA trap has burned many capacity plans. Then quantize: FP8 today, ~2-bit KV when you need more.*

📊 **Diagram:** [KV Cache: Size It Right, Then Quantize It](quantization_visuals.md#14-kv-cache-size-it-right-then-quantize-it)

---

## Slide 12 — Local & Edge: MLX vs. GGUF

| Dimension | Apple MLX | GGUF / llama.cpp |
| :--- | :--- | :--- |
| **Target** | Apple Silicon (M1–M4) | CPU, Mac, edge, commodity GPUs |
| **Format** | Affine 2/4/8-bit, group size 64 | K-quants & I-quants in one file |
| **Standout** | Metal kernels fuse dequant + matmul; no CPU round-trips | `mmap` instant load; Q4_K_M ≈ **4.85 bpw** gold standard |
| **Speed** | Faster decode than llama.cpp for 7B–30B | Fast prefill via native `fp16` |
| **⚠ Trap** | Defaults to `bfloat16` — **no native HW on M1/M2** → slow prefill at long context | Fast CPU path is **8-bit** integer only |

- **GGUF details worth knowing**:
  - *K-quants*: superblocks of 256 weights → 8 sub-blocks of 32; `Q4_K_M` promotes sensitive tensors (`attn_v`, `ffn_down` → Q6_K; `attn_output` → Q5_K).
  - *I-quants*: an **Importance Matrix** from calibration data enables usable **2–3 bit** models (`IQ3_XXS`, `IQ2_S`).
  - ⚠ *Hardware reality*: fast CPU paths use **AVX-512 VNNI / ARM NEON 8-bit** dot products — there is **no native 16-bit integer dot product** on AVX-512.
- **Verdict**: **MLX** for decode speed on modern Macs (M3+); **llama.cpp** for portability and for prefill on M1/M2 (native fp16).

*Speaker note: Same hardware, two ecosystems. MLX wins decode on modern Macs; llama.cpp wins portability and rescues M1/M2 prefill because it uses fp16 instead of bf16.*

📊 **Diagrams:** [MLX vs. GGUF](quantization_visuals.md#15-local--edge-mlx-vs-gguf) · [K-Quant Superblock Layout](quantization_visuals.md#16-gguf-k-quant-superblock-layout)

---

# Module 6 — Closing & Decision Framework

## Slide 13 — Decision Flowchart + Rules of Thumb

```
What is your primary deployment target?
│
├── 1. Enterprise Cloud (NVIDIA Hopper / Ada / Blackwell)
│   ├── Blackwell (B100 / B200) ──► NVFP4 via TensorRT-LLM (Max compute throughput)
│   └── Hopper / Ada (H100 / L40S)
│       ├── High Concurrency (Batch > 32) ──► FP8 (W8A8) via vLLM / SGLang
│       └── Low Concurrency / VRAM Bound ──► AWQ (W4A16) with Marlin kernels
│
├── 2. Consumer Workstation (RTX 3090 / 4090 / 5090)
│   ├── Serving / Low Latency ──► AWQ W4A16 (vLLM)
│   └── Parameter Fine-Tuning ──► QLoRA with NF4 (bitsandbytes)
│
└── 3. CPU / Local Mac / Edge
    ├── Standard Deployment ──► GGUF Q4_K_M (llama.cpp / Ollama)
    ├── Maximum Accuracy ──► GGUF Q5_K_M
    └── Extreme VRAM Limit (<3.1 bpw) ──► GGUF IQ3_XXS with I-Matrix
```

**Rules of thumb (annotating the tree above)**
1. **Balance the trilemma**: cutting VRAM doesn't guarantee speedups — know bandwidth-vs-compute bound, and test real tasks.
2. **Sizing**: use *effective* bpw, and add a **10%–20% buffer** for scale/zero-point metadata.
3. **Calibrate in-domain** (256+ samples at 2048–4096 tokens) and always **benchmark task suites**, not just PPL.
4. **Verify hardware ISA first**: NVFP4 is Blackwell-only; M1/M2 prefill prefers `fp16`.
5. **Quantize the KV cache**: enable FP8 KV in vLLM, and size with `num_key_value_heads`.

*Speaker note: Pick your branch by hardware, then remember the five rules. If you only remember one: verify the hardware ISA before you promise a format.*

📊 **Diagram:** [Decision Flowchart (Mermaid edition)](quantization_visuals.md#17-decision-flowchart-mermaid-edition)

---

# Backup Material *(not part of the main run-of-show)*

## Backup Slide B1 — Essential References & Production Repos

- **Serving Engines & Kernels**:
  - `vLLM` (vllm-project/vllm) — Production LLM serving with FP8, AWQ, Marlin, FP8 KV cache.
  - `TensorRT-LLM` (NVIDIA/TensorRT-LLM) — Optimized enterprise serving; NVFP4 & FP8.
  - `DeepGEMM` (deepseek-ai/DeepGEMM) — Hopper FP8 GEMM library.
- **Local & Edge Tools**:
  - `llama.cpp` (ggerganov/llama.cpp) — GGUF, K-quants, I-matrix, SIMD assembly.
  - `MLX` (ml-explore/mlx) — Apple Silicon native framework.
- **Quantization Toolkits**:
  - `AutoAWQ` (casper-hansen/AutoAWQ) — Production AWQ quantization.
  - `AutoGPTQ` (AutoGPTQ/AutoGPTQ) — Second-order weight quantization.
  - `bitsandbytes` (bitsandbytes-foundation/bitsandbytes) — NF4 & 8-bit optimizers.

---

## Backup Slide B2 — Full Empirical Table & Hardware Fact Check

**Full footprint vs. quality table (slide 3 shows the 4-row summary):**

| quant | GB | top-1 (%) | mean KLD | 99.9% KLD |
| :--- | :--- | :--- | :--- | :--- |
| **UD-IQ1_S** | 72.5 | 77.325 | 0.396070 | 7.2126 |
| **UD-IQ1_M** | 74.5 | 79.691 | 0.314739 | 6.1965 |
| **UD-Q2_K_XL** | 78.9 | 82.715 | 0.224607 | 4.9121 |
| **UD-IQ3_XXS** | 82.0 | 85.414 | 0.165120 | 4.0375 |
| **UD-Q3_K_XL** | 90.0 | 88.315 | 0.106504 | 3.0538 |
| **UD-IQ4_XS** | 93.7 | 89.554 | 0.083630 | 2.3677 |
| **UD-Q4_K_XL** | 111.3 | 92.255 | 0.046893 | 1.5468 |
| **UD-Q5_K_XL** | 158.3 | 93.680 | 0.030415 | 1.0036 |
| **UD-Q6_K_XL** | 169.2 | 94.089 | 0.027091 | 0.8416 |
| **Q8_0** | 188.2 | 94.122 | 0.026574 | 0.8118 |

**Hardware & format reality check:**

| Feature / Claim | Status & Constraint | Production Advice |
| :--- | :--- | :--- |
| **NVFP4 Support** | **Blackwell-only (B100/B200)** | Do not specify for Hopper (H100) or Ada (L40S) |
| **FP8 (E4M3/E5M2)** | Supported on **Ada Lovelace, Hopper, Blackwell** | Production-ready default for cloud serving |
| **Bfloat16 on Apple Silicon** | Native on **M3 / M4**; emulated on M1 / M2 | On M1/M2 Macs, use llama.cpp (FP16) to avoid slow prefill |
| **AVX-512 SIMD Dot Product** | Native **8-bit integer** only (VNNI) | 16-bit integer math decomposes into slower sequences |
| **"4-Bit" VRAM Requirement** | Nominal 4.0 bpw ignores metadata | Add 10%–20% memory buffer for group scales & zero-points |
| **GQA Head Count** | KV Heads << Query Heads | Always size KV cache using `num_key_value_heads` |