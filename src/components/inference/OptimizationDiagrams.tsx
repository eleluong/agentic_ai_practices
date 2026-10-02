import { Fragment, type FC, type ReactNode } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

/**
 * Visual "how it works" diagrams for Module 06 — Modern Inference
 * Optimization Techniques. Each diagram replaces a prose explanation so the
 * mechanism is shown rather than told. Exported together via
 * OPTIMIZATION_DIAGRAMS, keyed by the `diagram` field on each deep dive.
 */

const Caption: FC<{ children: ReactNode }> = ({ children }) => (
    <p className="text-[11px] text-slate-500 leading-relaxed mt-3">{children}</p>
);

const Label: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`text-[10px] font-mono font-bold mb-2 ${className}`}>{children}</div>
);

/* ------------------------------------------------------------------ */
/* 06.1 — Disaggregation, Chunked Prefill & Render Tier                */
/* ------------------------------------------------------------------ */
export const DisaggregationDiagram: FC = () => (
    <div>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                <Label className="text-amber-700">PREFILL POOL · FLOP-BOUND</Label>
                <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="h-5 w-2.5 rounded-sm bg-amber-400" />
                    ))}
                </div>
                <div className="text-[9px] text-slate-500 mt-2">long prompt → one compute-heavy pass</div>
            </div>

            <div className="flex sm:flex-col items-center justify-center px-2 py-1">
                <svg width="40" height="16" viewBox="0 0 40 16" aria-hidden="true">
                    <line x1="2" y1="8" x2="29" y2="8" stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" />
                    <polygon points="29,3 40,8 29,13" fill="#64748b" />
                </svg>
                <span className="text-[9px] font-mono text-slate-500 text-center leading-tight">
                    KV stream
                    <br />
                    NVLink / RDMA
                </span>
            </div>

            <div className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                <Label className="text-emerald-700">DECODE POOL · BANDWIDTH-BOUND</Label>
                <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="h-5 w-2.5 rounded-sm bg-emerald-400" />
                    ))}
                </div>
                <div className="text-[9px] text-slate-500 mt-2">one token at a time, streaming KV</div>
            </div>
        </div>

        <div className="mt-2 rounded-xl border border-purple-200 bg-purple-50/70 p-3">
            <Label className="text-purple-700">GPU-LESS RENDER TIER · CPU ONLY</Label>
            <div className="flex items-center gap-2 flex-wrap text-[9px] font-mono text-slate-600">
                <span className="px-2 py-1 rounded bg-purple-100 border border-purple-300">/render → token IDs</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 rounded bg-emerald-100 border border-emerald-300">/generate (GPU)</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 rounded bg-purple-100 border border-purple-300">/derender → response</span>
            </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <Label className="text-slate-400">CHUNKED PREFILL · SAME GPU, INTERLEAVED</Label>
            <div className="flex items-end gap-1 h-12">
                {['c', 'D', 'c', 'D', 'c', 'D', 'c', 'D'].map((x, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                            className={`w-full rounded-t ${x === 'c' ? 'bg-amber-400' : 'bg-slate-300'}`}
                            style={{ height: x === 'c' ? '75%' : '42%' }}
                        />
                        <span className="text-[8px] font-mono text-slate-400 mt-0.5">{x}</span>
                    </div>
                ))}
            </div>
        </div>

        <Caption>
            Three orthogonal splits: chunked prefill interleaves ~2048-token blocks locally; P/D disaggregation separates
            pools and streams KV over RDMA (2.4× goodput on MI300X); the GPU-less render tier moves tokenization and
            parsing off the GPU box entirely — all three can be combined.
        </Caption>
    </div>
);

