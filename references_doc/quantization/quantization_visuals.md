# LLM Quantization — Visual Diagrams

> Mermaid companion to [`presentation_script.md`](presentation_script.md) and [`LLM Quantization Methods Survey.md`](LLM%20Quantization%20Methods%20Survey.md).
> One picture per quantization concept, in deck order. Renders on GitHub, in VS Code (Markdown Preview Mermaid Support), and at <https://mermaid.live>.

---

## 1. The Universal Quantization Pipeline

Every method — INT4/INT8 or FP8/FP4 — is the same round trip: map real values onto a small code set, store the code plus a scale, then reconstruct.

```mermaid
flowchart LR
    X["Real values X<br/>FP16 / BF16 weights & activations"] --> Q["Quantize<br/>Q = clip round X over S plus Z"]
    Q --> STORE["Stored codes<br/>INT4 / INT8 / FP4"]
    STORE --> DQ["Dequantize<br/>X hat = S times Q minus Z"]
    DQ --> MM["Matmul / output"]
    S["Scale S + zero-point Z<br/>metadata overhead"] -.-> Q
    S -.-> DQ
```

**Takeaway:** the payload is only part of the cost. `S` and `Z` are the *effective bpw* tax — always size with them included.

---

## 2. Quantization Granularity (Where the Error Comes From)

How many values share one scale factor determines the accuracy-vs-overhead trade-off.

```mermaid
flowchart TD
    ROOT["How many values share one scale?"]
    ROOT --> PT["Per-tensor<br/>1 scale for the whole matrix<br/>lowest overhead, highest error"]
    ROOT --> PC["Per-channel<br/>1 scale per row / output channel<br/>the standard for weights"]
    ROOT --> BW["Block / group-wise<br/>1 scale per g = 32 / 64 / 128<br/>best accuracy-vs-overhead balance"]
    PT --> EFF["Effective bpw = b + bits scale + bits ZP over g"]
    PC --> EFF
    BW --> EFF
```

| Scheme | Element bits | Scale metadata | Group | Effective bpw |
| :--- | :--- | :--- | :--- | :--- |
| INT4 + FP16 scale | 4 | 16 | 128 | 4.125 |
| MXFP4 (E8M0) | 4 | 8 | 32 | **4.25** |
| NVFP4 (E4M3 + FP32 outer) | 4 | ~8 | 16 | **~4.5** |
| GGUF Q4_K_M (mixed 4/5/6-bit) | 4–6 | 6-bit superblock | 32 | **~4.85** |

---

## 3. Strategy: PTQ vs. QAT (and PE-QAT)

Two ways to get from a high-precision model to a low-bit one.

```mermaid
flowchart TD
    BASE["High-Precision Model<br/>FP16 / BF16"]
    BASE --> PTQ["PTQ — Post-Training Quantization"]
    BASE --> QAT["QAT — Quantization-Aware Training"]

    PTQ --> P1["Forward pass on 128–512 calibration samples"]
    P1 --> P2["No gradients; minutes to hours"]
    P2 --> P3["Standard for 8-bit and 4-bit serving"]

    QAT --> Q1["Retraining with fake-quantization nodes"]
    Q1 --> Q2["Backprop via straight-through estimator"]
    Q2 --> Q3["Essential below 3-bit — expensive cluster compute"]

    Q3 --> PE["PE-QAT / ZeroQAT fix<br/>freeze base, train LoRA adapters only <2% params"]
    PE --> PERES["Near-QAT quality at 2–3 bits<br/>single developer node, hours"]
```

**Takeaway:** PTQ is free and covers ~95% of deployments down to 4-bit. Below that, PE-QAT gets near-QAT quality without a cluster bill.

---

## 4. LLM.int8(): Outlier Channel Decomposition

Why naive INT8 breaks — and the split that fixes it.

```mermaid
flowchart LR
    IN["Input tokens"] --> SPLIT{"Channel magnitude<br/>greater than 6.0 ?"}
    SPLIT -->|"Yes — 0.1% outlier channels"| FP16["FP16 GEMM<br/>native precision"]
    SPLIT -->|"No — 99.9% normal channels"| INT8["INT8 GEMM<br/>scaled"]
    FP16 --> SUM["Sum outputs"]
    INT8 --> SUM
    SUM --> NOTE["Halves VRAM, zero accuracy loss<br/>but mixed routing is often SLOWER than FP16"]
```

**Takeaway:** use it to *fit* a model on a tight GPU, never expecting a speedup.

---

## 5. QLoRA & NF4: Fine-Tuning on a Single GPU

Frozen 4-bit base + small FP16 adapters.

```mermaid
flowchart TD
    X["Input X"] --> BASE["Dequantize NF4 to FP16"]
    BASE --> FROZEN["Frozen base linear<br/>NF4 weights + double-quant scales"]
    X --> LA["LoRA A — FP16 trainable"]
    LA --> LB["LoRA B — FP16 trainable"]
    FROZEN --> ADD["Add"]
    LB --> ADD
    ADD --> OUT["Output"]

    subgraph TRICKS["Three memory tricks"]
        DQ["Double Quantization<br/>quantize the scales 32-bit to 8-bit<br/>saves ~0.37 bpw"]
        PO["Paged Optimizers<br/>page optimizer state to CPU RAM on spikes"]
        NF["NF4<br/>16 bins with equal probability mass<br/>optimal for Gaussian weights"]
    end
    FROZEN -.-> NF
```

