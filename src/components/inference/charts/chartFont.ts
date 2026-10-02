/**
 * Shared SVG monospace stack so hand-built charts render identical type to the
 * CSS `.font-mono-deck` utility (see `--font-mono-deck` in `src/index.css`).
 * Kept in sync manually because SVG `fontFamily` cannot read a CSS variable.
 */
export const CHART_FONT = 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace';