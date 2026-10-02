import { useMemo, useState } from 'react';
import { Activity, Cpu, Gauge } from 'lucide-react';
import { HARDWARE_ROWS } from '../../data/inferenceData';
import { CHART_FONT } from './charts/chartFont';

// Only accelerators with a published dense-compute figure can be plotted against
// a roofline ceiling. B200's compute is "Not stated in sources", so it is excluded
// rather than silently falling back to another GPU's ridge point.
const GPU_OPTIONS = HARDWARE_ROWS.filter(
    (h) => h.computeTflops > 0 && h.balanceFlops > 0,
).map((h) => ({
    id: h.gpu,
    label: h.gpu,
    bandwidth: h.bandwidthTbs,
    compute: h.computeTflops,
    balance: h.balanceFlops,
}));

/**
 * Interactive roofline explorer. A batch-size slider moves the decode
 * operating point from ~1 FLOP/byte (severely memory bound) up toward the
 * ridge point, while a GPU selector changes the machine-balance line.
 */
export const RooflineExplorer = () => {
    const [gpuId, setGpuId] = useState(GPU_OPTIONS[0].id);
    const [batch, setBatch] = useState(1);

    const gpu = useMemo(
        () => GPU_OPTIONS.find((g) => g.id === gpuId) ?? GPU_OPTIONS[0],
        [gpuId],
    );

    // Arithmetic intensity grows with batch (weights reused across the batch).
    const intensity = useMemo(() => {
        const base = 1;
        return base * batch;
    }, [batch]);

    const ridge = gpu.balance;
    const isComputeBound = intensity >= ridge;
    const utilization = Math.min(intensity / ridge, 1);

    /* --- chart geometry (log x-axis) --- */
    const W = 660;
    const H = 320;
    const m = { left: 58, right: 24, top: 28, bottom: 54 };
    const plotW = W - m.left - m.right;
    const plotH = H - m.top - m.bottom;
    const x0 = m.left;
    const y1 = m.top + plotH;

    const XMIN = Math.log10(0.5);
    const XMAX = Math.log10(2000);
    const xFor = (v: number) =>
        x0 + ((Math.log10(Math.max(v, 0.5)) - XMIN) / (XMAX - XMIN)) * plotW;

    // Headroom above the fastest supported accelerator, rounded to a tick step,
    // so a future part near the current ceiling cannot clip.
    const maxCompute = Math.max(...GPU_OPTIONS.map((g) => g.compute));
    const YMAX = Math.max(1200, Math.ceil((maxCompute * 1.2) / 200) * 200);
    const yFor = (v: number) => y1 - (v / YMAX) * plotH;

    const yTicks = Array.from({ length: Math.floor(YMAX / 200) }, (_, i) => (i + 1) * 200);
    const axisPivotX = m.left / 2;

    const ridgeX = xFor(ridge);
    const pointX = xFor(intensity);
    const pointY = yFor(Math.min(intensity * gpu.bandwidth, gpu.compute));
    const ceilingY = yFor(gpu.compute);

    const ticks = [1, 10, 100, 1000];
    const fmtTflops = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)} PF` : `${v} TF`);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                        <Gauge size={18} />
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Roofline Explorer</h3>
                        <p className="text-[11px] text-slate-500 font-mono">Intensity vs machine balance</p>
                    </div>
                </div>

                <label className="block mb-4">
                    <span className="text-[10px] text-slate-500 font-mono block mb-1">GPU</span>
                    <select
                        value={gpuId}
                        onChange={(e) => setGpuId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                    >
                        {GPU_OPTIONS.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.label} · {g.bandwidth} TB/s
                            </option>
                        ))}
                    </select>
                </label>
                <p className="text-[10px] text-slate-400 mb-4 -mt-2">
                    B200 is excluded from the roofline: its dense compute is not stated in the sources.
                </p>

                <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-mono" id="roofline-batch-label">Batch Size</span>
                        <span className="text-slate-900 font-mono font-semibold">{batch}</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={256}
                        step={1}
                        value={batch}
                        onChange={(e) => setBatch(Number(e.target.value))}
                        aria-labelledby="roofline-batch-label"
                        className="w-full accent-blue-500 cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs mb-5">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-mono mb-1">INTENSITY</div>
                        <div className="text-slate-900 font-mono font-bold">{intensity.toFixed(0)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-mono mb-1">RIDGE</div>
                        <div className="text-amber-600 font-mono font-bold">~{ridge}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-mono mb-1">CORE USE</div>
                        <div className="text-emerald-600 font-mono font-bold">{(utilization * 100).toFixed(0)}%</div>
                    </div>
                </div>

                <div
                    className={`mt-auto p-4 rounded-xl border text-xs ${isComputeBound
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}
                >
                    <div className="flex items-center gap-1.5 font-bold font-mono mb-1">
                        {isComputeBound ? <Cpu size={14} /> : <Activity size={14} />}
                        {isComputeBound ? 'COMPUTE BOUND' : 'MEMORY BANDWIDTH BOUND'}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                        {isComputeBound
                            ? 'Tensor Cores are saturated. Throughput scales with FLOPs; quantization now needs native low-bit GEMMs.'
                            : 'The arithmetic intensity sits below the ridge point, so the cores wait on HBM. Batching and KV compression are the levers.'}
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Roofline model chart">
                    {ticks.map((t) => {
                        const x = xFor(t);
                        return (
                            <g key={t}>
                                <line x1={x} y1={m.top} x2={x} y2={y1} stroke="#e2e8f0" strokeWidth={1} />
                                <text x={x} y={y1 + 16} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily={CHART_FONT}>
                                    {t}
                                </text>
                            </g>
                        );
                    })}
                    {yTicks.map((v) => {
                        const y = yFor(v);
                        return (
                            <g key={v}>
                                <line x1={x0} y1={y} x2={x0 + plotW} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                                <text x={x0 - 10} y={y + 3} textAnchor="end" fontSize={9} fill="#64748b" fontFamily={CHART_FONT}>
                                    {v}
                                </text>
                            </g>
                        );
                    })}

                    {/* axes titles */}
                    <text x={x0 + plotW / 2} y={H - 8} textAnchor="middle" fontSize={9} fill="#64748b">
                        ARITHMETIC INTENSITY (FLOPs / byte)
                    </text>
                    <text
                        x={axisPivotX}
                        y={m.top + plotH / 2}
                        textAnchor="middle"
                        fontSize={9}
                        fill="#64748b"
                        transform={`rotate(-90 ${axisPivotX} ${m.top + plotH / 2})`}
                    >
                        THROUGHPUT (TFLOPs)
                    </text>

                    {/* memory-bound slope */}
                    <line
                        x1={xFor(0.5)}
                        y1={Math.min(yFor(0.5 * gpu.bandwidth), ceilingY)}
                        x2={ridgeX}
                        y2={ceilingY}
                        stroke="#3b82f6"
                        strokeWidth={2}
                    />
                    {/* compute ceiling */}
                    <line x1={ridgeX} y1={ceilingY} x2={x0 + plotW} y2={ceilingY} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 4" />

                    {/* ridge marker */}
                    <line x1={ridgeX} y1={m.top} x2={ridgeX} y2={y1} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" />
                    <text x={ridgeX + 4} y={m.top + 12} fontSize={9} fill="#b45309" fontFamily={CHART_FONT}>
                        ridge ~{ridge}
                    </text>

                    {/* operating point */}
                    <circle cx={pointX} cy={pointY} r={7} fill={isComputeBound ? '#10b981' : '#f43f5e'} fillOpacity={0.9} stroke="#fff" strokeWidth={2} />
                    <text x={pointX} y={pointY - 14} textAnchor="middle" fontSize={10} fill="#0f172a" fontFamily={CHART_FONT} fontWeight={700}>
                        {fmtTflops(Math.min(intensity * gpu.bandwidth, gpu.compute))}
                    </text>
                </svg>

                <p className="mt-3 text-[11px] text-slate-500">
                    The solid line is the bandwidth-bound slope; the dashed line is the compute ceiling. The ridge point is where
                    they meet — {gpu.label} sits at <strong className="text-amber-600">~{ridge} FLOPs/byte</strong>.
                </p>
            </div>
        </div>
    );
};

export default RooflineExplorer;