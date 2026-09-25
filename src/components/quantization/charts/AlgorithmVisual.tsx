import { useId } from 'react';

/**
 * Hand-built SVG diagrams for each quantization algorithm.
 *
 * Every diagram is a self-contained, light-theme SVG (no external charting
 * dependency) that illustrates the *mechanism* of one method:
 *   - llm-int8   → outlier channel decomposition (FP16 + INT8 paths)
 *   - qlora-nf4  → NF4 equal-probability bins + frozen base / LoRA flow
 *   - gptq       → column-wise quantization with Hessian error feedback
 *   - awq        → salient channel weight scaling (equivalent transform)
 *   - fp8        → E4M3/E5M2 bit layouts + dynamic per-token scaling
 *   - nvfp4      → two-level block scaling (FP32 outer / E4M3 inner)
 */

const GRID = '#e2e8f0';
const AXIS = '#64748b';
const INK = '#0f172a';
const TEXT2 = '#334155';
const TEXT3 = '#475569';
const TRACK = '#f1f5f9';
const NEUTRAL = '#cbd5e1';
const BLUE = '#3b82f6';
const EMERALD = '#10b981';
const CYAN = '#06b6d4';
const ROSE = '#f43f5e';

const MONO = 'JetBrains Mono, monospace';

const Arrow = ({ id, color = AXIS }: { id: string; color?: string }) => (
    <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={color} />
        </marker>
    </defs>
);

/* ------------------------------------------------------------------ */
/* 1. LLM.int8() — Outlier channel decomposition                       */
/* ------------------------------------------------------------------ */
const OutlierSplitVisual = () => {
    const arrow = `${useId().replace(/[:]/g, '')}-a`;
    const X0 = 44;
    const X1 = 486;
    const BASE = 200;
    const TOP = 44;
    const yFor = (v: number) => BASE - (v / 8) * (BASE - TOP);
    const mags = [1.1, 0.9, 1.3, 1.0, 1.2, 0.8, 1.1, 0.95, 1.25, 1.05, 0.85, 1.15, 7.4, 1.0, 1.1, 0.9, 1.2, 1.05];
    const slot = (X1 - X0) / mags.length;
    const bw = slot * 0.55;
    const thresh = yFor(6);

    return (
        <svg viewBox="0 0 520 360" className="w-full h-auto" role="img" aria-label="LLM.int8() outlier channel decomposition">
            <Arrow id={arrow} />
            <text x={16} y={22} fontSize={11} fontWeight={700} fill={INK}>Activation channel magnitudes</text>

            <line x1={X0} y1={BASE} x2={X1} y2={BASE} stroke={GRID} strokeWidth={1} />
            <line x1={X0} y1={thresh} x2={X1} y2={thresh} stroke={ROSE} strokeWidth={1} strokeDasharray="4 4" />
            <text x={X0 - 6} y={thresh + 3} textAnchor="end" fontSize={9} fill={ROSE} fontFamily={MONO}>6.0</text>
            <text x={X0 - 6} y={BASE + 3} textAnchor="end" fontSize={9} fill={AXIS} fontFamily={MONO}>0</text>

            {mags.map((m, i) => {
                const x = X0 + i * slot + (slot - bw) / 2;
                const y = yFor(m);
                const outlier = m > 6;
                return (
                    <rect
                        key={i}
                        x={x}
                        y={y}
                        width={bw}
                        height={BASE - y}
                        rx={2}
                        fill={outlier ? ROSE : NEUTRAL}
                    />
                );
            })}
            <text x={X0 + 12 * slot + slot / 2} y={yFor(7.4) - 6} textAnchor="middle" fontSize={9} fill={ROSE} fontFamily={MONO}>
                0.1%
            </text>
            <text x={X0 + 4 * slot} y={yFor(1.3) - 6} textAnchor="middle" fontSize={9} fill={AXIS} fontFamily={MONO}>
                99.9% normal
            </text>

            {/* flow: split into FP16 + INT8, then sum */}
            <rect x={24} y={250} width={70} height={40} rx={8} fill={TRACK} stroke={GRID} />
            <text x={59} y={274} textAnchor="middle" fontSize={11} fill={INK} fontFamily={MONO}>X</text>

            <rect x={200} y={226} width={172} height={42} rx={8} fill="#fff1f2" stroke={ROSE} />
            <text x={286} y={244} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>FP16 GEMM</text>
            <text x={286} y={258} textAnchor="middle" fontSize={9} fill={AXIS}>0.1% outlier channels</text>

            <rect x={200} y={276} width={172} height={42} rx={8} fill="#eff6ff" stroke={BLUE} />
            <text x={286} y={294} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>INT8 GEMM</text>
            <text x={286} y={308} textAnchor="middle" fontSize={9} fill={AXIS}>99.9% normal channels</text>

            <rect x={402} y={250} width={84} height={44} rx={8} fill={TRACK} stroke={GRID} />
            <text x={444} y={276} textAnchor="middle" fontSize={11} fill={INK} fontFamily={MONO}>Σ Y</text>

            <path d="M94 264 L196 250" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M94 278 L196 292" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M372 248 L398 262" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M372 294 L398 280" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
        </svg>
    );
};

