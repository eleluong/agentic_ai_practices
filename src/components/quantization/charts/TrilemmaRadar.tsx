import { TRILEMMA_RADAR } from '../../../data/quantizationData';

/**
 * Radar / spider chart plotting five dimensions of the quantization
 * trilemma for AWQ, FP8, NVFP4 and the BF16 baseline. Hand-built SVG.
 */
export const TrilemmaRadar = () => {
    const { axes, series } = TRILEMMA_RADAR;

    const W = 560;
    const H = 470;
    const cx = 280;
    const cy = 200;
    const R = 140;
    const n = axes.length;

    const point = (i: number, radius: number) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const;
    };

    const ringPoints = (frac: number) =>
        axes.map((_, i) => point(i, frac * R).join(',')).join(' ');

    const seriesPoints = (data: number[]) =>
        data
            .map((v, i) => point(i, (Math.max(0, Math.min(100, v)) / 100) * R).join(','))
            .join(' ');

    const rings = [0.25, 0.5, 0.75, 1];

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-auto"
                role="img"
                aria-label="Quantization trilemma radar across five dimensions"
            >
                {/* rings */}
                {rings.map((f) => (
                    <polygon
                        key={f}
                        points={ringPoints(f)}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth={1}
                    />
                ))}

                {/* spokes + axis labels */}
                {axes.map((axis, i) => {
                    const [ex, ey] = point(i, R);
                    const [lx, ly] = point(i, R + 24);
                    const anchor = lx > cx + 6 ? 'start' : lx < cx - 6 ? 'end' : 'middle';
                    return (
                        <g key={axis}>
                            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#e2e8f0" strokeWidth={1} />
                            <text x={lx} y={ly + 3} textAnchor={anchor} fontSize={9.5} fill="#64748b">
                                {axis}
                            </text>
                        </g>
                    );
                })}

                {/* series */}
                {series.map((s) => (
                    <polygon
                        key={s.label}
                        points={seriesPoints(s.data)}
                        fill={s.color}
                        fillOpacity={s.dashed ? 0.05 : 0.14}
                        stroke={s.color}
                        strokeWidth={s.dashed ? 1.5 : 2}
                        strokeDasharray={s.dashed ? '5 4' : undefined}
                    >
                        <title>{`${s.label}`}</title>
                    </polygon>
                ))}

                {/* vertices for solid series */}
                {series
                    .filter((s) => !s.dashed)
                    .map((s) =>
                        s.data.map((v, i) => {
                            const [px, py] = point(i, (Math.max(0, Math.min(100, v)) / 100) * R);
                            return (
                                <circle key={`${s.label}-${i}`} cx={px} cy={py} r={2.6} fill={s.color}>
                                    <title>{`${s.label} · ${axes[i]}: ${v}`}</title>
                                </circle>
                            );
                        }),
                    )}
            </svg>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {series.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span
                            className="inline-block h-2.5 w-4 rounded-sm"
                            style={{
                                backgroundColor: s.dashed ? 'transparent' : s.color,
                                border: s.dashed ? `1.5px dashed ${s.color}` : 'none',
                            }}
                        />
                        <span className="text-[11px] text-slate-500">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrilemmaRadar;