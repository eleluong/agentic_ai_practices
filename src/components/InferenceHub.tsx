import { useState } from 'react';
import {
    Activity,
    ArrowRight,
    BookOpen,
    Check,
    Cpu,
    Gauge,
    Info,
    Layers,
    ListChecks,
    Snowflake,
    Sparkles,
    Workflow,
    Zap,
} from 'lucide-react';
import {
    ACCENT,
    CONSTRAINED_ENGINES,
    CONSTRAINED_STEPS,
    DEPLOYMENT_CHECKLIST,
    DIFFUSION_STEPS,
    DISAGG_STEPS,
    ENGINE_ROWS,
    EVICTION_METHODS,
    GLOSSARY_ROWS,
    GOODPUT_BENCHMARKS,
    HARDWARE_ROWS,
    INFERENCE_MODULES,
    INTERCONNECT_ROWS,
    KEY_NUMBERS,
    KERNEL_ROWS,
    KV_CONNECTORS,
    KV_STRATEGIES,
    LONG_CONTEXT_STATS,
    MLA_STATS,
    OPTIMIZATION_DEEP_DIVES,
    PAGED_ATTENTION_STATS,
    PARALLELISM_NOTES,
    PARALLELISM_ROWS,
    PREFILL_DECODE_ROWS,
    QUANT_METHODS,
    RENDER_TIER_STEPS,
    ROPE_METHODS,
    SAMPLING_DETAILS,
    SAMPLING_ROWS,
    SPEC_VARIANTS,
    SROUTER_STEPS,
    WORKLOAD_ROWS,
} from '../data/inferenceData';
import { RooflineExplorer } from './inference/RooflineExplorer';
import { KvMemoryLab } from './inference/KvMemoryLab';
import { SpeculativeDecoder } from './inference/SpeculativeDecoder';
import { DiffusionAnnealing } from './inference/DiffusionAnnealing';
import { DisaggregationFlow } from './inference/DisaggregationFlow';
import { SamplingLab } from './inference/SamplingLab';
import { ParallelismPlanner } from './inference/ParallelismPlanner';
import { OptimizationDiagram } from './inference/OptimizationDiagrams';
import { KernelThroughput, HardwareBalance } from './inference/charts';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

interface InferenceHubProps {
    scrollToSection: (id: string) => void;
}

const SectionHeading = ({
    index,
    heading,
    subtitle,
    accent,
    slideRefs,
}: {
    index: string;
    heading: string;
    subtitle: string;
    accent: (typeof INFERENCE_MODULES)[number]['accent'];
    slideRefs: string;
}) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
        <div>
            <div className={`text-[11px] font-mono font-bold tracking-widest mb-2 ${ACCENT[accent].text}`}>{index}</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{heading}</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl">{subtitle}</p>
        </div>
        <span className="text-[10px] font-mono text-slate-500 border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap">
            {slideRefs}
        </span>
    </div>
);

const SECTION = 'scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8';

/** Rich per-technique explanation used by the Optimizations module. */
const DeepDive = ({ d }: { d: (typeof OPTIMIZATION_DEEP_DIVES)[number] }) => {
    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${ACCENT[d.accent].bg} ${ACCENT[d.accent].text}`}>
                    {d.index}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{d.title}</h3>
                <span className="text-[10px] font-mono text-slate-500 border border-slate-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">
                    {d.applicability}
                </span>
            </div>

            <p className={`text-sm font-semibold mb-3 ${ACCENT[d.accent].text}`}>{d.tagline}</p>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">{d.what}</p>

            <div className="rounded-xl bg-white border border-slate-200 p-4 mb-4">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-3">HOW IT WORKS</div>
                <OptimizationDiagram id={d.diagram} />
            </div>

            <details className="group">
                <summary className="cursor-pointer text-[11px] font-semibold text-slate-500 hover:text-slate-700 inline-flex items-center gap-1.5 select-none">
                    <BookOpen size={12} />
                    Read the full explanation
                </summary>
                <div className="mt-3">
                    <p className="text-[12px] text-slate-600 leading-relaxed mb-3">{d.mechanism}</p>
                    {d.formula && (
                        <div className="mb-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] px-3 py-2 overflow-x-auto whitespace-nowrap">
                            {d.formula}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-[10px] font-mono font-bold text-emerald-600 mb-1.5">WHEN TO USE</div>
                            <ul className="space-y-1">
                                {d.whenToUse.map((w) => (
                                    <li key={w} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                        <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <span>{w}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono font-bold text-rose-500 mb-1.5">TRADE-OFFS</div>
                            <ul className="space-y-1">
                                {d.tradeoffs.map((w) => (
                                    <li key={w} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                        <span>{w}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    );
};

/**
 * The LLM Inference hub. Renders the full technical guide as flowing
 * sections with interactive demonstrations of every core mechanism.
 */
export const InferenceHub = ({ scrollToSection }: InferenceHubProps) => {
    const { lang } = useLanguage();
    const t = translations[lang];
    const inf = t.inference;
    const [checked, setChecked] = useState<boolean[]>(() => DEPLOYMENT_CHECKLIST.map(() => false));

    const checkedCount = checked.filter(Boolean).length;

    const im = (i: number) => {
        const m = INFERENCE_MODULES[i];
        return {
            ...m,
            heading: lang === 'vi' ? m.headingVi : m.heading,
            subtitle: lang === 'vi' ? m.subtitleVi : m.subtitle,
        };
    };

    return (
        <div className="space-y-16">
            {/* Hero */}
            <div className="text-center max-w-4xl mx-auto pt-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest inline-flex items-center gap-1.5 mb-6">
                    <Sparkles size={13} />
                    {inf.heroBadge}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
                        {inf.heroTitle}
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600">
                        {inf.heroSubtitle}
                    </span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    {inf.heroDesc}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto mt-10">
                    {KEY_NUMBERS.map((s) => (
                        <div key={s.label} className={`rounded-xl bg-white border p-3.5 shadow-xs ${ACCENT[s.accent].border}`}>
                            <div className={`text-lg font-black font-mono-deck ${ACCENT[s.accent].text}`}>{s.value}</div>
                            <div className="text-[10px] text-slate-500 leading-tight mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <button
                        onClick={() => scrollToSection('roofline')}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition flex items-center gap-2"
                    >
                        <Gauge size={16} /> {inf.navRoofline}
                    </button>
                    <button
                        onClick={() => scrollToSection('kv-lab')}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-sm transition flex items-center gap-2"
                    >
                        <Layers size={16} /> {inf.navKvLab}
                    </button>
                    <button
                        onClick={() => scrollToSection('checklist')}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-sm transition flex items-center gap-2"
                    >
                        <ListChecks size={16} /> {inf.navChecklist}
                    </button>
                </div>

                <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 border border-blue-100 text-left max-w-3xl mx-auto">
                    <div className="text-[10px] font-mono font-bold text-blue-600 mb-2">{inf.thesisLabel}</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{inf.thesisBody}</p>
                </div>

                {lang === 'vi' && (
                    <div className="mt-4 mx-auto max-w-3xl flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left">
                        <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-amber-800 leading-relaxed">{inf.deepDiveLanguageNote}</p>
                    </div>
                )}
            </div>

            {/* MODULE 01 — Core Mechanics */}
            <section id="mechanics" className={SECTION}>
                <SectionHeading {...im(0)} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-7 overflow-x-auto">
                        <table className="w-full text-xs data-table">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                    <th className="text-left p-3">PROPERTY</th>
                                    <th className="text-left p-3 text-blue-600">PREFILL</th>
                                    <th className="text-left p-3 text-rose-600">DECODE</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {PREFILL_DECODE_ROWS.map((r) => (
                                    <tr key={r.property} className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-900">{r.property}</td>
                                        <td className="p-3">{r.prefill}</td>
                                        <td className="p-3">{r.decode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="lg:col-span-5 space-y-3">
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                            <div className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1.5">
                                <Cpu size={14} /> Prefill — Compute Bound
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                                The whole prompt runs in parallel through massive GEMMs, saturating Tensor Cores at 100s–1000+
                                FLOPs/byte. Prefill determines TTFT.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                            <div className="text-xs font-bold text-rose-700 mb-1 flex items-center gap-1.5">
                                <Activity size={14} /> Decode — Bandwidth Bound
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                                One token per step. The model streams its entire weight matrix from HBM for a tiny amount of math —
                                leaving cores ~99% idle at batch 1.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hardware table + balance chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-6 overflow-x-auto">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Hardware: Compute vs Bandwidth</h3>
                        <table className="w-full text-xs data-table">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                    <th className="text-left p-3">GPU</th>
                                    <th className="text-left p-3">FP16</th>
                                    <th className="text-left p-3">HBM</th>
                                    <th className="text-right p-3">BALANCE</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {HARDWARE_ROWS.map((h) => (
                                    <tr key={h.gpu} className="border-b border-slate-100">
                                        <td className={`p-3 font-semibold ${ACCENT[h.accent].text}`}>{h.gpu}</td>
                                        <td className="p-3 font-mono">{h.compute}</td>
                                        <td className="p-3 font-mono">{h.bandwidth}</td>
                                        <td className="p-3 text-right font-mono">{h.balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="mt-3 text-[11px] text-slate-500">{inf.hardwareNote}</p>
                    </div>
                    <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Bandwidth vs Machine Balance</h3>
                        <HardwareBalance />
                    </div>
                </div>

                {/* Roofline interactive */}
                <div id="roofline" className="scroll-mt-24">
                    <RooflineExplorer />
                </div>
            </section>

            {/* MODULE 02 — KV Cache */}
            <section id="kv-cache" className={SECTION}>
                <SectionHeading {...im(1)} />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                    {PAGED_ATTENTION_STATS.map((s) => (
                        <div key={s.k} className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                            <div className="text-xl font-black text-indigo-600 font-mono-deck">{s.k}</div>
                            <div className="text-[11px] text-slate-600 mt-1 leading-snug">{s.v}</div>
                        </div>
                    ))}
                </div>

                <div id="kv-lab" className="scroll-mt-24 mb-8">
                    <KvMemoryLab />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 overflow-x-auto">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">KV Cache Strategy Comparison</h3>
                        <table className="w-full text-xs data-table">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                    <th className="text-left p-3">TECHNIQUE</th>
                                    <th className="text-left p-3">OPTIMIZES</th>
                                    <th className="text-left p-3">MECHANISM</th>
                                    <th className="text-center p-3">LOSSLESS</th>
                                    <th className="text-right p-3">COMPRESSION</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {KV_STRATEGIES.map((k) => (
                                    <tr key={k.technique} className="border-b border-slate-100">
                                        <td className={`p-3 font-semibold ${ACCENT[k.accent].text}`}>{k.technique}</td>
                                        <td className="p-3">{k.optimizes}</td>
                                        <td className="p-3 text-slate-500">{k.mechanism}</td>
                                        <td className="p-3 text-center">
                                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${k.lossless === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {k.lossless}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right font-mono font-bold">{k.compression}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="lg:col-span-4">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">MLA Latent Dimensions</h3>
                        <div className="space-y-3">
                            {MLA_STATS.map((s) => (
                                <div key={s.k} className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200">
                                    <span className="text-xl font-black text-purple-600 font-mono-deck">{s.k}</span>
                                    <span className="text-[11px] text-slate-600 text-right ml-3">{s.v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-xs font-bold text-slate-700 mb-1">Weight Absorption</div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                                Up-projection matrices are absorbed into the Query and Output weights, letting the attention kernel
                                operate directly on the compressed latent vector.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Long-context mechanics */}
                <div className="mt-10 pt-8 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Long-Context Mechanics: RoPE Scaling & Ring Attention</h3>
                    <p className="text-[11px] text-slate-500 mb-5">
                        A single 128K request explodes KV memory and attention compute — extended context demands both
                        positional interpolation and cross-GPU sequence sharding.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        {LONG_CONTEXT_STATS.map((s) => (
                            <div key={s.k} className="p-4 rounded-xl bg-cyan-50 border border-cyan-200">
                                <div className="text-xl font-black text-cyan-600 font-mono-deck">{s.k}</div>
                                <div className="text-[11px] text-slate-600 mt-1 leading-snug">{s.v}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-6 overflow-x-auto">
                            <h4 className="text-xs font-bold text-slate-900 mb-3">RoPE Extension Methods</h4>
                            <table className="w-full text-xs data-table">
                                <thead>
                                    <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                        <th className="text-left p-3">METHOD</th>
                                        <th className="text-left p-3">MECHANISM</th>
                                        <th className="text-left p-3">TRADEOFF</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    {ROPE_METHODS.map((r) => (
                                        <tr key={r.method} className="border-b border-slate-100">
                                            <td className={`p-3 font-semibold ${ACCENT[r.accent].text}`}>{r.method}</td>
                                            <td className="p-3 font-mono text-[11px] text-slate-500">{r.mechanism}</td>
                                            <td className="p-3 text-slate-500">{r.tradeoff}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="lg:col-span-6 overflow-x-auto">
                            <h4 className="text-xs font-bold text-slate-900 mb-3">Sparse & Eviction-Based KV Caching</h4>
                            <table className="w-full text-xs data-table">
                                <thead>
                                    <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                        <th className="text-left p-3">METHOD</th>
                                        <th className="text-left p-3">MECHANISM</th>
                                        <th className="text-left p-3">GAIN</th>
                                        <th className="text-center p-3">LOSSLESS</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    {EVICTION_METHODS.map((e) => (
                                        <tr key={e.method} className="border-b border-slate-100">
                                            <td className={`p-3 font-semibold ${ACCENT[e.accent].text}`}>{e.method}</td>
                                            <td className="p-3 text-slate-500">{e.mechanism}</td>
                                            <td className="p-3 text-slate-500">{e.gain}</td>
                                            <td className="p-3 text-center">
                                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">
                                                    {e.lossless}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULE 03 — Distributed Parallelism */}
            <section id="distributed" className={SECTION}>
                <SectionHeading {...im(2)} />

                <div className="mb-8">
                    <ParallelismPlanner />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-7 overflow-x-auto">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Parallelism Strategy Matrix</h3>
                        <table className="w-full text-xs data-table">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                    <th className="text-left p-3">STRATEGY</th>
                                    <th className="text-left p-3">PARTITIONED DIM</th>
                                    <th className="text-left p-3">COLLECTIVES</th>
                                    <th className="text-left p-3">NETWORK</th>
                                    <th className="text-left p-3">USE CASE</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {PARALLELISM_ROWS.map((p) => (
                                    <tr key={p.strategy} className="border-b border-slate-100">
                                        <td className={`p-3 font-semibold ${ACCENT[p.accent].text}`}>{p.strategy}</td>
                                        <td className="p-3 text-slate-500">{p.dimension}</td>
                                        <td className="p-3 font-mono text-[11px]">{p.collectives}</td>
                                        <td className="p-3 text-slate-500">{p.network}</td>
                                        <td className="p-3 text-slate-500">{p.useCase}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="lg:col-span-5 overflow-x-auto">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Interconnect Hierarchy</h3>
                        <table className="w-full text-xs data-table">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                    <th className="text-left p-3">LINK</th>
                                    <th className="text-left p-3">DOMAIN</th>
                                    <th className="text-right p-3">BW</th>
                                    <th className="text-right p-3">LATENCY</th>
                                    <th className="text-right p-3">RECOMMENDED</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {INTERCONNECT_ROWS.map((r) => (
                                    <tr key={r.link} className="border-b border-slate-100">
                                        <td className={`p-3 font-semibold ${ACCENT[r.accent].text}`}>{r.link}</td>
                                        <td className="p-3 text-slate-500">{r.domain}</td>
                                        <td className="p-3 text-right font-mono">{r.bandwidth}</td>
                                        <td className="p-3 text-right font-mono">{r.latency}</td>
                                        <td className="p-3 text-right text-slate-500">{r.recommended}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PARALLELISM_NOTES.map((n) => (
                        <div key={n.title} className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">
                            <div className="text-xs font-bold text-indigo-700 mb-2">{n.title}</div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{n.detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MODULE 04 — Serving Engines */}
            <section id="engines" className={SECTION}>
                <SectionHeading {...im(3)} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {ENGINE_ROWS.map((e) => (
                        <div key={e.engine} className={`glass-card glass-card-hover rounded-2xl p-6 border ${ACCENT[e.accent].border}`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-slate-900">{e.engine}</h3>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${ACCENT[e.accent].bg} ${ACCENT[e.accent].text}`}>
                                    ENGINE
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">{e.mechanism}</p>
                            <div className="space-y-1.5 text-[11px] border-t border-slate-200 pt-3">
                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">Best for</span>
                                    <span className="font-mono text-slate-700 text-right">{e.bestFor}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">Hardware</span>
                                    <span className="font-mono text-slate-700 text-right">{e.hardware}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">Gotcha</span>
                                    <span className="font-mono text-rose-600 text-right">{e.gotcha}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">SGLang SRouter — Cache-Aware Routing</h3>
                    <p className="text-[11px] text-slate-500 mb-5">
                        A Rust-based distributed load balancer that routes to the worker already holding the prefix.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {SROUTER_STEPS.map((s, i) => (
                            <div key={s.step} className="relative p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                <div className="text-[9px] font-mono font-bold text-emerald-600 mb-1.5">{s.step}</div>
                                <div className="text-xs font-bold text-slate-900 mb-1">{s.title}</div>
                                <div className="text-[10px] text-slate-500 leading-relaxed">{s.detail}</div>
                                {i < SROUTER_STEPS.length - 1 && (
                                    <ArrowRight size={14} className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 z-10" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MODULE 05 — Kernels */}
            <section id="kernels" className={SECTION}>
                <SectionHeading {...im(4)} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-7 overflow-x-auto">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Attention Kernel Evolution</h3>
                        <table className="w-full text-xs data-table">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                    <th className="text-left p-3">KERNEL</th>
                                    <th className="text-left p-3">ARCH</th>
                                    <th className="text-left p-3">PRIMITIVES</th>
                                    <th className="text-right p-3">HEADLINE</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {KERNEL_ROWS.map((k) => (
                                    <tr key={k.kernel} className="border-b border-slate-100">
                                        <td className={`p-3 font-semibold ${ACCENT[k.accent].text}`}>{k.kernel}</td>
                                        <td className="p-3">{k.architecture}</td>
                                        <td className="p-3 text-slate-500">{k.primitives}</td>
                                        <td className="p-3 text-right font-mono font-bold">{k.headline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Relative Kernel Throughput</h3>
                        <KernelThroughput />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6 p-5 rounded-xl bg-cyan-50 border border-cyan-200">
                        <div className="text-xs font-bold text-cyan-700 mb-2">Tiling + Online Softmax</div>
                        <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                            Q/K/V blocks are loaded into fast SRAM so the N×N attention matrix is never written to HBM. Online
                            Softmax solves the incomplete-row problem by rescaling prior outputs as new block maxima arrive.
                        </p>
                        <div className="p-3 rounded-lg bg-white border border-cyan-200 font-mono text-[11px] text-slate-700">
                            out ← out · e^(m_old − m_new)
                        </div>
                    </div>
                    <div className="lg:col-span-6 p-5 rounded-xl bg-purple-50 border border-purple-200">
                        <div className="text-xs font-bold text-purple-700 mb-2">FlashAttention-4 on Blackwell</div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                            Uses <code className="font-mono">tcgen05.mma</code>, a dedicated TMEM accumulator space, and 2-CTA MMA
                            to halve memory traffic. Software-emulated exponentials on FMA units keep the SFU from bottlenecking
                            softmax — reaching ~1600 TFLOPs/s BF16 on the B200.
                        </p>
                    </div>
                </div>
            </section>

            {/* MODULE 06 — Optimizations */}
            <section id="optimizations" className={SECTION}>
                <SectionHeading {...im(5)} />

                <p className="text-[13px] text-slate-600 leading-relaxed max-w-3xl mb-10 -mt-2">
                    Five techniques dominate modern serving, and each attacks a different bottleneck: scheduling
                    interference, memory footprint, idle decode compute, distributional control, and output structure.
                    The deep dives below give the mechanism, the trade-off, and when to actually reach for each one.
                </p>

                {/* 06.1 Disaggregation, Chunked Prefill & Render Tier */}
                <DeepDive d={OPTIMIZATION_DEEP_DIVES[0]} />

                <div className="mb-8">
                    <DisaggregationFlow />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {DISAGG_STEPS.map((s) => (
                        <div key={s.step} className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                                <Workflow size={14} className="text-amber-600" /> {s.step}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{s.detail}</p>
                        </div>
                    ))}
                </div>

                {/* Render tier, KV connector ecosystem & goodput evidence */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    <div className="lg:col-span-5 rounded-xl bg-purple-50 border border-purple-200 p-5">
                        <div className="text-xs font-bold text-purple-700 mb-3">GPU-less Render Tier</div>
                        <div className="space-y-3">
                            {RENDER_TIER_STEPS.map((s) => (
                                <div key={s.step}>
                                    <div className="text-[10px] font-mono font-bold text-purple-600">
                                        {s.step} · {s.title}
                                    </div>
                                    <p className="text-[11px] text-slate-600 leading-relaxed">{s.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-4 rounded-xl bg-white border border-slate-200 p-5">
                        <div className="text-xs font-bold text-slate-700 mb-3">KV Connector Ecosystem</div>
                        <div className="space-y-2">
                            {KV_CONNECTORS.map((c) => (
                                <div key={c.name} className="flex items-start justify-between gap-3 text-[11px]">
                                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">{c.name}</span>
                                    <span className="text-slate-500 text-right leading-snug">{c.notes}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-3 rounded-xl bg-white border border-slate-200 p-5">
                        <div className="text-xs font-bold text-slate-700 mb-3">Goodput Benchmarks</div>
                        <div className="space-y-3">
                            {GOODPUT_BENCHMARKS.map((g) => (
                                <div key={g.setup} className={`rounded-lg border bg-white p-3 ${ACCENT[g.accent].border}`}>
                                    <div className="text-[10px] font-mono text-slate-500">{g.setup}</div>
                                    <div className={`text-[11px] mt-1 leading-snug ${ACCENT[g.accent].text}`}>{g.result}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 06.2 Advanced Quantization */}
                <DeepDive d={OPTIMIZATION_DEEP_DIVES[1]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    <div className="lg:col-span-8 overflow-x-auto">
                        <div className="text-[10px] font-mono font-bold text-slate-400 mb-3">METHOD COMPARISON</div>
                        <table className="w-full text-xs data-table">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                    <th className="text-left p-3">METHOD</th>
                                    <th className="text-left p-3">TYPE</th>
                                    <th className="text-left p-3">PRECISION</th>
                                    <th className="text-left p-3">MECHANISM</th>
                                    <th className="text-right p-3">HW</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {QUANT_METHODS.map((q) => (
                                    <tr key={q.method} className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-900">{q.method}</td>
                                        <td className="p-3">{q.type}</td>
                                        <td className="p-3 font-mono">{q.precision}</td>
                                        <td className="p-3 text-slate-500">{q.mechanism}</td>
                                        <td className="p-3 text-right font-mono">{q.hardware}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="p-5 rounded-xl bg-cyan-50 border border-cyan-200 h-full flex flex-col">
                            <div className="text-xs font-bold text-cyan-700 mb-2">NVFP4 Microscaling</div>
                            <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                                Two-level scaling — fine-grained 16×16 or 1×16 blocks with local FP8 scales plus a global FP32
                                scale — runs models in 4-bit with near-16-bit accuracy.
                            </p>
                            <button
                                onClick={() => scrollToSection('checklist')}
                                className="mt-auto text-[11px] font-bold text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1.5"
                            >
                                <BookOpen size={13} /> See the full quantization survey
                            </button>
                        </div>
                    </div>
                </div>

                {/* 06.3 Speculative Decoding & MTP */}
                <DeepDive d={OPTIMIZATION_DEEP_DIVES[2]} />

                <div className="mb-8">
                    <SpeculativeDecoder />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {SPEC_VARIANTS.map((v) => (
                        <div key={v.variant} className={`p-5 rounded-xl border ${ACCENT[v.accent].border} bg-white`}>
                            <div className={`text-xs font-bold mb-2 ${ACCENT[v.accent].text}`}>{v.variant}</div>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{v.approach}</p>
                            <div className="space-y-1 text-[10px] font-mono border-t border-slate-100 pt-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">accept</span>
                                    <span className="text-slate-700">{v.acceptance}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">speedup</span>
                                    <span className="text-slate-700">{v.speedup}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 06.4 Decoding & Sampling Strategies */}
                <DeepDive d={OPTIMIZATION_DEEP_DIVES[3]} />

                <div className="mb-8">
                    <SamplingLab />
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-xs data-table">
                        <thead>
                            <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                <th className="text-left p-3">STRATEGY</th>
                                <th className="text-left p-3">LOGIC</th>
                                <th className="text-left p-3">HYPERPARAM</th>
                                <th className="text-left p-3">OVERHEAD</th>
                                <th className="text-left p-3">USE CASE</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {SAMPLING_ROWS.map((s) => (
                                <tr key={s.strategy} className="border-b border-slate-100">
                                    <td className={`p-3 font-semibold ${ACCENT[s.accent].text}`}>{s.strategy}</td>
                                    <td className="p-3 font-mono text-[11px] text-slate-500">{s.logic}</td>
                                    <td className="p-3 font-mono text-[11px]">{s.hyperparam}</td>
                                    <td className="p-3 text-slate-500">{s.overhead}</td>
                                    <td className="p-3 text-slate-500">{s.useCase}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {SAMPLING_DETAILS.map((s) => (
                        <div key={s.strategy} className={`p-4 rounded-xl bg-white border ${ACCENT[s.accent].border} flex flex-col`}>
                            <div className={`text-xs font-bold mb-2 ${ACCENT[s.accent].text}`}>{s.strategy}</div>
                            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{s.mechanism}</p>
                            <div className="rounded-lg bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 mb-3 overflow-x-auto whitespace-nowrap">
                                {s.formula}
                            </div>
                            <div className="mt-auto border-t border-slate-100 pt-2">
                                <div className="text-[9px] font-mono font-bold text-rose-500 mb-1">WATCH OUT</div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{s.edge}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 06.5 Structured Output & Constrained Decoding */}
                <DeepDive d={OPTIMIZATION_DEEP_DIVES[4]} />

                <div className="rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] px-4 py-3 mb-6 overflow-x-auto whitespace-nowrap">
                    forward pass → raw logits z → lookup FSM valid transitions → mask invalid to −∞ → softmax → guaranteed-valid token
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {CONSTRAINED_STEPS.map((s) => (
                        <div key={s.step} className="relative p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                            <div className="text-[9px] font-mono font-bold text-indigo-600 mb-1.5">{s.step}</div>
                            <div className="text-xs font-bold text-slate-900 mb-1">{s.title}</div>
                            <div className="text-[10px] text-slate-500 leading-relaxed">{s.detail}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CONSTRAINED_ENGINES.map((e) => (
                        <div key={e.engine} className="p-4 rounded-xl bg-white border border-slate-200">
                            <div className="text-xs font-bold text-slate-900 mb-1.5 font-mono">{e.engine}</div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{e.detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MODULE 07 — Diffusion */}
            <section id="diffusion" className={SECTION}>
                <SectionHeading {...im(6)} />

                <div className="mb-8">
                    <DiffusionAnnealing />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {DIFFUSION_STEPS.map((s) => (
                        <div key={s.step} className="relative p-4 rounded-xl bg-rose-50 border border-rose-200">
                            <div className="text-[9px] font-mono font-bold text-rose-600 mb-1.5">{s.step}</div>
                            <div className="text-xs font-bold text-slate-900 mb-1">{s.title}</div>
                            <div className="text-[10px] text-slate-500 leading-relaxed">{s.detail}</div>
                            {s.step !== '04' && (
                                <ArrowRight size={14} className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-rose-400 z-10" />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* MODULE 08 — Production guide */}
            <section id="production" className={SECTION}>
                <SectionHeading {...im(7)} />

                <div className="overflow-x-auto mb-10">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                        <Snowflake size={14} className="text-blue-600" /> Workload → Engine Selection
                    </h3>
                    <table className="w-full text-xs data-table">
                        <thead>
                            <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                <th className="text-left p-3">WORKLOAD</th>
                                <th className="text-left p-3">RECOMMENDED</th>
                                <th className="text-left p-3">WHY</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {WORKLOAD_ROWS.map((w) => (
                                <tr key={w.workload} className="border-b border-slate-100">
                                    <td className="p-3 font-semibold text-slate-900">{w.workload}</td>
                                    <td className={`p-3 font-mono font-bold ${ACCENT[w.accent].text}`}>{w.engine}</td>
                                    <td className="p-3 text-slate-500">{w.why}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Checklist */}
                    <div id="checklist" className="scroll-mt-24 lg:col-span-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <ListChecks size={14} className="text-emerald-600" /> Deployment Checklist
                            </h3>
                            <span className="text-[10px] font-mono text-slate-500" aria-live="polite">
                                {checkedCount}/{DEPLOYMENT_CHECKLIST.length}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {DEPLOYMENT_CHECKLIST.map((item, i) => (
                                <button
                                    key={item}
                                    onClick={() => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)))}
                                    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${checked[i]
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-white border-slate-200 hover:border-emerald-300'
                                        }`}
                                >
                                    <span
                                        className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center ${checked[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                                            }`}
                                    >
                                        {checked[i] && <Check size={11} />}
                                    </span>
                                    <span className={`text-[11px] leading-relaxed ${checked[i] ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                        {item}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Glossary */}
                    <div className="lg:col-span-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                            <BookOpen size={14} className="text-slate-600" /> Glossary
                        </h3>
                        <div className="rounded-2xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-xs">
                                <tbody>
                                    {GLOSSARY_ROWS.map((g, i) => (
                                        <tr key={g.term} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                                            <td className="p-3 font-mono font-bold text-slate-900 w-32 align-top">{g.term}</td>
                                            <td className="p-3 text-slate-600">{g.meaning}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                            <Zap size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                                Instruments to watch first: TTFT, TPOT, and p95/p50 latency spread. A rising p95/p50 ratio is the
                                earliest signal of KV cache thrashing or prefill/decode interference.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InferenceHub;