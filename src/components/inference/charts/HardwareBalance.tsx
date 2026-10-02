import { BALANCE_CHART } from '../../../data/inferenceData';
import { CHART_FONT } from './chartFont';

/**
 * Grouped bar chart contrasting HBM bandwidth growth against the falling
 * machine-balance (ridge) point across Hopper → Blackwell.
 */
export const HardwareBalance = () => {
    const { labels, series } = BALANCE_CHART;

    const W = 700;
    const H = 300;
    const m = { left: 64, right: 24, top: 28, bottom: 56 };
    const plotW = W - m.left - m.right;
    const plotH = H - m.top - m.bottom;
    const x0 = m.left;
    const y1 = m.top + plotH;

    const MAX = 9;
    const yFor = (v: number) => y1 - (v / MAX) * plotH;

    const groupW = plotW / labels.length;
    const barW = 30;
    const gap = 6;
    const seriesW = series.length * barW + (series.length - 1) * gap;

    return (
        <div className="w-full">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Bandwidth versus machine balance by GPU">
                {[0, 2, 4, 6, 8].map((t) => {
                    const y = yFor(t);
                    return (
                        <g key={t}>
                            <line x1={x0} y1={y} x2={x0 + plotW} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                            <text x={x0 - 10} y={y + 3} textAnchor="end" fontSize={9} fill="#64748b" fontFamily={CHART_FONT}>
                                {t}
                            </text>
                        </g>
                    );
                })}

                {labels.map((label, gi) => {
                    const center = x0 + gi * groupW + groupW / 2;
                    const gx = center - seriesW / 2;
                    return (
                        <g key={label}>
                            {series.map((s, si) => {
                                const x = gx + si * (barW + gap);
                                const raw = s.data[gi];
                                if (raw == null) {
                                    return (
                                        <text key={s.label} x={x + barW / 2} y={y1 - 6} textAnchor="middle" fontSize={8} fill="#94a3b8" fontFamily={CHART_FONT}>
                                            N/A
                                        </text>
                                    );
                                }
                                const y = yFor(raw);
                                const h = Math.max(y1 - y, 1.5);
                                return (
                                    <g key={s.label}>
                                        <rect x={x} y={y} width={barW} height={h} rx={3} fill={s.color} fillOpacity={0.9}>
                                            <title>{`${label} · ${s.label}: ${raw}`}</title>
                                        </rect>
                                        {raw > 0 && (
                                            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={9} fill="#475569" fontFamily={CHART_FONT}>
                                                {raw}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                            <text x={center} y={y1 + 20} textAnchor="middle" fontSize={11} fill="#334155" fontFamily={CHART_FONT}>
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {series.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                        <span className="text-[11px] text-slate-500">{s.label}</span>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-500">
                H200 adds ~43% decode throughput at equal compute; B200 doubles bandwidth again to 8.0 TB/s.
                B200's compute (and therefore its ridge) is not stated in the sources, so its ridge bar is omitted.
            </p>
        </div>
    );
};

export default HardwareBalance;