/* ------------------------------------------------------------------ */
/* 2. QLoRA & NF4                                                       */
/* ------------------------------------------------------------------ */
const Nf4Visual = () => {
    const arrow = `${useId().replace(/[:]/g, '')}-a`;
    const X0 = 44;
    const X1 = 486;
    const BASE = 172;
    const TOP = 44;
    const xFor = (v: number) => X0 + ((v + 2.8) / 5.6) * (X1 - X0);
    const yFor = (d: number) => BASE - d * (BASE - TOP);
    const curve = Array.from({ length: 57 }, (_, i) => -2.8 + i * 0.1);
    const path = curve
        .map((v, i) => `${i === 0 ? 'M' : 'L'}${xFor(v).toFixed(1)} ${yFor(Math.exp(-(v * v) / 2)).toFixed(1)}`)
        .join(' ');
    const edges = [
        -2.6, -1.534, -1.15, -0.887, -0.674, -0.489, -0.319, -0.157, 0,
        0.157, 0.319, 0.489, 0.674, 0.887, 1.15, 1.534, 2.6,
    ];

    return (
        <svg viewBox="0 0 520 380" className="w-full h-auto" role="img" aria-label="NF4 equal-probability bins and QLoRA architecture">
            <Arrow id={arrow} />
            <text x={16} y={22} fontSize={11} fontWeight={700} fill={INK}>NF4: 16 bins, equal probability mass</text>

            <rect x={xFor(-0.157)} y={yFor(1)} width={xFor(0.157) - xFor(-0.157)} height={BASE - yFor(1)} fill="#dbeafe" opacity={0.7} />
            {edges.map((e) => (
                <line key={e} x1={xFor(e)} y1={BASE} x2={xFor(e)} y2={yFor(Math.exp(-(e * e) / 2))} stroke={GRID} strokeWidth={1} />
            ))}
            <path d={path} fill="none" stroke={BLUE} strokeWidth={2} />
            <line x1={X0} y1={BASE} x2={X1} y2={BASE} stroke={GRID} strokeWidth={1} />
            <text x={X1} y={BASE + 14} textAnchor="end" fontSize={9} fill={AXIS} fontFamily={MONO}>weights ~ N(0, σ²)</text>

            {/* architecture flow */}
            <rect x={20} y={224} width={50} height={92} rx={8} fill={TRACK} stroke={GRID} />
            <text x={45} y={275} textAnchor="middle" fontSize={11} fill={INK} fontFamily={MONO}>X</text>

            <rect x={108} y={224} width={156} height={38} rx={8} fill="#eff6ff" stroke={BLUE} />
            <text x={186} y={241} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>Dequant NF4 → FP16</text>
            <text x={186} y={254} textAnchor="middle" fontSize={8.5} fill={AXIS}>frozen base weights</text>

            <rect x={276} y={224} width={146} height={38} rx={8} fill={TRACK} stroke={GRID} />
            <text x={349} y={241} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>Frozen Base Linear</text>
            <text x={349} y={254} textAnchor="middle" fontSize={8.5} fill={AXIS}>NF4 + double-quant</text>

            <rect x={108} y={278} width={156} height={38} rx={8} fill="#ecfeff" stroke={CYAN} />
            <text x={186} y={301} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>LoRA A · FP16 train</text>

            <rect x={276} y={278} width={146} height={38} rx={8} fill="#ecfeff" stroke={CYAN} />
            <text x={349} y={301} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>LoRA B · FP16 train</text>

            <rect x={438} y={250} width={70} height={44} rx={8} fill={TRACK} stroke={GRID} />
            <text x={473} y={276} textAnchor="middle" fontSize={11} fill={INK} fontFamily={MONO}>Output</text>

            <path d="M70 240 L104 240" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M70 300 L104 300" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M264 243 L272 243" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M264 297 L272 297" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M422 243 L434 262" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <path d="M422 297 L434 281" stroke={AXIS} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />

            <text x={16} y={352} fontSize={9.5} fill={TEXT3} fontFamily={MONO}>
                double-quant −0.37 bpw · paged optimizers · 65B on one 48 GB GPU
            </text>
        </svg>
    );
};

/* ------------------------------------------------------------------ */
/* 3. GPTQ — column-wise error compensation                            */
/* ------------------------------------------------------------------ */
const GptqErrorVisual = () => {
    const arrow = `${useId().replace(/[:]/g, '')}-a`;
    const X0 = 40;
    const CW = 44;
    const GAP = 4;
    const N = 9;
    const CY = 64;
    const CH = 64;
    const cellX = (i: number) => X0 + i * (CW + GAP);
    const lastCenter = cellX(N - 1) + CW / 2;

    return (
        <svg viewBox="0 0 520 264" className="w-full h-auto" role="img" aria-label="GPTQ column-wise quantization with Hessian error compensation">
            <Arrow id={arrow} color={ROSE} />
            <text x={16} y={22} fontSize={11} fontWeight={700} fill={INK}>Column-wise quantization with error feedback</text>

            <text x={cellX(0) + CW / 2} y={52} textAnchor="middle" fontSize={9.5} fill={ROSE} fontFamily={MONO}>① round → INT4</text>

            {Array.from({ length: N }, (_, i) => {
                const first = i === 0;
                return (
                    <g key={i}>
                        <rect
                            x={cellX(i)}
                            y={CY}
                            width={CW}
                            height={CH}
                            rx={6}
                            fill={first ? '#fff1f2' : TRACK}
                            stroke={first ? ROSE : GRID}
                        />
                        <text x={cellX(i) + CW / 2} y={CY + CH / 2 + 4} textAnchor="middle" fontSize={10} fill={first ? ROSE : AXIS} fontFamily={MONO}>
                            {first ? 'wᵢ' : 'W'}
                        </text>
                    </g>
                );
            })}

            <path d={`M${cellX(0) + CW / 2} ${CY + CH + 6} V152 H${lastCenter}`} stroke={ROSE} strokeWidth={1.2} fill="none" />
            <path d={`M${lastCenter} 152 V${CY + CH + 6}`} stroke={ROSE} strokeWidth={1.2} fill="none" markerEnd={`url(#${arrow})`} />
            <text x={(cellX(0) + CW / 2 + lastCenter) / 2} y={170} textAnchor="middle" fontSize={9.5} fill={ROSE} fontFamily={MONO}>
                subtract e · (H⁻¹)ᵢⱼ / (H⁻¹)ᵢᵢ from columns i+1…N
            </text>

            <text x={16} y={198} fontSize={9} fill={AXIS} fontFamily={MONO}>
                H⁻¹ = (2XXᵀ + λI)⁻¹ from calibration data
            </text>

            <rect x={16} y={212} width={148} height={26} rx={6} fill={TRACK} stroke={GRID} />
            <text x={90} y={229} textAnchor="middle" fontSize={9} fill={TEXT2} fontFamily={MONO}>fixed column order</text>
            <rect x={176} y={212} width={168} height={26} rx={6} fill={TRACK} stroke={GRID} />
            <text x={260} y={229} textAnchor="middle" fontSize={9} fill={TEXT2} fontFamily={MONO}>lazy batch updates (128 cols)</text>
            <rect x={356} y={212} width={152} height={26} rx={6} fill="#fff1f2" stroke={ROSE} />
            <text x={432} y={229} textAnchor="middle" fontSize={9} fill={ROSE} fontFamily={MONO}>175B under 4h on 1×A100</text>
        </svg>
    );
};

/* ------------------------------------------------------------------ */
/* 4. AWQ — salient channel scaling                                    */
/* ------------------------------------------------------------------ */
const AwqScaleVisual = () => {
    const arrow = `${useId().replace(/[:]/g, '')}-a`;
    const X0 = 132;
    const X1 = 486;
    const N = 12;
    const slot = (X1 - X0) / N;
    const bw = slot * 0.5;
    const cx = (i: number) => X0 + i * slot + slot / 2;
    const act = [1, 1.1, 0.9, 1.2, 6.5, 1, 1.1, 0.95, 1.05, 1.15, 1, 0.9];
    const wgt = [1, 1, 1.1, 0.95, 1, 1.05, 1, 1.1, 0.9, 1, 1, 0.95];
    const BA = 112;
    const WA = 198;
    const yA = (v: number) => BA - (v / 7) * (BA - 46);
    const yW = (v: number) => WA - (v / 1.5) * (WA - 142);
    const salient = 4;

    return (
        <svg viewBox="0 0 520 272" className="w-full h-auto" role="img" aria-label="AWQ salient channel weight scaling">
            <Arrow id={arrow} color={ROSE} />
            <text x={16} y={20} fontSize={11} fontWeight={700} fill={INK}>Equivalent rescale of the salient channel</text>

            <text x={12} y={82} fontSize={10} fill={TEXT3} fontFamily={MONO}>Activations X</text>
            <line x1={X0} y1={BA} x2={X1} y2={BA} stroke={GRID} strokeWidth={1} />
            {act.map((v, i) => (
                <rect
                    key={i}
                    x={cx(i) - bw / 2}
                    y={yA(v)}
                    width={bw}
                    height={BA - yA(v)}
                    rx={2}
                    fill={i === salient ? ROSE : NEUTRAL}
                />
            ))}
            <rect
                x={cx(salient) - bw / 2}
                y={yA(act[salient] / 3)}
                width={bw}
                height={BA - yA(act[salient] / 3)}
                rx={2}
                fill="none"
                stroke={ROSE}
                strokeDasharray="3 2"
            />
            <text x={cx(salient)} y={40} textAnchor="middle" fontSize={9} fill={ROSE} fontFamily={MONO}>÷ s ↓ salient</text>

            <text x={12} y={170} fontSize={10} fill={TEXT3} fontFamily={MONO}>Weights W</text>
            <line x1={X0} y1={WA} x2={X1} y2={WA} stroke={GRID} strokeWidth={1} />
            {wgt.map((v, i) => (
                <rect
                    key={i}
                    x={cx(i) - bw / 2}
                    y={yW(v)}
                    width={bw}
                    height={WA - yW(v)}
                    rx={2}
                    fill={i === salient ? EMERALD : NEUTRAL}
                />
            ))}
            <rect
                x={cx(salient) - bw / 2}
                y={yW(1.5)}
                width={bw}
                height={WA - yW(1.5)}
                rx={2}
                fill="none"
                stroke={EMERALD}
                strokeDasharray="3 2"
            />
            <text x={cx(salient)} y={134} textAnchor="middle" fontSize={9} fill={EMERALD} fontFamily={MONO}>× s ↑ salient</text>

            <text x={16} y={234} fontSize={9.5} fill={TEXT3} fontFamily={MONO}>
                Y = (X · diag(s)⁻¹) · (diag(s) · W) — an exact identity
            </text>
            <text x={16} y={252} fontSize={9.5} fill={AXIS} fontFamily={MONO}>
                1/s folds into the preceding LayerNorm → runtime is pure INT4, zero overhead
            </text>
        </svg>
    );
};

