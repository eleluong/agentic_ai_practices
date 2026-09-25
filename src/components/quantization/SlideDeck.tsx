import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    ChevronLeft,
    Grid2x2,
    NotebookPen,
    Presentation,
    X,
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
    HARDWARE_MATRIX,
    PILLARS,
    REPO_GROUPS,
    RULES_OF_THUMB,
    SLIDE_META,
    STRATEGY_CARDS,
    KV_TIERS,
} from '../../data/quantizationData';
import {
    AlgorithmVisual,
    EmpiricalDualAxis,
    FormatThroughput,
    GptqAwqBars,
    TrilemmaRadar,
} from './charts';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

interface SlideDeckProps {
    open: boolean;
    onClose: () => void;
}

const SlideShell = ({
    children,
    accent = 'blue',
}: {
    children: React.ReactNode;
    accent?: keyof typeof ACCENT;
}) => {
    const a = ACCENT[accent];
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className={`h-1 w-24 rounded-full mb-6 ${a.bg}`} style={{ backgroundColor: a.fill }} />
            {children}
        </div>
    );
};

const SlideTag = ({ children, accent = 'blue' }: { children: React.ReactNode; accent?: keyof typeof ACCENT }) => (
    <div className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-2 ${ACCENT[accent].text}`}>
        {children}
    </div>
);

const BAR_BTN = 'text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition flex items-center gap-1.5';

/**
 * Fullscreen 15-slide presentation engine. Keyboard: ←/→ navigate,
 * Space advances, Esc closes, N toggles speaker notes.
 */
export const SlideDeck = ({ open, onClose }: SlideDeckProps) => {
    const { lang } = useLanguage();
    const t = translations[lang];
    const [index, setIndex] = useState(0);
    const [notesOpen, setNotesOpen] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    const total = SLIDE_META.length;

    const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
    const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                next();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prev();
            } else if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'n' || e.key === 'N') {
                setNotesOpen((v) => !v);
            } else if (e.key === 'Tab') {
                const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                );
                if (!focusables || focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, next, prev, onClose]);

    // Lock body scroll and move focus into the dialog; restore on close.
    useEffect(() => {
        if (!open) return;
        const prevOverflow = document.body.style.overflow;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        document.body.style.overflow = 'hidden';
        const raf = window.requestAnimationFrame(() => dialogRef.current?.focus());
        return () => {
            document.body.style.overflow = prevOverflow;
            window.cancelAnimationFrame(raf);
            previouslyFocused?.focus();
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            setIndex(0);
            setNotesOpen(false);
            setShowGrid(false);
        }
    }, [open]);

    if (!open) return null;

    const meta = SLIDE_META[index];
    const metaNote = lang === 'vi' ? meta.speakerNoteVi : meta.speakerNote;

    const renderSlide = (i: number) => {
        switch (i) {
            case 0:
                return (
                    <SlideShell accent="blue">
                        <SlideTag accent="blue">Slide 1 — Why Quantize</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Memory, Speed & TCO</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PILLARS.map((p) => (
                                <div key={p.title} className={`glass-card rounded-2xl p-5 border ${ACCENT[p.accent].border}`}>
                                    <div className={`text-[10px] font-mono font-bold mb-2 ${ACCENT[p.accent].text}`}>{p.index}</div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-3">{p.title}</h3>
                                    <ul className="space-y-2 text-[11px] text-slate-600">
                                        {p.points.map((pt) => (
                                            <li key={pt.strong}>
                                                <span className={pt.warn ? 'text-rose-600 font-semibold' : 'text-slate-800 font-semibold'}>
                                                    {pt.strong}
                                                </span>{' '}
                                                {pt.body}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </SlideShell>
                );
            case 1:
                return (
                    <SlideShell accent="cyan">
                        <SlideTag accent="cyan">Slide 2 — Engineering Trilemma</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Memory · Speed · Accuracy</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                            <TrilemmaRadar />
                            <div className="space-y-3 text-sm text-slate-600">
                                <p>
                                    You cannot maximize all three at once. Cutting VRAM does <strong className="text-slate-900">not</strong>{' '}
                                    guarantee lower latency.
                                </p>
                                <p>
                                    First diagnose whether your pipeline is <strong className="text-blue-600">memory-bandwidth bound</strong>{' '}
                                    (low batch) or <strong className="text-emerald-600">compute bound</strong> (high batch).
                                </p>
                                <p className="text-xs text-slate-500">
                                    Weight-only W4A16 helps the bandwidth-bound case; native FP8/NVFP4 GEMMs are required once Tensor Cores
                                    saturate.
                                </p>
                            </div>
                        </div>
                    </SlideShell>
                );
            case 2:
                return (
                    <SlideShell accent="cyan">
                        <SlideTag accent="cyan">Slide 3 — Empirical Trade-Offs</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Footprint vs. Accuracy & Tail Divergence</h2>
                        <EmpiricalDualAxis />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                            {FOUNDATION_TAKEAWAYS.map((t) => (
                                <div key={t.tag} className={`rounded-xl p-3 border bg-slate-50 ${ACCENT[t.accent].border}`}>
                                    <div className={`text-[9px] font-mono font-bold mb-1 ${ACCENT[t.accent].text}`}>{t.tag}</div>
                                    <div className="text-[11px] font-semibold text-slate-900">{t.title}</div>
                                </div>
                            ))}
                        </div>
                    </SlideShell>
                );
            case 3:
                return (
                    <SlideShell accent="purple">
                        <SlideTag accent="purple">Slide 4 — Strategy</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">PTQ vs. QAT (and PE-QAT)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {STRATEGY_CARDS.map((c) => (
                                <div
                                    key={c.title}
                                    className={`glass-card rounded-2xl p-5 border ${ACCENT[c.accent].border} ${c.recommended ? 'ring-1 ring-purple-300' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${ACCENT[c.accent].bg} ${ACCENT[c.accent].text}`}>
                                            {c.badge}
                                        </span>
                                        <span className="text-[9px] text-slate-500 font-mono">{c.badgeNote}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-2">{c.title}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{c.desc}</p>
                                    <div className="space-y-1 border-t border-slate-200 pt-3">
                                        {c.facts.map((f) => (
                                            <div key={f.label} className="flex justify-between text-[10px]">
                                                <span className="text-slate-500">{f.label}</span>
                                                <span className="font-mono text-slate-700">{f.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SlideShell>
                );
            case 4:
                return (
                    <SlideShell accent="amber">
                        <SlideTag accent="amber">Slide 5 — Calibration & Evaluation</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">The Production Gotchas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {CALIBRATION_TRAPS.map((t) => (
                                <div key={t.title} className={`rounded-2xl p-5 bg-slate-50 border ${ACCENT[t.accent].border}`}>
                                    <h3 className="text-sm font-bold text-slate-900 mb-2">{t.title}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">{t.body}</p>
                                </div>
                            ))}
                        </div>
                    </SlideShell>
                );
            case 5:
                return (
                    <SlideShell accent="amber">
                        <SlideTag accent="amber">Slide 6 — Outliers & Fine-Tuning</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">LLM.int8() & QLoRA / NF4</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {ALGORITHM_CARDS.filter((c) => c.id === 'llm-int8' || c.id === 'qlora-nf4').map((c) => (
                                <div key={c.id} className={`glass-card rounded-2xl p-5 border ${ACCENT[c.accent].border}`}>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">{c.name}</h3>
                                    <div className={`text-[10px] font-mono mb-3 ${ACCENT[c.accent].text}`}>{c.category}</div>
                                    <AlgorithmVisual id={c.id} />
                                    <p className="text-[11px] text-slate-500 leading-relaxed mt-3 mb-3">{c.tagline}</p>
                                    <ul className="space-y-1 text-[11px] text-slate-600">
                                        {c.steps.slice(0, 3).map((s) => (
                                            <li key={s} className="flex gap-1.5">
                                                <span className={`shrink-0 ${ACCENT[c.accent].text}`}>•</span>
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {c.warning && <p className="mt-3 text-[10px] text-rose-600">⚠ {c.warning}</p>}
                                </div>
                            ))}
                        </div>
                    </SlideShell>
                );
            case 6:
                return (
                    <SlideShell accent="emerald">
                        <SlideTag accent="emerald">Slide 7 — GPTQ vs. AWQ</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">The Production Face-Off</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                            <GptqAwqBars />
                            <div className="space-y-2 text-[11px] text-slate-600">
                                <p>
                                    Both land at ~4 bpw. <strong className="text-emerald-600">AWQ</strong> wins on calibration speed (6×),
                                    cross-domain robustness, and kernel latency.
                                </p>
                                <p className="text-slate-500">
                                    Default to AWQ unless you have a legacy GPTQ repository to support.
                                </p>
                            </div>
                        </div>
                    </SlideShell>
                );
            case 7:
                return (
                    <SlideShell accent="blue">
                        <SlideTag accent="blue">Slide 8 — Formats</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">FP8, OCP MX & NVFP4</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                            <div className="grid grid-cols-1 gap-3">
                                {FORMAT_CARDS.map((c) => (
                                    <div key={c.title} className={`rounded-xl p-4 bg-slate-50 border ${ACCENT[c.accent].border}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-xs font-bold text-slate-900">{c.title}</h3>
                                            <span className="text-[9px] font-mono text-slate-500">{c.badgeNote}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{c.desc}</p>
                                        {(c.id === 'fp8' || c.id === 'nvfp4') && <AlgorithmVisual id={c.id} />}
                                    </div>
                                ))}
                            </div>
                            <FormatThroughput />
                        </div>
                    </SlideShell>
                );
            case 8:
                return (
                    <SlideShell accent="emerald">
                        <SlideTag accent="emerald">Slide 9 — DeepSeek-V3</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Pre-Training 671B in FP8</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {DEEPSEEK_POINTS.map((p) => (
                                <div key={p.title} className={`rounded-2xl p-5 bg-slate-50 border ${ACCENT[p.accent].border}`}>
                                    <div className={`text-[10px] font-mono font-bold mb-2 ${ACCENT[p.accent].text}`}>{p.label}</div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-2">{p.title}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">{p.body}</p>
                                </div>
                            ))}
                        </div>
                    </SlideShell>
                );
            case 9:
                return (
                    <SlideShell accent="blue">
                        <SlideTag accent="blue">Slide 10 — KV Cache</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Size It Right, Then Quantize It</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {KV_TIERS.map((t) => (
                                <div key={t.title} className={`rounded-2xl p-5 bg-slate-50 border ${ACCENT[t.accent].border}`}>
                                    <h3 className="text-sm font-bold text-slate-900 mb-2">{t.title}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">{t.body}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-xs text-amber-600 font-mono">
                            ⚠ Size with num_key_value_heads — the GQA 8× trap has burned many capacity plans.
                        </p>
                    </SlideShell>
                );
            case 10:
                return (
                    <SlideShell accent="emerald">
                        <SlideTag accent="emerald">Slide 11 — Local & Edge</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">MLX vs. GGUF (llama.cpp)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {EDGE_PLATFORMS.map((p) => (
                                <div key={p.name} className={`glass-card rounded-2xl p-5 border ${ACCENT[p.accent].border}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${ACCENT[p.accent].bg} ${ACCENT[p.accent].text}`}>
                                            {p.badge}
                                        </span>
                                    </div>
                                    <ul className="space-y-2 text-[11px] text-slate-600">
                                        {p.points.map((pt) => (
                                            <li key={pt.text} className={pt.warn ? 'text-amber-600' : ''}>
                                                {pt.warn ? '⚠ ' : '• '}
                                                {pt.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </SlideShell>
                );
            case 11:
                return (
                    <SlideShell accent="cyan">
                        <SlideTag accent="cyan">Slide 12 — Decision Framework</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-5">Decision Flow & 5 Rules of Thumb</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                {DECISION_TIERS.map((tier) => (
                                    <div key={tier.id} className={`rounded-lg px-3 py-2 border bg-slate-50 ${ACCENT[tier.accent].border}`}>
                                        <div className={`text-[10px] font-mono font-bold ${ACCENT[tier.accent].text}`}>{tier.label}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            {tier.branches.map((b) => b.title).join(' · ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-1.5">
                                {RULES_OF_THUMB.map((r) => (
                                    <div key={r.num} className="flex gap-2 text-[11px]">
                                        <span className={`font-mono text-[9px] shrink-0 ${ACCENT[r.accent].text}`}>{r.num}</span>
                                        <span className="text-slate-600">
                                            <strong className="text-slate-900">{r.title}</strong> — {r.desc}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SlideShell>
                );
            case 12:
                return (
                    <SlideShell accent="blue">
                        <SlideTag accent="blue">Backup B1 — References</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Production Repos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {REPO_GROUPS.map((g) => (
                                <div key={g.title} className={`rounded-2xl p-5 bg-slate-50 border ${ACCENT[g.accent].border}`}>
                                    <div className={`text-[10px] font-mono font-bold mb-3 ${ACCENT[g.accent].text}`}>{g.title}</div>
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
                    </SlideShell>
                );
            default:
                return (
                    <SlideShell accent="blue">
                        <SlideTag accent="blue">Backup B2 — Fact Check</SlideTag>
                        <h2 className="text-3xl font-black text-slate-900 mb-5">Full Table & Hardware Reality</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-[10px] data-table">
                                    <thead className="bg-slate-50 font-mono text-slate-500">
                                        <tr>
                                            <th className="text-left p-2">Quant</th>
                                            <th className="text-right p-2">GB</th>
                                            <th className="text-right p-2">Top-1</th>
                                            <th className="text-right p-2">Tail KLD</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {EMPIRICAL_DATA.map((t) => (
                                            <tr key={t.quant} className={t.highlight ? 'text-blue-600' : t.baseline ? 'text-emerald-600' : 'text-slate-700'}>
                                                <td className="p-2 font-mono">{t.quant}</td>
                                                <td className="p-2 text-right font-mono">{t.gb}</td>
                                                <td className="p-2 text-right font-mono">{t.top1}</td>
                                                <td className="p-2 text-right font-mono">{t.tailKLD}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="space-y-2">
                                {HARDWARE_MATRIX.map((h) => (
                                    <div key={h.feature} className="flex gap-2 text-[10px]">
                                        <span className={`font-mono shrink-0 ${ACCENT[h.accent].text}`}>{h.feature}:</span>
                                        <span className="text-slate-500">{h.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SlideShell>
                );
        }
    };

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.quantDeck.ariaLabel}
            tabIndex={-1}
            className="fixed inset-0 z-50 bg-slate-50 flex flex-col focus:outline-none"
        >
            {/* Top bar */}
            <div className="h-14 shrink-0 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                        <Presentation size={16} />
                    </span>
                    <div className="hidden sm:block">
                        <div className="text-[11px] font-bold text-slate-900">{t.quantDeck.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{meta.module}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowGrid((v) => !v)}
                        className={`text-xs px-2.5 py-1 rounded border transition flex items-center gap-1.5 ${showGrid
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                            }`}
                        title={t.quantDeck.slidesTitle}
                    >
                        <Grid2x2 size={13} />
                        <span className="hidden sm:inline">{t.quantDeck.slides}</span>
                    </button>
                    <button
                        onClick={() => setNotesOpen((v) => !v)}
                        className={`text-xs px-2.5 py-1 rounded border transition flex items-center gap-1.5 ${notesOpen
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                            }`}
                        title={t.quantDeck.notesTitle}
                    >
                        <NotebookPen size={13} />
                        <span className="hidden sm:inline">{t.quantDeck.notes}</span>
                    </button>
                    <button
                        onClick={onClose}
                        aria-label={t.quantDeck.closeTitle}
                        className={BAR_BTN}
                        title={t.quantDeck.closeTitle}
                    >
                        <X size={13} />
                    </button>
                </div>
            </div>

            {/* Body */}
            {showGrid ? (
                <div className="flex-1 overflow-y-auto p-6 deck-scroll">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {SLIDE_META.map((s, i) => (
                            <button
                                key={s.title}
                                onClick={() => {
                                    setIndex(i);
                                    setShowGrid(false);
                                }}
                                className={`text-left rounded-xl border p-3 transition ${i === index
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                            >
                                <div className="text-[9px] font-mono text-slate-500 mb-1">{String(i + 1).padStart(2, '0')}</div>
                                <div className="text-[11px] text-slate-700 leading-snug">{lang === 'vi' ? s.titleVi : s.title}</div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto flex items-start justify-center p-4 sm:p-8 deck-scroll">
                    {renderSlide(index)}
                </div>
            )}

            {/* Speaker notes drawer */}
            {notesOpen && (
                <div className="shrink-0 border-t border-amber-200 bg-amber-50 px-6 py-3">
                    <div className="max-w-5xl mx-auto flex items-start gap-3">
                        <NotebookPen size={14} className="text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <div className="text-[10px] font-mono font-bold text-amber-700 mb-1">{t.quantDeck.speakerNotes}</div>
                            <p className="text-[11px] text-slate-700 leading-relaxed">{metaNote}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom nav */}
            <div className="h-14 shrink-0 border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between bg-white/90 backdrop-blur-md">
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
                >
                    <ChevronLeft size={14} /> {t.quantDeck.prev}
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-500">
                        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                    <div className="hidden sm:flex items-center gap-1">
                        {SLIDE_META.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`${t.quantDeck.goToSlide} ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-blue-500' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={next}
                    disabled={index === total - 1}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white border border-blue-500 transition flex items-center gap-1.5"
                >
                    {t.quantDeck.next} <ArrowRight size={14} />
                </button>
            </div>
            <span className="sr-only">{t.quantDeck.kbdHint}</span>
        </div>
    );
};

export default SlideDeck;