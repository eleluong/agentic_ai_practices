import { THROUGHPUT_CHART } from '../../../data/quantizationData';

/**
 * Horizontal normalised throughput bars comparing BF16, FP8, NVFP4 and
 * OCP MXFP4 effective compute rates (BF16 = 1.0×). Hand-built SVG.
 */
export const FormatThroughput = () => {
    const { labels, data, colors } = THROUGHPUT_CHART;
    const max = Math.max(...data);

    const W = 660;
    const rowH = 46;
    const top = 18;
    const left = 170;
    const right = 70;
    const barMaxW = W - left - right;
    const H = top + labels.length * rowH + 8;

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-auto"
                role="img"
                aria-label="Normalised compute throughput by numeric format"
            >
                {labels.map((label, i) => {
                    const y = top + i * rowH;
                    const bw = Math.max((data[i] / max) * barMaxW, 3);
                    return (
                        <g key={label}>
                            <text
                                x={left - 14}
                                y={y + 21}
                                textAnchor="end"
                                fontSize={11}
                                fill="#334155"
                            >
                                {label}
                            </text>
                            <rect x={left} y={y + 6} width={barMaxW} height={20} rx={5} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={1} />
                            <rect x={left} y={y + 6} width={bw} height={20} rx={5} fill={colors[i]} fillOpacity={0.9}>
                                <title>{`${label}: ${data[i]}× BF16`}</title>
                            </rect>
                            <text
                                x={left + bw + 10}
                                y={y + 21}
                                fontSize={11}
                                fill="#0f172a"
                                fontFamily="JetBrains Mono, monospace"
                                fontWeight={700}
                            >
                                {data[i].toFixed(1)}×
                            </text>
                        </g>
                    );
                })}
            </svg>
            <p className="mt-2 text-center text-[11px] text-slate-500">
                Relative dense compute throughput, normalised to BF16 = 1.0× (illustrative vendor figures).
            </p>
        </div>
    );
};

export default FormatThroughput;