/**
 * LLM Quantization deck content.
 *
 * Single source of truth derived from:
 *  - references_doc/quantization/presentation_script.md
 *  - references_doc/quantization/quantization_visuals.md
 *  - references_doc/quantization/presentation.html
 *
 * Consumed by the QuantizationHub sections, the SVG chart components,
 * and the fullscreen SlideDeck.
 */

/* ------------------------------------------------------------------ */
/* Shared accent palette                                               */
/* ------------------------------------------------------------------ */
export const ACCENT = {
  blue: {
    text: 'text-blue-600',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    fill: '#3b82f6',
  },
  emerald: {
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    fill: '#10b981',
  },
  purple: {
    text: 'text-purple-600',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    fill: '#a855f7',
  },
  amber: {
    text: 'text-amber-600',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    fill: '#f59e0b',
  },
  cyan: {
    text: 'text-cyan-600',
    border: 'border-cyan-200',
    bg: 'bg-cyan-50',
    fill: '#06b6d4',
  },
  rose: {
    text: 'text-rose-600',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    fill: '#f43f5e',
  },
} as const;

export type AccentKey = keyof typeof ACCENT;

/* ------------------------------------------------------------------ */
/* Module metadata (nav + section headers)                              */
/* ------------------------------------------------------------------ */
export interface QuantModule {
  id: string;
  index: string;
  navLabel: string;
  navLabelVi: string;
  heading: string;
  headingVi: string;
  subtitle: string;
  subtitleVi: string;
  accent: AccentKey;
  slideRefs: string;
}

export const QUANT_MODULES: QuantModule[] = [
  {
    id: 'overview',
    index: 'Module 00',
    navLabel: 'Overview',
    navLabelVi: 'Tổng Quan',
    heading: 'Why Quantize & The Engineering Trilemma',
    headingVi: 'Vì Sao Lượng Tử Hóa & Bộ Ba Kỹ Thuật',
    subtitle:
      'Memory bandwidth vs compute bottlenecks, and the balance between VRAM, Speed, and Reasoning Fidelity.',
    subtitleVi:
      'Nút thắt băng thông bộ nhớ so với tính toán, và sự cân bằng giữa VRAM, Tốc độ và Độ trung thực suy luận.',
    accent: 'blue',
    slideRefs: 'Slides 1–2',
  },
  {
    id: 'foundations',
    index: 'Module 01',
    navLabel: 'Foundations',
    navLabelVi: 'Nền Tảng',
    heading: 'Footprint vs. Accuracy & The Tail Divergence Cliff',
    headingVi: 'Dấu Chân Bộ Nhớ & Vách Phân Kỳ Đuôi',
    subtitle:
      'Why 4-bit is the production sweet spot, and why 99.9% tail KLD reveals silent reasoning collapses.',
    subtitleVi:
      'Vì sao 4-bit là điểm ngọt sản xuất, và vì sao KLD đuôi 99,9% tiết lộ sự sụp đổ suy luận thầm lặng.',
    accent: 'cyan',
    slideRefs: 'Slide 3',
  },
  {
    id: 'strategy',
    index: 'Module 02',
    navLabel: 'Strategy',
    navLabelVi: 'Chiến Lược',
    heading: 'PTQ vs. QAT & The Calibration Trap',
    headingVi: 'PTQ so với QAT & Bẫy Hiệu Chuẩn',
    subtitle:
      'Zero-cost PTQ, Parameter-Efficient QAT (PE-QAT), calibration distribution shifts, and why perplexity lies.',
    subtitleVi:
      'PTQ chi phí bằng không, QAT hiệu quả tham số (PE-QAT), dịch chuyển phân phối hiệu chuẩn, và vì sao perplexity đánh lừa.',
    accent: 'purple',
    slideRefs: 'Slides 4–5',
  },
  {
    id: 'algorithms',
    index: 'Module 03',
    navLabel: 'Algorithms',
    navLabelVi: 'Thuật Toán',
    heading: 'Taming Outliers & The Production Face-Off',
    headingVi: 'Thuần Hóa Outlier & Cuộc Đối Đầu Sản Xuất',
    subtitle:
      'LLM.int8() outlier channels, QLoRA NF4, and the GPTQ vs. AWQ production face-off.',
    subtitleVi:
      'Kênh outlier LLM.int8(), QLoRA NF4, và cuộc đối đầu sản xuất GPTQ so với AWQ.',
    accent: 'purple',
    slideRefs: 'Slides 6–7',
  },
  {
    id: 'formats',
    index: 'Module 04',
    navLabel: 'Formats',
    navLabelVi: 'Định Dạng',
    heading: 'FP8, OCP Microscaling (MX), and Blackwell NVFP4',
    headingVi: 'FP8, OCP Microscaling (MX) và Blackwell NVFP4',
    subtitle:
      'Why exponents beat integer grids at low bits, and the hardware reality across Hopper, Ada, and Blackwell.',
    subtitleVi:
      'Vì sao số mũ vượt trội lưới số nguyên ở bit thấp, và thực tế phần cứng trên Hopper, Ada và Blackwell.',
    accent: 'blue',
    slideRefs: 'Slide 8',
  },
  {
    id: 'production',
    index: 'Module 05',
    navLabel: 'Production',
    navLabelVi: 'Sản Xuất',
    heading: 'DeepSeek-V3, KV Cache & Local/Edge',
    headingVi: 'DeepSeek-V3, KV Cache & Cục Bộ/Edge',
    subtitle:
      'Pre-training 671B in FP8 with DeepGEMM, avoiding the 8× GQA sizing blunder, and Apple MLX vs. GGUF.',
    subtitleVi:
      'Tiền huấn luyện 671B bằng FP8 với DeepGEMM, tránh sai lầm GQA 8×, và Apple MLX so với GGUF.',
    accent: 'emerald',
    slideRefs: 'Slides 9–11',
  },
  {
    id: 'decision-framework',
    index: 'Module 06',
    navLabel: 'Decision Flow',
    navLabelVi: 'Luồng Quyết Định',
    heading: 'Decision Flowchart & 5 Production Rules',
    headingVi: 'Sơ Đồ Quyết Định & 5 Quy Tắc Sản Xuất',
    subtitle:
      'Select your exact format, runtime, and serving backend based on target silicon and concurrency.',
    subtitleVi:
      'Chọn chính xác định dạng, runtime và backend phục vụ dựa trên silicon mục tiêu và độ đồng thời.',
    accent: 'cyan',
    slideRefs: 'Slide 12',
  },
  {
    id: 'backup',
    index: 'Backup',
    navLabel: 'Backup',
    navLabelVi: 'Dự Phòng',
    heading: 'Repositories & Hardware Reality Checks',
    headingVi: 'Kho Mã Nguồn & Kiểm Tra Thực Tế Phần Cứng',
    subtitle: 'Official serving repos, kernel toolkits, and compatibility constraints.',
    subtitleVi: 'Kho phục vụ chính thức, bộ công cụ kernel và ràng buộc tương thích.',
    accent: 'blue',
    slideRefs: 'Slides B1–B2',
  },
];

/* ------------------------------------------------------------------ */
/* Slide 1 — Why quantize: three pillars                                */
/* ------------------------------------------------------------------ */
export interface PillarCard {
  index: string;
  title: string;
  accent: AccentKey;
  points: { strong: string; body: string; warn?: boolean }[];
  insight: string;
}