**Takeaway:** 65B fine-tuned on a single 48GB GPU, matching full 16-bit quality.

---

## 6. GPTQ: Second-Order Error Compensation

Quantize one column, then let the *remaining* weights absorb the error.

```mermaid
flowchart LR
    C1["Column 1"] --> Q1["Quantize to INT4"]
    Q1 --> ERR["Measure rounding error e"]
    ERR --> HESS["Weight by inverse Hessian H inverse<br/>from calibration data"]
    HESS --> UPD["Subtract error from remaining columns"]
    UPD --> C2["Columns 2..N — already corrected"]
    C2 --> SPEED["Fixed column order + lazy batch updates<br/>175B in under 4 hours on one A100"]
```

---

## 7. AWQ: Activation-Aware Weight Quantization

Protect the salient 1% with a mathematically identical rescale.

```mermaid
flowchart LR
    OBS["Observe activations"] --> SAL["Find top 1% salient channels"]
    SAL --> UP["Scale salient weights UP by s"]
    SAL --> DOWN["Scale activations DOWN by 1 over s"]
    UP --> Q["Quantize everything to uniform INT4"]
    DOWN --> Q
    Q --> FOLD["Fold 1 over s into prior LayerNorm / bias"]
    FOLD --> RUN["Runtime = pure INT4, zero overhead"]
```

**Takeaway:** `(X / s) · (W · s)` is an identity; the trick is that the *weights* now round more gently.

---

## 8. SmoothQuant: Migrating Difficulty from Activations to Weights

For W8A8, activations are the bottleneck — move the pain into the weights.

```mermaid
flowchart LR
    X["Activations X<br/>extreme outliers"] --> MIG["Equivalent transform"]
    W["Weights W<br/>smooth, uniform"] --> MIG
    MIG --> X2["X prime = X · diag(s) inverse<br/>now easy to quantize"]
    MIG --> W2["W prime = diag(s) · W<br/>now harder, but tolerable"]
    X2 --> G["Standard INT8 GEMM on both operands"]
    W2 --> G
    G --> NOTE["Balance factor s = max|X|^alpha over max|W|^(1-alpha)<br/>alpha = 0.5 splits difficulty evenly"]
```

---

## 9. QuaRot & SpinQuant: Orthogonal Rotations for W4A4

Channel scaling is not enough at 4-bit — disperse the outliers instead.

```mermaid
flowchart LR
    X["X — outliers concentrated<br/>in a few channels"] --> RX["Multiply by orthogonal R"]
    W["W"] --> RW["Multiply by R transpose"]
    RX --> Y["Y = (X R)(R transpose W)"]
    RW --> Y
    Y --> DISP["Outliers dispersed across all channels<br/>incoherent, not independent"]
    DISP --> W4A4["W4A4 becomes viable"]
    RX --> SPIN["SpinQuant: learn R per layer via Cayley SGD<br/>closes gap to under 3% perplexity delta"]
```

---

## 10. FP8: E4M3 vs. E5M2

Same 8 bits, two different trades between precision and range.

```mermaid
flowchart LR
    subgraph E4M3["E4M3 — precision-first"]
        S1["Sign 1b"] --> E1["Exponent 4b"] --> M1["Mantissa 3b"]
    end
    subgraph E5M2["E5M2 — range-first"]
        S2["Sign 1b"] --> E2["Exponent 5b"] --> M2["Mantissa 2b"]
    end
    E4M3 --> USE1["Inference weights, activations, KV cache<br/>range ±448"]
    E5M2 --> USE2["Training gradients — prevents underflow<br/>range ±57344"]
```

**Takeaway:** floats beat integers at 8-bit because the exponent absorbs outliers natively; dynamic per-token scaling handles the rest.

---

## 11. OCP Microscaling (MX): One Scale per 32 Elements

The cross-vendor open standard.

```mermaid
flowchart LR
    SC["Shared scale<br/>E8M0 exponent-only<br/>pure power-of-two bit-shift"] --> BLK["Block of 32 elements<br/>FP4 (E2M1) / FP6 / FP8 (E4M3)"]
    BLK --> BPW["MXFP4 ≈ 4.25 bpw<br/>MXFP6 ≈ 6.25 bpw"]
    BLK --> WA["Weight AND activation format<br/>not weight-only"]
```

---

## 12. NVFP4: Two-Level Scaling on Blackwell

Fix FP4's tiny ±6 range with a scale inside a scale.

```mermaid
flowchart LR
    OUT["Outer scale — FP32<br/>one per tensor<br/>stops global saturation"] --> IN["Inner scale — E4M3 FP8<br/>one per 16 elements<br/>fine-grained local range"]
    IN --> EL["16 elements — E2M1 FP4"]
    EL --> BPW["~4.5 bpw effective"]
    EL --> HW["Requires Blackwell B100 / B200<br/>cannot run on Hopper, Ada, Ampere"]
```

