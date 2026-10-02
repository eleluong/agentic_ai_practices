import { useState } from 'react';
import { Boxes, Cpu, Network, Split } from 'lucide-react';

type Mode = 'colocated' | 'chunked' | 'disagg' | 'render';

interface Bar {
    label: string;
    height: number;
    color: string;
}

/**
 * Latency-smoothing demo. Compares co-located prefill/decode jitter against
 * chunked prefill and full prefill-decode disaggregation.
 */
export const DisaggregationFlow = () => {
    const [mode, setMode] = useState<Mode>('colocated');

    const bars: Bar[] = (() => {
        if (mode === 'colocated') {
            return [
                { label: 'D', height: 18, color: '#94a3b8' },
                { label: 'D', height: 18, color: '#94a3b8' },
                { label: 'P', height: 90, color: '#f43f5e' },
                { label: 'D', height: 18, color: '#94a3b8' },
                { label: 'D', height: 18, color: '#94a3b8' },
                { label: 'P', height: 90, color: '#f43f5e' },
                { label: 'D', height: 18, color: '#94a3b8' },
            ];
        }
        if (mode === 'chunked') {
            return [
                { label: 'D', height: 22, color: '#94a3b8' },
                { label: 'c', height: 34, color: '#f59e0b' },
                { label: 'D', height: 22, color: '#94a3b8' },
                { label: 'c', height: 34, color: '#f59e0b' },
                { label: 'D', height: 22, color: '#94a3b8' },
                { label: 'c', height: 34, color: '#f59e0b' },
                { label: 'D', height: 22, color: '#94a3b8' },
            ];
        }
        if (mode === 'disagg') {
            // Prefill runs on a separate pool: decode stays flat (D) while the
            // prefill spike (P) is absorbed off the decode GPU entirely.
            return [
                { label: 'D', height: 24, color: '#10b981' },
                { label: 'D', height: 24, color: '#10b981' },
                { label: 'P', height: 80, color: '#3b82f6' },
                { label: 'D', height: 24, color: '#10b981' },
                { label: 'D', height: 24, color: '#10b981' },
                { label: 'P', height: 80, color: '#3b82f6' },
                { label: 'D', height: 24, color: '#10b981' },
            ];
        }
        // render mode — engine is pure token→token, CPU render/derender shown as R
        return [
            { label: 'R', height: 14, color: '#a855f7' },
            { label: 'D', height: 22, color: '#10b981' },
            { label: 'D', height: 22, color: '#10b981' },
            { label: 'R', height: 14, color: '#a855f7' },
            { label: 'D', height: 22, color: '#10b981' },
            { label: 'D', height: 22, color: '#10b981' },
            { label: 'R', height: 14, color: '#a855f7' },
        ];
    })();

    const maxH = 100;

    const modes: { id: Mode; label: string; icon: typeof Boxes }[] = [
        { id: 'colocated', label: 'Co-located', icon: Boxes },
        { id: 'chunked', label: 'Chunked Prefill', icon: Split },
        { id: 'disagg', label: 'P/D Disaggregated', icon: Network },
        { id: 'render', label: 'Render Tier', icon: Cpu },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Latency Smoothing Under Mixed Load</h3>
                    <p className="text-[11px] text-slate-500 font-mono">P = prefill spike · c = chunk · D = decode step</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {modes.map((m) => {
                        const Icon = m.icon;
                        const active = mode === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                aria-pressed={active}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1.5 cursor-pointer ${active
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                                    }`}
                            >
                                <Icon size={13} />
                                {m.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-40 px-2 bg-slate-50 border border-slate-100 rounded-xl">
                {bars.map((b, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                            className="w-full rounded-t-md transition-all duration-500"
                            style={{ height: `${(b.height / maxH) * 100}%`, backgroundColor: b.color, opacity: 0.9 }}
                            role="img"
                            aria-label={`${b.label} · ${b.height}%`}
                            title={`${b.label} · ${b.height}%`}
                        />
                        <span className="text-[9px] font-mono text-slate-400 mt-1">{b.label}</span>
                    </div>
                ))}
            </div>

            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                {mode === 'colocated' &&
                    'A large incoming prefill stalls every ongoing decode on the shared GPU, producing severe token jitter and p99 latency spikes.'}
                {mode === 'chunked' &&
                    'Sarathi-style chunked prefill splits the prompt into ~2048-token blocks and interleaves them with decode, smoothing the spikes locally without extra hardware.'}
                {mode === 'disagg' &&
                    'Prefill and decode run on physically separate GPU pools. The KV cache streams over NVLink/RDMA. TTFT and ITL are now independently tunable — 2.4× goodput on MI300X vs collocated (vLLM Sep 2026).'}
                {mode === 'render' &&
                    'GPU-less Render Tier: /render (CPU) tokenizes the request · /inference/v1/generate (GPU) runs pure token→token · /derender (CPU) parses response. R = render/derender step on CPU; D = decode on GPU.'}
            </p>
        </div>
    );
};

export default DisaggregationFlow;