export const PILLARS: PillarCard[] = [
  {
    index: 'Pillar 01',
    title: 'Memory — Frontier Enabler',
    accent: 'blue',
    points: [
      {
        strong: 'Warehouse collapse:',
        body: '16-bit weights require 800GB–2TB+ for 405B–1T models. FP8/FP4 fits them onto a single 8-GPU node.',
      },
      {
        strong: 'Workstation unlock:',
        body: '70B models shrink from 140GB down to <40GB, running smoothly on 1 GPU.',
      },
      {
        strong: 'KV Cache space:',
        body: 'Leaves headroom for 32k–128k context windows which otherwise outgrow weights.',
      },
    ],
    insight: 'Eliminates inter-node tensor parallel bottlenecks across InfiniBand.',
  },
  {
    index: 'Pillar 02',
    title: 'Speed — Match the Bottleneck',
    accent: 'emerald',
    points: [
      {
        strong: 'Low Batch (Chat/Agents):',
        body: 'Memory-bandwidth bound. Weight transfer time dominates. Weight-only W4A16 gives direct speedup.',
      },
      {
        strong: 'High Batch (Serving):',
        body: 'Compute bound. Tensor Cores saturated. Requires native low-bit GEMMs (FP8, NVFP4).',
      },
      {
        strong: 'Dequant Trap:',
        body: 'Naive routing (e.g. LLM.int8) saves VRAM but is slower than FP16 due to dispatch overhead.',
        warn: true,
      },
    ],
    insight: 'First diagnose whether your pipeline is memory-bound or compute-bound!',
  },
  {
    index: 'Pillar 03',
    title: 'Economics & TCO',
    accent: 'purple',
    points: [
      {
        strong: '3×–5× Cost Reduction:',
        body: 'Slashes energy per token and cloud GPU hosting expense drastically.',
      },
      {
        strong: 'Faster Cold Starts:',
        body: 'Docker container pulls and checkpoint sync times drop in half or more.',
      },
      {
        strong: 'Edge Democratization:',
        body: 'Runs production models on Apple Silicon (MLX), CPUs, and single consumer RTX GPUs.',
      },
    ],
    insight: 'Headline bit-widths lie: always calculate scales & hardware ISA compatibility.',
  },
];

/* ------------------------------------------------------------------ */
/* Universal pipeline + effective bpw granularity                       */
/* ------------------------------------------------------------------ */
export interface PipelineStep {
  step: string;
  title: string;
  detail: string;
  accent: AccentKey;
  mono?: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: '01. INPUT TENSORS',
    title: 'Real Values X',
    detail: 'FP16 / BF16 weights & activations from base model',
    accent: 'blue',
  },
  {
    step: '02. QUANTIZE',
    title: 'Map & Round',
    detail: 'Round real values onto a small code set',
    accent: 'cyan',
    mono: 'Q = clip(round(X / S) + Z)',
  },
  {
    step: '03. STORAGE',
    title: 'Stored Codes + Metadata',
    detail: 'INT4 / INT8 / FP4 payload + scale S & zero-point Z',
    accent: 'purple',
  },
  {
    step: '04. DEQUANTIZE',
    title: 'Runtime Reconstruct',
    detail: 'Reconstruct approximate values for compute',
    accent: 'amber',
    mono: 'X̂ = S × (Q − Z)',
  },
  {
    step: '05. EXECUTION',
    title: 'MatMul / Tensor Core',
    detail: 'Direct low-bit GEMM or fused kernel matmul',
    accent: 'emerald',
  },
];

export interface GranularityRow {
  scheme: string;
  elementBits: string;
  scaleMeta: string;
  group: number;
  effectiveBpw: number;
  note: string;
  accent: AccentKey;
}

export const GRANULARITY_ROWS: GranularityRow[] = [
  {
    scheme: 'INT4 + FP16 Scale',
    elementBits: '4-bit',
    scaleMeta: '16-bit FP16',
    group: 128,
    effectiveBpw: 4.125,
    note: 'Standard AWQ/GPTQ; small metadata tax (+3.1%)',
    accent: 'blue',
  },
  {
    scheme: 'OCP MXFP4 (E8M0)',
    elementBits: '4-bit',
    scaleMeta: '8-bit exponent only',
    group: 32,
    effectiveBpw: 4.25,
    note: 'Pure power-of-two bit shift; open cross-vendor standard',
    accent: 'cyan',
  },
  {
    scheme: 'NVFP4 (Blackwell)',
    elementBits: '4-bit (E2M1)',
    scaleMeta: 'E4M3 inner + FP32 outer',
    group: 16,
    effectiveBpw: 4.5,
    note: 'Dual-level scaling; 5th Gen Tensor Core native (~2× dense FP8)',
    accent: 'emerald',
  },
  {
    scheme: 'GGUF Q4_K_M (K-Quant)',
    elementBits: '4-bit to 6-bit',
    scaleMeta: '6-bit superblock scales',
    group: 32,
    effectiveBpw: 4.85,
    note: 'Promotes sensitive tensors (attn_v, ffn_down); gold standard for edge',
    accent: 'purple',
  },
];

export const GRANULARITY_SCHEMES: {
  title: string;
  desc: string;
  accent: AccentKey;
}[] = [
  {
    title: 'Per-tensor',
    desc: '1 scale for the whole matrix — lowest overhead, highest error.',
    accent: 'rose',
  },
  {
    title: 'Per-channel',
    desc: '1 scale per row / output channel — the standard for weights.',
    accent: 'amber',
  },
  {
    title: 'Block / group-wise',
    desc: '1 scale per group of 32 / 64 / 128 — best accuracy-vs-overhead balance.',
    accent: 'emerald',
  },
];

/* ------------------------------------------------------------------ */
/* Slide 3 / B2 — Empirical footprint vs quality                        */
/* ------------------------------------------------------------------ */
export interface EmpiricalTier {
  quant: string;
  gb: number;
  top1: number;
  meanKLD: number;
  tailKLD: number;
  bpw: string;
  highlight?: boolean;
  baseline?: boolean;
}

export const EMPIRICAL_DATA: EmpiricalTier[] = [
  { quant: 'UD-IQ1_S', gb: 72.5, top1: 77.325, meanKLD: 0.39607, tailKLD: 7.2126, bpw: '1.5 bpw' },
  { quant: 'UD-IQ1_M', gb: 74.5, top1: 79.691, meanKLD: 0.314739, tailKLD: 6.1965, bpw: '1.75 bpw' },
  { quant: 'UD-Q2_K_XL', gb: 78.9, top1: 82.715, meanKLD: 0.224607, tailKLD: 4.9121, bpw: '2.2 bpw' },
  { quant: 'UD-IQ3_XXS', gb: 82.0, top1: 85.414, meanKLD: 0.16512, tailKLD: 4.0375, bpw: '2.6 bpw' },
  { quant: 'UD-Q3_K_XL', gb: 90.0, top1: 88.315, meanKLD: 0.106504, tailKLD: 3.0538, bpw: '3.2 bpw' },
  { quant: 'UD-IQ4_XS', gb: 93.7, top1: 89.554, meanKLD: 0.08363, tailKLD: 2.3677, bpw: '3.6 bpw' },
  {
    quant: 'UD-Q4_K_XL',
    gb: 111.3,
    top1: 92.255,
    meanKLD: 0.046893,
    tailKLD: 1.5468,
    bpw: '4.2 bpw',
    highlight: true,
  },
  { quant: 'UD-Q5_K_XL', gb: 158.3, top1: 93.68, meanKLD: 0.030415, tailKLD: 1.0036, bpw: '5.1 bpw' },
  { quant: 'UD-Q6_K_XL', gb: 169.2, top1: 94.089, meanKLD: 0.027091, tailKLD: 0.8416, bpw: '6.2 bpw' },
  {
    quant: 'Q8_0',
    gb: 188.2,
    top1: 94.122,
    meanKLD: 0.026574,
    tailKLD: 0.8118,
    bpw: '8.0 bpw',
    baseline: true,
  },
];

export interface TakeawayCard {
  tag: string;
  title: string;
  body: string;
  accent: AccentKey;
  icon: 'plateau' | 'sweetspot' | 'cliff' | 'tail';
}

export const FOUNDATION_TAKEAWAYS: TakeawayCard[] = [
  {
    tag: '01. Near-Zero Plateau (5–8b)',
    title: 'Q6 matches Q8 fidelity',
    body: 'UD-Q6_K_XL (169.2GB) scores 94.09% top-1 vs Q8_0 (94.12%), saving 19GB with negligible 0.027 mean KLD.',
    accent: 'emerald',
    icon: 'plateau',
  },
  {
    tag: '02. Sweet Spot (4-bit)',
    title: '41% VRAM Savings',
    body: 'UD-Q4_K_XL (111.3GB) maintains 92.26% top-1 with tightly bounded divergence (0.047 mean KLD, 1.55 99.9% KLD).',
    accent: 'blue',
    icon: 'sweetspot',
  },
  {
    tag: '03. Sub-4-Bit Cliff',
    title: '8.4× Error Surge',
    body: 'Dropping to UD-IQ1_S (72.5GB) saves only 39GB more, but mean KLD surges 8.4× and the tail explodes to 7.21!',
    accent: 'rose',
    icon: 'cliff',
  },
  {
    tag: '04. 99.9% Tail Metric',
    title: 'The Production Breaker',
    body: 'Top-1 accuracy masks catastrophic rare events: hallucinated syntax, infinite loops, and broken JSON schemas.',
    accent: 'amber',
    icon: 'tail',
  },
];

/* ------------------------------------------------------------------ */
/* Slide 4–5 — Strategy: PTQ / PE-QAT / QAT + calibration traps         */
/* ------------------------------------------------------------------ */
export interface StrategyCard {
  badge: string;
  badgeNote: string;
  title: string;
  desc: string;
  accent: AccentKey;
  recommended?: boolean;
  facts: { label: string; value: string }[];
}

export const STRATEGY_CARDS: StrategyCard[] = [
  {
    badge: 'PTQ',
    badgeNote: '~95% Deployments',
    title: 'Post-Training Quantization',
    desc: 'Forward pass only over 128–512 calibration samples. Zero backprop, zero gradient compute. Quantizes in 5 to 60 minutes on a single node.',
    accent: 'blue',
    facts: [
      { label: 'Compute Cost:', value: 'Near $0 (Minutes)' },
      { label: 'Sweet Spot:', value: '8-bit & 4-bit (AWQ, GPTQ)' },
      { label: 'Failure Mode:', value: 'Unbounded cascades below 4-bit' },
    ],
  },
  {
    badge: 'Modern Fix',
    badgeNote: 'Recommended <4-bit',
    title: 'PE-QAT / ZeroQAT',
    desc: 'Freeze the base model weights completely; train only LoRA adapters or step-size clipping bounds (<2% parameters) under simulated quantization noise.',
    accent: 'purple',
    recommended: true,
    facts: [
      { label: 'Compute Cost:', value: 'Single developer node (1–4 hours)' },
      { label: 'Sweet Spot:', value: '2-bit to 3-bit regimes' },
      { label: 'Advantage:', value: 'Near full-QAT quality without cluster bills' },
    ],
  },
  {
    badge: 'Full QAT',
    badgeNote: 'Cluster Compute',
    title: 'Quantization-Aware Training',
    desc: 'Retrains or continues pre-training with fake-quantization nodes. Backprop calculates gradients via straight-through estimators (STE).',
    accent: 'amber',
    facts: [
      { label: 'Compute Cost:', value: 'Massive (hundreds of GPU cluster hours)' },
      { label: 'Sweet Spot:', value: 'Pre-training from scratch (DeepSeek FP8)' },
      { label: 'Disadvantage:', value: 'Cost-prohibitive for standard teams' },
    ],
  },
];

export interface TrapCard {
  title: string;
  body: string;
  accent: AccentKey;
  icon: 'corpus' | 'runtime' | 'ppl';
}

export const CALIBRATION_TRAPS: TrapCard[] = [
  {
    title: 'Trap 1: Generic Calibration Corpus',
    body: 'Calibrating on WikiText-2 or C4 causes brutal domain mismatch. If serving SQL or legal contracts, calibrate on 128–512 domain-specific sequences at 2048–4096 tokens (not short 512 snippets).',
    accent: 'amber',
    icon: 'corpus',
  },
  {
    title: 'Trap 2: Runtime Kernel & Precision Parity',
    body: 'Calibration statistics MUST match your production serving runtime: exact attention backend (Eager vs FlashAttention-2 vs FlashInfer) and compute datatypes (FP16 vs BF16 vs FP8).',
    accent: 'blue',
    icon: 'runtime',
  },
  {
    title: 'Trap 3: Perplexity (PPL) Lies!',
    body: 'Perplexity frequently remains completely stable while strict JSON adherence, multi-hop reasoning, and code syntax break down. Always gate release on task suites (GSM8K, MMLU, JSON schema).',
    accent: 'rose',
    icon: 'ppl',
  },
];

/* ------------------------------------------------------------------ */
/* Slide 6–8 — Algorithms                                               */
/* ------------------------------------------------------------------ */
export interface AlgorithmCard {
  id: string;
  name: string;
  category: string;
  /** Precisely what the method is, in one line. */
  tagline: string;
  /** The core principle / why it works. */
  principle: string;
  /** The mathematical identity or objective it relies on. */
  formula: string;
  /** Step-by-step mechanism. */
  steps: string[];
  /** The equivalent-INT / dequantization GPU kernel it maps to. */
  kernel: string;
  /** The GPU-level mechanic that makes it cheap at runtime. */
  runtime: string;
  /** Headline measured results. */
  metrics: { label: string; value: string }[];
  /** Situations where this method is the right default. */
  bestFor: string[];
  /** Primary limitation / cost. */
  warning?: string;
  accent: AccentKey;
}

export const ALGORITHM_CARDS: AlgorithmCard[] = [
  {
    id: 'llm-int8',
    name: 'LLM.int8()',
    category: 'Outlier Channels',
    tagline: 'Mixed-precision decomposition that isolates the 0.1% of activation channels that break uniform INT8.',
    principle:
      'Above ~6.7B params, transformer activations contain a handful of channels whose magnitude spikes past 6.0 across every token. A single per-tensor INT8 scale must stretch to cover that spike, so the other 99.9% of values collapse into a few quantization levels. LLM.int8() splits the matmul along channels instead of forcing one scale over all of them.',
    formula: 'Y = X_fp16 · W_fp16  +  S_x·S_w·(X_int8 · W_int8)',
    steps: [
      'Scan each activation row at runtime for channels whose magnitude exceeds the 6.0 threshold.',
      'Multiply the ~0.1% outlier channels in native FP16 — full precision, no scale.',
      'Multiply the remaining 99.9% normal channels in INT8 with a shared scale.',
      'Sum the FP16 and INT8 partial products back into the FP16 output stream.',
    ],
    kernel: 'Custom mixed-precision GEMM — int8 plus fp16 branches',
    runtime:
      'Outlier detection and two GEMMs per layer mean routing overhead usually exceeds the compute saved. It is a memory tool, not a speed tool.',
    metrics: [
      { label: 'VRAM', value: '−50% (halved)' },
      { label: 'Accuracy loss', value: '≈0%' },
      { label: 'Latency vs FP16', value: 'often slower' },
      { label: 'Outlier rate', value: '0.1–1%' },
    ],
    bestFor: ['Fitting a >7B model on a GPU that cannot hold FP16 weights', 'Memory-bound offline workloads where throughput is secondary'],
    warning: 'Mixed-precision routing adds latency — often slower than native FP16. Use for memory fitting, not speedups.',
    accent: 'amber',
  },
  {
    id: 'qlora-nf4',
    name: 'QLoRA & NF4',
    category: 'Fine-Tuning on One GPU',
    tagline: 'A frozen 4-bit NF4 base plus tiny FP16 LoRA adapters — fine-tune 65B on a single 48GB GPU.',
    principle:
      'Pretrained weights are roughly Gaussian, so uniform linear bins waste levels on the distribution tails. NF4 (NormalFloat4) places its 16 bin thresholds so that each bin carries equal probability mass — information-theoretically optimal for a bell curve. The base stays frozen in 4-bit; gradients flow only through small FP16 adapters.',
    formula: 'NF4: 16 bins, equal probability area  ·  Y = W_nf4·x  +  (B·A)·x',
    steps: [
      'Store the frozen base linear weights in NF4, dequantizing to FP16 on the fly.',
      'Add trainable LoRA A/B adapters in FP16 and train only those (≈1–2% of params).',
      'Apply double quantization: quantize the scale factors too (32-bit → 8-bit, block 256).',
      'Use paged optimizers to spill optimizer state to CPU RAM during allocation spikes.',
    ],
    kernel: 'bitsandbytes NF4 dequantization + FP16 GEMM / LoRA adapters',
    runtime:
      'Dequantization happens per forward pass, but the frozen 4-bit weights cut the memory footprint ~4× versus FP16 fine-tuning, so the whole model and optimizer fit in one GPU.',
    metrics: [
      { label: 'Base weights', value: '4-bit NF4' },
      { label: 'Double-quant saving', value: '~0.37 bpw' },
      { label: 'Hardware', value: '1× 48GB' },
      { label: 'Quality vs 16-bit', value: 'matches full FT' },
    ],
    bestFor: ['Parameter fine-tuning on a consumer/prosumer GPU', 'Task adaptation where the base model must stay unchanged'],
    accent: 'cyan',
  },
  {
    id: 'gptq',
    name: 'GPTQ',
    category: 'Second-Order Error Compensation',
    tagline: 'Quantize weights one column at a time and let the remaining columns absorb each rounding error.',
    principle:
      'Naive round-to-nearest collapses at 4-bit. GPTQ forms a layer-wise reconstruction objective and minimizes it with a second-order (Hessian) expansion: after each column is rounded, the induced error is propagated into the still-unquantized columns weighted by the inverse Hessian estimated from calibration activations.',
    formula: 'min_Ŵ || WX − ŴX ||₂²   with   H⁻¹ = (2XXᵀ + λI)⁻¹',
    steps: [
      'Pick a fixed left-to-right column order so one inverse-Hessian factorization is shared.',
      'Quantize column wᵢ to INT4 and measure the rounding error e = wᵢ − round(wᵢ).',
      'Update the remaining columns: W −= e · (H⁻¹)ᵢ / (H⁻¹)ᵢᵢ.',
      'Batch the updates in L2/SRAM over ~128 columns before writing back to DRAM.',
    ],
    kernel: 'Marlin / ExLlama INT4 kernels (universal: vLLM, TensorRT-LLM, AutoGPTQ)',
    runtime:
      'Per-channel scales plus group-wise INT4 give near-FP16 quality at ~4 bpw with mature, fast weights-only kernels. Error is baked in at quantization time, so nothing extra runs at inference.',
    metrics: [
      { label: 'Bits / weight', value: '~4 bpw' },
      { label: 'Calibration (70B)', value: '30–60 min' },
      { label: '175B quantize', value: 'under 4h · 1×A100' },
      { label: 'Domain robustness', value: 'overfits calib.' },
    ],
    bestFor: ['Legacy GPTQ repositories and custom architectures', 'Workloads already standardized on AutoGPTQ'],
    warning: 'Directly fits the calibration distribution, so it can overfit it — AWQ generalizes better across domains.',
    accent: 'rose',
  },
  {
    id: 'awq',
    name: 'AWQ',
    category: 'Activation-Aware Weight Quantization',
    tagline: 'Protect the salient ~1% of weights with a mathematically exact rescale — zero runtime overhead.',
    principle:
      'Salience is defined by activation magnitude, not weight magnitude: the ~1% of weight channels fed by high-energy activations dominate output error. AWQ scales those weights up and the matching activations down by the same factor — an exact identity — so the salient weights round more gently, then everything quantizes to uniform INT4.',
    formula: 'W′ = W · diag(s)   X′ = X · diag(s)⁻¹   ⟹   X·W = X′·W′',
    steps: [
      'Profile calibration activations to find the top ~1% salient channels (per-channel scale s).',
      'Scale salient weights up by s and their input activations down by 1/s.',
      'Quantize all weights to uniform INT4 — no mixed precision, no special cases.',
      'Fold 1/s into the preceding LayerNorm or Linear bias at graph-build time.',
    ],
    kernel: 'AWQ INT4 with Marlin / FlashInfer (vLLM, TensorRT-LLM, TGI)',
    runtime:
      'Because 1/s is absorbed upstream and s is baked into the quantized weights, the deployed graph is plain INT4 — the protection costs literally nothing at inference.',
    metrics: [
      { label: 'Bits / weight', value: '~4 bpw' },
      { label: 'Calibration (70B)', value: '5–10 min (6× faster)' },
      { label: 'Protected weights', value: '~1% salient' },
      { label: 'Kernel latency', value: 'highest (Marlin)' },
    ],
    bestFor: ['New vLLM / TensorRT-LLM deployments', 'Cross-domain serving where GPTQ would overfit calibration'],
    accent: 'emerald',
  },
];

export interface ShootoutRow {
  dimension: string;
  gptq: string;
  awq: string;
  verdict: string;
  awqWins?: boolean;
}

export const SHOOTOUT_ROWS: ShootoutRow[] = [
  {
    dimension: 'Core Mathematical Principle',
    gptq: 'Hessian inverse error compensation',
    awq: 'Salient channel weight scaling',
    verdict: 'Both reach ~4 bpw',
  },
  {
    dimension: 'Calibration Speed (70B)',
    gptq: '30–60 minutes',
    awq: '5–10 minutes',
    verdict: 'AWQ (6× faster)',
    awqWins: true,
  },
  {
    dimension: 'Domain Generalization',
    gptq: 'Prone to overfitting calibration text',
    awq: 'Superior cross-domain retention',
    verdict: 'AWQ',
    awqWins: true,
  },
  {
    dimension: 'Inference Kernel Support',
    gptq: 'Universal (vLLM, TensorRT-LLM, AutoGPTQ)',
    awq: 'Universal (vLLM, TensorRT-LLM, TGI)',
    verdict: 'Tie (Marlin backed)',
  },
  {
    dimension: 'Serving Kernel Latency',
    gptq: 'High (Marlin kernels)',
    awq: 'Highest (Marlin / FlashInfer)',
    verdict: 'AWQ',
    awqWins: true,
  },
];

/* ------------------------------------------------------------------ */
/* Slide 8 — Modern floating-point formats                              */
/* ------------------------------------------------------------------ */
export interface FormatCard {
  /** Stable key used to select the matching SVG visual. */
  id: 'fp8' | 'ocp-mx' | 'nvfp4';
  badge: string;
  badgeNote: string;
  title: string;
  desc: string;
  accent: AccentKey;
  rows: { label: string; value: string; note?: string }[];
  footer: string;
  footerTone: 'ok' | 'warn';
}

export const FORMAT_CARDS: FormatCard[] = [
  {
    id: 'fp8',
    badge: 'Cloud Standard',
    badgeNote: 'Ada & Hopper',
    title: 'FP8 (E4M3 vs. E5M2)',
    desc: 'Floating-point scales absorb activation outliers natively. Dynamic per-token scaling prevents clipping without retraining.',
    accent: 'blue',
    rows: [
      {
        label: 'E4M3 (Range ±448)',
        value: '1 sign | 4 exponent | 3 mantissa',
        note: 'Inference weights, activations, KV cache',
      },
      {
        label: 'E5M2 (Range ±57,344)',
        value: '1 sign | 5 exponent | 2 mantissa',
        note: 'Training gradients (prevents underflow)',
      },
    ],
    footer: 'vLLM flag: --kv-cache-dtype fp8',
    footerTone: 'ok',
  },
  {
    id: 'ocp-mx',
    badge: 'Open Standard',
    badgeNote: 'Cross-Vendor',
    title: 'OCP Microscaling (MX)',
    desc: 'A block of 32 elements shares a single 8-bit exponent-only scale (E8M0) — pure power-of-two bit-shift arithmetic.',
    accent: 'cyan',
    rows: [
      { label: 'MXFP4 Effective:', value: '~4.25 bpw' },
      { label: 'MXFP6 Effective:', value: '~6.25 bpw' },
      { label: 'Applied to:', value: 'BOTH weights AND activations natively' },
    ],
    footer: '⚠ Awaiting native accelerator silicon instruction rollouts.',
    footerTone: 'warn',
  },
  {
    id: 'nvfp4',
    badge: 'Blackwell Only',
    badgeNote: 'B100 / B200',
    title: 'NVFP4 Dual Scaling',
    desc: 'Raw E2M1 FP4 only spans −6.0 to +6.0, so it saturates immediately. NVIDIA solves this with nested two-tier scales.',
    accent: 'emerald',
    rows: [
      { label: 'Outer Scale (FP32):', value: '1 per entire tensor', note: 'prevents global saturation' },
      { label: 'Inner Scale (E4M3 FP8):', value: '1 per 16 elements', note: 'fine-grained local range' },
      { label: 'Effective footprint:', value: '≈ 4.5 bpw' },
    ],
    footer: '⚠ Hard requirement: cannot execute on Hopper (H100) or Ada!',
    footerTone: 'warn',
  },
];

/* ------------------------------------------------------------------ */
/* Slides 9–11 — Production case studies                                */
/* ------------------------------------------------------------------ */
export interface DeepSeekPoint {
  label: string;
  title: string;
  body: string;
  accent: AccentKey;
}

export const DEEPSEEK_POINTS: DeepSeekPoint[] = [
  {
    label: '01. THE RISK',
    title: 'Narrow Accumulator',
    body: 'FP8 accumulation paths have ~13–14 effective mantissa bits vs 23 for FP32. Over long reduction dimensions, rounding error compounds, risking divergence.',
    accent: 'rose',
  },
  {
    label: '02. THE ARCHITECTURE',
    title: 'Fine-Grained Tiling',
    body: 'Activations sliced into [1 × 128] token-channel tiles; weights blocked into [128 × 128] GEMM tiles to keep accumulations short.',
    accent: 'cyan',
  },
  {
    label: '03. THE OUTCOME',
    title: 'Zero Quality Loss',
    body: '671B MoE trained from scratch in FP8 with DeepGEMM — custom CUDA C++ kernels with hand-tuned Hopper wgmma instructions.',
    accent: 'emerald',
  },
];

export interface KvTier {
  title: string;
  body: string;
  accent: AccentKey;
}

export const KV_TIERS: KvTier[] = [
  {
    title: 'Tier 1: FP8 KV Cache',
    body: 'vLLM --kv-cache-dtype fp8. Halves memory with <0.1% accuracy drop. Double context length instantly.',
    accent: 'blue',
  },
  {
    title: 'Tier 2: ~2-bit (KIVI / KVQuant)',
    body: 'Keys per-channel, Values per-token (matching outlier axes). Recent 32–128 tokens in FP16. Reaches ~2-bit KV with minimal PPL loss.',
    accent: 'purple',
  },
];

export interface EdgePlatform {
  name: string;
  accent: AccentKey;
  badge: string;
  points: { text: string; warn?: boolean }[];
}

export const EDGE_PLATFORMS: EdgePlatform[] = [
  {
    name: 'Apple MLX',
    accent: 'blue',
    badge: 'Fastest Mac Decode',
    points: [
      { text: 'Format: Affine 2/4/8-bit with group size 64.' },
      {
        text: 'Standout: Metal kernels fuse dequantization + matmul into single threadgroups without CPU roundtrips.',
      },
      { text: 'Performance: Superior token generation (decode) speed on M3/M4.' },
      {
        text: 'Trap: Defaults to bfloat16 which is emulated on M1/M2 → sluggish prefill at long context!',
        warn: true,
      },
    ],
  },
  {
    name: 'GGUF / llama.cpp',
    accent: 'emerald',
    badge: 'Universal Portability',
    points: [
      { text: 'Format: K-quants & I-quants packaged in a single .gguf file loaded instantly via mmap.' },
      { text: 'Gold standard: Q4_K_M (~4.85 bpw) promotes sensitive attention matrices to 6-bit.' },
      { text: 'Extreme limit: I-Matrix calibration enables usable 2–3 bit models (IQ3_XXS).' },
      {
        text: 'Hardware reality: CPU fast path uses 8-bit integer SIMD (AVX-512 VNNI / ARM NEON); no native 16-bit integer dot product exists!',
        warn: true,
      },
    ],
  },
];

export interface KQuantDetail {
  title: string;
  body: string;
}

export const KQUANT_DETAILS: KQuantDetail[] = [
  {
    title: 'K-quants',
    body: 'Superblocks of 256 weights → 8 sub-blocks of 32. Q4_K_M promotes sensitive tensors: attn_v, ffn_down → Q6_K; attn_output → Q5_K.',
  },
  {
    title: 'I-quants',
    body: 'An Importance Matrix from calibration data enables usable 2–3 bit models (IQ3_XXS, IQ2_S).',
  },
];

/* ------------------------------------------------------------------ */
/* Slide 13 — Decision framework                                        */
/* ------------------------------------------------------------------ */
export interface DecisionBranch {
  tag: string;
  title: string;
  desc: string;
  primaryNote: string;
  accent: AccentKey;
}

export interface DecisionTier {
  id: 'cloud' | 'workstation' | 'edge';
  label: string;
  accent: AccentKey;
  branches: DecisionBranch[];
}

export const DECISION_TIERS: DecisionTier[] = [
  {
    id: 'cloud',
    label: 'Enterprise Cloud (NVIDIA Hopper / Ada / Blackwell)',
    accent: 'blue',
    branches: [
      {
        tag: 'BRANCH A — BLACKWELL B100/B200',
        title: 'NVFP4 via TensorRT-LLM',
        desc: 'Maximum compute throughput (up to 4× BF16 FLOPS) with dual-level FP32/E4M3 scaling. Slashes inter-node bottlenecks.',
        primaryNote: 'Primary: Highest token throughput',
        accent: 'emerald',
      },
      {
        tag: 'BRANCH B — HOPPER / ADA (BATCH > 32)',
        title: 'FP8 (W8A8) via vLLM / SGLang',
        desc: 'Compute-bound serving at scale. Native FP8 Tensor Core GEMMs + FP8 KV cache. Zero accuracy degradation on modern models.',
        primaryNote: 'Primary: High-concurrency production',
        accent: 'blue',
      },
      {
        tag: 'BRANCH C — HOPPER / ADA (BATCH 1–16)',
        title: 'AWQ W4A16 (Marlin Kernels)',
        desc: 'Memory-bandwidth bound low-latency serving (chat/agents). Fits large models into minimal GPUs with peak memory transfer rates.',
        primaryNote: 'Primary: Low latency & VRAM constrained',
        accent: 'cyan',
      },
    ],
  },
  {
    id: 'workstation',
    label: 'Workstation (RTX 3090 / 4090 / 5090)',
    accent: 'purple',
    branches: [
      {
        tag: 'BRANCH A — SERVING & LOCAL INFERENCE',
        title: 'AWQ W4A16 via vLLM / Ollama',
        desc: 'Fits 70B models inside 2× RTX 3090/4090 (48GB combined) or 8B models into a single 16GB VRAM card at 45+ tokens/sec.',
        primaryNote: 'Primary: Local developer workstation serving',
        accent: 'purple',
      },
      {
        tag: 'BRANCH B — FINE-TUNING & ADAPTER ADAPTATION',
        title: 'QLoRA with NF4 (bitsandbytes)',
        desc: 'Train LoRA adapters on a 65B/70B model using a single 48GB GPU. NormalFloat4 + double quantization preserves 16-bit fidelity.',
        primaryNote: 'Primary: Single-node model fine-tuning',
        accent: 'amber',
      },
    ],
  },
  {
    id: 'edge',
    label: 'Local Mac / CPU / Edge Device',
    accent: 'emerald',
    branches: [
      {
        tag: 'TIER 1 — STANDARD DEPLOYMENT',
        title: 'GGUF Q4_K_M (llama.cpp)',
        desc: 'Gold standard ~4.85 bpw. Promotes attention tensors to 5/6-bit. Flawless balance of size and reasoning fidelity.',
        primaryNote: 'Platform: CPU / Mac / Edge devices',
        accent: 'blue',
      },
      {
        tag: 'TIER 2 — MAXIMUM ACCURACY',
        title: 'GGUF Q5_K_M (~5.5 bpw)',
        desc: 'Virtually undetectable degradation from full 16-bit precision. Ideal when RAM is slightly less constrained.',
        primaryNote: 'Platform: High-RAM Apple Silicon (64GB+)',
        accent: 'emerald',
      },
      {
        tag: 'TIER 3 — EXTREME MEMORY CONSTRAINT',
        title: 'GGUF IQ3_XXS (with I-Matrix)',
        desc: 'Sub-3.1 bpw. Uses a calibration importance matrix to salvage reasoning. Fits 70B models in under 28GB RAM.',
        primaryNote: 'Platform: Constrained 32GB Mac / Laptop',
        accent: 'rose',
      },
    ],
  },
];

export interface RuleItem {
  num: string;
  title: string;
  desc: string;
  accent: AccentKey;
}

export const RULES_OF_THUMB: RuleItem[] = [
  {
    num: 'RULE 01',
    title: 'Balance the Trilemma',
    desc: 'Cutting VRAM does not guarantee faster latency. Know whether you are memory-bandwidth or compute bound.',
    accent: 'blue',
  },
  {
    num: 'RULE 02',
    title: 'Account for Metadata',
    desc: 'Nominal 4-bit is misleading. Always add a 10%–20% memory buffer for zero-points, group scales, and runtimes.',
    accent: 'cyan',
  },
  {
    num: 'RULE 03',
    title: 'In-Domain Calibration',
    desc: 'Calibrate with 256+ in-domain texts at 2048–4096 tokens. Never release on PPL alone; test JSON & reasoning tasks.',
    accent: 'purple',
  },
  {
    num: 'RULE 04',
    title: 'Verify Hardware ISA',
    desc: 'NVFP4 is Blackwell-only. Apple M1/M2 requires FP16 to avoid slow emulated bf16 prefill. Check before promising.',
    accent: 'amber',
  },
  {
    num: 'RULE 05',
    title: 'Quantize KV Cache',
    desc: 'Enable FP8 KV in vLLM to double context capacity. Size using num_key_value_heads to avoid an 8× error.',
    accent: 'emerald',
  },
];

/* ------------------------------------------------------------------ */
/* Backup — hardware matrix + repos                                     */
/* ------------------------------------------------------------------ */
export interface HardwareRow {
  feature: string;
  status: string;
  advice: string;
  accent: AccentKey;
}

