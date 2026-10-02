import { useMemo, useState } from 'react';
import { Blocks, Layers, Share2 } from 'lucide-react';

type Mode = 'paged' | 'radix' | 'mla';

const BLOCK_COUNT = 24;
const BLOCKS_PER_SEQ = 3;

interface SeqSpec {
    id: string;
    label: string;
    blocks: number;
    color: string;
    prefix?: boolean;
}

const SEQS: SeqSpec[] = [
    { id: 's1', label: 'System prompt + Q1', blocks: BLOCKS_PER_SEQ, color: '#3b82f6', prefix: true },
    { id: 's2', label: 'System prompt + Q2', blocks: BLOCKS_PER_SEQ, color: '#10b981', prefix: true },
    { id: 's3', label: 'System prompt + Q3', blocks: BLOCKS_PER_SEQ, color: '#a855f7', prefix: true },
    { id: 's4', label: 'Independent request', blocks: BLOCKS_PER_SEQ, color: '#f59e0b' },
];

/**
 * KV cache memory lab. Demonstrates three state-management strategies:
 *  - Paged: on-demand block allocation nearly eliminates fragmentation.
 *  - Radix: shared prefix blocks are referenced once across requests.
 *  - MLA: the whole cache is compressed into a latent vector.
 */
export const KvMemoryLab = () => {
    const [mode, setMode] = useState<Mode>('paged');

    const { allocation, usedBlocks, slackPct } = useMemo(() => {
        const alloc: (string | null)[] = new Array(BLOCK_COUNT).fill(null);

        if (mode === 'radix') {
            // Shared prefix occupies 1 block (slot 0), each seq adds 2 unique blocks.
            alloc[0] = '#6366f1';
            let cursor = 1;
            SEQS.forEach((s) => {
                for (let i = 0; i < 2 && cursor < BLOCK_COUNT; i += 1) {
                    alloc[cursor] = s.color;
                    cursor += 1;
                }
            });
            return { allocation: alloc, usedBlocks: cursor, slackPct: 0 };
        }

        // Paged / MLA: contiguous-per-sequence on-demand allocation.
        let cursor = 0;
        SEQS.forEach((s) => {
            const size = mode === 'mla' ? 1 : s.blocks;
            for (let i = 0; i < size && cursor < BLOCK_COUNT; i += 1) {
                alloc[cursor] = s.color;
                cursor += 1;
            }
        });
        // On-demand paging leaves only minor *internal* slack (~4% per block); the
        // 60–80% waste the copy describes belongs to static contiguous allocation.
        // MLA compresses each sequence into a single block, so it has none.
        const slack = mode === 'mla' ? 0 : 4;
        return { allocation: alloc, usedBlocks: cursor, slackPct: slack };
    }, [mode]);

    const modes: { id: Mode; label: string; icon: typeof Blocks; desc: string }[] = [
        { id: 'paged', label: 'PagedAttention', icon: Blocks, desc: 'Fixed-size blocks + block table' },
        { id: 'radix', label: 'RadixAttention', icon: Share2, desc: 'Shared prefixes referenced once' },
        { id: 'mla', label: 'MLA', icon: Layers, desc: 'Low-rank latent compression' },
    ];

    const utilization = ((usedBlocks / BLOCK_COUNT) * 100).toFixed(0);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">KV Cache Memory Lab</h3>
                    <p className="text-[11px] text-slate-500">Watch fragmentation disappear and prefixes get shared.</p>
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
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                                    }`}
                                title={m.desc}
                            >
                                <Icon size={13} />
                                {m.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Physical memory grid */}
            <div className="grid grid-cols-8 gap-1.5 mb-4">
                {allocation.map((color, i) => (
                    <div
                        key={i}
                        className={`aspect-square rounded-md border flex items-center justify-center text-[9px] font-mono transition ${color ? 'border-transparent text-white' : 'bg-slate-50 border-dashed border-slate-200 text-slate-400'
                            }`}
                        style={color ? { backgroundColor: color, opacity: 0.85 } : undefined}
                        title={color ? `Block ${i}` : `Block ${i} · free`}
                    >
                        {i}
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
                {SEQS.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                        <span className="text-[11px] text-slate-500">
                            {mode === 'radix' && s.prefix ? `${s.label} (shared prefix)` : s.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">BLOCKS USED</div>
                    <div className="text-slate-900 font-mono font-bold">{usedBlocks} / {BLOCK_COUNT}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">UTILIZATION</div>
                    <div className="text-emerald-600 font-mono font-bold">{utilization}%</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-mono mb-1">INTERNAL SLACK</div>
                    <div className={`font-mono font-bold ${slackPct ? 'text-rose-600' : 'text-emerald-600'}`}>
                        ~{slackPct}%
                    </div>
                </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                {mode === 'paged' &&
                    'Static contiguous allocation wastes 60–80% of VRAM on unused slack. Fixed-size blocks allocated on demand lift utilization to ~96% and unlock 2–4× larger batches.'}
                {mode === 'radix' &&
                    'RadixAttention stores shared prefixes once in a radix tree with LRU eviction and reference counting. A cache hit skips prefill entirely, so agentic/RAG traffic stops paying for the same system prompt repeatedly.'}
                {mode === 'mla' &&
                    'MLA projects Keys and Values into a single shared latent vector (512 dims + 64 RoPE dims). The up-projection matrices are absorbed into Q/O weights, shrinking the cache by >90% with negligible quality loss.'}
            </p>
        </div>
    );
};

export default KvMemoryLab;