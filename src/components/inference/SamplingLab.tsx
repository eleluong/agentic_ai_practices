import { useEffect, useMemo, useState } from 'react';
import { Scissors, SlidersHorizontal, Thermometer } from 'lucide-react';

interface Candidate {
    token: string;
    logit: number;
}

// A fixed toy logit vector so the demo is deterministic. Values are chosen so the
// top token dominates and a long, flat tail exists to be truncated.
const VOCAB: Candidate[] = [
    { token: 'quantum', logit: 4.2 },
    { token: 'annealing', logit: 3.4 },
    { token: 'systems', logit: 2.6 },
    { token: 'escape', logit: 1.9 },
    { token: 'local', logit: 1.2 },
    { token: 'minima', logit: 0.6 },
    { token: 'energy', logit: 0.0 },
    { token: 'the', logit: -1.1 },
    { token: 'and', logit: -2.0 },
    { token: 'of', logit: -3.2 },
];

type Strategy = 'greedy' | 'topk' | 'topp' | 'minp' | 'beam';

const STRATEGIES: { id: Strategy; label: string }[] = [
    { id: 'greedy', label: 'Greedy' },
    { id: 'topk', label: 'Top-k' },
    { id: 'topp', label: 'Top-p' },
    { id: 'minp', label: 'Min-p' },
    { id: 'beam', label: 'Beam' },
];

/**
 * Interactive sampler. Temperature reshapes the logits; the selected strategy then
 * truncates the tail before softmax renormalization. Dropped tokens are rendered
 * faded (the logit-masking step used by constrained/truncated decoding).
 */
