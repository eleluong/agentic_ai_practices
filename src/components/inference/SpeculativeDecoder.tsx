import { useMemo, useState } from 'react';
import { Check, Rabbit, Sparkles, X, Zap } from 'lucide-react';

interface DraftToken {
    id: number;
    text: string;
    accepted: boolean;
}

const TARGET_TEXT = ['Quantum', 'annealing', 'lets', 'systems', 'escape', 'local', 'minima'];

/**
 * Speculative decoding simulator. The draft model proposes several future
 * tokens in one cheap pass; the target model verifies them in parallel.
 * Rejected tokens are corrected via the lossless residual distribution.
 */
export const SpeculativeDecoder = () => {
    const [draftCount, setDraftCount] = useState(4);
    const [acceptanceRate, setAcceptanceRate] = useState(80);

    // Real speculative decoding accepts a *prefix*: drafts are verified in order and
    // everything after the first rejection is discarded, so the accepted count is
    // floor(draftTokens × acceptanceRate) rather than an independent coin flip.
    const acceptedCount = Math.floor((draftCount * acceptanceRate) / 100);

    const drafts: DraftToken[] = useMemo(() => {
        return Array.from({ length: draftCount }, (_, i) => ({
            id: i,
            // TARGET_TEXT has one entry per selectable draft count (2–7), so each
            // position maps to a distinct token without wrapping/repeating.
            text: TARGET_TEXT[i],
            accepted: i < acceptedCount,
        }));
    }, [draftCount, acceptedCount]);

    const accepted = drafts.filter((d) => d.accepted).length;
    // Sequential decoding needs (accepted + 1) target passes to emit the same
    // tokens. Speculative decoding needs 1 verification pass plus the draft passes,
    // which are cheaper but not free (draft model ≈ 15% of a target pass per token).
    const DRAFT_COST = 0.15;
    const baselinePasses = accepted + 1;
    const speculativePasses = 1 + DRAFT_COST * draftCount;
    const speedup = baselinePasses / speculativePasses;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 text-amber-600">
                        <Zap size={18} />
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Speculative Decoding</h3>
                        <p className="text-[11px] text-slate-500 font-mono">Draft, verify, accept — losslessly</p>
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-mono flex items-center gap-1.5" id="spec-draft-label"><Rabbit size={12} /> Draft tokens</span>
                        <span className="text-slate-900 font-mono font-semibold">{draftCount}</span>
                    </div>
                    <input
                        type="range"
                        min={2}
                        max={7}
                        step={1}
                        value={draftCount}
                        onChange={(e) => setDraftCount(Number(e.target.value))}
                        aria-labelledby="spec-draft-label"
                        className="w-full accent-amber-500 cursor-pointer"
                    />
                </div>

                <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-mono" id="spec-rate-label">Draft acceptance rate</span>
                        <span className="text-slate-900 font-mono font-semibold">{acceptanceRate}%</span>
                    </div>
                    <input
                        type="range"
                        min={40}
                        max={95}
                        step={5}
                        value={acceptanceRate}
                        onChange={(e) => setAcceptanceRate(Number(e.target.value))}
                        aria-labelledby="spec-rate-label"
                        className="w-full accent-amber-500 cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs mb-5">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-mono mb-1">ACCEPTED</div>
                        <div className="text-emerald-600 font-mono font-bold">{accepted}/{draftCount}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-mono mb-1">COST (passes)</div>
                        <div className="text-slate-900 font-mono font-bold">{speculativePasses.toFixed(1)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-mono mb-1">SPEEDUP</div>
                        <div className="text-amber-600 font-mono font-bold">{speedup.toFixed(1)}×</div>
                    </div>
                </div>

                <div className="mt-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-slate-700 mb-1">
                        <Sparkles size={13} /> LOSSLESS GUARANTEE
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 font-mono">
                        p'(x) = max(0, p(x) − q(x)) / Σ max(0, p(x') − q(x'))
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                        Rejected tokens resample from the residual distribution, so the output matches the target model exactly.
                    </p>
                </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-[10px] font-mono text-amber-600 font-bold mb-3">DRAFT TREE → PARALLEL VERIFICATION</div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {drafts.map((d) => (
                        <div
                            key={d.id}
                            className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${d.accepted
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-rose-50 border-rose-200 text-rose-700'
                                }`}
                        >
                            {d.accepted ? <Check size={12} /> : <X size={12} />}
                            {d.text}
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-400 w-24 shrink-0">SEQUENTIAL</span>
                        <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden">
                            <div
                                className="h-full bg-slate-400 rounded-md"
                                style={{ width: `${Math.min((baselinePasses / 8) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-mono text-slate-600 w-16 text-right">{baselinePasses} passes</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-400 w-24 shrink-0">SPECULATIVE</span>
                        <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden">
                            <div
                                className="h-full bg-amber-500 rounded-md"
                                style={{ width: `${Math.min((speculativePasses / 8) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-mono text-amber-600 w-20 text-right">{speculativePasses.toFixed(1)} pass-equiv</span>
                    </div>
                </div>

                <p className="mt-5 text-[11px] text-slate-500 leading-relaxed">
                    Because decode is starved for compute, the spare FLOPs are spent drafting. EAGLE-2 speculates in feature space
                    and reaches 75–85% acceptance for 2.5×–4× real speedups; MTP bakes the heads into pre-training.
                </p>
            </div>
        </div>
    );
};

export default SpeculativeDecoder;