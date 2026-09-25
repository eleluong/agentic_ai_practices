import { FOOTPRINT_CHART } from '../../../data/quantizationData';

/**
 * Grouped log-scale bar chart comparing model memory footprint (GB)
 * across 16-bit, FP8, INT4/AWQ and NVFP4 precision levels.
 * Hand-built SVG — no charting dependency.
 */
export const ModelFootprintBar = () => {
    const { labels, series } = FOOTPRINT_CHART;

    const W = 840;
    const H = 390;
    const m = { left: 78, right: 24, top: 30, bottom: 70 };
    const plotW = W - m.left - m.right;
    const plotH = H - m.top - m.bottom;
    const x0 = m.left;
    const y1 = m.top + plotH;

    const MAX_LOG = Math.log10(2200);
    const yFor = (v: number) => y1 - (Math.log10(Math.max(v, 1)) / MAX_LOG) * plotH;
    const ticks = [1, 10, 100, 1000];

    const groupW = plotW / labels.length;
    const barW = 28;
    const gap = 5;
    const seriesW = series.length * barW + (series.length - 1) * gap;

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-auto"
                role="img"
                aria-label="Model memory footprint by precision level"
            >
                {/* gridlines */}
                {ticks.map((t) => {
                    const y = yFor(t);
                    return (
                        <g key={t}>
                            <line x1={x0} y1={y} x2={x0 + plotW} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                            <text
                                x={x0 - 12}
                                y={y + 3}
                                textAnchor="end"
                                fontSize={10}
                                fill="#64748b"
                                fontFamily="JetBrains Mono, monospace"
                            >
                                {t}
                            </text>
                        </g>
                    );
                })}

                {/* y-axis title */}
                <text
                    x={18}
                    y={m.top + plotH / 2}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#64748b"
                    transform={`rotate(-90 18 ${m.top + plotH / 2})`}
                >
                    WEIGHTS (GB · log scale)
                </text>

                {/* bars */}
                {labels.map((label, gi) => {
                    const groupCenter = x0 + gi * groupW + groupW / 2;
                    const gx = groupCenter - seriesW / 2;
                    return (
                        <g key={label}>
                            {series.map((s, si) => {
                                const v = s.data[gi];
                                const y = yFor(v);
                                const h = Math.max(y1 - y, 1.5);
                                const x = gx + si * (barW + gap);
                                return (
                                    <g key={s.label}>
                                        <rect x={x} y={y} width={barW} height={h} rx={3} fill={s.color} fillOpacity={0.9}>
                                            <title>{`${label} · ${s.label}: ${v} GB`}</title>
                                        </rect>
                                        <text
                                            x={x + barW / 2}
                                            y={y - 5}
                                            textAnchor="middle"
                                            fontSize={9}
                                            fill="#475569"
                                            fontFamily="JetBrains Mono, monospace"
                                        >
                                            {v >= 100 ? v.toFixed(0) : v}
                                        </text>
                                    </g>
                                );
                            })}
                            <text
                                x={groupCenter}
                                y={y1 + 22}
                                textAnchor="middle"
                                fontSize={11}
                                fill="#334155"
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {series.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                        <span className="text-[11px] text-slate-500">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelFootprintBar;