import { useMemo, useState } from 'react';
import { AlertTriangle, Network, Spline } from 'lucide-react';

interface Scenario {
    id: string;
    label: string;
    primary: string;
    secondary: string;
    network: string;
    rationale: string;
    warning: string;
    accent: string;
    border: string;
}

const SCENARIOS: Scenario[] = [
    {
        id: 'dense-node',
        label: 'Dense 70B within one node',
        primary: 'TP8',
        secondary: 'SP',
        network: 'NVLink ≥ 900 GB/s',
        rationale: 'Shards each layer across 8 GPUs; 2 All-Reduce/layer stay inside the fast NVLink domain.',
        warning: 'TP > 8 yields diminishing returns from tiny sub-matrices and kernel-launch overhead.',
        accent: 'text-blue-600',
        border: 'border-blue-200',
    },
    {
        id: 'massive',
        label: 'Massive model (>400B) across nodes',
        primary: 'TP8 intra-node',
        secondary: 'PP across nodes',
        network: 'NVLink intra + InfiniBand inter',
        rationale: 'Layers are partitioned across nodes with cheap P2P activation transfers at stage boundaries.',
        warning: 'PP inflates ITL: idle downstream stages stall decode, so only use it when the model cannot fit under TP8.',
        accent: 'text-purple-600',
        border: 'border-purple-200',
    },
    {
        id: 'moe',
        label: 'MoE (DeepSeek-V3, Mixtral)',
        primary: 'EP',
        secondary: 'TP',
        network: 'NVLink or optimized RoCE',
        rationale: 'Distributes experts across GPUs; tokens route via two All-to-All collectives per MoE layer.',
        warning: 'Popular experts create hotspots — balance dispatch buffers or tail latency spikes.',
        accent: 'text-amber-600',
        border: 'border-amber-200',
    },
    {
        id: 'throughput',
        label: 'High-concurrency throughput',
        primary: 'DP',
        secondary: 'TP (if the model does not fit one GPU)',
        network: 'Standard Ethernet is enough',
        rationale: 'Replica sets serve disjoint request batches with zero inter-GPU communication, scaling QPS linearly.',
        warning: 'DP only helps once the model already fits in memory per replica.',
        accent: 'text-emerald-600',
        border: 'border-emerald-200',
    },
    {
        id: 'longctx',
        label: 'Ultra-long context (128K+)',
        primary: 'SP',
        secondary: 'Ring Attention / EP',
        network: 'NVLink ≥ 900 GB/s',
        rationale: 'Shards the sequence dimension; Reduce-Scatter + All-Gather replace All-Reduce at equal comm cost.',
        warning: 'Beyond single-GPU memory, distribute the sequence across a ring of GPUs — or evict KV with H2O / StreamingLLM.',
        accent: 'text-cyan-600',
        border: 'border-cyan-200',
    },
    {
        id: 'budget',
        label: 'Budget PCIe server',
        primary: 'DP',
        secondary: 'Small PP',
        network: 'PCIe Gen 5 (32 GB/s)',
        rationale: 'PCIe latency (5–10 µs) makes All-Reduce-bound TP strictly worse than replicating the model.',
        warning: 'Never place TP across PCIe — the collective time eclipses the decode GEMM itself.',
        accent: 'text-rose-600',
        border: 'border-rose-200',
    },
];

/**
 * Distributed-parallelism planner. Maps a deployment scenario onto the correct
 * TP / PP / SP / EP / DP placement and the interconnect it demands.
 */
export const ParallelismPlanner = () => {
    const [selected, setSelected] = useState(SCENARIOS[0].id);
    const scenario = useMemo(
        () => SCENARIOS.find((s) => s.id === selected) ?? SCENARIOS[0],
        [selected],
    );

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
                    <Spline size={18} />
                </span>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Parallelism Planner</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Scenario → placement on the interconnect</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-2">
                    {SCENARIOS.map((s) => {
                        const active = s.id === selected;
                        return (
                            <button
                                key={s.id}
                                onClick={() => setSelected(s.id)}
                                aria-pressed={active}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer ${active
                                    ? `bg-slate-50 ${s.border}`
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <span className="font-semibold text-slate-800">{s.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="lg:col-span-6">
                    <div className={`rounded-2xl border ${scenario.border} p-5 h-full flex flex-col`}>
                        <div className="text-[10px] font-mono text-slate-400 mb-2">RECOMMENDED PLACEMENT</div>
                        <div className="flex flex-wrap items-baseline gap-2 mb-3">
                            <span className={`text-2xl font-black font-mono-deck ${scenario.accent}`}>{scenario.primary}</span>
                            <span className="text-[11px] text-slate-500 font-mono">+ {scenario.secondary}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-3">
                            <Network size={13} className="text-slate-400 shrink-0" />
                            <span className="font-mono">{scenario.network}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{scenario.rationale}</p>
                        <div className="mt-auto p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-600 leading-relaxed">{scenario.warning}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParallelismPlanner;