import { useState } from 'react';
import {
    Boxes,
    CircleAlert,
    Gauge,
    Layers,
    LineChart,
    Play,
    Presentation,
    Scale,
    ShieldAlert,
    Sparkles,
    Target,
    TrendingDown,
    TriangleAlert,
    Workflow,
    Wrench,
} from 'lucide-react';
import {
    ACCENT,
    ALGORITHM_CARDS,
    CALIBRATION_TRAPS,
    DEEPSEEK_POINTS,
    DECISION_TIERS,
    EDGE_PLATFORMS,
    EMPIRICAL_DATA,
    FOUNDATION_TAKEAWAYS,
    FORMAT_CARDS,
    GRANULARITY_ROWS,
    GRANULARITY_SCHEMES,
    HARDWARE_MATRIX,
    KQUANT_DETAILS,
    KV_TIERS,
    PILLARS,
    PIPELINE_STEPS,
    QUANT_MODULES,
    REPO_GROUPS,
    RULES_OF_THUMB,
    SHOOTOUT_ROWS,
    STRATEGY_CARDS,
} from '../../data/quantizationData';
import { ModelFootprintBar, EmpiricalDualAxis, GptqAwqBars, TrilemmaRadar, FormatThroughput, AlgorithmVisual } from './charts';
import { SlideDeck } from './SlideDeck';
import { VramCalculator } from './VramCalculator';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

interface QuantizationHubProps {
    scrollToSection: (id: string) => void;
}

const TAKEAWAY_ICONS = {
    plateau: Gauge,
    sweetspot: Target,
    cliff: TrendingDown,
    tail: ShieldAlert,
} as const;

const TRAP_ICONS = {
    corpus: Layers,
    runtime: Wrench,
    ppl: CircleAlert,
} as const;

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
    accent: (typeof QUANT_MODULES)[number]['accent'];
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

/**
 * The LLM Quantization hub. Renders all modules as flowing sections that
 * match the rest of the light site theme and hosts the fullscreen SlideDeck.
 */
