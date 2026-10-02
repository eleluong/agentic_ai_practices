import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Snowflake, Thermometer } from 'lucide-react';

const CANVAS = 32;
const TOTAL_STEPS = 6;

/**
 * Diffusion LLM annealing demo. A fixed-length canvas starts as random
 * "noise" tokens; each step locks the low-entropy (confident) positions and
 * re-noises the rest, converging in a handful of parallel passes.
 */
export const DiffusionAnnealing = () => {
    const [step, setStep] = useState(3);
    const [playing, setPlaying] = useState(false);
    const timer = useRef<number | null>(null);

    // Deterministic pseudo-random confidence per position.
    const confidence = useMemo(
        () =>
            Array.from({ length: CANVAS }, (_, i) => {
                const seed = (i * 9301 + 49297) % 233280;
                return seed / 233280;
            }),
        [],
    );

    // Positions lock progressively as steps advance.
    const locked = useMemo(
        () => confidence.map((c) => c <= (step / TOTAL_STEPS) * 0.95),
        [confidence, step],
    );

    const lockedCount = locked.filter(Boolean).length;

    useEffect(() => {
        if (!playing) return undefined;
        timer.current = window.setInterval(() => {
            setStep((s) => {
                if (s >= TOTAL_STEPS) {
                    setPlaying(false);
                    return s;
                }
                return s + 1;
            });
        }, 700);
        return () => {
            if (timer.current) window.clearInterval(timer.current);
        };
    }, [playing]);

    const reset = () => {
        setPlaying(false);
        setStep(1);
    };

    const glyph = (i: number, isLocked: boolean) => {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        if (isLocked) return chars[(i * 7) % 26];
        // noisy token — mix of symbols shifts each step
        const noise = '░▒▓█▚▞#%&*';
        return noise[(i + step * 3) % noise.length];
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 border border-rose-200 text-rose-600">
                        <Snowflake size={18} />
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Diffusion Annealing Canvas</h3>
                        <p className="text-[11px] text-slate-500 font-mono">Fixed-length noise → coherent text</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPlaying((p) => !p)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                        {playing ? <Pause size={13} /> : <Play size={13} />}
                        {playing ? 'Pause' : 'Anneal'}
                    </button>
                    <button
                        onClick={reset}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                    >
                        <RotateCcw size={13} /> Reset
                    </button>
                </div>
            </div>

            <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                {Array.from({ length: CANVAS }, (_, i) => {
                    const isLocked = locked[i];
                    return (
                        <div
                            key={i}
                            className={`aspect-square rounded-md border flex items-center justify-center text-[11px] font-mono transition-all duration-500 ${isLocked
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                                : 'bg-rose-50 border-rose-200 text-rose-400'
                                }`}
                            title={`Position ${i} · ${isLocked ? 'locked' : 'noisy'}`}
                        >
                            {glyph(i, isLocked)}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono text-slate-400 w-20 shrink-0 flex items-center gap-1">
                    <Thermometer size={11} /> STEP {step}/{TOTAL_STEPS}
                </span>
                <input
                    type="range"
                    min={1}
                    max={TOTAL_STEPS}
                    step={1}
                    value={step}
                    aria-label="Annealing step"
                    onChange={(e) => {
                        setPlaying(false);
                        setStep(Number(e.target.value));
                    }}
                    className="flex-1 accent-rose-500 cursor-pointer"
                />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">LOCKED</div>
                    <div className="text-emerald-600 font-mono font-bold">{lockedCount} / {CANVAS}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">RE-NOISED</div>
                    <div className="text-rose-600 font-mono font-bold">{CANVAS - lockedCount}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">PARALLEL</div>
                    <div className="text-slate-900 font-mono font-bold">All {CANVAS}</div>
                </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                DiffusionGemma applies bidirectional attention across a fixed canvas. The EntropyBoundSampler locks
                low-entropy (highly confident) tokens and re-noises the remainder, annealing hundreds of tokens simultaneously
                into coherent text — breaking the one-token-per-step autoregressive bottleneck.
            </p>
        </div>
    );
};

export default DiffusionAnnealing;