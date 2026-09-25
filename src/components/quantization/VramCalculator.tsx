import { useMemo, useState } from 'react';
import { Cpu, HardDrive, MemoryStick, Server, TriangleAlert } from 'lucide-react';

interface ModelSpec {
    id: string;
    label: string;
    layers: number;
    kvHeads: number;
    headDim: number;
    paramsB: number;
}

const MODELS: ModelSpec[] = [
    { id: '8b', label: 'Llama 3 8B (32 layers, 8 KV)', layers: 32, kvHeads: 8, headDim: 128, paramsB: 8 },
    { id: '70b', label: 'Llama 3 70B (80 layers, 8 KV)', layers: 80, kvHeads: 8, headDim: 128, paramsB: 70 },
    { id: '405b', label: 'Llama 3 405B (126 layers, 8 KV)', layers: 126, kvHeads: 8, headDim: 128, paramsB: 405 },
];

const WEIGHT_DTYPES = [
    { value: 16, label: 'FP16 / BF16 (16-bit)' },
    { value: 8, label: 'FP8 (8-bit)' },
    { value: 4, label: 'INT4 / AWQ (~4.5 bpw w/ metadata)' },
];

const KV_DTYPES = [
    { value: 16, label: 'FP16 (2 bytes)' },
    { value: 8, label: 'FP8 (1 byte)' },
];

const CONCURRENCY_TIERS = [1, 4, 8, 16, 32];

/**
 * Interactive VRAM & KV-cache estimator. Ports the presentation's
 * calculator into React state and renders the concurrency curve as a
 * stacked SVG bar chart (weights static + KV cache dynamic).
 */
export const VramCalculator = () => {
    const [modelId, setModelId] = useState('70b');
    const [weightBits, setWeightBits] = useState(4);
    const [kvBits, setKvBits] = useState(8);
    const [ctxTokens, setCtxTokens] = useState(32768);

    const spec = useMemo(() => MODELS.find((m) => m.id === modelId) ?? MODELS[1], [modelId]);

    const { weightGB, kvGB, totalGB, tiers } = useMemo(() => {
        // Nominal 4-bit ignores metadata, so apply a 10% buffer (4.5 bpw effective).
        const effectiveWeightBpw = weightBits === 4 ? 4.5 : weightBits;
        const wGB = (spec.paramsB * effectiveWeightBpw) / 8;

        const bytesPerElem = kvBits / 8;
        const kvBytesPerToken = 2 * spec.layers * spec.kvHeads * spec.headDim * bytesPerElem;
        const kvGBOne = (kvBytesPerToken * ctxTokens) / (1024 * 1024 * 1024);

        const tierData = CONCURRENCY_TIERS.map((c) => ({
            concurrency: c,
            weights: wGB,
            kv: kvGBOne * c,
            total: wGB + kvGBOne * c,
        }));

        return { weightGB: wGB, kvGB: kvGBOne, totalGB: wGB + kvGBOne, tiers: tierData };
    }, [spec, weightBits, kvBits, ctxTokens]);

    const maxTotal = Math.max(...tiers.map((t) => t.total), 1);

    /* --- stacked bar chart geometry --- */
    const CW = 640;
    const CH = 300;
    const cm = { left: 56, right: 20, top: 24, bottom: 50 };
    const cPlotW = CW - cm.left - cm.right;
    const cPlotH = CH - cm.top - cm.bottom;
    const cy1 = cm.top + cPlotH;
    const slot = cPlotW / tiers.length;
    const barW = 52;

    const yScale = (v: number) => cy1 - (v / maxTotal) * cPlotH;

    const fmt = (n: number) => `${n.toFixed(1)} GB`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls + summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                        <MemoryStick size={18} />
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">KV Cache & VRAM Calculator</h3>
                        <p className="text-[11px] text-slate-500 font-mono">Sized with num_key_value_heads, not query heads</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
                    <label className="block">
                        <span className="text-[10px] text-slate-500 font-mono block mb-1">Model Architecture</span>
                        <select
                            value={modelId}
                            onChange={(e) => setModelId(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                        >
                            {MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-[10px] text-slate-500 font-mono block mb-1">Weight Precision</span>
                        <select
                            value={weightBits}
                            onChange={(e) => setWeightBits(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                        >
                            {WEIGHT_DTYPES.map((w) => (
                                <option key={w.value} value={w.value}>
                                    {w.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-[10px] text-slate-500 font-mono block mb-1">KV Cache Dtype</span>
                        <select
                            value={kvBits}
                            onChange={(e) => setKvBits(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                        >
                            {KV_DTYPES.map((k) => (
                                <option key={k.value} value={k.value}>
                                    {k.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-mono">Context Length</span>
                        <span className="text-slate-900 font-mono font-semibold">
                            {ctxTokens.toLocaleString()} tokens ({(ctxTokens / 1024).toFixed(0)}k)
                        </span>
                    </div>
                    <input
                        type="range"
                        min={2048}
                        max={131072}
                        step={2048}
                        value={ctxTokens}
                        onChange={(e) => setCtxTokens(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs mb-4">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono mb-1">
                            <HardDrive size={12} /> WEIGHTS
                        </div>
                        <div className="text-slate-900 font-mono font-bold">{fmt(weightGB)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono mb-1">
                            <Server size={12} /> KV / 1 STREAM
                        </div>
                        <div className="text-rose-600 font-mono font-bold">{fmt(kvGB)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono mb-1">
                            <Cpu size={12} /> TOTAL
                        </div>
                        <div className="text-emerald-600 font-mono font-bold">{fmt(totalGB)}</div>
                    </div>
                </div>

                <div className="mt-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold font-mono">
                        <TriangleAlert size={13} /> THE 8× GQA TRAP
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                        Llama-3-70B has 64 query heads but only 8 KV heads! Sizing with query heads overstates KV cache by
                        exactly 8×. Always read{' '}
                        <code className="text-slate-900 font-mono">num_key_value_heads</code> in{' '}
                        <code className="text-slate-900 font-mono">config.json</code>.
                    </p>
                </div>
            </div>

            {/* Concurrency curve */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Concurrency Memory Curve</h3>
                    <span className="text-[10px] font-mono text-slate-500">WEIGHTS + KV × STREAMS</span>
                </div>

                <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full h-auto" role="img" aria-label="Stacked VRAM usage by concurrency tier">
                    {/* y gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                        const v = maxTotal * f;
                        const y = yScale(v);
                        return (
                            <g key={f}>
                                <line x1={cm.left} y1={y} x2={cm.left + cPlotW} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                                <text x={cm.left - 10} y={y + 3} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="JetBrains Mono, monospace">
                                    {v.toFixed(0)}
                                </text>
                            </g>
                        );
                    })}
                    <text x={14} y={cm.top + cPlotH / 2} textAnchor="middle" fontSize={9} fill="#64748b" transform={`rotate(-90 14 ${cm.top + cPlotH / 2})`}>
                        TOTAL VRAM (GB)
                    </text>

                    {tiers.map((t, i) => {
                        const center = cm.left + i * slot + slot / 2;
                        const wH = (t.weights / maxTotal) * cPlotH;
                        const kH = (t.kv / maxTotal) * cPlotH;
                        const wY = cy1 - wH;
                        const kY = wY - kH;
                        return (
                            <g key={t.concurrency}>
                                {/* KV (dynamic) */}
                                <rect x={center - barW / 2} y={kY} width={barW} height={Math.max(kH, 1)} rx={3} fill="#f43f5e" fillOpacity={0.75}>
                                    <title>{`KV cache × ${t.concurrency}: ${t.kv.toFixed(1)} GB`}</title>
                                </rect>
                                {/* weights (static) */}
                                <rect x={center - barW / 2} y={wY} width={barW} height={Math.max(wH, 1)} rx={3} fill="#3b82f6" fillOpacity={0.75}>
                                    <title>{`Weights (static): ${t.weights.toFixed(1)} GB`}</title>
                                </rect>
                                <text x={center} y={kY - 6} textAnchor="middle" fontSize={9.5} fill="#0f172a" fontFamily="JetBrains Mono, monospace" fontWeight={700}>
                                    {t.total.toFixed(0)}
                                </text>
                                <text x={center} y={cy1 + 20} textAnchor="middle" fontSize={10} fill="#334155">
                                    {t.concurrency} Stream{t.concurrency > 1 ? 's' : ''}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500/70" />
                        <span className="text-[11px] text-slate-500">Model Weights (Static)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-500/70" />
                        <span className="text-[11px] text-slate-500">KV Cache (Dynamic)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VramCalculator;