export const QuantizationHub = ({ scrollToSection }: QuantizationHubProps) => {
    const { lang } = useLanguage();
    const t = translations[lang];
    const [deckOpen, setDeckOpen] = useState(false);
    const [decisionTab, setDecisionTab] = useState<'cloud' | 'workstation' | 'edge'>('cloud');

    const activeTier = DECISION_TIERS.find((t) => t.id === decisionTab) ?? DECISION_TIERS[0];

    // Locale-aware section heading props derived from the shared module metadata.
    const qm = (i: number) => {
        const m = QUANT_MODULES[i];
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
                    {t.quant.heroBadge}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
                        {t.quant.heroTitle}
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600">
                        {t.quant.heroSubtitle}
                    </span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    {t.quant.heroDesc}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
                    {[
                        { k: '4-bit', v: t.quant.statSweetSpot },
                        { k: '41%', v: t.quant.statVram },
                        { k: '2×', v: t.quant.statThroughput },
                        { k: '15', v: t.quant.statSlides },
                    ].map((s) => (
                        <div key={s.k} className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                            <div className="text-lg font-black text-slate-900 font-mono-deck">{s.k}</div>
                            <div className="text-[10px] text-slate-500">{s.v}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <button
                        onClick={() => setDeckOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition flex items-center gap-2"
                    >
                        <Presentation size={16} /> {t.quant.openDeck}
                    </button>
                    <button
                        onClick={() => scrollToSection('trilemma')}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-sm transition flex items-center gap-2"
                    >
                        <LineChart size={16} /> {t.quant.navTrilemma}
                    </button>
                    <button
                        onClick={() => scrollToSection('calculator')}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-sm transition flex items-center gap-2"
                    >
                        <Gauge size={16} /> {t.quant.navCalculator}
                    </button>
                </div>
            </div>

            {/* MODULE 00 — Overview */}
            <section id="overview" className={SECTION}>
                <SectionHeading {...qm(0)} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {PILLARS.map((p) => (
                        <div
                            key={p.title}
                            className={`glass-card glass-card-hover rounded-2xl p-6 border ${ACCENT[p.accent].border} relative overflow-hidden`}
                        >
                            <div className={`text-[10px] font-mono font-bold tracking-widest mb-2 ${ACCENT[p.accent].text}`}>
                                {p.index}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-4">{p.title}</h3>
                            <ul className="space-y-3 text-xs text-slate-600 mb-4">
                                {p.points.map((pt) => (
                                    <li key={pt.strong} className="flex items-start gap-2">
                                        <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0`} style={{ backgroundColor: ACCENT[p.accent].fill }} />
                                        <span>
                                            <strong className={pt.warn ? 'text-rose-600' : 'text-slate-900'}>{pt.strong}</strong>{' '}
                                            {pt.body}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-3 italic">{p.insight}</div>
                        </div>
                    ))}
                </div>

                {/* Trilemma radar */}
                <div id="trilemma" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-200">
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-slate-900">{t.quant.trilemmaTitle}</h3>
                            <p className="text-[11px] text-slate-500">{t.quant.trilemmaDesc}</p>
                        </div>
                        <TrilemmaRadar />
                    </div>
                    <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-3">{t.quant.bottleneckTitle}</h3>
                            <div className="space-y-4 text-xs text-slate-600">
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <div className="font-bold text-emerald-700 mb-1">{t.quant.bottleneckLow}</div>
                                    {t.quant.bottleneckLowDesc}
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                                    <div className="font-bold text-blue-700 mb-1">{t.quant.bottleneckHigh}</div>
                                    {t.quant.bottleneckHighDesc}
                                </div>
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                                    <div className="font-bold text-rose-700 mb-1">{t.quant.bottleneckTrap}</div>
                                    {t.quant.bottleneckTrapDesc}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <ModelFootprintBar />
                        </div>
                    </div>
                </div>

                {/* Pipeline + granularity */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">{t.quant.pipelineTitle}</h3>
                            <p className="text-[11px] text-slate-500">{t.quant.pipelineDesc}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                        {PIPELINE_STEPS.map((s) => (
                            <div key={s.step} className={`p-3.5 rounded-xl bg-slate-50 border ${ACCENT[s.accent].border}`}>
                                <div className={`text-[9px] font-mono font-bold mb-1.5 ${ACCENT[s.accent].text}`}>{s.step}</div>
                                <div className="text-xs font-bold text-slate-900 mb-1">{s.title}</div>
                                <div className="text-[10px] text-slate-500 leading-relaxed">{s.detail}</div>
                                {s.mono && <div className="text-[10px] text-cyan-700 font-mono mt-2">{s.mono}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 overflow-x-auto">
                            <table className="w-full text-xs data-table">
                                <thead>
                                    <tr className="text-slate-500 border-b border-slate-200 bg-slate-50 font-mono">
                                        <th className="text-left p-3">SCHEME</th>
                                        <th className="text-left p-3">ELEMENT</th>
                                        <th className="text-left p-3">SCALE META</th>
                                        <th className="text-right p-3">GROUP</th>
                                        <th className="text-right p-3">EFF. BPW</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    {GRANULARITY_ROWS.map((r) => (
                                        <tr key={r.scheme} className="border-b border-slate-100">
                                            <td className={`p-3 font-semibold ${ACCENT[r.accent].text}`}>{r.scheme}</td>
                                            <td className="p-3 font-mono">{r.elementBits}</td>
                                            <td className="p-3 text-slate-500">{r.scaleMeta}</td>
                                            <td className="p-3 text-right font-mono">{r.group}</td>
                                            <td className="p-3 text-right font-mono font-bold">{r.effectiveBpw}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="lg:col-span-4 space-y-3">
                            {GRANULARITY_SCHEMES.map((g) => (
                                <div key={g.title} className={`p-4 rounded-xl bg-slate-50 border ${ACCENT[g.accent].border}`}>
                                    <div className={`text-xs font-bold mb-1 ${ACCENT[g.accent].text}`}>{g.title}</div>
                                    <div className="text-[11px] text-slate-500 leading-relaxed">{g.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULE 01 — Foundations */}
            <section id="foundations" className={SECTION}>
                <SectionHeading {...qm(1)} />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {FOUNDATION_TAKEAWAYS.map((t) => {
                        const Icon = TAKEAWAY_ICONS[t.icon];
                        return (
                            <div key={t.tag} className={`glass-card rounded-xl p-4 border ${ACCENT[t.accent].border}`}>
                                <Icon size={18} className={`mb-2 ${ACCENT[t.accent].text}`} />
                                <div className={`text-[9px] font-mono font-bold mb-1 ${ACCENT[t.accent].text}`}>{t.tag}</div>
                                <div className="text-xs font-bold text-slate-900 mb-1">{t.title}</div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{t.body}</p>
                            </div>
                        );
                    })}
                </div>

                <div id="empirical-table" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-200">
                        <div className="mb-4">
                            <div className="text-[10px] font-mono text-cyan-600 font-bold mb-1">FOOTPRINT VS. QUALITY</div>
                            <h3 className="text-sm font-bold text-slate-900">10-Tier Empirical Frontier</h3>
                        </div>
                        <EmpiricalDualAxis />
                    </div>
                    <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-200 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-900">Raw Measurements</h3>
                            <span className="text-[10px] font-mono text-slate-500">KLD ↓ better</span>
                        </div>
                        <div className="overflow-x-auto max-h-80 overflow-y-auto deck-scroll rounded-lg border border-slate-200">
                            <table className="w-full text-[10px] data-table">
                                <thead className="sticky top-0 bg-slate-50 font-mono text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left p-2">QUANT</th>
                                        <th className="text-right p-2">GB</th>
                                        <th className="text-right p-2">TOP-1</th>
                                        <th className="text-right p-2">MEAN</th>
                                        <th className="text-right p-2">99.9%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {EMPIRICAL_DATA.map((t) => (
                                        <tr
                                            key={t.quant}
                                            className={`border-b border-slate-100 ${t.highlight ? 'bg-blue-50 text-blue-700' : t.baseline ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                                                }`}
                                        >
                                            <td className="p-2 font-mono">{t.quant}</td>
                                            <td className="p-2 text-right font-mono">{t.gb}</td>
                                            <td className="p-2 text-right font-mono">{t.top1}</td>
                                            <td className="p-2 text-right font-mono">{t.meanKLD}</td>
                                            <td className="p-2 text-right font-mono">{t.tailKLD}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-[10px] text-slate-500">
                            <strong className="text-blue-600">UD-Q4_K_XL</strong> is the sweet spot;{' '}
                            <strong className="text-emerald-600">Q8_0</strong> is the baseline.
                        </p>
                    </div>
                </div>
            </section>

            {/* MODULE 02 — Strategy */}
            <section id="strategy" className={SECTION}>
                <SectionHeading {...qm(2)} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {STRATEGY_CARDS.map((c) => (
                        <div
                            key={c.title}
                            className={`glass-card glass-card-hover rounded-2xl p-6 border ${ACCENT[c.accent].border} ${c.recommended ? 'ring-1 ring-purple-300' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${ACCENT[c.accent].bg} ${ACCENT[c.accent].text}`}>
                                    {c.badge}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">{c.badgeNote}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">{c.desc}</p>
                            <div className="space-y-1.5 text-[11px] border-t border-slate-200 pt-3">
                                {c.facts.map((f) => (
                                    <div key={f.label} className="flex justify-between gap-3">
                                        <span className="text-slate-500">{f.label}</span>
                                        <span className="font-mono text-slate-700 text-right">{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CALIBRATION_TRAPS.map((t) => {
                        const Icon = TRAP_ICONS[t.icon];
                        return (
                            <div key={t.title} className={`p-5 rounded-xl bg-slate-50 border ${ACCENT[t.accent].border}`}>
                                <Icon size={18} className={`mb-2 ${ACCENT[t.accent].text}`} />
                                <h3 className="text-sm font-bold text-slate-900 mb-2">{t.title}</h3>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{t.body}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* MODULE 03 — Algorithms */}
            <section id="algorithms" className={SECTION}>
                <SectionHeading {...qm(3)} />

                <div className="space-y-6 mb-8">
                    {ALGORITHM_CARDS.map((c, idx) => (
                        <div key={c.id} className={`glass-card rounded-2xl p-6 border ${ACCENT[c.accent].border}`}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Visualization + identity + metrics */}
                                <div className="lg:col-span-5 space-y-4">
                                    <AlgorithmVisual id={c.id} />
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] text-slate-700 break-words">
                                        <div className={`text-[9px] uppercase tracking-widest mb-1 ${ACCENT[c.accent].text}`}>identity</div>
                                        {c.formula}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {c.metrics.map((m) => (
                                            <div key={m.label} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                                                <div className="text-[9px] font-mono text-slate-500">{m.label}</div>
                                                <div className={`text-xs font-bold mt-0.5 ${ACCENT[c.accent].text}`}>{m.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detail */}
                                <div className="lg:col-span-7">
                                    <div className="flex items-start justify-between gap-3 mb-1">
                                        <div>
                                            <div className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-1 ${ACCENT[c.accent].text}`}>
                                                {String(idx + 1).padStart(2, '0')} · {c.category}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                                        </div>
                                        <Workflow size={18} className={ACCENT[c.accent].text} />
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{c.tagline}</p>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{c.principle}</p>

                                    <div className="text-[10px] font-mono font-bold text-slate-500 mb-2">MECHANISM</div>
                                    <ol className="space-y-2 mb-4">
                                        {c.steps.map((s, i) => (
                                            <li key={s} className="flex items-start gap-2 text-[11px] text-slate-600">
                                                <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${ACCENT[c.accent].bg} ${ACCENT[c.accent].text}`}>
                                                    {i + 1}
                                                </span>
                                                {s}
                                            </li>
                                        ))}
                                    </ol>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <div className="text-[9px] font-mono text-slate-500 mb-1">KERNEL</div>
                                            <div className="text-[11px] text-slate-700">{c.kernel}</div>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <div className="text-[9px] font-mono text-slate-500 mb-1">RUNTIME</div>
                                            <div className="text-[11px] text-slate-700">{c.runtime}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {c.bestFor.map((b) => (
                                            <span key={b} className={`text-[10px] rounded-full border px-2.5 py-1 ${ACCENT[c.accent].border} ${ACCENT[c.accent].bg} ${ACCENT[c.accent].text}`}>
                                                {b}
                                            </span>
                                        ))}
                                    </div>

                                    {c.warning && (
                                        <div className="flex items-start gap-2 text-[10px] text-rose-600 border-t border-slate-200 pt-3">
                                            <TriangleAlert size={12} className="mt-0.5 shrink-0" />
                                            {c.warning}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-200">
                    <div className="mb-4">
                        <div className="text-[10px] font-mono text-emerald-600 font-bold mb-1">GPTQ VS. AWQ</div>
                        <h3 className="text-sm font-bold text-slate-900">The Production Face-Off</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-7 overflow-x-auto">
                            <table className="w-full text-xs data-table">
                                <thead className="bg-slate-50 font-mono text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left p-3">DIMENSION</th>
                                        <th className="text-left p-3">GPTQ</th>
                                        <th className="text-left p-3">AWQ</th>
                                        <th className="text-left p-3">VERDICT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SHOOTOUT_ROWS.map((r) => (
                                        <tr key={r.dimension} className="border-b border-slate-100">
                                            <td className="p-3 text-slate-700 font-semibold">{r.dimension}</td>
                                            <td className="p-3 text-slate-500">{r.gptq}</td>
                                            <td className={`p-3 ${r.awqWins ? 'text-emerald-600' : 'text-slate-500'}`}>{r.awq}</td>
                                            <td className={`p-3 font-mono font-bold ${r.awqWins ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                {r.verdict}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="lg:col-span-5">
                            <GptqAwqBars />
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULE 04 — Formats */}
            <section id="formats" className={SECTION}>
                <SectionHeading {...qm(4)} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {FORMAT_CARDS.map((c) => (
                        <div key={c.title} className={`glass-card glass-card-hover rounded-2xl p-6 border ${ACCENT[c.accent].border}`}>
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${ACCENT[c.accent].bg} ${ACCENT[c.accent].text}`}>
                                    {c.badge}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">{c.badgeNote}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{c.desc}</p>
                            <div className="space-y-2 mb-4 font-mono text-[11px]">
                                {c.rows.map((r) => (
                                    <div key={r.label} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-slate-500">{r.label}</span>
                                            <span className="text-slate-800 text-right">{r.value}</span>
                                        </div>
                                        {r.note && <div className="text-[9px] text-slate-400 mt-1">{r.note}</div>}
                                    </div>
                                ))}
                            </div>
                            {(c.id === 'fp8' || c.id === 'nvfp4') && (
                                <div className="mb-4">
                                    <AlgorithmVisual id={c.id} />
                                </div>
                            )}

                            <div
                                className={`text-[10px] font-mono font-semibold ${c.footerTone === 'warn' ? 'text-amber-600' : 'text-emerald-600'
                                    }`}
                            >
                                {c.footer}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-200">
                    <div className="mb-4">
                        <div className="text-[10px] font-mono text-blue-600 font-bold mb-1">COMPUTE THROUGHPUT</div>
                        <h3 className="text-sm font-bold text-slate-900">Relative Dense GEMM Rate by Format</h3>
                    </div>
                    <FormatThroughput />
                </div>
            </section>

            {/* MODULE 05 — Production */}
            <section id="production" className={SECTION}>
                <SectionHeading {...qm(5)} />

                {/* DeepSeek */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 mb-8 relative overflow-hidden">
                    <div className="mb-4">
                        <div className="text-[10px] font-mono text-emerald-600 font-bold mb-1">CASE STUDY — DEEPSEEK-V3</div>
                        <h3 className="text-sm font-bold text-slate-900">Pre-Training 671B Parameters in FP8</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {DEEPSEEK_POINTS.map((p) => (
                            <div key={p.title} className={`p-4 rounded-xl bg-slate-50 border ${ACCENT[p.accent].border}`}>
                                <div className={`text-[10px] font-mono font-bold mb-2 ${ACCENT[p.accent].text}`}>{p.label}</div>
                                <div className="text-sm font-bold text-slate-900 mb-1">{p.title}</div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KV cache tiers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {KV_TIERS.map((t) => (
                        <div key={t.title} className={`p-5 rounded-xl bg-slate-50 border ${ACCENT[t.accent].border}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Layers size={16} className={ACCENT[t.accent].text} />
                                <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{t.body}</p>
                        </div>
                    ))}
                </div>

                {/* Calculator */}
                <div id="calculator" className="scroll-mt-24 mb-8">
                    <VramCalculator />
                </div>

                {/* Edge platforms */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 mb-8">
                    <div className="mb-4">
                        <div className="text-[10px] font-mono text-emerald-600 font-bold mb-1">LOCAL & EDGE RUNTIMES</div>
                        <h3 className="text-sm font-bold text-slate-900">MLX vs. GGUF (llama.cpp)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {EDGE_PLATFORMS.map((p) => (
                            <div key={p.name} className={`p-5 rounded-xl bg-slate-50 border ${ACCENT[p.accent].border}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${ACCENT[p.accent].bg} ${ACCENT[p.accent].text}`}>
                                        {p.badge}
                                    </span>
                                </div>
                                <ul className="space-y-2 text-[11px] text-slate-600">
                                    {p.points.map((pt) => (
                                        <li key={pt.text} className={`flex items-start gap-2 ${pt.warn ? 'text-amber-600' : ''}`}>
                                            {pt.warn ? (
                                                <TriangleAlert size={12} className="mt-0.5 shrink-0" />
                                            ) : (
                                                <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-400 shrink-0" />
                                            )}
                                            <span>{pt.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {KQUANT_DETAILS.map((k) => (
                            <div key={k.title} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="text-xs font-bold text-cyan-700 mb-1 font-mono">{k.title}</div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{k.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MODULE 06 — Decision framework */}
            <section id="decision-framework" className={SECTION}>
                <SectionHeading {...qm(6)} />

                <div className="glass-card rounded-2xl p-6 border border-slate-200 mb-8">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {DECISION_TIERS.map((tier) => (
                            <button
                                key={tier.id}
                                onClick={() => setDecisionTab(tier.id)}
                                className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition ${decisionTab === tier.id
                                    ? `${ACCENT[tier.accent].bg} ${ACCENT[tier.accent].border} ${ACCENT[tier.accent].text}`
                                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {tier.id === 'cloud' ? 'Enterprise Cloud' : tier.id === 'workstation' ? 'Workstation' : 'Mac / CPU / Edge'}
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 mb-4">{activeTier.label}</p>
                    <div className={`grid grid-cols-1 ${activeTier.branches.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                        {activeTier.branches.map((b) => (
                            <div key={b.tag} className={`p-5 rounded-xl bg-slate-50 border ${ACCENT[b.accent].border}`}>
                                <div className={`text-[10px] font-mono font-bold mb-1 ${ACCENT[b.accent].text}`}>{b.tag}</div>
                                <h4 className="text-sm font-bold text-slate-900 mb-2">{b.title}</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{b.desc}</p>
                                <div className={`text-[11px] font-mono font-semibold ${ACCENT[b.accent].text}`}>{b.primaryNote}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-200">
                    <div className="mb-4">
                        <div className="text-[10px] font-mono text-cyan-600 font-bold mb-1">RULES OF THUMB</div>
                        <h3 className="text-sm font-bold text-slate-900">Five Rules Before You Ship</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                        {RULES_OF_THUMB.map((r) => (
                            <div key={r.num} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <div className={`text-[10px] font-mono font-bold mb-2 ${ACCENT[r.accent].text}`}>{r.num}</div>
                                <div className="text-xs font-bold text-slate-900 mb-1">{r.title}</div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Backup */}
            <section id="backup" className={SECTION}>
                <SectionHeading {...qm(7)} />

                <div className="glass-card rounded-2xl p-6 border border-slate-200 mb-8">
                    <div className="mb-4 flex items-center gap-2">
                        <Scale size={16} className="text-cyan-600" />
                        <h3 className="text-sm font-bold text-slate-900">Hardware Reality Checks</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs data-table">
                            <thead className="bg-slate-50 font-mono text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="text-left p-3">FEATURE</th>
                                    <th className="text-left p-3">STATUS</th>
                                    <th className="text-left p-3">ADVICE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {HARDWARE_MATRIX.map((h) => (
                                    <tr key={h.feature} className="border-b border-slate-100">
                                        <td className={`p-3 font-semibold ${ACCENT[h.accent].text}`}>{h.feature}</td>
                                        <td className="p-3 text-slate-600">{h.status}</td>
                                        <td className="p-3 text-slate-500">{h.advice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {REPO_GROUPS.map((g) => (
                        <div key={g.title} className={`p-5 rounded-xl bg-slate-50 border ${ACCENT[g.accent].border}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Boxes size={15} className={ACCENT[g.accent].text} />
                                <div className={`text-[10px] font-mono font-bold ${ACCENT[g.accent].text}`}>{g.title}</div>
                            </div>
                            <ul className="space-y-2 text-[11px]">
                                {g.items.map((it) => (
                                    <li key={it.name}>
                                        <span className="font-mono text-slate-900">{it.name}</span>
                                        <span className="text-slate-500"> — {it.detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => setDeckOpen(true)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-xs transition flex items-center gap-2"
                    >
                        <Play size={16} /> Present the Full Deck
                    </button>
                </div>
            </section>

            <SlideDeck open={deckOpen} onClose={() => setDeckOpen(false)} />
        </div>
    );
};

export default QuantizationHub;