export const HARDWARE_MATRIX: HardwareRow[] = [
  {
    feature: 'NVFP4 Support',
    status: 'Blackwell-only (B100 / B200 / GB200)',
    advice: 'Do not promise or specify for Hopper (H100) or Ada (L40S).',
    accent: 'emerald',
  },
  {
    feature: 'FP8 (E4M3 / E5M2)',
    status: 'Supported on Ada Lovelace, Hopper, Blackwell',
    advice: 'The production-ready cloud default for high-concurrency serving.',
    accent: 'blue',
  },
  {
    feature: 'Bfloat16 on Apple Silicon',
    status: 'Native hardware on M3 / M4; emulated on M1 / M2',
    advice: 'On M1/M2 Macs, use llama.cpp (FP16) to avoid 3×–5× slower prefill.',
    accent: 'amber',
  },
  {
    feature: 'AVX-512 SIMD Dot Products',
    status: 'Native 8-bit integer only (VNNI)',
    advice: 'No 16-bit integer dot product; it decomposes into slower sequences.',
    accent: 'purple',
  },
  {
    feature: '"4-Bit" VRAM Requirement',
    status: 'Nominal 4.0 bpw ignores scales & zero-points',
    advice: 'Always add a 10%–20% headroom buffer for metadata & KV cache.',
    accent: 'cyan',
  },
  {
    feature: 'GQA Head Count Sizing',
    status: 'KV Heads << Query Heads in modern LLMs',
    advice: 'Always size KV cache using num_key_value_heads.',
    accent: 'rose',
  },
];

export interface RepoGroup {
  title: string;
  accent: AccentKey;
  items: { name: string; detail: string }[];
}

