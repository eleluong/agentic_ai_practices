import { KERNEL_THROUGHPUT } from '../../../data/inferenceData';
import { CHART_FONT } from './chartFont';

/**
 * Horizontal bar chart comparing attention kernel headline throughput
 * relative to vanilla attention (illustrative). Hand-built SVG.
 */
export const KernelThroughput = () => {
    const { labels, data, colors } = KERNEL_THROUGHPUT;
    const max = Math.max(...data);

    const W = 660;
    const rowH = 46;
    const top = 18;
    const left = 130;
    const right = 70;
    const barMaxW = W - left - right;
    const H = top + labels.length * rowH + 8;

    return (
        <div className="w-full">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Attention kernel relative throughput">
                {labels.map((label, i) => {
                    const y = top + i * rowH;
                    const bw = Math.max((data[i] / max) * barMaxW, 3);
                    return (
                        <g key={label}>
                            <text x={left - 14} y={y + 21} textAnchor="end" fontSize={11} fill="#334155" fontFamily={CHART_FONT}>
                                {label}
                            </text>
                            <rect x={left} y={y + 6} width={barMaxW} height={20} rx={5} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={1} />
                            <rect x={left} y={y + 6} width={bw} height={20} rx={5} fill={colors[i]} fillOpacity={0.9}>
                                <title>{`${label}: ${data[i]}× vanilla`}</title>
                            </rect>
                            <text x={left + bw + 10} y={y + 21} fontSize={11} fill="#0f172a" fontFamily={CHART_FONT} fontWeight={700}>
                                {data[i].toFixed(1)}×
                            </text>
                        </g>
                    );
                })}
            </svg>
            <p className="mt-2 text-center text-[11px] text-slate-500">
                Relative attention throughput, normalised to vanilla attention = 1.0× (illustrative).
            </p>
        </div>
    );
};

export default KernelThroughput;