/* ------------------------------------------------------------------ */
/* 06.2 — Advanced Quantization                                        */
/* ------------------------------------------------------------------ */
export const QuantizationDiagram: FC = () => (
    <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            <Label className="text-slate-400">MEMORY FOOTPRINT PER WEIGHT</Label>
            {[
                { name: 'FP16', width: '100%', color: '#94a3b8', note: '16-bit' },
                { name: 'FP8', width: '50%', color: '#06b6d4', note: '8-bit' },
                { name: 'NVFP4', width: '25%', color: '#3b82f6', note: '4× smaller' },
            ].map((r) => (
                <div key={r.name} className="flex items-center gap-2">
                    <span className="w-12 text-[10px] font-mono text-slate-500">{r.name}</span>
                    <div className="flex-1 h-4 rounded bg-slate-100 overflow-hidden">
                        <div className="h-full rounded" style={{ width: r.width, backgroundColor: r.color }} />
                    </div>
                    <span className="w-16 text-right text-[10px] font-mono text-slate-500">{r.note}</span>
                </div>
            ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
            <Label className="text-slate-400">NVFP4 MICROSCALING · 16×16 BLOCK</Label>
            <div className="flex items-center gap-4 flex-wrap">
                <div className="grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span
                            key={i}
                            className={`h-4 w-4 rounded-[2px] ${i === 5 ? 'bg-rose-400' : 'bg-cyan-400/70'}`}
                        />
                    ))}
                </div>
                <div className="text-[9px] text-slate-500 leading-tight space-y-1">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" /> top-1% salient weight kept high-precision (AWQ)
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400/70" /> 4-bit weights (GPTQ error-compensated)
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-700">
                    local FP8 scale / block
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700">
                    global FP32 scale
                </span>
            </div>
        </div>

        <Caption>
            Decode is bandwidth-bound, so shrinking bytes-per-weight directly raises tokens/sec. AWQ protects the
            salient 1% of weights, GPTQ compensates error via the inverse Hessian, and NVFP4 adds per-block FP8
            scales under one global FP32 scale to reach 4-bit at near-16-bit accuracy.
        </Caption>
    </div>
);

/* ------------------------------------------------------------------ */
/* 06.3 — Speculative Decoding & MTP                                   */
/* ------------------------------------------------------------------ */
export const SpeculativeDiagram: FC = () => {
    const draft = [
        { t: 'The', ok: true },
        { t: 'quick', ok: true },
        { t: 'brown', ok: true },
        { t: 'fox', ok: false },
    ];
    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                <Label className="text-emerald-700">DRAFT MODEL · 4 TOKENS IN 1 PASS</Label>
                <div className="flex flex-wrap gap-2">
                    {draft.map((d) => (
                        <span key={d.t} className="px-2 py-1 rounded bg-white border border-emerald-200 text-[11px] font-mono text-slate-700">
                            {d.t}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
                    <line x1="8" y1="0" x2="8" y2="11" stroke="#94a3b8" strokeWidth="2" />
                    <polygon points="3,11 13,11 8,18" fill="#94a3b8" />
                </svg>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3">
                <Label className="text-blue-700">TARGET MODEL · PARALLEL VERIFY (ONE FORWARD PASS)</Label>
                <div className="flex flex-wrap gap-2">
                    {draft.map((d) => (
                        <span
                            key={d.t}
                            className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1 ${d.ok ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-rose-100 border-rose-300 text-rose-700'
                                }`}
                        >
                            {d.t} {d.ok ? <Check size={11} /> : <X size={11} />}
                        </span>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
                <Label className="text-slate-400">REJECTED TOKEN → RESIDUAL RESAMPLE (LOSSLESS)</Label>
                <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-slate-600">
                    <span className="px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-600">"fox" ✗</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="px-2 py-1 rounded bg-slate-900 text-slate-100">
                        p′(x) = max(0, p−q) / Σ max(0, p−q)
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
                        "fox" → "jumps"
                    </span>
                </div>
            </div>

            <Caption>
                Idle decode FLOPs draft several tokens cheaply; the target verifies them all in a single parallel pass.
                Rejections resample from the normalized residual, so the final distribution is identical to the target's
                — the speedup is lossless. EAGLE-2 reaches 75–85% acceptance for 2.5×–4× speedups.
            </Caption>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* 06.4 — Decoding & Sampling Strategies                               */
/* ------------------------------------------------------------------ */
export const SamplingDiagram: FC = () => {
    const probs = [0.42, 0.21, 0.12, 0.08, 0.06, 0.05, 0.03, 0.02, 0.01];
    const keepCount = 4;
    const steps = ['logits z', 'z / T', 'truncate', 'softmax p', 'draw'];
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                {steps.map((s, i) => (
                    <Fragment key={s}>
                        <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">{s}</span>
                        {i < steps.length - 1 && <ArrowRight size={12} className="text-slate-400" />}
                    </Fragment>
                ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
                <Label className="text-slate-400">TRUNCATED VOCABULARY BEFORE THE DRAW</Label>
                <div className="flex items-end gap-1 h-28">
                    {probs.map((p, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                            <div
                                className="w-full rounded-t"
                                style={{ height: `${p * 200}%`, backgroundColor: i < keepCount ? '#a855f7' : '#cbd5e1' }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[9px] font-mono mt-1.5">
                    <span className="text-purple-600">kept — nucleus / top-k / min-p</span>
                    <span className="text-slate-400">masked → −∞</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-[9px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-700">{'T < 1 sharpens'}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">{'T > 1 flattens'}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-100">T = 0 → argmax</span>
                </div>
            </div>

            <Caption>
                Temperature rescales the logits, truncation decides the candidate set, and softmax turns what remains
                into a distribution. At T = 0 the draw is deterministic (argmax); above it, a categorical draw injects
                controlled diversity.
            </Caption>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* 06.5 — Structured Output & Constrained Decoding                     */
/* ------------------------------------------------------------------ */
export const ConstrainedDiagram: FC = () => {
    const states = ['{', '"key"', ':', 'value', '}', 'END'];
    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 overflow-x-auto">
                <Label className="text-slate-400">DFA STATE TRACKER · CURRENT STATE DRIVES THE MASK</Label>
                <div className="flex items-center gap-1.5 min-w-max">
                    {states.map((s, i) => (
                        <Fragment key={s}>
                            <span
                                className={`px-2 py-1 rounded-lg text-[11px] font-mono border ${s === 'END'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                    }`}
                            >
                                {s}
                            </span>
                            {i < states.length - 1 && <ArrowRight size={13} className="text-slate-400" />}
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
                <Label className="text-slate-400">VOCABULARY MASK AT THE CURRENT STATE</Label>
                <div className="flex gap-1.5 flex-wrap">
                    <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-700 text-[11px] font-mono">
                        : valid
                    </span>
                    <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-700 text-[11px] font-mono">
                        ,] valid
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-400 text-[11px] font-mono line-through">
                        the −∞
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-400 text-[11px] font-mono line-through">
                        cat −∞
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-400 text-[11px] font-mono line-through">
                        {'{'} −∞
                    </span>
                </div>
            </div>

            <Caption>
                The schema is compiled to a DFA/PDA; the engine tracks its state from emitted tokens and, before
                softmax, sets every non-transition token to −∞. Each emitted token is therefore syntactically valid by
                construction — no unclosed braces or invalid keys.
            </Caption>
        </div>
    );
};

/** Dispatches to the diagram for a given deep dive id. */
export const OptimizationDiagram: FC<{ id: string }> = ({ id }) => {
    switch (id) {
        case 'disaggregation':
            return <DisaggregationDiagram />;
        case 'quantization':
            return <QuantizationDiagram />;
        case 'speculative':
            return <SpeculativeDiagram />;
        case 'sampling':
            return <SamplingDiagram />;
        case 'structured':
            return <ConstrainedDiagram />;
        default:
            return null;
    }
};

export default OptimizationDiagram;