/* ------------------------------------------------------------------ */
/* 5. Dynamic FP8 — E4M3 / E5M2 + per-token scaling                    */
/* ------------------------------------------------------------------ */
const Fp8DynamicVisual = () => {
    const tokens = [
        [0.9, 0.7, 1.1, 0.8],
        [1.0, 0.6, 0.9, 1.2],
        [7.2, 0.8, 1.1, 0.9],
        [0.8, 1.1, 0.7, 1.0],
        [1.1, 0.9, 1.2, 0.6],
    ];
    const GLOBAL_MAX = 7.2;
    const ROW_H = 24;
    const BAR_W = 16;
    const GAPX = 5;
    const rowY = (j: number) => 124 + j * ROW_H;

    const panel = (
        x0: number,
        title: string,
        color: string,
        scaleOf: (vals: number[]) => number,
        label: (outlier: boolean) => string,
        note: string,
    ) => (
        <>
            <text x={x0} y={112} fontSize={9.5} fontWeight={700} fill={color} fontFamily={MONO}>{title}</text>
            {tokens.map((vals, j) => {
                const base = rowY(j) + 18;
                const s = scaleOf(vals);
                const outlier = Math.max(...vals) > 6;
                return (
                    <g key={j}>
                        <text x={x0} y={base - 4} fontSize={9} fill={AXIS} fontFamily={MONO}>{`t${j + 1}`}</text>
                        <line x1={x0 + 18} y1={base} x2={x0 + 108} y2={base} stroke={GRID} strokeWidth={1} />
                        {vals.map((v, k) => {
                            const h = Math.max(2, (v / s) * 14);
                            return (
                                <rect
                                    key={k}
                                    x={x0 + 22 + k * (BAR_W + GAPX)}
                                    y={base - h}
                                    width={BAR_W}
                                    height={h}
                                    rx={2}
                                    fill={outlier && k === 0 ? ROSE : color}
                                />
                            );
                        })}
                        <text x={x0 + 114} y={base - 4} fontSize={8} fill={outlier ? ROSE : TEXT3} fontFamily={MONO}>
                            {label(outlier)}
                        </text>
                    </g>
                );
            })}
            <text x={x0} y={rowY(tokens.length - 1) + 36} fontSize={8.5} fill={TEXT3} fontFamily={MONO}>{note}</text>
        </>
    );

    return (
        <svg viewBox="0 0 500 300" className="w-full h-auto" role="img" aria-label="FP8 E4M3 vs E5M2 bit layouts and dynamic per-token scaling">
            <text x={16} y={20} fontSize={11} fontWeight={700} fill={INK}>FP8: exponents absorb outliers — rescale per token</text>

            {/* bit layouts */}
            <text x={24} y={42} fontSize={9.5} fontWeight={700} fill={TEXT2}>E4M3 · precision-first</text>
            <rect x={24} y={50} width={18} height={20} rx={3} fill="#eff6ff" stroke={BLUE} />
            <text x={33} y={64} textAnchor="middle" fontSize={8} fill={AXIS} fontFamily={MONO}>S</text>
            <rect x={44} y={50} width={52} height={20} rx={3} fill="#dbeafe" stroke={BLUE} />
            <text x={70} y={64} textAnchor="middle" fontSize={8} fill={TEXT2} fontFamily={MONO}>E × 4</text>
            <rect x={98} y={50} width={34} height={20} rx={3} fill="#eff6ff" stroke={BLUE} />
            <text x={115} y={64} textAnchor="middle" fontSize={8} fill={TEXT2} fontFamily={MONO}>M × 3</text>
            <text x={24} y={84} fontSize={8.5} fill={AXIS} fontFamily={MONO}>±448 · weights, activations, KV cache</text>

            <text x={270} y={42} fontSize={9.5} fontWeight={700} fill={TEXT2}>E5M2 · range-first</text>
            <rect x={270} y={50} width={18} height={20} rx={3} fill="#ecfeff" stroke={CYAN} />
            <text x={279} y={64} textAnchor="middle" fontSize={8} fill={AXIS} fontFamily={MONO}>S</text>
            <rect x={290} y={50} width={60} height={20} rx={3} fill="#cffafe" stroke={CYAN} />
            <text x={320} y={64} textAnchor="middle" fontSize={8} fill={TEXT2} fontFamily={MONO}>E × 5</text>
            <rect x={352} y={50} width={28} height={20} rx={3} fill="#ecfeff" stroke={CYAN} />
            <text x={366} y={64} textAnchor="middle" fontSize={8} fill={TEXT2} fontFamily={MONO}>M × 2</text>
            <text x={270} y={84} fontSize={8.5} fill={AXIS} fontFamily={MONO}>±57,344 · training gradients</text>

            <line x1={16} y1={96} x2={484} y2={96} stroke={GRID} strokeWidth={1} />

            {/* static vs dynamic scaling */}
            {panel(24, 'STATIC — one scale for all', NEUTRAL, () => GLOBAL_MAX, () => 'shared s = 7.2/448', 'set by the outlier → every other token collapses')}
            {panel(264, 'DYNAMIC — scale per token', BLUE, (vals) => Math.max(...vals), (o) => (o ? 's = 7.2/448' : 's ≈ 1.2/448'), 'each row uses the full FP8 range, no clipping')}

            <text x={16} y={282} fontSize={9} fill={TEXT3} fontFamily={MONO}>
                s = |x|ᵐᵃˣ / 448 is recomputed every forward pass — no retraining, no clipping
            </text>
        </svg>
    );
};

/* ------------------------------------------------------------------ */
/* 6. NVFP4 — two-level (dual) block scaling                           */
/* ------------------------------------------------------------------ */
const Nvfp4DualScaleVisual = () => {
    const arrow = `${useId().replace(/[:]/g, '')}-a`;
    const COLS = 4;
    const ROWS = 2;
    const BW = 104;
    const BH = 66;
    const GX = 12;
    const GY = 12;
    const X0 = 40;
    const Y0 = 84;
    const blockX = (c: number) => X0 + c * (BW + GX);
    const blockY = (r: number) => Y0 + r * (BH + GY);
    const dots = Array.from({ length: 16 }, (_, i) => i);

    return (
        <svg viewBox="0 0 520 312" className="w-full h-auto" role="img" aria-label="NVFP4 two-level block scaling with FP32 outer and E4M3 inner scales">
            <Arrow id={arrow} color={EMERALD} />
            <text x={16} y={20} fontSize={11} fontWeight={700} fill={INK}>NVFP4: a scale inside a scale</text>

            {/* outer scale */}
            <rect x={X0} y={34} width={452} height={30} rx={8} fill="#ecfdf5" stroke={EMERALD} />
            <text x={266} y={53} textAnchor="middle" fontSize={9.5} fill={INK} fontFamily={MONO}>
                OUTER · FP32 · one per tensor — prevents global saturation
            </text>
            <path d="M266 66 V80" stroke={EMERALD} strokeWidth={1.4} fill="none" markerEnd={`url(#${arrow})`} />

            {/* blocks */}
            {Array.from({ length: ROWS }, (_, r) =>
                Array.from({ length: COLS }, (_, c) => (
                    <g key={`${r}-${c}`}>
                        <rect x={blockX(c)} y={blockY(r)} width={BW} height={BH} rx={8} fill="#f8fafc" stroke="#a7f3d0" />
                        <text x={blockX(c) + 9} y={blockY(r) + 16} fontSize={8} fill={CYAN} fontFamily={MONO}>E4M3 ×16</text>
                        {dots.map((d) => (
                            <circle
                                key={d}
                                cx={blockX(c) + 14 + (d % 4) * 22}
                                cy={blockY(r) + 30 + Math.floor(d / 4) * 10}
                                r={3.4}
                                fill={EMERALD}
                                opacity={0.8}
                            />
                        ))}
                        <text x={blockX(c) + BW - 8} y={blockY(r) + BH - 6} textAnchor="end" fontSize={7.5} fill={AXIS} fontFamily={MONO}>E2M1</text>
                    </g>
                )),
            )}

            <text x={16} y={252} fontSize={9.5} fill={TEXT3} fontFamily={MONO}>
                Inner E4M3 scale per 16 elements keeps the local range fine-grained
            </text>
            <text x={16} y={272} fontSize={9} fill={TEXT3} fontFamily={MONO}>
                E2M1 values span only −6…+6 · two-level scaling → ≈ 4.5 bpw effective
            </text>
            <text x={16} y={292} fontSize={9} fill={ROSE} fontFamily={MONO}>
                ⚠ Blackwell B100/B200 only — cannot execute on Hopper or Ada
            </text>
        </svg>
    );
};

const VISUALS: Record<string, () => React.ReactElement> = {
    'llm-int8': OutlierSplitVisual,
    'qlora-nf4': Nf4Visual,
    gptq: GptqErrorVisual,
    awq: AwqScaleVisual,
    fp8: Fp8DynamicVisual,
    nvfp4: Nvfp4DualScaleVisual,
};

export const AlgorithmVisual = ({ id }: { id: string }) => {
    const V = VISUALS[id];
    if (!V) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <V />
        </div>
    );
};

export default AlgorithmVisual;