import { GPTQ_AWQ_CHART } from '../../../data/quantizationData';

/**
 * Paired comparison of GPTQ vs AWQ on calibration time (minutes) and
 * serving kernel latency (ms). Values live on different scales, so each
 * dimension is normalised independently and annotated with the raw value.
 * Hand-built SVG.
 */
export const GptqAwqBars = () => {
    const { labels, series } = GPTQ_AWQ_CHART;

    const W = 620;
    const H = 300;
    const m = { left: 24, right: 24, top: 34, bottom: 54 };
    const plotW = W - m.left - m.right;
    const plotH = H - m.top - m.bottom;
    const y1 = m.top + plotH;

    const maxima = labels.map((_, di) => Math.max(...series.map((s) => s.data[di])));

    const dimW = plotW / labels.length;
    const barW = 58;
    const gap = 26;
    const groupW = series.length * barW + (series.length - 1) * gap;

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-auto"
                role="img"
                aria-label="GPTQ versus AWQ calibration time and kernel latency"
            >
                {labels.map((label, di) => {
                    const center = m.left + di * dimW + dimW / 2;
                    const gx = center - groupW / 2;
                    const max = maxima[di] || 1;
                    return (
                        <g key={label}>
                            <line x1={m.left + di * dimW} y1={m.top} x2={m.left + di * dimW} y2={y1} stroke="#e2e8f0" strokeWidth={1} />
                            {series.map((s, si) => {
                                const v = s.data[di];
                                const h = Math.max((v / max) * plotH, 2);
                                const x = gx + si * (barW + gap);
                                const y = y1 - h;
                                const win = si === 1; // AWQ is the winner for both dimensions
                                return (
                                    <g key={s.label}>
                                        <rect x={x} y={y} width={barW} height={h} rx={4} fill={s.color} fillOpacity={0.9}>
                                            <title>{`${s.label} · ${label}: ${v}`}</title>
                                        </rect>
                                        <text
                                            x={x + barW / 2}
                                            y={y - 6}
                                            textAnchor="middle"
                                            fontSize={11}
                                            fill={win ? '#059669' : '#475569'}
                                            fontFamily="JetBrains Mono, monospace"
                                            fontWeight={win ? 700 : 500}
                                        >
                                            {v}
                                        </text>
                                        <text x={x + barW / 2} y={y1 + 18} textAnchor="middle" fontSize={10} fill="#64748b">
                                            {s.label}
                                        </text>
                                    </g>
                                );
                            })}
                            <text x={center} y={y1 + 40} textAnchor="middle" fontSize={10.5} fill="#334155">
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {series.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                        <span className="text-[11px] text-slate-500">{s.label}</span>
                    </div>
                ))}
                <span className="text-[11px] text-emerald-600 font-medium">Lower is better in both dimensions</span>
            </div>
        </div>
    );
};

export default GptqAwqBars;