export const REPO_GROUPS: RepoGroup[] = [
  {
    title: 'SERVING ENGINES & KERNELS',
    accent: 'blue',
    items: [
      { name: 'vLLM', detail: 'Production LLM serving (FP8, AWQ, Marlin kernels, FP8 KV cache).' },
      { name: 'TensorRT-LLM', detail: 'Enterprise NVIDIA serving; NVFP4 & FP8 optimized.' },
      { name: 'DeepGEMM', detail: 'DeepSeek open-source Hopper FP8 wgmma kernel library.' },
    ],
  },
  {
    title: 'LOCAL & EDGE RUNTIMES',
    accent: 'emerald',
    items: [
      { name: 'llama.cpp', detail: 'GGUF, K-quants, I-matrix, SIMD assembly kernels.' },
      { name: 'MLX', detail: 'Apple Silicon native framework for M1–M4 GPUs.' },
      { name: 'Ollama', detail: 'Packaged local model execution with GGUF defaults.' },
    ],
  },
  {
    title: 'QUANTIZATION TOOLKITS',
    accent: 'purple',
    items: [
      { name: 'AutoAWQ', detail: 'Fast salient activation-aware weight quantization.' },
      { name: 'AutoGPTQ', detail: 'Second-order Hessian inverse error compensation.' },
      { name: 'bitsandbytes', detail: 'NF4 & 8-bit optimizers for single-GPU fine-tuning.' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Charts datasets                                                      */
/* ------------------------------------------------------------------ */
export const FOOTPRINT_CHART = {
  labels: ['8B Model', '70B Model', '405B Frontier', '1T MoE'],
  series: [
    { label: 'FP16 / BF16 (16-bit)', color: '#94a3b8', data: [16, 140, 810, 2000] },
    { label: 'FP8 (8-bit)', color: '#3b82f6', data: [8, 70, 405, 1000] },
    { label: 'INT4 / AWQ (~4.1 bpw)', color: '#06b6d4', data: [4.1, 36, 208, 512] },
    { label: 'NVFP4 (~4.5 bpw)', color: '#10b981', data: [4.5, 39.4, 228, 560] },
  ],
};

export const TRILEMMA_RADAR = {
  axes: [
    'VRAM Compression',
    'Low-Batch Latency',
    'High-Batch Throughput',
    'Reasoning Retention',
    'Domain Robustness',
  ],
  series: [
    { label: 'AWQ (W4A16)', color: '#06b6d4', data: [90, 95, 60, 94, 92] },
    { label: 'FP8 (W8A8)', color: '#3b82f6', data: [65, 75, 95, 98, 98] },
    { label: 'NVFP4 (W4A4)', color: '#10b981', data: [92, 90, 100, 92, 90] },
    { label: 'BF16 (Baseline)', color: '#64748b', data: [20, 50, 50, 100, 100], dashed: true },
  ],
};

export const GPTQ_AWQ_CHART = {
  labels: ['70B Calibration (mins)', 'Kernel Latency (ms)'],
  series: [
    { label: 'GPTQ', color: '#94a3b8', data: [45, 18.2] },
    { label: 'AWQ', color: '#10b981', data: [8, 14.5] },
  ],
};

export const THROUGHPUT_CHART = {
  labels: ['BF16 (Dense)', 'FP8 (Hopper)', 'NVFP4 (Blackwell)', 'OCP MXFP4 (Est.)'],
  data: [1.0, 2.0, 4.0, 3.8],
  colors: ['#64748b', '#3b82f6', '#10b981', '#06b6d4'],
};

/* ------------------------------------------------------------------ */
/* Slide deck metadata (bodies are rendered by SlideDeck.tsx)           */
/* ------------------------------------------------------------------ */
export interface SlideMeta {
  module: string;
  title: string;
  titleVi: string;
  speakerNote: string;
  speakerNoteVi: string;
}

export const SLIDE_META: SlideMeta[] = [
  {
    module: 'Module 0 — Opening',
    title: 'Slide 1: Why Quantize — Memory, Speed, and TCO',
    titleVi: 'Slide 1: Vì Sao Lượng Tử Hóa — Bộ Nhớ, Tốc Độ và TCO',
    speakerNote:
      'Quantization is not a compression trick for small models — it is the enabler of frontier-scale AI. Three payoffs: memory, speed, TCO. But headline bit-widths lie.',
    speakerNoteVi:
      'Lượng tử hóa không phải mẹo nén cho mô hình nhỏ — nó là yếu tố mở đường cho AI quy mô tiên tiến. Ba lợi ích: bộ nhớ, tốc độ, TCO. Nhưng con số bit trên tiêu đề thường đánh lừa.',
  },
  {
    module: 'Module 0 — Opening',
    title: 'Slide 2: The Engineering Trilemma — Memory, Speed, and Accuracy',
    titleVi: 'Slide 2: Bộ Ba Kỹ Thuật — Bộ Nhớ, Tốc Độ và Độ Chính Xác',
    speakerNote:
      "You can't maximize all three. Cutting VRAM does not guarantee speedups — first know whether you are bandwidth-bound or compute-bound.",
    speakerNoteVi:
      'Bạn không thể tối đa cả ba. Giảm VRAM không đảm bảo nhanh hơn — trước tiên hãy biết bạn bị giới hạn bởi băng thông hay tính toán.',
  },
  {
    module: 'Module 1 — Foundations',
    title: 'Slide 3: Empirical Trade-Offs — Footprint vs. Accuracy & Tail Divergence',
    titleVi: 'Slide 3: Đánh Đổi Thực Nghiệm — Dấu Chân vs. Độ Chính Xác & Phân Kỳ Đuôi',
    speakerNote:
      '4-bit is the sweet spot: 41% smaller than Q8 with high fidelity. Below 4-bit the tail blows up — and the tail is where production breaks.',
    speakerNoteVi:
      '4-bit là điểm ngọt: nhỏ hơn 41% so với Q8 mà vẫn trung thực cao. Dưới 4-bit phần đuôi bùng nổ — và đuôi chính là nơi sản xuất đổ vỡ.',
  },
  {
    module: 'Module 2 — Strategy',
    title: 'Slide 4: PTQ vs. QAT (and PE-QAT)',
    titleVi: 'Slide 4: PTQ so với QAT (và PE-QAT)',
    speakerNote:
      'PTQ is free and covers 95% of deployments down to 4-bit. Below that, PE-QAT buys near-QAT quality for <2% of a cluster bill.',
    speakerNoteVi:
      'PTQ miễn phí và bao phủ 95% triển khai xuống tới 4-bit. Thấp hơn nữa, PE-QAT mua chất lượng gần QAT với dưới 2% hóa đơn cụm.',
  },
  {
    module: 'Module 2 — Strategy',
    title: 'Slide 5: Calibration & Evaluation — The Production Gotchas',
    titleVi: 'Slide 5: Hiệu Chuẩn & Đánh Giá — Những Cạm Bẫy Sản Xuất',
    speakerNote:
      'Calibration corpus is the #1 source of PTQ variance — use in-domain data at native length. And never ship on PPL alone; run a task suite.',
    speakerNoteVi:
      'Tập dữ liệu hiệu chuẩn là nguồn biến thiên PTQ số 1 — dùng dữ liệu đúng miền ở độ dài gốc. Và đừng bao giờ phát hành chỉ dựa trên PPL; hãy chạy bộ tác vụ.',
  },
  {
    module: 'Module 3 — Algorithms',
    title: 'Slide 6: Outliers & Fine-Tuning — LLM.int8() and QLoRA/NF4',
    titleVi: 'Slide 6: Outlier & Tinh Chỉnh — LLM.int8() và QLoRA/NF4',
    speakerNote:
      'Outliers are why naive INT8 fails — and why LLM.int8() trades speed for memory. QLoRA/NF4 is how you fine-tune a 65B model on one workstation.',
    speakerNoteVi:
      'Outlier là lý do INT8 ngây thơ thất bại — và là lý do LLM.int8() đánh đổi tốc độ lấy bộ nhớ. QLoRA/NF4 là cách tinh chỉnh mô hình 65B trên một máy trạm.',
  },
  {
    module: 'Module 3 — Algorithms',
    title: 'Slide 7: GPTQ vs. AWQ — The Production Face-Off',
    titleVi: 'Slide 7: GPTQ so với AWQ — Cuộc Đối Đầu Sản Xuất',
    speakerNote:
      'Both reach ~4 bpw. AWQ wins on calibration speed, domain robustness, and kernel performance — default to it unless you have a legacy GPTQ repo.',
    speakerNoteVi:
      'Cả hai đều đạt ~4 bpw. AWQ thắng về tốc độ hiệu chuẩn, độ bền theo miền và hiệu năng kernel — mặc định chọn nó trừ khi bạn có kho GPTQ kế thừa.',
  },
  {
    module: 'Module 4 — Formats',
    title: 'Slide 8: Modern Low-Bit Floating-Point Formats — FP8, OCP MX, NVFP4',
    titleVi: 'Slide 8: Định Dạng Dấu Phẩy Động Bit Thấp Hiện Đại — FP8, OCP MX, NVFP4',
    speakerNote:
      'FP8 is the safe cloud default today. MX is the open cross-vendor bet. NVFP4 is the fastest but Blackwell-only — check your fleet before promising it.',
    speakerNoteVi:
      'FP8 là mặc định an toàn cho cloud hiện nay. MX là canh bạc mở liên nhà cung cấp. NVFP4 nhanh nhất nhưng chỉ Blackwell — kiểm tra đội máy trước khi hứa hẹn.',
  },
  {
    module: 'Module 5 — Production',
    title: 'Slide 9: DeepSeek-V3 — Pre-Training 671B Parameters in FP8',
    titleVi: 'Slide 9: DeepSeek-V3 — Tiền Huấn Luyện 671B Tham Số Bằng FP8',
    speakerNote:
      'Proof that FP8 works for pre-training, not just inference. The trick is fine-grained tiling to keep the short FP8 accumulator honest.',
    speakerNoteVi:
      'Bằng chứng FP8 hiệu quả cho tiền huấn luyện, không chỉ suy luận. Bí quyết là chia ô mịn để giữ bộ tích lũy FP8 ngắn trung thực.',
  },
  {
    module: 'Module 5 — Production',
    title: 'Slide 10: KV Cache — Size It Right, Then Quantize It',
    titleVi: 'Slide 10: KV Cache — Tính Đúng Kích Thước, Rồi Lượng Tử Hóa',
    speakerNote:
      'Two moves. First size it correctly with KV heads — the 8× GQA trap has burned many capacity plans. Then quantize: FP8 today, ~2-bit KV when you need more.',
    speakerNoteVi:
      'Hai bước. Đầu tiên tính đúng kích thước với KV heads — bẫy GQA 8× đã đốt cháy nhiều kế hoạch dung lượng. Rồi lượng tử hóa: FP8 hôm nay, KV ~2-bit khi cần thêm.',
  },
  {
    module: 'Module 5 — Production',
    title: 'Slide 11: Local & Edge — MLX vs. GGUF (llama.cpp)',
    titleVi: 'Slide 11: Cục Bộ & Edge — MLX so với GGUF (llama.cpp)',
    speakerNote:
      'Same hardware, two ecosystems. MLX wins decode on modern Macs; llama.cpp wins portability and rescues M1/M2 prefill because it uses fp16 instead of bf16.',
    speakerNoteVi:
      'Cùng phần cứng, hai hệ sinh thái. MLX thắng giải mã trên Mac hiện đại; llama.cpp thắng tính di động và cứu prefill M1/M2 vì dùng fp16 thay vì bf16.',
  },
  {
    module: 'Module 6 — Closing',
    title: 'Slide 12: Decision Flowchart + 5 Rules of Thumb',
    titleVi: 'Slide 12: Sơ Đồ Quyết Định + 5 Quy Tắc Kinh Nghiệm',
    speakerNote:
      'Pick your branch by hardware, then remember the five rules. If you only remember one: verify the hardware ISA before you promise a format.',
    speakerNoteVi:
      'Chọn nhánh theo phần cứng, rồi nhớ năm quy tắc. Nếu chỉ nhớ một: xác minh ISA phần cứng trước khi hứa một định dạng.',
  },
  {
    module: 'Backup Material',
    title: 'Backup Slide B1: Essential References & Production Repos',
    titleVi: 'Slide Dự Phòng B1: Tham Chiếu Thiết Yếu & Kho Sản Xuất',
    speakerNote:
      'Official repositories for all serving runtimes, quantization toolkits, and edge libraries covered in the presentation.',
    speakerNoteVi:
      'Kho chính thức cho mọi runtime phục vụ, bộ công cụ lượng tử hóa và thư viện edge được đề cập trong bài trình bày.',
  },
  {
    module: 'Backup Material',
    title: 'Backup Slide B2: Full Empirical Table & Hardware Fact Check',
    titleVi: 'Slide Dự Phòng B2: Bảng Thực Nghiệm Đầy Đủ & Kiểm Tra Phần Cứng',
    speakerNote:
      'Complete 10-tier precision table from 72.5 GB to 188.2 GB, accompanied by hardware ISA constraints across NVIDIA and Apple Silicon.',
    speakerNoteVi:
      'Bảng độ chính xác đầy đủ 10 tầng từ 72,5 GB đến 188,2 GB, kèm ràng buộc ISA phần cứng trên NVIDIA và Apple Silicon.',
  },
];