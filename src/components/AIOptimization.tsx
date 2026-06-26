import { useState } from 'react';
import { 
  Zap, Gauge, Layers, Terminal, Copy, Check, Info, Sparkles, 
  Shield, Coins, Activity, Square, CheckSquare, ArrowUpRight, Award, 
  AlertTriangle, Eye
} from 'lucide-react';

export const AIOptimization = () => {
  const [activeTab, setActiveTab] = useState<'vllm' | 'autoawq'>('vllm');
  const [sliderVal, setSliderVal] = useState<number>(2); // 1 = FP16, 2 = INT8, 3 = INT4, 4 = FP4
  const [copied, setCopied] = useState(false);

  // New state variables for optimization guide interactive elements
  const [tierFilter, setTierFilter] = useState<'all' | 'api' | 'self-hosted' | 'infra'>('all');
  const [activePillar, setActivePillar] = useState<'accuracy' | 'latency' | 'economics'>('accuracy');
  
  // Checklist State
  const [checklist, setChecklist] = useState({
    // Accuracy
    structuredOutput: false,
    failureClassifier: false,
    oneJobTool: false,
    validateBusinessRules: false,
    // Latency
    parallelizeSteps: false,
    pruneRag: false,
    staticPromptTop: false,
    summarizeHistory: false,
    // Token Economics
    enablePromptCaching: false,
    routeRoutineSteps: false,
    outputLengthInstructions: false,
    trackCostPerNode: false,
    // Observability
    instrumentEveryNode: false,
    buildP50P95: false,
    trackCacheHitRate: false,
    // Advanced
    enableContinuousBatching: false,
    prefillDecodeDisagg: false,
    applyQuantization: false,
    speculativeDecoding: false,
    monitorVramFragmentation: false,
    profileGpuUtilization: false,
  });

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = Object.keys(checklist).length;
  const checkedItems = Object.values(checklist).filter(Boolean).length;
  const optimizationScore = Math.round((checkedItems / totalItems) * 100);

  const getRankBadge = () => {
    if (optimizationScore === 0) return { name: "Raw Agentic Stack", color: "text-slate-400 bg-slate-100 border-slate-200" };
    if (optimizationScore <= 25) return { name: "API Integrator 🟢", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (optimizationScore <= 55) return { name: "Efficiency Architect ⚡", color: "text-teal-600 bg-teal-50 border-teal-200" };
    if (optimizationScore <= 85) return { name: "Token Economist 🪙", color: "text-amber-600 bg-amber-50 border-amber-200 text-amber-600 font-bold" };
    if (optimizationScore < 100) return { name: "Agentic Master 👑", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
    return { name: "Inference Overlord 🔮", color: "text-purple-600 bg-purple-50 border-purple-200" };
  };

  const rankBadge = getRankBadge();

  // Helper to determine active state/dimming based on tier filter
  const isTierActive = (tiers: ('api' | 'self-hosted' | 'infra')[]) => {
    if (tierFilter === 'all') return true;
    return tiers.includes(tierFilter as any);
  };

  // Static configs to display in Code Console
  const configs = {
    vllm: {
      title: "vLLM Production Serving Setup",
      description: "Spin up a production-ready Hugging Face model with optimized PagedAttention KV-caching and AWQ 4-bit quantization.",
      code: `python3 -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Meta-Llama-3-70B-Instruct \\
  --quantization awq \\
  --tensor-parallel-size 2 \\
  --max-model-len 4096 \\
  --gpu-memory-utilization 0.90 \\
  --port 8000`
    },
    autoawq: {
      title: "AutoAWQ Model Quantization",
      description: "Quantize models to 4-bit AWQ weights using a representative calibration dataset to preserve accuracy.",
      code: `from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model_path = "meta-llama/Meta-Llama-3-70B-Instruct"
quant_path = "Meta-Llama-3-70B-Instruct-AWQ"

quant_config = {
    "zero_point": True,
    "q_group_size": 128,
    "w_bit": 4,
    "version": "GEMM"
}

# Load, quantize, and save
model = AutoAWQForCausalLM.from_pretrained(model_path, safetensors=True)
tokenizer = AutoTokenizer.from_pretrained(model_path, use_fast=True)
model.quantize(tokenizer, quant_config=quant_config)
model.save_quantized(quant_path)
tokenizer.save_pretrained(quant_path)`
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Slider data
  const sliderData = [
    {
      level: "FP16 / BF16 (Uncompressed)",
      throughput: "18 tokens/sec",
      vram: "140 GB VRAM",
      accuracy: "100% (Baseline)",
      hardware: "2x NVIDIA A100 (80GB)",
      color: "from-blue-500 to-indigo-600",
      description: "Zero quantization error. Best for reasoning tasks but requires multi-GPU orchestration."
    },
    {
      level: "INT8 AWQ (Balanced Precision)",
      throughput: "35 tokens/sec",
      vram: "72 GB VRAM",
      accuracy: "99.7% Accuracy",
      hardware: "1x NVIDIA A100 (80GB)",
      color: "from-indigo-500 to-purple-600",
      description: "Saves 50% memory with virtually unnoticeable accuracy loss. Runs comfortably on a single high-tier GPU."
    },
    {
      level: "INT4 AWQ (High Speed / Quantized)",
      throughput: "65 tokens/sec",
      vram: "38 GB VRAM",
      accuracy: "98.3% Accuracy",
      hardware: "1x NVIDIA A10G (24GB) or RTX 4090",
      color: "from-purple-500 to-pink-500",
      description: "Extremely fast generation. Perfect for standard chatbots and real-time agents on budget hardware."
    },
    {
      level: "FP4 Blackwell (Extreme Efficiency)",
      throughput: "95 tokens/sec",
      vram: "20 GB VRAM",
      accuracy: "95.6% Accuracy",
      hardware: "1x NVIDIA T4 / Consumer GPU",
      color: "from-pink-500 to-rose-500",
      description: "Maximize throughput on consumer-grade hardware. Useful for agentic loops with high concurrency requirements."
    }
  ];

  const currentOpt = sliderData[sliderVal - 1] || sliderData[1];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto pt-8">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest inline-flex items-center mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
          Mastering the Agentic Trinity
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 leading-tight">
          AI Optimization & Performance Hub
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Most AI agent failures aren't model failures — they are <strong>systems failures</strong> in how 
          <span className="text-slate-900 font-semibold"> Accuracy</span>, 
          <span className="text-slate-900 font-semibold"> Latency</span>, and 
          <span className="text-slate-900 font-semibold"> Token Economics</span> are balanced.
        </p>
      </div>

      {/* Interactive Trinity Pillars Explorer */}
      <section id="optimization-stack" className="scroll-mt-24 bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
              <span>The Agentic Trinity Architecture</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Select a pillar and filter by applicability tier to view specific optimization patterns.
            </p>
          </div>

          {/* Tier Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start lg:self-auto">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                tierFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>All Tiers</span>
            </button>
            <button
              onClick={() => setTierFilter('api')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                tierFilter === 'api'
                  ? 'bg-white text-emerald-600 shadow-xs border border-slate-200/40'
                  : 'text-slate-500 hover:text-emerald-500'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>API 🟢</span>
            </button>
            <button
              onClick={() => setTierFilter('self-hosted')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                tierFilter === 'self-hosted'
                  ? 'bg-white text-amber-600 shadow-xs border border-slate-200/40'
                  : 'text-slate-500 hover:text-amber-500'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Self-Hosted 🟡</span>
            </button>
            <button
              onClick={() => setTierFilter('infra')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                tierFilter === 'infra'
                  ? 'bg-white text-rose-600 shadow-xs border border-slate-200/40'
                  : 'text-slate-500 hover:text-rose-500'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Infra 🔴</span>
            </button>
          </div>
        </div>

        {/* Pillar Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-8 bg-slate-50 p-1.5 rounded-xl border border-slate-200/40">
          <button
            onClick={() => setActivePillar('accuracy')}
            className={`py-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 cursor-pointer ${
              activePillar === 'accuracy'
                ? 'bg-white text-indigo-650 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-500" />
            <span>Pillar I: Accuracy</span>
          </button>
          <button
            onClick={() => setActivePillar('latency')}
            className={`py-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 cursor-pointer ${
              activePillar === 'latency'
                ? 'bg-white text-emerald-650 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Pillar II: Latency</span>
          </button>
          <button
            onClick={() => setActivePillar('economics')}
            className={`py-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 cursor-pointer ${
              activePillar === 'economics'
                ? 'bg-white text-amber-650 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Pillar III: Economics</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="space-y-6">
          
          {/* ==================== ACCURACY PILLAR ==================== */}
          {activePillar === 'accuracy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 mb-2">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                  <strong className="text-indigo-900 block mb-1">Goal: Prevent Cascading Failures & Out-of-Bound Generation</strong>
                  Ensure the final output is correct, and that one bad output doesn't snowball into a broken system loop. Grounding and semantic constraints are the primary levers here.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accuracy Technique 1 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api', 'self-hosted']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">1. Structured Output Modes</h3>
                      <div className="flex space-x-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-600 border border-amber-100">Self-Hosted 🟡</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Avoid parsing raw LLM text with regex. Use API-native modes like <code>response_format</code> or Gemini's <code>response_schema</code>.
                    </p>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Self-Hosted Fix:</span>
                      <p className="text-[11px] font-mono text-slate-350 leading-relaxed">
                        Enforce grammar-constrained sampling at the token head via logit masking or regex-guided finite-state automata (FSA).
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 rounded px-2.5 py-1 self-start select-none">
                    Eliminates Retry-on-Parse Costs
                  </span>
                </div>

                {/* Accuracy Technique 2 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">2. Design Atomic, Recoverable Steps</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
                      Treat every agent node as independently checkpointable. Serialize conversation/tool context before expensive calls.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-xs text-slate-500">
                        <span className="text-emerald-500 font-bold mr-1.5">✓</span>
                        <span><strong>Transient</strong> (rate limits, 5xx): Exponential backoff + jitter.</span>
                      </div>
                      <div className="flex items-start text-xs text-slate-500">
                        <span className="text-emerald-500 font-bold mr-1.5">✓</span>
                        <span><strong>Semantic</strong> (logic violations): Rollback to last valid state, apply repair handler. Never retry identical context.</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 rounded px-2.5 py-1 self-start select-none">
                    Requires Idempotency Keys on Tools
                  </span>
                </div>

                {/* Accuracy Technique 3 */}
                <div className={`p-6 border rounded-2xl md:col-span-2 transition duration-200 ${
                  isTierActive(['api', 'self-hosted']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">3. Grounding Over LLM Judges</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Evaluating LLM outputs using semantic and algorithmic checks instead of slow LLM-as-judge calls.</p>
                    </div>
                    <div className="flex space-x-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-600 border border-amber-100">Self-Hosted 🟡</span>
                    </div>
                  </div>

                  {/* Responsive Grounding Table */}
                  <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                    <table className="min-w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                          <th className="p-3">Evaluation Approach</th>
                          <th className="p-3">Cost Tier</th>
                          <th className="p-3">Optimal Target Use Case</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                        <tr className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-semibold text-slate-900">Schema & Business Rule Checks</td>
                          <td className="p-3 text-emerald-600 font-bold bg-emerald-50/30">~$0.00</td>
                          <td className="p-3">First line of defense for structural, type & basic parameter boundaries.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-semibold text-slate-900">Embedding Vector Similarity</td>
                          <td className="p-3 text-emerald-600 font-bold bg-emerald-50/30">Near Zero</td>
                          <td className="p-3">RAG pipeline evaluation — flags responses drifting from retrieved reference context.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-semibold text-slate-900">Algorithmic Self-Consistency</td>
                          <td className="p-3 text-amber-650 font-bold bg-amber-50/30">3-5x API Cost</td>
                          <td className="p-3">High-stakes numeric or logic tasks. Check divergence over multiple runs.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-semibold text-slate-900">LLM-as-a-Judge API Call</td>
                          <td className="p-3 text-rose-600 font-bold bg-rose-50/30">High Cost</td>
                          <td className="p-3">Only when fluid, nuanced, human-like semantic reasoning is strictly required.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Accuracy Technique 4 */}
                <div className={`p-6 border rounded-2xl md:col-span-2 transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">4. Control Tool Granularity</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                    </div>
                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-4">
                      Poor tool design is a major cause of agent failures. Ambiguous, overloaded tools confuse model reasoning.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                      <div>
                        <span className="block text-xs font-bold text-slate-800 mb-1">One Tool, One Job</span>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Don't make generic tools with flags. Split them into specialized, single-purpose functions.
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800 mb-1">Explicit Failure Modes</span>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Tools must return structured error payloads, never raise raw stack traces or return empty fields.
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800 mb-1">Limit Active Toolset</span>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Minimize hallucinated calls. Only inject tool schemas relevant to the agent's current stage.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== LATENCY PILLAR ==================== */}
          {activePillar === 'latency' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 mb-2">
                <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                  <strong className="text-emerald-950 block mb-1">Goal: Minimize Time-to-First-Token (TTFT) and Wall-Clock Latency</strong>
                  Break down long agent execution loops. Latency in agent systems is dominated by sequential generation calls and oversized prefill windows.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Latency Technique 1 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">1. Parallelize Independent Work</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                    </div>
                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-4">
                      Sequential loops destroy wall-clock performance. Map your workflows as Directed Acyclic Graphs (DAGs) and execute independent paths in parallel using async I/O.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 text-center flex items-center justify-center space-x-4">
                      <span className="text-xs text-slate-500 font-medium">Sequential RAG</span>
                      <span className="text-rose-500 font-bold text-xs">2.4s</span>
                      <span className="text-slate-400 font-bold">→</span>
                      <span className="text-xs text-emerald-600 font-bold">Parallel async RAG</span>
                      <span className="text-emerald-600 font-extrabold text-sm px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded">1.3s (1.8x reduction)</span>
                    </div>
                  </div>
                </div>

                {/* Latency Technique 2 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">2. Prefill Optimization (Pruning)</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                    </div>
                    <p className="text-slate-655 text-xs sm:text-sm leading-relaxed mb-4">
                      Longer prompts directly elevate prefill processing times and increase Time-to-First-Token. Keep prompts clean.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2">
                      <li className="flex items-start">
                        <span className="text-emerald-500 font-bold mr-2">•</span>
                        <span><strong>Prune RAG Chunks:</strong> Use a lightweight re-ranker, keep only top 3-4 chunks.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 font-bold mr-2">•</span>
                        <span><strong>Compress Prompts:</strong> Remove verbose context; express business rules strictly and concisely.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 font-bold mr-2">•</span>
                        <span><strong>Summarize History:</strong> Swap early conversation turns with short rolling summaries.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Latency Technique 3 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">3. Prefix/Prompt Caching</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                    </div>
                    <p className="text-slate-655 text-xs sm:text-sm leading-relaxed mb-4">
                      Leverage API cache policies. Structure message prompts strategically: Place static components (system prompts, tool definitions) first, and dynamic context (user history, variables) last.
                    </p>
                    <div className="border border-slate-200/60 rounded-xl overflow-hidden text-[10px] sm:text-xs">
                      <div className="bg-slate-50 px-3 py-2 font-bold text-slate-600 border-b border-slate-200/60">Correct Prompt Order for Cache Hits:</div>
                      <div className="p-3 space-y-1 bg-white font-mono">
                        <div className="p-1.5 bg-indigo-50 border border-indigo-150 rounded text-indigo-700">1. System Prompt / Static Instructions [CACHE BOUND]</div>
                        <div className="p-1.5 bg-indigo-50/50 border border-indigo-150 rounded text-indigo-650">2. Tool JSON Definitions / Static Knowledge Base</div>
                        <div className="p-1.5 bg-amber-50 border border-amber-150 rounded text-amber-700 font-bold">3. User Messages & Dynamic Context [NEW DATA]</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latency Technique 4 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['self-hosted', 'infra']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">4. Speculative & Parallel Decoding</h3>
                      <div className="flex space-x-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-600 border border-amber-100">Self-Hosted 🟡</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-50 text-rose-600 border border-rose-100">Infra 🔴</span>
                      </div>
                    </div>
                    <p className="text-slate-655 text-xs sm:text-sm leading-relaxed mb-3">
                      Optimizations inside self-hosted runtimes that mathematically accelerate raw token generation:
                    </p>
                    <div className="space-y-3">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs font-bold text-slate-800 block">Speculative Decoding</span>
                        <span className="text-[11px] text-slate-550 block leading-relaxed">
                          A smaller drafting model predicts tokens ahead; target model checks in one forward pass. Gain <strong>2.5x–3.2x throughput</strong> losslessly.
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs font-bold text-slate-800 block">Prefill-Decode (PD) Disaggregation</span>
                        <span className="text-[11px] text-slate-555 block leading-relaxed">
                          Compute-heavy prefill and memory-heavy decode on separate GPUs cuts tail latency by <strong>5x–10x</strong> under peak load.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TOKEN ECONOMICS PILLAR ==================== */}
          {activePillar === 'economics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 mb-2">
                <Coins className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                  <strong className="text-amber-955 block mb-1">Goal: Slash Execution Token Bills & Wasteful Inference Costs</strong>
                  Tackle the hidden 30x compounding cost multiplier. Production agents trigger massive context updates; proper model routing is required to sustain margin.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Economics Technique 1 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">1. Prompt Caching ROI</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                    </div>
                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-4">
                      The single highest-ROI optimization for LLM costs. Once static contexts are cached, returning queries hit cached records, slashing processing expenses.
                    </p>
                    <div className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200/80 rounded-xl">
                      <span className="text-2xl">🪙</span>
                      <div>
                        <span className="block text-sm font-bold text-amber-900">40% - 70% Cost Reduction</span>
                        <span className="text-xs text-amber-750 leading-relaxed block">Typically seen in high-volume multi-turn conversational agents and recursive code loops.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economics Technique 2 */}
                <div className={`p-6 border rounded-2xl transition duration-200 flex flex-col justify-between ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">2. Context Pruning Layer</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                    </div>
                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-4">
                      Embed a lightweight distillation process in-between the retrieval engine and the model invocation. Don't dump raw docs directly.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-150">
                        <span className="w-5 h-5 bg-indigo-150 text-indigo-705 font-bold rounded flex items-center justify-center mr-2 text-[10px]">1</span>
                        <span>Re-rank candidates using vector similarity.</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-150">
                        <span className="w-5 h-5 bg-indigo-150 text-indigo-705 font-bold rounded flex items-center justify-center mr-2 text-[10px]">2</span>
                        <span>Prune bottom 60% of context nodes before sending.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economics Technique 3 */}
                <div className={`p-6 border rounded-2xl md:col-span-2 transition duration-200 ${
                  isTierActive(['api']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">3. Dynamic Model Routing</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Route sub-steps to different model tiers. Avoid using frontier models for routine processing tasks.</p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">API 🟢</span>
                  </div>

                  {/* Responsive Routing Table */}
                  <div className="overflow-x-auto border border-slate-200/60 rounded-xl mb-4">
                    <table className="min-w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                          <th className="p-3">Task Tier</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Target Model Assignment</th>
                          <th className="p-3">Cost Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                        <tr className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-semibold text-slate-900 flex items-center"><ArrowUpRight className="w-3.5 h-3.5 mr-1 text-slate-400" />Orchestration / Planning</td>
                          <td className="p-3">Low (1-2x per flow)</td>
                          <td className="p-3">Frontier Model (e.g. GPT-4o, Claude 3.5 Sonnet)</td>
                          <td className="p-3 text-slate-600">Fixed Baseline Cost</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-semibold text-slate-900 flex items-center"><ArrowUpRight className="w-3.5 h-3.5 mr-1 text-slate-400" />Extraction & RAG Lookup</td>
                          <td className="p-3">High (30-50x per flow)</td>
                          <td className="p-3">Lightweight Model (e.g. Gemini 1.5 Flash, GPT-4o-mini)</td>
                          <td className="p-3 text-emerald-600 font-bold bg-emerald-50/20">Cuts 40-70% total bill</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition">
                          <td className="p-3 font-semibold text-slate-900 flex items-center"><ArrowUpRight className="w-3.5 h-3.5 mr-1 text-slate-400" />Critique & Validation</td>
                          <td className="p-3">Moderate</td>
                          <td className="p-3">Mid-Tier Model / Special Checker</td>
                          <td className="p-3 text-slate-600">Balanced Overhead</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                    <span className="block text-xs font-bold text-slate-800 mb-1 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
                      Intelligent Escalation Pattern
                    </span>
                    <span className="text-xs text-slate-500 leading-relaxed block">
                      Attach an output entropy monitor to your lightweight model. If token prediction distribution has high variance/uncertainty, auto-escalate only that specific query to the frontier model.
                    </span>
                  </div>
                </div>

                {/* Economics Technique 4 */}
                <div className={`p-6 border rounded-2xl md:col-span-2 transition duration-200 ${
                  isTierActive(['self-hosted', 'infra']) 
                    ? 'bg-white border-slate-200/80 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-100 opacity-40'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">4. Quantization Strategy</h3>
                    <div className="flex space-x-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-600 border border-amber-100">Self-Hosted 🟡</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-50 text-rose-600 border border-rose-100">Infra 🔴</span>
                    </div>
                  </div>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-4">
                    Deploy a comprehensive weight + memory quantization stack inside your cluster rather than running raw FP16 values:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/50">
                      <span className="block text-xs font-bold text-slate-800 mb-0.5">W8A8 Weights</span>
                      <span className="text-[11px] text-slate-500 block leading-normal">Quantize weights and activations to double execution math throughput.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/50">
                      <span className="block text-xs font-bold text-slate-800 mb-0.5">FP8 KV Cache</span>
                      <span className="text-[11px] text-slate-500 block leading-normal">Halves memory size, enabling 70B parameter models to load on single GPUs.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/50">
                      <span className="block text-xs font-bold text-slate-800 mb-0.5">&lt;5% Accuracy Loss</span>
                      <span className="text-[11px] text-slate-500 block leading-normal">Ensures output validation metrics stay inside acceptable quality parameters.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Interactive Trade-Off Simulator (Existing) */}
      <section id="trade-off" className="scroll-mt-24 bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
              <span>Model Quantization Trade-Off Simulator</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Drag the slider to visualize the mathematical balance between model quality, throughput, and hardware requirements.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-lg uppercase tracking-wide">
            Live Trades
          </span>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column (left 5-cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">
                Optimization Mode Selector:
              </label>
              
              {/* Slider */}
              <div className="px-2 pt-2 pb-6">
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-hidden"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
                  <span>FP16</span>
                  <span>INT8</span>
                  <span>INT4</span>
                  <span>FP4</span>
                </div>
              </div>

              {/* Selection Explanation */}
              <div className="mt-4 p-4 bg-white border border-slate-200/60 rounded-xl">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm mb-1">
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${currentOpt.color}`}></span>
                  <span>{currentOpt.level}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mt-2">
                  {currentOpt.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start space-x-2 text-slate-400 bg-slate-100/50 p-3 rounded-lg text-xs border border-slate-200/40">
              <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
              <span>Simulated specs reflect a 70B parameter model family context (e.g., Llama-3-70B). Actual runtimes vary by server utilization.</span>
            </div>
          </div>

          {/* Metrics Dashboard Column (right 7-cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            
            {/* Metric 1: Throughput */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Throughput</span>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {currentOpt.throughput}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center mt-1">
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  Generation Speed
                </span>
              </div>
            </div>

            {/* Metric 2: Memory */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required VRAM</span>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {currentOpt.vram}
                </span>
                <span className="text-xs text-indigo-600 font-semibold flex items-center mt-1">
                  <Layers className="w-3.5 h-3.5 mr-1" />
                  Minimum Footprint
                </span>
              </div>
            </div>

            {/* Metric 3: Accuracy */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Relative Accuracy</span>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {currentOpt.accuracy}
                </span>
                <span className="text-xs text-purple-600 font-semibold flex items-center mt-1">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Task Performance
                </span>
              </div>
            </div>

            {/* Metric 4: Hardware */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Compute</span>
              <div>
                <span className="block text-sm sm:text-base font-extrabold text-slate-900 mt-2 line-clamp-2">
                  {currentOpt.hardware}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center mt-1">
                  <Gauge className="w-3.5 h-3.5 mr-1" />
                  Cost Efficiency Target
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Code Console (Existing) */}
      <section id="blueprints" className="scroll-mt-24 bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
              <span>Setup Blueprints Console</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Copy and deploy production-grade scripts to configure optimized inference environments.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 font-medium">
            <button
              onClick={() => setActiveTab('vllm')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'vllm'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              vLLM Runtime
            </button>
            <button
              onClick={() => setActiveTab('autoawq')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'autoawq'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              AutoAWQ Quant
            </button>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-900">
          {/* Console Header */}
          <div className="flex justify-between items-center bg-slate-900/80 px-6 py-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 tracking-tight">
                {configs[activeTab].title}
              </span>
            </div>
            <button
              onClick={() => handleCopy(configs[activeTab].code)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition duration-150 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Blueprint</span>
                </>
              )}
            </button>
          </div>

          {/* Console Description & Code */}
          <div className="p-6">
            <p className="text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed font-mono">
              # {configs[activeTab].description}
            </p>
            <pre className="text-xs sm:text-sm text-slate-100 overflow-x-auto font-mono leading-relaxed select-all">
              {configs[activeTab].code}
            </pre>
          </div>
        </div>
      </section>

      {/* Observability Hub */}
      <section id="observability" className="scroll-mt-24 bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
              <span>System Observability Console</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              "You cannot optimize what you cannot measure." Track telemetry at every agent node before optimization.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-slate-900 text-slate-300 text-xs font-mono font-bold rounded-lg border border-slate-800 flex items-center space-x-1.5 self-start lg:self-auto select-none shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>TELEMETRY: ACTIVE</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Mock Real-Time Terminal (left 7-cols) */}
          <div className="lg:col-span-7 bg-slate-955 rounded-2xl overflow-hidden shadow-lg border border-slate-900 text-slate-200 font-mono text-xs">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400 font-bold text-[11px]">PROD_AGENT_ROUTING_STREAM</span>
              </div>
              <span className="text-[10px] text-slate-500">Live Telemetry Metrics</span>
            </div>
            
            <div className="p-4 space-y-2 bg-slate-950 min-h-[220px]">
              <div className="text-slate-500"># Listening for agent execution events...</div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">[16:12:01.03] NODE_EXEC</span>
                <span className="text-emerald-400">PLANNER_LLM_CALL (1024 inp, 128 out) - OK</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">[16:12:01.21] TTFT_LATENCY</span>
                <span>420 ms (OpenAI GPT-4o)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">[16:12:01.22] CACHE_CHECK</span>
                <span className="text-emerald-400 font-bold">CACHE HIT (90% cost saved)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">[16:12:01.25] ROUTER_MONITOR</span>
                <span className="text-slate-400">Model: GPT-4o-mini | Confidence: 94.2%</span>
              </div>
              
              <div className="flex items-center justify-between text-yellow-450 bg-yellow-500/5 px-2 py-1 rounded border border-yellow-500/10">
                <div className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>ALERT: Node [CRITIQUE_CHECK] p95 latency spike detected</span>
                </div>
                <span>4.2s (Threshold: 2.0s)</span>
              </div>
              <div className="text-slate-550 pt-1"># Investigating KV cache thrash. Re-ranker pruning advised.</div>
            </div>
          </div>

          {/* Details (right 5-cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center">
                <Eye className="w-4 h-4 text-slate-600 mr-1.5" />
                What to Capture (Every Node)
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-2">•</span>
                  <span><strong>Tokens:</strong> <code>input_tokens</code>, <code>output_tokens</code>, and <code>cache_hit</code> true/false.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-2">•</span>
                  <span><strong>Latency:</strong> Time-to-First-Token (<code>ttft_ms</code>) & total elapsed execution time.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-2">•</span>
                  <span><strong>Tools:</strong> Executed tool name, input arguments, and result exit code status.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 font-bold mr-2">•</span>
                  <span><strong>Trace:</strong> Escalation status, retry attempts, and detailed failure reason.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200/65 rounded-2xl">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center">
                <Activity className="w-4 h-4 text-slate-600 mr-1.5" />
                Key Warning Signals to Watch
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-500 font-bold mr-2">•</span>
                  <span><strong>p95 Latency &gt; 4x p50:</strong> Indicates KV cache thrashing or oversized prompts. Trim contexts before scaling hardware.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 font-bold mr-2">•</span>
                  <span><strong>Semantic Cache Hits &lt; 70%:</strong> Signals user query distribution drift. Re-seed caching nodes; do not scale server fleets.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive 80/20 Checklist Dashboard */}
      <section id="checklist" className="scroll-mt-24 bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2 mb-6">
          <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
          <span>Interactive 80/20 & Advanced Optimization Checklist</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Optimization Meter Card (left 4-cols) */}
          <div className="lg:col-span-4 p-6 bg-slate-50 rounded-2xl border border-slate-200/60 text-center flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Agent Optimization Score</span>
              
              {/* Circular score chart mock */}
              <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-slate-200"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-emerald-500 transition-all duration-500 ease-out"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - optimizationScore / 100)}
                    fill="transparent"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-950">{optimizationScore}%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Optimized</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-bold">System Status Rank:</span>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${rankBadge.color}`}>
                  {rankBadge.name}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed mt-6 border-t border-slate-200/60 pt-4 flex items-center justify-center space-x-1">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>Tick items to test your tech stack's configuration.</span>
            </div>
          </div>

          {/* Checklist Selectors (right 8-cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tier 1: 80/20 Core checklist */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans">Core 80/20 Checklist (High-Impact / Low-Cost)</span>
              </div>
              
              {/* Accuracy Sub-section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-650 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> 🎯 Accuracy
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    onClick={() => toggleChecklist('structuredOutput')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.structuredOutput ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Switch to native structured output</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('failureClassifier')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.failureClassifier ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Add failure classifier before retry</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('oneJobTool')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.oneJobTool ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Give each tool one job</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('validateBusinessRules')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.validateBusinessRules ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Validate outputs against rules first</div>
                  </div>
                </div>
              </div>

              {/* Latency Sub-section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-650 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> ⚡ Latency
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    onClick={() => toggleChecklist('parallelizeSteps')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.parallelizeSteps ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Parallelize independent DAG branches</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('pruneRag')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.pruneRag ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Cut RAG retrieval to 3–4 chunks max</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('staticPromptTop')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.staticPromptTop ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Move static prompt content to top</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('summarizeHistory')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.summarizeHistory ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Summarize long conversation histories</div>
                  </div>
                </div>
              </div>

              {/* Economics Sub-section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-655 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> 💰 Token Economics
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    onClick={() => toggleChecklist('enablePromptCaching')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.enablePromptCaching ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Enable prompt caching</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('routeRoutineSteps')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.routeRoutineSteps ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Route routine steps to smaller model</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('outputLengthInstructions')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.outputLengthInstructions ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Set explicit output length limits</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('trackCostPerNode')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.trackCostPerNode ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Track cost per agent node</div>
                  </div>
                </div>
              </div>

              {/* Observability Sub-section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> 🔍 Observability
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    onClick={() => toggleChecklist('instrumentEveryNode')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.instrumentEveryNode ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Instrument every node before optimizing</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('buildP50P95')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.buildP50P95 ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Build p50/p95 latency view per node</div>
                  </div>
                  <div 
                    onClick={() => toggleChecklist('trackCacheHitRate')}
                    className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                  >
                    {checklist.trackCacheHitRate ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div className="text-xs font-bold text-slate-700">Track cache hit rate (target &gt;70%)</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Tier 2: Advanced Checklist */}
            <div className="space-y-3 pt-2">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block font-sans">Advanced Checklist (Self-Hosted Inference)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div 
                  onClick={() => toggleChecklist('enableContinuousBatching')}
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                >
                  {checklist.enableContinuousBatching ? (
                    <CheckSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="text-xs font-bold text-slate-700">Enable continuous / dynamic batching</div>
                </div>

                <div 
                  onClick={() => toggleChecklist('prefillDecodeDisagg')}
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                >
                  {checklist.prefillDecodeDisagg ? (
                    <CheckSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="text-xs font-bold text-slate-700">Separate prefill & decode GPU pools</div>
                </div>

                <div 
                  onClick={() => toggleChecklist('applyQuantization')}
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                >
                  {checklist.applyQuantization ? (
                    <CheckSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="text-xs font-bold text-slate-700">Quantize weights AND KV cache</div>
                </div>

                <div 
                  onClick={() => toggleChecklist('speculativeDecoding')}
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                >
                  {checklist.speculativeDecoding ? (
                    <CheckSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="text-xs font-bold text-slate-700">Enable speculative decoding</div>
                </div>

                <div 
                  onClick={() => toggleChecklist('monitorVramFragmentation')}
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                >
                  {checklist.monitorVramFragmentation ? (
                    <CheckSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="text-xs font-bold text-slate-700">Monitor VRAM KV cache fragmentation</div>
                </div>

                <div 
                  onClick={() => toggleChecklist('profileGpuUtilization')}
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition cursor-pointer"
                >
                  {checklist.profileGpuUtilization ? (
                    <CheckSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="text-xs font-bold text-slate-700">Profile GPU utilization vs. MFU</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Final Takeaway */}
      <footer className="bg-slate-900 border border-slate-800 shadow-xl rounded-2xl p-6 sm:p-8 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start space-x-4 text-left">
          <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-sm sm:text-base">Systematic Engineering over Ad-Hoc Prompts</h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-2xl font-mono">
              Do not tune prompts blindly. Establish observability first, guarantee logical correctness with structure constraint rules, utilize parallel flows to minimize TTFT, and route dynamically to optimize token margins. Master the patterns, not the library wrappers.
            </p>
          </div>
        </div>
        <span className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wider shrink-0 select-none font-mono">
          PRACTICE OVER PRESETS
        </span>
      </footer>
    </div>
  );
};

export default AIOptimization;