---

## 13. DeepSeek-V3: Fine-Grained FP8 Pre-Training

The tiling that keeps FP8's short accumulator honest over long reductions.

```mermaid
flowchart LR
    ACT["Activations"] --> TILE["Tile-wise scaling<br/>1 x 128 token-channel tiles"]
    WGT["Weights"] --> BLOCK["Block-wise scaling<br/>128 x 128 GEMM tiles"]
    TILE --> GEMM["DeepGEMM<br/>custom CUDA C++ / wgmma<br/>short accumulations"]
    BLOCK --> GEMM
    GEMM --> RESULT["671B MoE trained from scratch in FP8<br/>no divergence"]
```

---

## 14. KV Cache: Size It Right, Then Quantize It

Two independent decisions, in order.

```mermaid
flowchart TD
    F["KV bytes per token = 2 x layers x KV heads x head dim x bytes per elem"]
    F --> GQA{"Sizing with KV heads?"}
    GQA -->|"No — used query heads"| BAD["8x overstatement<br/>Llama-3-70B: 64 query vs 8 KV heads<br/>flawed capacity plan"]
    GQA -->|"Yes — num_key_value_heads"| OK["Correct footprint"]
    OK --> T1["Tier 1 — FP8 KV cache<br/>--kv-cache-dtype fp8<br/>halves memory, under 0.1% loss"]
    OK --> T2["Tier 2 — KIVI / KVQuant<br/>Keys per-channel, Values per-token<br/>recent 32–128 tokens in FP16<br/>~2-bit KV"]
    T1 --> IMPACT["2x–4x more concurrent serving capacity"]
    T2 --> IMPACT
```

---

## 15. Local & Edge: MLX vs. GGUF

```mermaid
flowchart LR
    HW["Target hardware"] --> MLX["Apple MLX"]
    HW --> GGUF["GGUF / llama.cpp"]

    MLX --> M1["Affine 2/4/8-bit, group 64"]
    M1 --> M2["Metal kernels fuse dequant + matmul"]
    M2 --> M3["Faster decode 7B–30B"]
    M2 --> M4["Trap: defaults to bfloat16<br/>no native HW on M1/M2 — slow prefill"]

    GGUF --> G1["K-quants and I-quants in one mmap file"]
    G1 --> G2["Q4_K_M ≈ 4.85 bpw gold standard"]
    G1 --> G3["I-Matrix enables 2–3 bit IQ quants"]
    G1 --> G4["Trap: CPU fast path is 8-bit only<br/>no native 16-bit integer dot product"]
```

---

## 16. GGUF K-Quant Superblock Layout

How ~4.85 bpw is actually spent.

```mermaid
flowchart LR
    SB["Superblock — 256 weights<br/>shared 6-bit scale + 6-bit minimum"] --> B1["Sub-block — 32 weights"]
    SB --> B2["Sub-block — 32 weights"]
    SB --> B3["Sub-block — 32 weights"]
    SB --> B4["... 8 sub-blocks total"]
    B1 --> Q4["Q4_K_M policy<br/>most tensors 4-bit"]
    Q4 --> PROMO["Promoted sensitive tensors<br/>attn_v and ffn_down to Q6_K<br/>attn_output to Q5_K"]
```

---

## 17. Decision Flowchart (Mermaid edition)

The closing slide of [`presentation_script.md`](presentation_script.md), as a renderable graph.

```mermaid
flowchart TD
    START{"Primary deployment target?"}

    START --> CLOUD["Enterprise Cloud<br/>Hopper / Ada / Blackwell"]
    START --> WS["Consumer Workstation<br/>RTX 3090 / 4090 / 5090"]
    START --> EDGE["CPU / Local Mac / Edge"]

    CLOUD --> BW{"Blackwell?"}
    BW -->|"Yes — B100 / B200"| NVFP4["NVFP4 via TensorRT-LLM<br/>max compute throughput"]
    BW -->|"No — H100 / L40S"| CONC{"High concurrency<br/>batch greater than 32?"}
    CONC -->|"Yes"| FP8["FP8 W8A8 via vLLM / SGLang"]
    CONC -->|"No — VRAM bound"| AWQ1["AWQ W4A16 with Marlin kernels"]

    WS --> WSC{"What for?"}
    WSC -->|"Serving / low latency"| AWQ2["AWQ W4A16 via vLLM"]
    WSC -->|"Fine-tuning"| QLORA["QLoRA with NF4<br/>bitsandbytes"]

    EDGE --> EDC{"Priority?"}
    EDC -->|"Standard"| Q4KM["GGUF Q4_K_M<br/>llama.cpp / Ollama"]
    EDC -->|"Max accuracy"| Q5KM["GGUF Q5_K_M"]
    EDC -->|"Extreme VRAM, under 3.1 bpw"| IQ["GGUF IQ3_XXS<br/>with I-Matrix"]