export const SamplingLab = () => {
    const [strategy, setStrategy] = useState<Strategy>('topp');
    const [temp, setTemp] = useState(1.0);
    const [topK, setTopK] = useState(4);
    const [topP, setTopP] = useState(0.9);
    const [minP, setMinP] = useState(0.1);
    const [beams, setBeams] = useState(3);

    // Reset each strategy's hyperparameter to its default when the user
    // switches, so a value tuned for one strategy never silently leaks
    // into another.
    useEffect(() => {
        if (strategy === 'topk') setTopK(4);
        if (strategy === 'topp') setTopP(0.9);
        if (strategy === 'minp') setMinP(0.1);
        if (strategy === 'beam') setBeams(3);
    }, [strategy]);

    const distribution = useMemo(() => {
        const scaled = VOCAB.map((v) => v.logit / temp);
        const max = Math.max(...scaled);
        const exps = scaled.map((s) => Math.exp(s - max));
        const sum = exps.reduce((a, b) => a + b, 0);
        return VOCAB.map((v, i) => ({ ...v, p: exps[i] / sum }));
    }, [temp]);

    const maxP = Math.max(...distribution.map((d) => d.p));

    const kept = useMemo(() => {
        const sorted = [...distribution].sort((a, b) => b.p - a.p);
        if (strategy === 'greedy') return new Set([sorted[0].token]);
        if (strategy === 'topk') return new Set(sorted.slice(0, topK).map((d) => d.token));
        if (strategy === 'beam') return new Set(sorted.slice(0, beams).map((d) => d.token));
        if (strategy === 'minp')
            return new Set(distribution.filter((d) => d.p >= minP * maxP).map((d) => d.token));
        // top-p (nucleus): smallest set whose cumulative probability ≥ p
        const chosen = new Set<string>();
        let cumulative = 0;
        for (const item of sorted) {
            chosen.add(item.token);
            cumulative += item.p;
            if (cumulative >= topP) break;
        }
        return chosen;
    }, [distribution, strategy, topK, topP, minP, beams, maxP]);

    // After truncation the survivors are renormalized so they sum to 1 — this
    // is the distribution the categorical draw actually samples from.
    const renormalized = useMemo(() => {
        const mass = distribution.filter((d) => kept.has(d.token)).reduce((a, b) => a + b.p, 0) || 1;
        return distribution.map((d) => ({ ...d, p: kept.has(d.token) ? d.p / mass : d.p }));
    }, [distribution, kept]);
    const maxRenorm = Math.max(...renormalized.map((d) => d.p));

    const keptCount = kept.size;
    const keptMass = distribution
        .filter((d) => kept.has(d.token))
        .reduce((a, b) => a + b.p, 0);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                        <SlidersHorizontal size={18} />
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Decoding & Sampling Lab</h3>
                        <p className="text-[11px] text-slate-500 font-mono">Truncate the tail, then renormalize</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {STRATEGIES.map((s) => {
                        const active = strategy === s.id;
                        return (
                            <button
                                key={s.id}
                                onClick={() => setStrategy(s.id)}
                                aria-pressed={active}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${active
                                    ? 'bg-cyan-600 border-cyan-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-300'
                                    }`}
                            >
                                {s.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <label className="block">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mb-1">
                        <Thermometer size={11} /> TEMPERATURE · {temp.toFixed(1)}
                    </span>
                    <input
                        type="range"
                        min={0.1}
                        max={2}
                        step={0.1}
                        value={temp}
                        onChange={(e) => setTemp(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                    />
                </label>

                {strategy === 'topk' && (
                    <label className="block">
                        <span className="text-[10px] text-slate-500 font-mono mb-1 block">TOP-K · {topK}</span>
                        <input type="range" min={1} max={10} step={1} value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                    </label>
                )}
                {strategy === 'topp' && (
                    <label className="block">
                        <span className="text-[10px] text-slate-500 font-mono mb-1 block">TOP-P · {topP.toFixed(2)}</span>
                        <input type="range" min={0.5} max={1} step={0.01} value={topP} onChange={(e) => setTopP(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                    </label>
                )}
                {strategy === 'minp' && (
                    <label className="block">
                        <span className="text-[10px] text-slate-500 font-mono mb-1 block">MIN-P · {minP.toFixed(2)}</span>
                        <input type="range" min={0.02} max={0.5} step={0.01} value={minP} onChange={(e) => setMinP(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                    </label>
                )}
                {strategy === 'beam' && (
                    <label className="block">
                        <span className="text-[10px] text-slate-500 font-mono mb-1 block">BEAMS · {beams}</span>
                        <input type="range" min={2} max={8} step={1} value={beams} onChange={(e) => setBeams(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                    </label>
                )}
            </div>

            {/* Distribution bars */}
            <div className="space-y-1.5 mb-5">
                {renormalized.map((d) => {
                    const isKept = kept.has(d.token);
                    const width = (d.p / maxRenorm) * 100;
                    return (
                        <div key={d.token} className="flex items-center gap-3">
                            <span className={`w-20 shrink-0 text-[11px] font-mono text-right ${isKept ? 'text-slate-700' : 'text-slate-300 line-through'}`}>
                                {d.token}
                            </span>
                            <div className="flex-1 h-5 bg-slate-50 rounded-md overflow-hidden border border-slate-100">
                                <div
                                    className={`h-full rounded-md transition-all duration-300 ${isKept ? 'bg-cyan-500' : 'bg-slate-200'}`}
                                    style={{ width: `${width}%` }}
                                />
                            </div>
                            <span className={`w-14 shrink-0 text-[10px] font-mono text-right ${isKept ? 'text-cyan-700' : 'text-slate-300'}`}>
                                {(d.p * 100).toFixed(1)}%
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">CANDIDATES</div>
                    <div className="text-slate-900 font-mono font-bold">{keptCount} / {VOCAB.length}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">KEPT MASS</div>
                    <div className="text-cyan-700 font-mono font-bold">{(keptMass * 100).toFixed(1)}%</div>
                    <div className="text-slate-400 text-[9px] font-mono mt-0.5">renormalized → 100%</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">TOP TOKEN</div>
                    <div className="text-slate-900 font-mono font-bold truncate">
                        {[...distribution].sort((a, b) => b.p - a.p)[0].token}
                    </div>
                </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                <Scissors size={12} className="mt-0.5 shrink-0 text-cyan-600" />
                {strategy === 'greedy' && 'Temperature 0 collapses the distribution onto the argmax — deterministic but prone to repetition.'}
                {strategy === 'topk' && 'A static k ignores entropy: too tight when the model is uncertain, too loose when it is 99% confident.'}
                {strategy === 'topp' && 'Nucleus sampling expands and shrinks the pool by cumulative probability — but a flat tail can still admit bad tokens.'}
                {strategy === 'minp' && 'Min-p self-calibrates to the top token: confident → cut hard, uncertain → open the pool. Removes flat-tail noise.'}
                {strategy === 'beam' && 'Beam search keeps B hypotheses but costs B× KV-cache VRAM and decode latency — largely deprecated for long-form generation.'}
            </p>
        </div>
    );
};

export default SamplingLab;