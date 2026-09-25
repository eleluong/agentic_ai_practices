import { EMPIRICAL_DATA } from '../../../data/quantizationData';

/**
 * Dual-axis chart: bars = on-disk weight size (GB, left axis),
 * line = top-1 accuracy % (right axis) across the 10 empirical tiers.
 * The 4-bit "sweet spot" and the Q8_0 baseline are highlighted.
 * Hand-built SVG.
 */
export const EmpiricalDualAxis = () => {
    const data = EMPIRICAL_DATA;

    const W = 880;
    const H = 410;
    const m = { left: 58, right: 62, top: 34, bottom: 96 };
    const plotW = W - m.left - m.right;
    const plotH = H - m.top - m.bottom;
    const x0 = m.left;
    const y1 = m.top + plotH;

    const gbMax = Math.ceil(Math.max(...data.map((d) => d.gb)) / 50) * 50;
    const topMin = Math.floor(Math.min(...data.map((d) => d.top1)) / 10) * 10;
    const topMax = 100;

    const yGB = (v: number) => y1 - (v / gbMax) * plotH;
    const yTop = (v: number) => y1 - ((v - topMin) / (topMax - topMin)) * plotH;

    const slot = plotW / data.length;
    const barW = 42;

    const gbTicks = Array.from({ length: gbMax / 50 + 1 }, (_, i) => i * 50);
    const topTicks = Array.from(
        { length: (topMax - topMin) / 10 + 1 },
        (_, i) => topMin + i * 10,
    );

    const barColor = (t: typeof data[number]) => {
        if (t.highlight) return '#3b82f6';
        if (t.baseline) return '#10b981';
        return '#cbd5e1';
    };

    const linePoints = data
        .map((t, i) => `${x0 + i * slot + slot / 2},${yTop(t.top1)}`)
        .join(' ');

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-auto"
                role="img"
                aria-label="Weight size versus top-1 accuracy across quantization tiers"
            >
                {/* gridlines from left axis */}
                {gbTicks.map((t) => {
                    const y = yGB(t);
                    return (
                        <g key={`g-${t}`}>
                            <line x1={x0} y1={y} x2={x0 + plotW} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                            <text x={x0 - 10} y={y + 3} textAnchor="end" fontSize={10} fill="#64748b" fontFamily="JetBrains Mono, monospace">
                                {t}
                            </text>
                        </g>
                    );
                })}

                {/* right-axis ticks */}
                {topTicks.map((t) => (
                    <text
                        key={`r-${t}`}
                        x={x0 + plotW + 10}
                        y={yTop(t) + 3}
                        textAnchor="start"
                        fontSize={9.5}
                        fill="#64748b"
                        fontFamily="JetBrains Mono, monospace"
                    >
                        {t}%
                    </text>
                ))}

                {/* axis titles */}
                <text x={18} y={m.top + plotH / 2} textAnchor="middle" fontSize={10} fill="#64748b" transform={`rotate(-90 18 ${m.top + plotH / 2})`}>
                    WEIGHTS (GB)
                </text>
                <text x={W - 16} y={m.top + plotH / 2} textAnchor="middle" fontSize={10} fill="#64748b" transform={`rotate(90 ${W - 16} ${m.top + plotH / 2})`}>
                    TOP-1 ACCURACY (%)
                </text>

                {/* bars */}
                {data.map((t, i) => {
                    const c = x0 + i * slot + slot / 2;
                    const y = yGB(t.gb);
                    const h = Math.max(y1 - y, 1.5);
                    return (
                        <g key={t.quant}>
                            <rect x={c - barW / 2} y={y} width={barW} height={h} rx={3} fill={barColor(t)} fillOpacity={0.9}>
                                <title>{`${t.quant}: ${t.gb} GB · top-1 ${t.top1}% · mean KLD ${t.meanKLD}`}</title>
                            </rect>
                            <text x={c} y={y - 5} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="JetBrains Mono, monospace">
                                {t.gb}
                            </text>
                            <text
                                x={c}
                                y={y1 + 16}
                                textAnchor="end"
                                fontSize={9}
                                fill="#64748b"
                                fontFamily="JetBrains Mono, monospace"
                                transform={`rotate(-45 ${c} ${y1 + 16})`}
                            >
                                {t.quant}
                            </text>
                            <text
                                x={c}
                                y={y1 + 62}
                                textAnchor="middle"
                                fontSize={8.5}
                                fill="#64748b"
                                fontFamily="JetBrains Mono, monospace"
                            >
                                {t.bpw}
                            </text>
                        </g>
                    );
                })}

                {/* top-1 accuracy line */}
                <polyline points={linePoints} fill="none" stroke="#f59e0b" strokeWidth={2} />
                {data.map((t, i) => {
                    const c = x0 + i * slot + slot / 2;
                    return (
                        <g key={`pt-${t.quant}`}>
                            <circle cx={c} cy={yTop(t.top1)} r={3} fill="#f59e0b" stroke="#ffffff" strokeWidth={1}>
                                <title>{`${t.quant}: top-1 ${t.top1}%`}</title>
                            </circle>
                        </g>
                    );
                })}

                {/* highlights */}
                {data.map((t, i) => {
                    if (!t.highlight && !t.baseline) return null;
                    const c = x0 + i * slot + slot / 2;
                    return (
                        <text
                            key={`hl-${t.quant}`}
                            x={c}
                            y={y1 + 80}
                            textAnchor="middle"
                            fontSize={8.5}
                            fill={t.highlight ? '#2563eb' : '#059669'}
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight={700}
                        >
                            {t.highlight ? 'SWEET SPOT' : 'BASELINE'}
                        </text>
                    );
                })}
            </svg>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-300" />
                    <span className="text-[11px] text-slate-500">Weight size (GB)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-block h-0.5 w-4 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                    <span className="text-[11px] text-slate-500">Top-1 accuracy (%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                    <span className="text-[11px] text-slate-500">4-bit sweet spot</span>
                </div>
            </div>
        </div>
    );
};

export default EmpiricalDualAxis;