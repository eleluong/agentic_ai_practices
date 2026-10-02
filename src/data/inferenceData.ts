/**
 * LLM Inference Architecture & Optimization deck content.
 *
 * Single source of truth derived from:
 *  - references_doc/inferencing/AI-LLM Inference Technical Guide.md
 *  - plans/inference-guide-enhancement-plan.md
 *
 * Consumed by the InferenceHub sections, the interactive demo
 * components, and the standalone presentation deck.
 */

/* ------------------------------------------------------------------ */
/* Shared accent palette (mirrors quantizationData)                     */
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
  indigo: {
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
    fill: '#6366f1',
  },
} as const;

export type AccentKey = keyof typeof ACCENT;

/* ------------------------------------------------------------------ */
/* Module metadata (nav + section headers)                              */
/* ------------------------------------------------------------------ */
export interface InferenceModule {
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

export const INFERENCE_MODULES: InferenceModule[] = [
  {
    id: 'mechanics',
    index: 'Module 01',
    navLabel: 'Core Mechanics',
    navLabelVi: 'Cơ Chế Cốt Lõi',
    heading: 'Prefill, Decode and the Roofline Model',
    headingVi: 'Prefill, Decode và Mô Hình Roofline',
    subtitle:
      'Why decode is memory-bandwidth bound and prefill is compute bound — the single asymmetry behind every modern optimization.',
    subtitleVi:
      'Vì sao decode bị giới hạn bởi băng thông bộ nhớ còn prefill bị giới hạn bởi tính toán — sự bất đối xứng đằng sau mọi tối ưu hiện đại.',
    accent: 'blue',
    slideRefs: 'Slides 1–2',
  },
  {
    id: 'kv-cache',
    index: 'Module 02',
    navLabel: 'KV Cache',
    navLabelVi: 'KV Cache',
    heading: 'State Management and the Anatomy of the KV Cache',
    headingVi: 'Quản Lý Trạng Thái và Giải Phẫu KV Cache',
    subtitle:
      'PagedAttention fragmentation recovery, MLA latent compression, then long-context RoPE/Ring attention and sparse KV eviction.',
    subtitleVi:
      'Khôi phục phân mảnh bằng PagedAttention, nén tiềm ẩn MLA, rồi RoPE/Ring attention cho ngữ cảnh dài và loại bỏ KV thưa.',
    accent: 'purple',
    slideRefs: 'Slides 3–5',
  },
  {
    id: 'distributed',
    index: 'Module 03',
    navLabel: 'Distributed',
    navLabelVi: 'Phân Tán',
    heading: 'Distributed Inference and Parallelism Strategies',
    headingVi: 'Suy Luận Phân Tán và Các Chiến Lược Song Song',
    subtitle:
      'Five orthogonal dimensions — TP, PP, SP, EP and DP — placed on the interconnect hierarchy that decides their speed.',
    subtitleVi:
      'Năm chiều song song trực giao — TP, PP, SP, EP và DP — đặt trên hệ thống liên kết quyết định tốc độ của chúng.',
    accent: 'indigo',
    slideRefs: 'Slides 6–7',
  },
  {
    id: 'engines',
    index: 'Module 04',
    navLabel: 'Serving Engines',
    navLabelVi: 'Serving Engine',
    heading: 'Inference Serving Packages',
    headingVi: 'Các Gói Phục Vụ Suy Luận',
    subtitle:
      'vLLM, SGLang, TensorRT-LLM and llama.cpp — four cache-management philosophies, matched to the workloads each wins.',
    subtitleVi:
      'vLLM, SGLang, TensorRT-LLM và llama.cpp — bốn triết lý quản lý cache, gắn với từng loại tải công việc mà chúng chiến thắng.',
    accent: 'emerald',
    slideRefs: 'Slides 8–9',
  },
  {
    id: 'kernels',
    index: 'Module 05',
    navLabel: 'Kernels',
    navLabelVi: 'Kernel',
    heading: 'Inference Backends and Kernels',
    headingVi: 'Các Backend và Kernel Suy Luận',
    subtitle:
      'Online Softmax, tiling, and the FlashAttention evolution from Hopper FA3 to Blackwell FA4.',
    subtitleVi:
      'Online Softmax, tiling, và tiến hóa FlashAttention từ Hopper FA3 đến Blackwell FA4.',
    accent: 'cyan',
    slideRefs: 'Slides 10–11',
  },
  {
    id: 'optimizations',
    index: 'Module 06',
    navLabel: 'Optimizations',
    navLabelVi: 'Tối Ưu',
    heading: 'Modern Inference Optimization Techniques',
    headingVi: 'Các Kỹ Thuật Tối Ưu Suy Luận Hiện Đại',
    subtitle:
      'Disaggregation, advanced quantization, lossless speculative decoding, decoding/sampling strategies, and grammar-constrained output.',
    subtitleVi:
      'Phân tách, lượng tử hóa nâng cao, giải mã suy đoán không mất mát, chiến lược lấy mẫu, và đầu ra ràng buộc ngữ pháp.',
    accent: 'amber',
    slideRefs: 'Slides 12–14',
  },
  {
    id: 'diffusion',
    index: 'Module 07',
    navLabel: 'Diffusion LLMs',
    navLabelVi: 'LLM Khuếch Tán',
    heading: 'Breaking the Autoregressive Paradigm',
    headingVi: 'Phá Vỡ Mô Hình Tự Hồi Quy',
    subtitle:
      'Discrete text diffusion with DiffusionGemma and the EntropyBoundSampler — annealing hundreds of tokens in parallel.',
    subtitleVi:
      'Khuếch tán văn bản rời rạc với DiffusionGemma và EntropyBoundSampler — tôi luyện hàng trăm token song song.',
    accent: 'rose',
    slideRefs: 'Slide 15',
  },
  {
    id: 'production',
    index: 'Module 08',
    navLabel: 'Decision Guide',
    navLabelVi: 'Hướng Dẫn Quyết Định',
    heading: 'Production Decision Guide & Checklist',
    headingVi: 'Hướng Dẫn Quyết Định Sản Xuất & Danh Sách Kiểm Tra',
    subtitle:
      'Workload-to-engine selection, glossary, and a deployment checklist for latency and throughput.',
    subtitleVi:
      'Chọn engine theo tải công việc, thuật ngữ, và danh sách kiểm tra triển khai cho độ trễ và thông lượng.',
    accent: 'blue',
    slideRefs: 'Slides 16–17',
  },
];

/* ------------------------------------------------------------------ */
/* Module 01 — Core mechanics                                          */
/* ------------------------------------------------------------------ */
export interface PhaseRow {
  property: string;
  prefill: string;
  decode: string;
}

export const PREFILL_DECODE_ROWS: PhaseRow[] = [
  { property: 'Workload', prefill: 'Whole prompt in parallel', decode: 'One token per step' },
  { property: 'Dominant resource', prefill: 'Tensor Core FLOPs', decode: 'HBM bandwidth' },
  { property: 'Arithmetic intensity', prefill: '100s – 1000+ FLOPs/byte', decode: '~1 FLOP/byte at batch 1' },
  { property: 'Primary SLA metric', prefill: 'TTFT', decode: 'TPOT / ITL' },
  { property: 'Optimization levers', prefill: 'GEMM efficiency, chunking', decode: 'Batching, KV compression, quantization' },
];

export interface HardwareRow {
  gpu: string;
  compute: string;
  bandwidth: string;
  balance: string;
  notes: string;
  accent: AccentKey;
  /** Normalized HBM bandwidth for the roofline chart (TB/s). */
  bandwidthTbs: number;
  /** Machine balance FLOPs/byte (ridge point). */
  balanceFlops: number;
  /** Normalized FP16 compute for the chart (TFLOPS). */
  computeTflops: number;
}

export const HARDWARE_ROWS: HardwareRow[] = [
  {
    gpu: 'H100 SXM',
    compute: '989 TFLOPS',
    bandwidth: '3.35 TB/s (HBM3)',
    balance: '~295 FLOPs/byte',
    notes: 'Hopper baseline',
    accent: 'blue',
    bandwidthTbs: 3.35,
    balanceFlops: 295,
    computeTflops: 989,
  },
  {
    gpu: 'H200',
    compute: '~989 TFLOPS',
    bandwidth: '4.8 TB/s (HBM3e)',
    balance: '~206 FLOPs/byte',
    notes: '+43% decode throughput at equal compute',
    accent: 'emerald',
    bandwidthTbs: 4.8,
    balanceFlops: 206,
    computeTflops: 989,
  },
  {
    gpu: 'B200',
    compute: 'Not stated in sources',
    bandwidth: '8.0 TB/s',
    balance: 'N/A — bandwidth-optimized',
    notes: 'Blackwell; targets massive autoregressive bottlenecks',
    accent: 'purple',
    bandwidthTbs: 8.0,
    balanceFlops: 0,
    computeTflops: 0,
  },
];

/* ------------------------------------------------------------------ */
/* Module 02 — KV cache strategies                                     */
/* ------------------------------------------------------------------ */
export interface KvStrategy {
  technique: string;
  optimizes: string;
  mechanism: string;
  sharing: string;
  lossless: string;
  compression: string;
  source: string;
  accent: AccentKey;
}

export const KV_STRATEGIES: KvStrategy[] = [
  {
    technique: 'PagedAttention',
    optimizes: 'Memory fragmentation',
    mechanism: 'Paged block virtual table',
    sharing: 'No',
    lossless: 'Yes',
    compression: '60–80% waste → ~96% utilization',
    source: '[^11]',
    accent: 'blue',
  },
  {
    technique: 'MLA',
    optimizes: 'Latent cache footprint',
    mechanism: 'Low-rank latent + weight absorption',
    sharing: 'Per-model',
    lossless: 'Yes',
    compression: '>90% KV reduction',
    source: '[^18]',
    accent: 'purple',
  },
  {
    technique: 'YaRN / NTK RoPE',
    optimizes: 'Context length extension',
    mechanism: 'Regime-based frequency scaling',
    sharing: 'Per-model',
    lossless: 'Yes',
    compression: 'Extends 4K model to 128K+',
    source: '[^98]',
    accent: 'cyan',
  },
  {
    technique: 'Ring Attention',
    optimizes: 'Ultra-long context VRAM',
    mechanism: 'Distributed circular P2P transfers',
    sharing: 'Across GPUs',
    lossless: 'Yes',
    compression: 'Context scales with GPU count',
    source: '[^94]',
    accent: 'indigo',
  },
  {
    technique: 'StreamingLLM',
    optimizes: 'Infinite streaming context',
    mechanism: '4 attention sinks + sliding window',
    sharing: 'No',
    lossless: 'Lossy',
    compression: 'Bounded O(W) over infinite tokens',
    source: '[^95]',
    accent: 'emerald',
  },
  {
    technique: 'H2O / SnapKV',
    optimizes: 'Runtime KV cache growth',
    mechanism: 'Prune low cumulative attention scores',
    sharing: 'No',
    lossless: 'Lossy',
    compression: 'Up to 5× KV compression',
    source: '[^96][^97]',
    accent: 'rose',
  },
];

export const PAGED_ATTENTION_STATS = [
  { k: '60–80%', v: 'VRAM wasted by static contiguous allocation' },
  { k: '~96%', v: 'Utilization after block-level paging' },
  { k: '2–4×', v: 'Larger batch size unlocked' },
  { k: '16 / 32', v: 'Tokens per physical block' },
];

export const MLA_STATS = [
  { k: '512', v: 'Latent vector dimensions cached' },
  { k: '64', v: 'RoPE dimensions cached' },
  { k: '>90%', v: 'KV cache size reduction' },
];

export const LONG_CONTEXT_STATS = [
  { k: '17.2 GB', v: 'KV for a single 128K request (Llama-3-8B, FP16)' },
  { k: '43 GB', v: 'KV for a single 128K request (70B model)' },
  { k: 'O(S²)', v: 'Attention compute at 128K ≈ 1.64×10¹⁰ scores/head' },
];

export const ROPE_METHODS = [
  {
    method: 'Linear Interpolation',
    mechanism: 'Uniformly scale positions m → m/α',
    tradeoff: 'Simple, but compresses high frequencies → destroys local syntax resolution',
    accent: 'rose' as AccentKey,
  },
  {
    method: 'NTK-Aware',
    mechanism: "Adjust base b' = b·α^(d/(d−2))",
    tradeoff: 'Keeps high frequencies intact, interpolates low frequencies only',
    accent: 'amber' as AccentKey,
  },
  {
    method: 'YaRN',
    mechanism: 'Three frequency regimes + √t attention temperature',
    tradeoff: 'Best 128K+ stability; prevents perplexity explosion',
    accent: 'emerald' as AccentKey,
  },
];

export const EVICTION_METHODS = [
  {
    method: 'StreamingLLM',
    mechanism: 'Pin first 4 attention sinks + rolling 2044-token window',
    gain: 'Stable perplexity over infinite tokens at O(W) memory',
    lossless: 'Lossy',
    accent: 'emerald' as AccentKey,
  },
  {
    method: 'H2O',
    mechanism: 'Keep K_recent + highest cumulative-attention "heavy hitters"',
    gain: 'Evicts up to 80% of KV pairs at <0.5 perplexity loss',
    lossless: 'Lossy',
    accent: 'rose' as AccentKey,
  },
  {
    method: 'SnapKV',
    mechanism: 'Select critical prompt feature clusters during prefill',
    gain: 'Compresses the prompt KV before decode begins',
    lossless: 'Lossy',
    accent: 'amber' as AccentKey,
  },
];

/* ------------------------------------------------------------------ */
/* Module 03 — Distributed parallelism                                 */
/* ------------------------------------------------------------------ */
export interface ParallelismRow {
  strategy: string;
  dimension: string;
  collectives: string;
  network: string;
  useCase: string;
  accent: AccentKey;
}

export const PARALLELISM_ROWS: ParallelismRow[] = [
  {
    strategy: 'TP — Tensor',
    dimension: 'Hidden dim (d_model, heads)',
    collectives: '2× All-Reduce / layer',
    network: 'NVLink (≥900 GB/s)',
    useCase: 'Dense 70B+ within one 8-GPU node',
    accent: 'blue',
  },
  {
    strategy: 'PP — Pipeline',
    dimension: 'Layer depth (L)',
    collectives: 'P2P activation transfer',
    network: 'InfiniBand (≥400 Gbps)',
    useCase: 'Massive models (>400B) across nodes',
    accent: 'purple',
  },
  {
    strategy: 'SP — Sequence',
    dimension: 'Sequence length (S)',
    collectives: 'Reduce-Scatter + All-Gather',
    network: 'NVLink (≥900 GB/s)',
    useCase: 'High-concurrency long-context prefill',
    accent: 'cyan',
  },
  {
    strategy: 'EP — Expert',
    dimension: 'MoE expert index (E)',
    collectives: '2× All-to-All / MoE layer',
    network: 'NVLink or optimized RoCE',
    useCase: 'DeepSeek-V3, Mixtral MoE',
    accent: 'amber',
  },
  {
    strategy: 'DP — Data',
    dimension: 'Request batch (B)',
    collectives: 'None during inference',
    network: 'Standard Ethernet',
    useCase: 'High-concurrency throughput scaling',
    accent: 'emerald',
  },
];

export interface InterconnectRow {
  link: string;
  domain: string;
  bandwidth: string;
  latency: string;
  recommended: string;
  accent: AccentKey;
}

export const INTERCONNECT_ROWS: InterconnectRow[] = [
  {
    link: 'NVLink 5 (Blackwell)',
    domain: 'Intra-node / NVL72 rack',
    bandwidth: '900 GB/s',
    latency: '<1 µs',
    recommended: 'TP (up to 72), EP',
    accent: 'emerald',
  },
  {
    link: 'NVLink 4 (Hopper)',
    domain: 'Intra-node (8 GPUs)',
    bandwidth: '450 GB/s',
    latency: '~1–2 µs',
    recommended: 'TP (up to 8), SP',
    accent: 'blue',
  },
  {
    link: 'PCIe Gen 5',
    domain: 'Intra-node (budget servers)',
    bandwidth: '32 GB/s',
    latency: '5–10 µs',
    recommended: 'Avoid TP; use DP / small PP',
    accent: 'rose',
  },
  {
    link: 'InfiniBand NDR / RoCE v2',
    domain: 'Inter-node cluster',
    bandwidth: '50 GB/s',
    latency: '10–25 µs',
    recommended: 'PP, EP (high batch), DP',
    accent: 'purple',
  },
];

export const PARALLELISM_NOTES = [
  { title: 'TP stays in the node', detail: 'Two All-Reduce collectives per layer make TP latency-bound — restrict it to NVLink.' },
  { title: 'PP inflates ITL', detail: 'Only activation tensors cross stage boundaries, but idle stages add decode latency. Avoid unless the model cannot fit under TP8.' },
  { title: 'SP is communication-free', detail: 'Reduce-Scatter + All-Gather costs the same as the All-Reduce it replaces, while shrinking activation memory N×.' },
  { title: 'EP suffers hotspots', detail: 'Popular experts bottleneck their GPUs; balance dispatch buffers to avoid tail-latency spikes.' },
];

/* ------------------------------------------------------------------ */
/* Module 03 — Serving engines                                         */
/* ------------------------------------------------------------------ */
export interface EngineRow {
  engine: string;
  mechanism: string;
  bestFor: string;
  hardware: string;
  gotcha: string;
  accent: AccentKey;
}

export const ENGINE_ROWS: EngineRow[] = [
  {
    engine: 'vLLM',
    mechanism: 'PagedAttention + Continuous Batching',
    bestFor: 'General high-throughput text generation',
    hardware: 'NVIDIA, AMD, TPU, Gaudi',
    gotcha: 'Safest default; Python GIL caps extreme-RPS throughput',
    accent: 'blue',
  },
  {
    engine: 'SGLang',
    mechanism: 'RadixAttention + SRouter',
    bestFor: 'Agentic, prefix-heavy, RAG',
    hardware: 'NVIDIA (Rust router)',
    gotcha: 'Gains depend on prefix locality',
    accent: 'emerald',
  },
  {
    engine: 'TensorRT-LLM',
    mechanism: 'C++ IFB runtime + TRT graph fusion',
    bestFor: 'Maximum throughput, lowest tail latency',
    hardware: 'NVIDIA only (Ampere+)',
    gotcha: 'AOT engine compilation; hardware lock-in',
    accent: 'purple',
  },
  {
    engine: 'llama.cpp',
    mechanism: 'GGUF + mmap + layer offload',
    bestFor: 'Edge / local CPU + GPU',
    hardware: 'CPU + consumer GPU',
    gotcha: 'FA + asymmetric KV needs FA_ALL_QUANTS',
    accent: 'amber',
  },
];

export const SROUTER_STEPS = [
  { step: '01', title: 'Incoming Request', detail: 'Prompt arrives at the gateway with a reusable prefix.' },
  { step: '02', title: 'Cache-Aware Routing', detail: 'SRouter consults an approximate cluster radix tree.' },
  { step: '03', title: 'Worker Selection', detail: 'Routes to the GPU worker already holding the prefix in VRAM.' },
  { step: '04', title: 'Cache Hit', detail: 'Prefill is skipped — decode starts immediately.' },
];

/* ------------------------------------------------------------------ */
/* Module 04 — Kernels                                                 */
/* ------------------------------------------------------------------ */
export interface KernelRow {
  kernel: string;
  architecture: string;
  primitives: string;
  memory: string;
  headline: string;
  accent: AccentKey;
}

export const KERNEL_ROWS: KernelRow[] = [
  {
    kernel: 'Vanilla attention',
    architecture: 'Any',
    primitives: 'Materializes N×N',
    memory: 'High HBM traffic',
    headline: 'O(N²) memory-bound',
    accent: 'rose',
  },
  {
    kernel: 'FlashAttention-2',
    architecture: 'Turing+',
    primitives: 'Tiling + Online Softmax',
    memory: 'No HBM materialization',
    headline: 'Baseline fused attention',
    accent: 'amber',
  },
  {
    kernel: 'FA3',
    architecture: 'Hopper',
    primitives: 'TMA, WGMMA, ping-pong scheduling',
    memory: 'Async GEMM + softmax overlap',
    headline: 'Up to 75% of H100 peak FLOPS',
    accent: 'emerald',
  },
  {
    kernel: 'FA4',
    architecture: 'Blackwell (B200/GB200)',
    primitives: 'tcgen05.mma, TMEM, 2-CTA MMA',
    memory: 'FMA-emulated exponentials',
    headline: '~1600 TFLOPs/s BF16',
    accent: 'purple',
  },
  {
    kernel: 'FlashInfer',
    architecture: 'Multi-arch',
    primitives: 'JIT-compiled, unified block-sparse',
    memory: 'Runtime load balancing',
    headline: 'Flexible paged/ragged KV',
    accent: 'cyan',
  },
];

/* ------------------------------------------------------------------ */
/* Module 05 — Optimizations                                           */
/* ------------------------------------------------------------------ */

/** Rich, per-technique deep dive rendered as an explanatory block. */
export interface OptimizationDeepDive {
  id: string;
  index: string;
  title: string;
  tagline: string;
  applicability: string;
  what: string;
  mechanism: string;
  diagram: string;
  formula?: string;
  whenToUse: string[];
  tradeoffs: string[];
  accent: AccentKey;
}

export const OPTIMIZATION_DEEP_DIVES: OptimizationDeepDive[] = [
  {
    id: 'disaggregation',
    index: '06.1',
    title: 'Disaggregation, Chunked Prefill & Render Tier',
    tagline: 'Separate the three unrelated jobs a single vllm serve process does — and tune each independently.',
    applicability: '🔴 Infra',
    diagram: 'disaggregation',
    what: 'A single inference process handles three workloads with nothing in common: compute-bound prefill, memory-bandwidth-bound decode, and pure CPU work (tokenization, chat templating, tool/reasoning parsing). Co-located on the same GPU, a large prompt stalls every live decode stream until it finishes. The pitch for disaggregation is not peak throughput — splitting the same GPUs into prefill and decode pools won’t necessarily move more tokens per second with no latency target. What it buys is goodput: the request rate you can sustain while every request still meets both its TTFT and ITL SLAs.',
    mechanism: 'Three orthogonal splits can be combined. (1) Chunked prefill: split a long prompt into ~2048-token blocks and interleave them with decode steps on the same GPU — local, no extra hardware. (2) Prefill/Decode disaggregation: prefill runs on FLOP-heavy GPUs; the KV cache streams over NVLink/RDMA to a separate decode pool — TTFT and ITL can now be tuned independently. (3) GPU-less Render Tier: /render converts an OpenAI request to token IDs, the engine runs token-in/token-out, and /derender reassembles the full OpenAI response (content, reasoning, tool_calls) — all CPU work leaves the GPU box entirely and scales independently.',
    formula: 'request → /render (CPU) → [prefill: FLOP] ──KV (RDMA)──▶ [decode: BW] → /derender (CPU)',
    whenToUse: [
      'Strict P99 TTFT + ITL SLAs on mixed long-prompt / long-generation workloads',
      'Multi-turn / agentic loops (bidirectional KV transfer avoids recomputing prior turns)',
      'Clusters with RDMA fabric (InfiniBand or RoCE) — PCIe-only boxes see transfer overhead, not gains',
    ],
    tradeoffs: [
      'KV transfer is the #1 failure mode: check GPU peer-to-peer connectivity before benchmarking',
      'Streaming derender with reasoning/tool parsers can be O(n³) per chunk — size the render tier accordingly',
      'You now operate 3–4 services instead of 1; production needs an orchestrator (llm-d, Dynamo, KServe)',
    ],
    accent: 'amber',
  },
  {
    id: 'quantization',
    index: '06.2',
    title: 'Advanced Quantization',
    tagline: 'Shrink the bytes moved per token to relieve decode bandwidth pressure.',
    applicability: '🟡 Self-Hosted',
    diagram: 'quantization',
    what: 'Decode is bandwidth-bound: every generated token forces a full read of the weights from HBM. Quantization shrinks those bytes, directly raising tokens/sec, while also cutting the VRAM footprint so larger models or longer caches fit.',
    mechanism: 'Weight-only formats compress just the parameters: AWQ observes activation dynamics to identify and protect the top 1% of “salient weights” in higher precision, quantizing the rest to ~4-bit with minimal quality loss; GPTQ instead uses inverse-Hessian error compensation during column-by-column quantization. Weight+activation formats quantize both operands: Hopper brought native FP8 (E4M3 weights, E5M2 activations); Blackwell advances to NVFP4 4-bit microscaling.',
    formula: 'NVFP4 · two-level scaling := local FP8 scales on 16×16 / 1×16 blocks + one global FP32 scale',
    whenToUse: [
      'VRAM-constrained serving or larger context windows',
      'Maximizing decode throughput on bandwidth-bound GPUs',
      'NVFP4 on Blackwell, FP8 on Hopper / Ada',
    ],
    tradeoffs: [
      'AWQ/GPTQ cannot accelerate prefill (weights-only)',
      'Aggressive 4-bit needs calibration or fine-tuning data',
      'Always evaluate task accuracy before production rollout',
    ],
    accent: 'cyan',
  },
  {
    id: 'speculative',
    index: '06.3',
    title: 'Speculative Decoding & MTP',
    tagline: 'Spend idle decode FLOPs to draft several tokens, then verify them in parallel.',
    applicability: '🟡 Self-Hosted',
    diagram: 'speculative',
    what: 'Decode starves the GPU for compute: at batch 1 each step leaves thousands of FLOPs idle. Speculative decoding harvests that spare compute by drafting several future tokens with a cheap model, then verifying all of them in a single parallel forward pass of the large target model.',
    mechanism: 'Built on Leviathan’s rejection-sampling proof: a draft token is accepted with probability min(1, p/q) and, if rejected, the system resamples from a normalized residual distribution. This guarantees the output perfectly matches the target model’s distribution — mathematically lossless. Modern variants drop the separate draft model: Medusa adds lightweight heads to the target; EAGLE/EAGLE-2 speculates in hidden-state feature space with dynamic tree attention; MTP bakes speculative heads into pre-training.',
    formula: 'p′(x) = max(0, p(x) − q(x)) / Σₓ′ max(0, p(x′) − q(x′))',
    whenToUse: [
      'Low-batch, latency-sensitive decoding with spare compute',
      'When output must stay distribution-identical (lossless)',
      'Code and chat domains where acceptance rates run high',
    ],
    tradeoffs: [
      'Benefit vanishes when batching already saturates compute',
      'Draft model or heads add memory and maintenance cost',
      'Real speedup tracks acceptance rate (EAGLE-2: 75–85%)',
    ],
    accent: 'emerald',
  },
  {
    id: 'sampling',
    index: '06.4',
    title: 'Decoding & Sampling Strategies',
    tagline: 'Turn raw logits into one token — trading determinism for diversity.',
    applicability: '🟢 API',
    diagram: 'sampling',
    what: 'The final linear projection emits raw, unnormalized log-probabilities (logits) z over the vocabulary. A sampling strategy converts that distribution into a single token and dictates the fundamental trade-off between deterministic precision and linguistic diversity.',
    mechanism: 'The canonical pipeline is temperature scaling → tail truncation (top-k / top-p / min-p) → softmax → draw. Temperature divides logits by T: below 1.0 it sharpens the distribution onto high-confidence tokens (reducing hallucination), above 1.0 it flattens it toward uniform for creative writing. Truncation decides the candidate set before the categorical draw.',
    formula: 'z  →  z/T  →  truncate  →  softmax  →  argmax (T=0)  |  categorical draw (T>0)',
    whenToUse: [
      'Greedy for code, math, SQL and deterministic APIs',
      'Temperature as the global randomness dial',
      'Min-p for high-coherence reasoning and creative writing',
    ],
    tradeoffs: [
      'Top-k uses a static k — too restrictive when uncertain, noisy when confident',
      'Top-p can admit flat-tail junk just to meet the probability quota',
      'Beam search is deprecated: B× VRAM + latency, and generic prose',
    ],
    accent: 'purple',
  },
  {
    id: 'structured',
    index: '06.5',
    title: 'Structured Output & Constrained Decoding',
    tagline: 'Guarantee valid JSON, SQL or regex by masking logits before sampling.',
    applicability: '🟡 Self-Hosted',
    diagram: 'structured',
    what: 'Agentic and autonomous systems must emit machine-parseable structure — JSON, tool-call arguments, YAML, SQL. Left unconstrained, models break syntax (unclosed braces, invalid keys) and collapse downstream parsing pipelines.',
    mechanism: 'Constrained decoding enforces grammar validity inside the autoregressive loop. The JSON Schema or regex is precompiled into a Deterministic Finite Automaton (DFA/FSM) or a Pushdown Automaton for context-free grammars; the engine tracks the current state from emitted tokens; and before softmax it masks every token that is not a valid transition from that state to −∞. Every emitted token is therefore syntactically valid by construction.',
    formula: 'z′ᵢ = zᵢ  if token i is a valid transition  ·  else  z′ᵢ = −∞',
    whenToUse: [
      'Tool calling and function-argument generation',
      'JSON-mode / schema-bound API responses',
      'SQL, YAML or DSL synthesis that must parse',
    ],
    tradeoffs: [
      'Grammar compilation and state tracking add overhead',
      'Async bitmasking cuts that to under 2% on host CPU',
      'Overly strict grammars can suppress better phrasing',
    ],
    accent: 'indigo',
  },
];

export interface QuantMethod {
  method: string;
  type: string;
  precision: string;
  mechanism: string;
  hardware: string;
  source: string;
}

export const QUANT_METHODS: QuantMethod[] = [
  { method: 'AWQ', type: 'Weight-only', precision: '~4-bit', mechanism: 'Protects top 1% salient weights', hardware: 'Ampere+', source: '[^56]' },
  { method: 'GPTQ', type: 'Weight-only', precision: '~4-bit', mechanism: 'Inverse Hessian error compensation', hardware: 'Ampere+', source: '[^58]' },
  { method: 'FP8', type: 'Weight + activation', precision: 'E4M3 / E5M2', mechanism: 'Native 8-bit float', hardware: 'Hopper, Ada', source: '[^61]' },
  { method: 'NVFP4', type: 'Weight + activation', precision: '4-bit microscaling', mechanism: 'Two-level scales (local FP8 + global FP32)', hardware: 'Blackwell', source: '[^64]' },
];

export interface SpecVariant {
  variant: string;
  approach: string;
  acceptance: string;
  speedup: string;
  source: string;
  accent: AccentKey;
}

export const SPEC_VARIANTS: SpecVariant[] = [
  { variant: 'Classic draft-model', approach: 'Separate small draft model', acceptance: 'Model-dependent', speedup: 'Model-dependent', source: '[^72]', accent: 'blue' },
  { variant: 'Medusa', approach: 'Multiple lightweight heads on target', acceptance: 'Model-dependent', speedup: 'Model-dependent', source: '[^73]', accent: 'amber' },
  { variant: 'EAGLE / EAGLE-2', approach: 'Speculation in feature space (hidden states)', acceptance: '75–85%', speedup: '2.5× – 4×', source: '[^73][^75]', accent: 'emerald' },
  { variant: 'MTP', approach: 'Speculative heads baked into pre-training', acceptance: 'High', speedup: 'Model-dependent', source: '[^77]', accent: 'purple' },
];

export const DISAGG_STEPS = [
  {
    step: 'Chunked Prefill',
    detail: 'Split a large prompt into ~2048-token blocks and interleave each block with ongoing decode steps — smooths latency spikes on the same GPU without extra hardware.',
    accent: 'amber' as AccentKey,
  },
  {
    step: 'Prefill / Decode Split',
    detail: 'Prompts run on FLOP-heavy prefill GPUs; the resulting KV cache streams over NVLink/RDMA to bandwidth-optimized decode GPUs. TTFT and ITL can now be tuned independently.',
    accent: 'blue' as AccentKey,
  },
  {
    step: 'KV Transfer Prerequisite',
    detail: 'Gains only materialize with fast GPU peer-to-peer connectivity (RDMA, NVLink). Without it, transfer overhead dominates — verify before benchmarking.',
    accent: 'rose' as AccentKey,
  },
  {
    step: 'GPU-less Render Tier',
    detail: '/render converts chat requests to token IDs; /derender reassembles the full OpenAI response. All CPU work (tokenization, parsing) leaves the GPU box and scales independently.',
    accent: 'emerald' as AccentKey,
  },
];

/** Steps inside the GPU-less render / derender frontend (vLLM v0.30+). */
export const RENDER_TIER_STEPS = [
  { step: '01', title: '/render', detail: 'Chat template + tokenization on CPU only. Converts an OpenAI chat request into token IDs with no GPU involved.' },
  { step: '02', title: '/inference/v1/generate', detail: 'Engine runs purely token-in → token-out. No chat template, no parsing — pure GPU compute.' },
  { step: '03', title: '/derender', detail: 'Reconstructs the full OpenAI response: splits content, reasoning traces, and tool_calls from the raw token IDs.' },
];

/** Real goodput benchmarks from the vLLM Sep 2026 disaggregation blog. */
export const GOODPUT_BENCHMARKS = [
  {
    setup: '2× L40S (PCIe, no NVLink)',
    model: 'Qwen2.5-7B, ~8K prompts, 256 output',
    result: 'Co-located p99 ITL ≈ 6× higher at 0.4–0.6 req/s; P/D p99 stays flat',
    caveat: 'No peer-to-peer → KV transfer 1.3 s per request at low rates; check connectivity first',
    accent: 'amber' as AccentKey,
  },
  {
    setup: '8× AMD MI300X (single node)',
    model: 'Qwen3-235B-A22B-FP8 · MoRI-IO connector',
    result: '73/100 requests met 1 s TTFT + 50 ms ITL vs 30/100 collocated → 2.4× goodput',
    caveat: 'Results assume fast intra-node KV path',
    accent: 'blue' as AccentKey,
  },
  {
    setup: '16× H200 (llm-d cluster)',
    model: 'gpt-oss-120b',
    result: '59% lower mean E2E latency · 67% lower P95 vs aggregated replicas',
    caveat: 'Requires RDMA fabric between nodes',
    accent: 'emerald' as AccentKey,
  },
];

/** KV connector ecosystem (vLLM v0.30+). */
export const KV_CONNECTORS = [
  { name: 'NIXL', vendor: 'vLLM upstream', notes: 'Default RDMA connector; side-channel port per worker' },
  { name: 'LMCache', vendor: 'Open source', notes: 'Prefix-aware caching layer with tiered storage' },
  { name: 'Mooncake', vendor: 'Moonshot AI', notes: 'Production-grade, used in Kimi K3 serving' },
  { name: 'FlexKV', vendor: 'Community', notes: 'Flexible multi-backend KV routing' },
  { name: 'MoRI-IO', vendor: 'AMD', notes: 'Optimized for MI300X intra-node transfers' },
  { name: 'MultiConnector', vendor: 'vLLM upstream', notes: 'Chains multiple connectors in sequence' },
];

/* Decoding & sampling strategies */
export interface SamplingRow {
  strategy: string;
  logic: string;
  hyperparam: string;
  overhead: string;
  useCase: string;
  accent: AccentKey;
}

export const SAMPLING_ROWS: SamplingRow[] = [
  { strategy: 'Greedy', logic: 'argmax z_i', hyperparam: 'None (T = 0)', overhead: 'Zero', useCase: 'Code, math, SQL, deterministic APIs', accent: 'blue' },
  { strategy: 'Temperature', logic: 'z_i / T', hyperparam: 'T ∈ [0.1, 2.0]', overhead: 'Scalar division', useCase: 'Global randomness vs determinism', accent: 'cyan' },
  { strategy: 'Top-k', logic: 'Keep top-k logits', hyperparam: 'k ∈ [20, 100]', overhead: 'Top-k selection', useCase: 'Coarse tail cutoff', accent: 'emerald' },
  { strategy: 'Top-p (Nucleus)', logic: 'Cumulative sum ≥ p', hyperparam: 'p ∈ [0.8, 0.95]', overhead: 'Cumulative sort', useCase: 'Adaptive vocabulary by entropy', accent: 'purple' },
  { strategy: 'Min-p', logic: 'p_i ≥ p_min · p_max', hyperparam: 'p_min ∈ [0.05, 0.1]', overhead: 'Max + compare', useCase: 'High-coherence reasoning & dialogue', accent: 'amber' },
  { strategy: 'Beam Search', logic: 'Maintain B hypotheses', hyperparam: 'B ∈ [2, 8]', overhead: 'B× VRAM & latency', useCase: 'Translation, short extraction (deprecated)', accent: 'rose' },
];

/** Per-strategy mechanism, formula and failure mode. */
export interface SamplingDetail {
  strategy: string;
  mechanism: string;
  formula: string;
  edge: string;
  accent: AccentKey;
}

export const SAMPLING_DETAILS: SamplingDetail[] = [
  {
    strategy: 'Greedy (T = 0)',
    mechanism: 'Selects the token with the highest logit and never samples — fully deterministic, with zero sampling overhead and the fastest generation speed.',
    formula: 't = argmaxᵢ zᵢ',
    edge: 'Vulnerable to repetitive phrasing and cyclical degeneration loops; ideal for math, code and strict factual extraction.',
    accent: 'blue',
  },
  {
    strategy: 'Temperature',
    mechanism: 'Divides logits by T before softmax, rescaling how sharp or flat the distribution is without changing which tokens exist.',
    formula: 'pᵢ = exp(zᵢ/T) / Σⱼ exp(zⱼ/T)',
    edge: 'T < 1.0 sharpens (safer, less hallucination); T > 1.0 flattens toward uniform for creative writing.',
    accent: 'cyan',
  },
  {
    strategy: 'Top-k',
    mechanism: 'Restricts candidates to the k highest-probability tokens and sets every other logit to −∞ before normalizing.',
    formula: 'V⁽ᵏ⁾ = argtopk(z, k)',
    edge: 'Static threshold: too restrictive when the model is uncertain, yet forces low-quality tokens in when it is 99% confident.',
    accent: 'emerald',
  },
  {
    strategy: 'Top-p (Nucleus)',
    mechanism: 'Retains the smallest token set whose cumulative probability reaches p — entropy-adaptive, so the pool grows under uncertainty and shrinks to one when confident.',
    formula: 'V⁽ᵖ⁾ = { i : Σⱼ∈V⁽ᵖ⁾ pⱼ ≥ p }',
    edge: 'If the tail is flat, it can still admit inappropriate low-probability tokens to satisfy the probability quota.',
    accent: 'purple',
  },
  {
    strategy: 'Min-p',
    mechanism: 'Drops any token below a floor proportional to the top token’s probability, self-calibrating the cutoff to model confidence.',
    formula: 'keep i  ⟺  pᵢ ≥ p_min · maxⱼ pⱼ',
    edge: 'Top p=0.90 & p_min=0.1 → cutoff 0.09; top p=0.15 → cutoff 0.015. Removes flat-tail noise without losing expressiveness.',
    accent: 'amber',
  },
  {
    strategy: 'Beam Search',
    mechanism: 'Maintains B parallel hypotheses and ranks candidates by cumulative log-probability across the beam.',
    formula: 'rank candidates by Σ log p',
    edge: 'Deprecated for long-form LLMs: B× KV VRAM and decode stalls, and it yields repetitive, generic prose. Superseded by Best-of-N reranking.',
    accent: 'rose',
  },
];

export const CONSTRAINED_STEPS = [
  { step: '01', title: 'Grammar Compilation', detail: 'A JSON Schema / regex is precompiled into a DFA or pushdown automaton.' },
  { step: '02', title: 'State Tracking', detail: 'The engine tracks the current automaton state from emitted tokens.' },
  { step: '03', title: 'Logit Masking', detail: 'Invalid tokens are set to −∞ before softmax, guaranteeing valid syntax.' },
];

export const CONSTRAINED_ENGINES = [
  { engine: 'xGrammar', detail: 'Arbitrary CFGs; bit-parallel token maps, microsecond parsing.' },
  { engine: 'Outlines / llguidance', detail: 'Precomputed FSM→bitmask index; zero-copy token filtering.' },
  { engine: 'Async Bitmasking', detail: 'Host CPU precomputes masks concurrently with the GPU pass (<2% overhead).' },
];

/* ------------------------------------------------------------------ */
/* Module 06 — Diffusion LLMs                                          */
/* ------------------------------------------------------------------ */
export const DIFFUSION_STEPS = [
  { step: '01', title: 'Noise Canvas', detail: 'Start with a fixed-length canvas of random tokens (e.g., 256).' },
  { step: '02', title: 'Bidirectional Attention', detail: 'Apply attention across the whole canvas — no causal mask.' },
  { step: '03', title: 'EntropyBoundSampler', detail: 'Evaluate prediction entropy to score confidence per token.' },
  { step: '04', title: 'Lock & Re-noise', detail: 'Lock low-entropy tokens; re-noise the rest and refine in parallel.' },
];

/* ------------------------------------------------------------------ */
/* Module 07 — Production guide                                        */
/* ------------------------------------------------------------------ */
export interface WorkloadRow {
  workload: string;
  engine: string;
  why: string;
  accent: AccentKey;
}

export const WORKLOAD_ROWS: WorkloadRow[] = [
  { workload: 'General chat / high throughput', engine: 'vLLM', why: 'PagedAttention + continuous batching is the safest default.', accent: 'blue' },
  { workload: 'RAG / agentic with shared prefixes', engine: 'SGLang', why: 'Cache-aware SRouter maximizes prefix reuse across the cluster.', accent: 'emerald' },
  { workload: 'Edge / local single-machine', engine: 'llama.cpp', why: 'GGUF + mmap + granular CPU/GPU layer offload.', accent: 'amber' },
  { workload: 'Strict tail-latency SLAs', engine: 'P/D Disaggregated (vLLM + llm-d / Dynamo)', why: 'Prefill and decode on separate GPU pools; TTFT and ITL tuned independently. 2.4× goodput on MI300X vs collocated.', accent: 'rose' },
  { workload: 'Long-context serving', engine: 'MLA + KV quantization', why: 'Shrinks the cache that otherwise outgrows model weights.', accent: 'purple' },
];

export const GLOSSARY_ROWS = [
  { term: 'TTFT', meaning: 'Time-to-First-Token; dominated by prefill' },
  { term: 'TPOT / ITL', meaning: 'Time-Per-Output-Token / Inter-Token Latency; dominated by decode' },
  { term: 'GEMM', meaning: 'General Matrix Multiplication' },
  { term: 'HBM / SRAM', meaning: 'High Bandwidth Memory (device DRAM) / on-chip scratchpad' },
  { term: 'TMA', meaning: 'Tensor Memory Accelerator (Hopper async copy engine)' },
  { term: 'WGMMA', meaning: 'Warpgroup Matrix Multiply-Accumulate' },
  { term: 'TMEM', meaning: 'Tensor Memory (Blackwell dedicated MMA accumulator space)' },
  { term: 'SFU', meaning: 'Special Function Unit (hardware transcendental unit)' },
  { term: 'MLA', meaning: 'Multi-Head Latent Attention' },
  { term: 'TP', meaning: 'Tensor Parallelism (intra-node weight sharding via All-Reduce)' },
  { term: 'PP', meaning: 'Pipeline Parallelism (inter-node layer sharding via P2P)' },
  { term: 'SP', meaning: 'Sequence Parallelism (sequence-dimension activation sharding)' },
  { term: 'EP', meaning: 'Expert Parallelism (MoE expert distribution via All-to-All)' },
  { term: 'DP', meaning: 'Data Parallelism (replicated models serving disjoint batches)' },
  { term: 'IFB', meaning: 'In-Flight Batching (iteration-level continuous scheduling)' },
  { term: 'YaRN', meaning: 'Yet another RoPE extensioN (multi-band context extension)' },
  { term: 'H2O', meaning: 'Heavy Hitter Oracle (attention-score KV eviction)' },
  { term: 'DFA / PDA', meaning: 'Finite Automaton / Pushdown Automaton (grammar engines)' },
  { term: 'Goodput', meaning: 'Request rate sustained while all requests meet both TTFT and ITL SLA targets simultaneously' },
  { term: 'P/D', meaning: 'Prefill/Decode disaggregation — separate GPU pools for each phase' },
  { term: 'Render Tier', meaning: 'GPU-less frontend: /render (tokenize) + /derender (parse response) off the GPU box' },
  { term: 'Bidirectional KV', meaning: 'Prefill pulls KV blocks back from decode on multi-turn, avoiding recomputation of prior conversation turns' },
  { term: 'NIXL', meaning: 'Default vLLM RDMA KV connector with per-worker side-channel ports' },
];

export const DEPLOYMENT_CHECKLIST = [
  'Enable continuous batching to swap completed sequences on the fly without padding.',
  'Enable prefix/prompt caching and keep invariant system instructions at the prompt head.',
  'Quantize weights and KV cache (FP8 / NVFP4 / KV4) to relieve decode bandwidth pressure.',
  'Restrict Tensor Parallelism strictly within the high-speed NVLink domain (≤8 GPUs/node).',
  'Deploy Pipeline or Data Parallelism across nodes to avoid All-Reduce collective stalls.',
  'Balance Expert Parallelism dispatch buffers to prevent expert hotspot stalls (MoE).',
  'For ultra-long contexts (>32K), evaluate StreamingLLM sinks or H2O / SnapKV eviction to avoid OOM.',
  'Configure Min-p sampling (p_min ∈ [0.05, 0.1]) to remove flat-tail hallucinations.',
  'Enable async grammar-constrained decoding (xGrammar / llguidance) for JSON & tool calls.',
  'Use chunked prefill to smooth TTFT spikes under mixed batch workloads.',
  'Evaluate prefill-decode disaggregation when strict tail-latency (P99) SLAs are required — verify GPU peer-to-peer connectivity before benchmarking.',
  'For multi-turn / agentic workloads, enable bidirectional KV transfer so prefill pulls prior-turn blocks from decode instead of recomputing them.',
  'Move tokenization, chat templating, and tool/reasoning parsing off GPU nodes with the vLLM render tier (/render + /derender) to scale CPU work independently.',
  'Add speculative decoding / MTP when spare compute exists during decode.',
  'Instrument TTFT, TPOT, and p95/p50 latency spread as first-class observability signals.',
];

/* ------------------------------------------------------------------ */
/* Key-numbers dashboard (executive summary)                           */
/* ------------------------------------------------------------------ */
export interface KeyNumber {
  value: string;
  label: string;
  accent: AccentKey;
}

export const KEY_NUMBERS: KeyNumber[] = [
  { value: '~295', label: 'H100 machine balance (FLOPs/byte)', accent: 'blue' },
  { value: '~1', label: 'Decode FLOPs/byte at batch 1', accent: 'rose' },
  { value: '+43%', label: 'H200 vs H100 decode throughput', accent: 'emerald' },
  { value: '~96%', label: 'VRAM utilization (PagedAttention)', accent: 'purple' },
  { value: '>90%', label: 'MLA KV cache reduction', accent: 'cyan' },
  { value: '~1600', label: 'FA4 TFLOPs/s BF16 on B200', accent: 'amber' },
];

/* ------------------------------------------------------------------ */
/* Charts                                                              */
/* ------------------------------------------------------------------ */
/**
 * Machine-balance frontier: bandwidth (TB/s) vs ridge point (FLOPs/byte).
 * Derived from HARDWARE_ROWS so the table and chart can never drift apart.
 * B200's compute (and therefore its ridge) is not stated in the sources → null.
 */
export const BALANCE_CHART = {
  labels: HARDWARE_ROWS.map((h) => h.gpu),
  series: [
    { label: 'HBM Bandwidth (TB/s)', color: '#3b82f6', data: HARDWARE_ROWS.map((h) => h.bandwidthTbs) },
    // Ridge index = FLOPs/byte ÷ 50 so it shares the 0–9 axis with TB/s.
    {
      label: 'Ridge Index (FLOPs/byte ÷ 50)',
      color: '#f59e0b',
      data: HARDWARE_ROWS.map((h): number | null => (h.balanceFlops ? h.balanceFlops / 50 : null)),
    },
  ],
};

/** Kernel headline throughput relative to vanilla attention (illustrative). */
export const KERNEL_THROUGHPUT = {
  labels: ['Vanilla', 'FA2', 'FA3', 'FA4', 'FlashInfer'],
  data: [1, 3.2, 7.5, 16.0, 6.0],
  colors: ['#f43f5e', '#f59e0b', '#10b981', '#a855f7', '#06b6d4'],
};