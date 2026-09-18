import {
    Bug,
    Crosshair,
    Radar,
    AlertTriangle,
    Activity,
    Braces,
    Unplug,
    Repeat,
    Timer,
    Database,
    Workflow,
    Network,
    FlaskConical,
    GitMerge,
    RotateCcw,
    Play,
    Check,
    MessageSquare,
    Eye,
    ShieldCheck,
    Layers,
    Lock,
    Gauge,
    Zap,
    FileCheck,
    ScrollText,
    Siren,
    ArrowRight,
    LoaderCircle,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

/* ------------------------------------------------------------------ */
/*  Failure mode catalogue (category -> modes)                          */
/* ------------------------------------------------------------------ */

type FailureCategory = 'technical' | 'cognitive' | 'coordination';

interface FailureMode {
    icon: ComponentType<{ className?: string }>;
    title: string;
    desc: string;
    signal: string;
}

const FAILURE_CATALOG: Record<FailureCategory, {
    label: string;
    color: string;
    dot: string;
    icon: ComponentType<{ className?: string }>;
    modes: FailureMode[];
}> = {
    technical: {
        label: '1. Technical & Interface Faults',
        color: 'text-rose-600',
        dot: 'bg-rose-500',
        icon: Braces,
        modes: [
            {
                icon: Braces,
                title: 'API Misuse & Parameter Mismatch',
                desc: 'Violating the tool’s technical contract: unsupported endpoints, wrong data types, or null values sent instead of the expected structured schema.',
                signal: '400/422 errors · schema validation failure logs',
            },
            {
                icon: Activity,
                title: 'Silent Tool Failure',
                desc: 'The external tool returns an HTTP error or empty string ("") but the Agent ignores it and keeps reasoning on hallucinated data.',
                signal: 'Tool returns "" and the next step still references its output',
            },
            {
                icon: Unplug,
                title: 'Auth & Connection Failures',
                desc: 'Static configuration faults: wrong base URL, expired API keys, missing VPC access, hardware devices, or network sandbox restrictions.',
                signal: '401/403 · TLS + connection timeouts · stale credentials',
            },
        ],
    },
    cognitive: {
        label: '2. Cognitive & Reasoning Faults',
        color: 'text-amber-600',
        dot: 'bg-amber-500',
        icon: Eye,
        modes: [
            {
                icon: Repeat,
                title: 'Looping Planner Syndrome',
                desc: 'The Agent repeats the same sequence of actions without progress because it fails to update internal state from environment feedback.',
                signal: 'Identical tool calls with identical parameters across 3+ steps',
            },
            {
                icon: Timer,
                title: 'Over-Thinking Burnout',
                desc: 'The Agent falls into an infinite reasoning loop, burning hundreds of thousands of tokens and pushing latency up without a final decision.',
                signal: 'Token usage spikes · p95 latency >> budget · no terminal action',
            },
            {
                icon: Database,
                title: 'Memory Poisoning',
                desc: 'Wrong or hallucinated data is written directly into Long-Term Memory (vector DB, memory store), contaminating all future retrieval sessions.',
                signal: 'Retrieved context deteriorates over time · repeated same errors',
            },
        ],
    },
    coordination: {
        label: '3. Multi-Agent Coordination Faults',
        color: 'text-blue-600',
        dot: 'bg-blue-500',
        icon: Network,
        modes: [
            {
                icon: MessageSquare,
                title: 'Context Loss in Transitions',
                desc: 'Critical information is lost or over-summarized during handoffs between Agents, turning high-quality input into low-quality output.',
                signal: 'Quality drops sharply after each agent handoff boundary',
            },
            {
                icon: Workflow,
                title: 'Circular Dependencies',
                desc: 'Agent A delegates to Agent B, and B delegates back to A during reasoning, exhausting compute resources and the token budget.',
                signal: 'Infinite delegation graph · resource exhaustion · budget caps hit',
            },
            {
                icon: Siren,
                title: 'Cascading Quality Degradation',
                desc: 'A small error from an upstream Agent gets amplified cumulatively through each downstream Agent until the final result is completely degraded.',
                signal: 'Error grows monotonically along the execution chain',
            },
        ],
    },
};

/* ------------------------------------------------------------------ */
/*  Debug trace script (divergence-point simulation)                    */
/* ------------------------------------------------------------------ */

type TraceTone = 'ok' | 'warn' | 'err' | 'dim';

const TRACE_SCRIPT: { text: string; tone: TraceTone }[] = [
    { text: '[plan] Compose user query: "Top emerging AI governance frameworks 2026"', tone: 'dim' },
    { text: '[step 1/5] Planner decided: Web Search → Synthesize → Cite', tone: 'ok' },
    { text: '[act] tool_call: search(query="AI governance frameworks 2026")', tone: 'ok' },
    { text: '[observe] ✅ Valid result: 42 sources returned · 0 errors', tone: 'ok' },
    { text: '[step 3/5] Synthesizer drafting from grounded context…', tone: 'dim' },
    { text: '[act] tool_call: search(query="AI governace frmaeworks 2026")   ← typo', tone: 'warn' },
    { text: '[observe] ⚠️ Empty result set returned ("")', tone: 'err' },
    { text: '[decide] Model silently ignored empty observation ❌', tone: 'err' },
    { text: '[reason] Continuing with hallucinated citation data…', tone: 'err' },
    { text: '[localize] Divergence point detected at step 3 (tool_call #2)', tone: 'ok' },
    { text: '[rollout] Rewind to checkpoint C2 → retry with schema-valid query', tone: 'ok' },
    { text: '[resume] ✅ Valid result → grounded synthesis → clean output', tone: 'ok' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Agentic AI System Engineering & Debugging Guide.
 * Mirrors references_doc/agentic_debug/README.md as an interactive page:
 * probabilistic reliability, failure modes, observability, methodologies.
 */
export const AgenticDebug = () => {
    const { lang } = useLanguage();
    const t = translations[lang];

    /* ---- Reliability calculator state ---- */
    const [p, setP] = useState(0.9);
    const [k, setK] = useState(5);
    const successRate = Math.pow(p, k) * 100;

    /* ---- Failure mode explorer state ---- */
    const [category, setCategory] = useState<FailureCategory>('technical');

    /* ---- Debug trace simulator state ---- */
    const [traceRunning, setTraceRunning] = useState(false);
    const [traceLogs, setTraceLogs] = useState<{ text: string; tone: TraceTone }[]>([]);
    const traceTimersRef = useRef<number[]>([]);
    const traceConsoleRef = useRef<HTMLDivElement>(null);

    /* ---- FSM vs autonomous visualizer ---- */
    const [fsmMode, setFsmMode] = useState<'autonomous' | 'fsm'>('autonomous');

    /* ---- Observability active tool ---- */
    const [obsTool, setObsTool] = useState<'mlflow' | 'langfuse' | 'langsmith'>('mlflow');

    const scrollToAnchor = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const runTrace = () => {
        traceTimersRef.current.forEach(clearTimeout);
        traceTimersRef.current = [];
        setTraceRunning(true);
        setTraceLogs([]);

        const timers: number[] = [];
        let delay = 300;
        TRACE_SCRIPT.forEach((line, i) => {
            const timer = window.setTimeout(() => {
                setTraceLogs((prev) => [...prev, line]);
            }, delay);
            timers.push(timer);
            delay += i >= 5 && i <= 8 ? 750 : 450;
        });

        const finish = window.setTimeout(() => {
            setTraceRunning(false);
        }, delay + 200);
        timers.push(finish);
        traceTimersRef.current = timers;
    };

    const resetTrace = () => {
        traceTimersRef.current.forEach(clearTimeout);
        traceTimersRef.current = [];
        setTraceRunning(false);
        setTraceLogs([]);
    };

    useEffect(() => {
        if (traceConsoleRef.current) {
            traceConsoleRef.current.scrollTop = traceConsoleRef.current.scrollHeight;
        }
    }, [traceLogs]);

    useEffect(() => {
        return () => {
            traceTimersRef.current.forEach(clearTimeout);
        };
    }, []);

    const currentCategory = FAILURE_CATALOG[category];

    const obsTools = {
        mlflow: {
            platform: 'MLflow',
            strength: 'Unified Platform',
            feature: 'One-line autolog supports 50+ frameworks; auto-mirrors traces from Langfuse.',
            note: 'Framework-agnostic Python SDK — centralized monitoring without breaking existing observability infrastructure.',
            gradient: 'from-emerald-500 to-teal-500',
        },
        langfuse: {
            platform: 'Langfuse',
            strength: 'Self-Hosting & Privacy',
            feature: 'Default open-source choice for security-sensitive data; deep step-level tracing at optimal cost.',
            note: 'Detailed per-token UI, latency breakdown, and a trace visualizer.',
            gradient: 'from-amber-500 to-orange-500',
        },
        langsmith: {
            platform: 'LangSmith',
            strength: 'Fidelity & Scaling',
            feature: 'Insights clusters traces into failure categories using automatic LLM analysis.',
            note: 'Complete ecosystem with LangChain/LangGraph; dataset curation directly from production traces.',
            gradient: 'from-blue-500 to-indigo-500',
        },
    } as const;

    const ObsIcon = obsTool === 'mlflow' ? Gauge : obsTool === 'langfuse' ? Eye : Radar;

    const patternList = [
        { n: '01', title: 'Divide & Conquer', desc: 'Hierarchical Task Forests decompose a large, multi-dimensional query into independent parallel branches — eliminating context-window saturation.', color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { n: '02', title: 'Enrichment, Not Replacement', desc: 'Freeze verified state and apply only Delta Updates from new context — preserving 100% of validated data and slashing latency & token consumption.', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
        { n: '03', title: 'Reflection Loop', desc: 'Separate a Generator from a strict-rubric Critic; cap loops at 3–5 iterations to eliminate Over-Thinking Burnout.', color: 'bg-amber-50 text-amber-600 border-amber-100' },
        { n: '04', title: 'Branch → Resolve → Merge', desc: 'Fork uncertain sub-tasks into sandboxed sub-agent branches; merge only verified fixes — blocking Memory Poisoning.', color: 'bg-purple-50 text-purple-600 border-purple-100' },
        { n: '05', title: 'Autonomous → Deterministic', desc: 'Anchor probabilistic flows into deterministric FSM gates: code logic owns state transitions; the LLM executes inside nodes.', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    ];

    const methods = [
        {
            icon: RotateCcw,
            title: 'Time-Travel Debugging',
            en: 'Agent Rollout · State Rollback',
            desc: 'Rewind a failed run to a specific span or checkpoint. Tweak the prompt, update a tool description, or swap the model, then roll out a new execution from that point — test a patch instantly without re-running from scratch.',
        },
        {
            icon: Network,
            title: 'Interaction Graph Analysis',
            en: 'Graph Theory',
            desc: 'Visualize agent interactions as a directed graph. Use graph algorithms to detect cycles, bottlenecks, and isolated subgraphs (deadlocks / orphaned branches).',
        },
        {
            icon: ScrollText,
            title: 'Manual Transcript Review',
            en: 'Quality Audit',
            desc: 'Systematically review conversation and reasoning transcripts to distinguish model-capability failures from ambiguous evaluation harnesses or task specifications.',
        },
        {
            icon: FlaskConical,
            title: 'Simulation for Reproduction',
            en: 'Sandbox Replay',
            desc: 'Extract real failure scenarios into normalized templates. Replay the exact event sequence in an isolated, controlled sandbox to support regression testing.',
        },
    ];

    const governance = [
        {
            icon: Gauge,
            title: '1. Resource Config',
            items: [
                { label: 'Max Tokens Bound', desc: 'Fixed context-window ceiling and per-call output limits to stop endless token loops.' },
                { label: 'Financial Caps', desc: 'Hard dollar limits per task/session with automatic fallback or halt when thresholds are exceeded.' },
            ],
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 border-emerald-100',
        },
        {
            icon: ShieldCheck,
            title: '2. Active Guardrails',
            items: [
                { label: 'Hard Stops & Rate Limits', desc: 'Auto-disconnect when API/tool call frequency exceeds safe bounds or hazardous behavior signals appear.' },
                { label: 'Authority Manifolds', desc: 'Time- and context-bound privileges. Never grant permanent or unrestricted admin rights to an Agent.' },
            ],
            color: 'text-amber-600',
            bg: 'bg-amber-50 border-amber-100',
        },
        {
            icon: Layers,
            title: '3. Strategic Architecture',
            items: [
                { label: 'Policy-Tool Separation', desc: 'Separate the Policy Layer (risk assessment, prompt moderation, budget checks) from the Tool Layer (least-privilege execution).' },
                { label: 'Strategic HITL', desc: 'Mandatory human approval for high-risk actions; auto-escalate to humans when model confidence drops below 85%.' },
            ],
            color: 'text-blue-600',
            bg: 'bg-blue-50 border-blue-100',
        },
    ];

    return (
        <div className="space-y-16">
            {/* ===================== HERO ===================== */}
            <div className="text-center max-w-4xl mx-auto pt-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-widest inline-flex items-center mb-6">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-1.5 animate-pulse"></span>
                    Probabilistic AI Reliability Engineering
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 leading-tight">
                    Agentic AI System Engineering & Debugging Guide
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Debugging an Agent is not catching a syntax exception — it is{" "}
                    <strong className="text-slate-800">locating the divergence point</strong> in a probabilistic reasoning space.
                    From deterministic testing to high-fidelity execution-graph tracing and deterministic workflow anchoring.
                </p>
                <div className="mt-2 text-[11px] font-mono text-rose-500 font-bold uppercase tracking-wider">
                    v2026.4.1-STABLE
                </div>

                {/* 3 quick-nav cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-10">
                    <button
                        onClick={() => scrollToAnchor('reliability-crisis')}
                        className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-400 hover:shadow-md transition group text-left cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ChartPkIcon />
                        </div>
                        <div className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider mb-1">Math</div>
                        <div className="text-base font-bold text-slate-900">The Reliability Crisis</div>
                        <div className="text-xs text-slate-500 mt-1">pass^k = p^k — the Multiplication Effect</div>
                    </button>

                    <button
                        onClick={() => scrollToAnchor('failure-modes')}
                        className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition group text-left cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Bug className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider mb-1">Taxonomy</div>
                        <div className="text-base font-bold text-slate-900">Common Failure Modes</div>
                        <div className="text-xs text-slate-500 mt-1">Technical · Cognitive · Multi-Agent faults</div>
                    </button>

                    <button
                        onClick={() => scrollToAnchor('debug-loop')}
                        className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md transition group text-left cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Crosshair className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-wider mb-1">Method</div>
                        <div className="text-base font-bold text-slate-900">Localize the Divergence</div>
                        <div className="text-xs text-slate-500 mt-1">Time-travel, graph analysis, sandbox replay</div>
                    </button>
                </div>
            </div>

            {/* ===================== ONE-LINER TRANSITION ===================== */}
            <section className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">Deterministic World</div>
                        <div>Code A <span className="text-blue-400">───────▶</span> Code B <span className="text-blue-400">───────▶</span> Predictable Output</div>
                        <div className="text-slate-500 mt-1">(Exception / Stack trace)</div>
                    </div>
                    <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-900/60 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto">
                        <div className="text-[10px] uppercase tracking-wider text-rose-400 mb-3">Probabilistic Agents</div>
                        <div>Prompt <span className="text-rose-400">──(p)──▶</span> Reasoning <span className="text-rose-400">──(p)──▶</span> Tool Call</div>
                        <div className="text-slate-500 mt-1">Cumulative Error Decay ── each step multiplies uncertainty</div>
                    </div>
                </div>
            </section>

            {/* ===================== RELIABILITY CRISIS ===================== */}
            <section id="reliability-crisis" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Left: math + examples */}
                    <div className="w-full lg:w-5/12">
                        <div className="flex items-center gap-2 text-rose-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                            <AlertTriangle className="w-4 h-4" /> Core Challenge 1
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">The Reliability Crisis & The Multiplication Effect</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">
                            In a long task chain of <em className="not-italic font-mono text-slate-800">k</em> independent execution steps, if each step has success probability{" "}
                            <em className="not-italic font-mono text-slate-800">p</em>, the overall success rate collapses exponentially:
                        </p>
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center mb-6">
                            <div className="font-mono text-lg sm:text-xl text-emerald-400 font-bold">pass = p<sup>k</sup></div>
                            <div className="text-[10px] font-mono text-slate-500 mt-1">TOTAL CHAIN SUCCESS PROBABILITY</div>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-100 text-rose-950 text-xs leading-relaxed mb-6">
                            <strong className="text-rose-700 font-bold block mb-1">⚠ WARNING — Multiplication Effect:</strong>
                            A mere 1% error at one intermediate step is multiplied cumulatively across long-horizon tasks, collapsing the stability of the entire business execution chain.
                        </div>
                    </div>

                    {/* Right: interactive calculator */}
                    <div className="w-full lg:w-7/12 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-rose-500"></span> Interactive: pass = p<sup>k</sup>
                            </span>
                            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${successRate >= 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                successRate >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                    'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                }`}>
                                {successRate >= 80 ? 'STABLE' : successRate >= 50 ? 'FRAGILE' : 'CRITICAL'}
                            </span>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-6 mb-6">
                            <div>
                                <div className="flex justify-between text-xs font-mono mb-2">
                                    <span className="text-slate-400">STEP SUCCESS PROBABILITY (p)</span>
                                    <span className="text-rose-400 font-bold">{p.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.5}
                                    max={0.99}
                                    step={0.01}
                                    value={p}
                                    onChange={(e) => setP(parseFloat(e.target.value))}
                                    className="w-full accent-rose-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1"><span>0.50</span><span>0.99</span></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-mono mb-2">
                                    <span className="text-slate-400">NUMBER OF STEPS (k)</span>
                                    <span className="text-blue-400 font-bold">{k}</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={k}
                                    onChange={(e) => setK(parseInt(e.target.value))}
                                    className="w-full accent-blue-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1"><span>1</span><span>20</span></div>
                            </div>
                        </div>

                        {/* Result */}
                        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="flex items-end justify-between mb-2">
                                <div>
                                    <div className="text-[10px] font-mono text-slate-500 uppercase">Chain Success Rate</div>
                                    <div className={`text-3xl font-extrabold font-mono mt-1 ${successRate >= 80 ? 'text-emerald-400' : successRate >= 50 ? 'text-amber-400' : 'text-rose-400'
                                        }`}>
                                        {successRate.toFixed(1)}%
                                    </div>
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 text-right">
                                    0.9<sup>5</sup> ≈ 59%<br />0.9<sup>8</sup> ≈ 43%<br />0.8<sup>8</sup> ≈ 16.7%
                                </div>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${successRate >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                                        successRate >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                                            'bg-gradient-to-r from-rose-600 to-rose-400'
                                        }`}
                                    style={{ width: `${successRate}%` }}
                                ></div>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                                Even a <strong className="text-rose-300">very reliable model (p = 0.9)</strong> collapses to{" "}
                                <strong className="text-amber-300">~43% over 8 steps</strong> — and a single run at p = 0.8 falls to{" "}
                                <strong className="text-rose-300">~16.7%</strong>. This is why monolithic autonomous chains fail: reliability decays multiplicatively, not additively.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== REASONING DIVERGENCE ===================== */}
            <section id="divergence" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row-reverse items-start gap-8">
                    {/* Left: explanation */}
                    <div className="w-full lg:w-5/12">
                        <div className="flex items-center gap-2 text-rose-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                            <Crosshair className="w-4 h-4" /> Core Challenge 2
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Non-deterministic Models & Reasoning Divergence</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">
                            Unlike catching a syntax exception, probabilistic models do not crash with a stack trace. Instead they{" "}
                            <strong className="text-slate-800">silently "branch away"</strong> from the optimal trajectory{" "}
                            <em className="not-italic">(reasoning trajectory divergence)</em>.
                        </p>
                        <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-950 text-xs leading-relaxed mb-6">
                            <strong className="text-indigo-700 font-bold block mb-1">STRATEGY:</strong>
                            Systems need observation strategies for <strong>Localization</strong> — pinpointing the exact divergence point — instead of only inspecting the final result.
                        </div>
                        <div className="font-mono text-[11px] bg-slate-950 text-slate-300 border border-slate-800 rounded-xl p-4 overflow-x-auto leading-relaxed">
                            <div><span className="text-emerald-400">Optimal:</span> [Plan] ─▶ [Search] ─▶ [Valid Result] ─▶ [Synthesize] ✅</div>
                            <div className="text-slate-700">│</div>
                            <div><span className="text-rose-400">Divergence:</span>&nbsp;&nbsp;&nbsp;&nbsp;└─▶ [Hallucinated Query] ─▶ [Empty Result] ─▶ [Looping] ❌</div>
                        </div>
                    </div>

                    {/* Right: live trace console */}
                    <div className="w-full lg:w-7/12">
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
                            {/* Console header */}
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900/70">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                                <span className="ml-2 text-[10px] font-mono text-slate-500">agent_trace — execution graph (high-fidelity)</span>
                                <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border ${traceRunning
                                    ? 'text-rose-400 border-rose-500/40 bg-rose-500/10 animate-pulse'
                                    : traceLogs.length > 0
                                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                        : 'text-slate-500 border-slate-700 bg-slate-800/50'
                                    }`}>
                                    {traceRunning ? <LoaderCircle className="w-3 h-3 inline mr-1 animate-spin" /> : null}
                                    {traceRunning ? 'Tracing…' : traceLogs.length > 0 ? 'Localized ✓' : 'Idle'}
                                </span>
                            </div>

                            {/* Trace logs */}
                            <div ref={traceConsoleRef} className="h-64 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed space-y-1.5">
                                {traceLogs.length === 0 && (
                                    <span className="text-slate-600">$ press <span className="text-indigo-400">Run Trace</span> to observe a silent reasoning divergence in real time…</span>
                                )}
                                {traceLogs.map((log, i) => (
                                    <div key={i} className={
                                        log.tone === 'ok' ? 'text-emerald-400' :
                                            log.tone === 'warn' ? 'text-amber-400' :
                                                log.tone === 'err' ? 'text-rose-400' : 'text-slate-400'
                                    }>
                                        <span className="text-slate-600 select-none">› </span>{log.text}
                                    </div>
                                ))}
                                {traceLogs.length > 0 && !traceRunning && (
                                    <div className="text-emerald-400 font-bold pt-2 border-t border-slate-800 mt-2">
                                        <span className="text-slate-600 select-none">› </span>[result] Divergence localized at step 3 — rewind & roll out fixed from checkpoint C2. ✅
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-800 bg-slate-900/50">
                                <button
                                    onClick={runTrace}
                                    disabled={traceRunning}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Play className="w-3.5 h-3.5" /> Run Trace
                                </button>
                                <button
                                    onClick={resetTrace}
                                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                                >
                                    Reset
                                </button>
                                <span className="ml-auto text-[10px] font-mono text-slate-600">
                                    {traceLogs.length}/{TRACE_SCRIPT.length} events · {TRACE_SCRIPT.filter((l) => l.tone === 'err').length} anomaly events
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== FAILURE MODES ===================== */}
            <section id="failure-modes" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">Common Failure Modes</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">The Agentic Failure Taxonomy</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Errors decompose into three core categories. Toggle to explore each failure mode, its symptoms, and its tell-tale signal.
                    </p>
                </div>

                {/* Category tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    {(Object.keys(FAILURE_CATALOG) as FailureCategory[]).map((key) => {
                        const cat = FAILURE_CATALOG[key];
                        const CatIcon = cat.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setCategory(key)}
                                className={`p-4 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${category === key
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm'
                                    }`}
                            >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${category === key ? cat.dot : 'bg-slate-100'}`}>
                                    <CatIcon className={`w-4 h-4 ${category === key ? 'text-white' : 'text-slate-500'}`} />
                                </span>
                                <div>
                                    <div className={`text-xs font-bold ${category === key ? 'text-white' : cat.color}`}>{cat.label}</div>
                                    <div className={`text-[10px] mt-0.5 ${category === key ? 'text-slate-400' : 'text-slate-400'}`}>{cat.modes.length} failure modes</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Mode cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentCategory.modes.map((mode) => {
                        const ModeIcon = mode.icon;
                        return (
                            <div key={mode.title} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:shadow-md hover:border-slate-300 transition">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${currentCategory.dot} bg-opacity-10`}>
                                    <ModeIcon className={`w-5 h-5 ${currentCategory.color}`} />
                                </div>
                                <h3 className="text-sm font-extrabold text-slate-900 mb-2">{mode.title}</h3>
                                <p className="text-xs text-slate-600 leading-relaxed mb-4">{mode.desc}</p>
                                <div className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-2">
                                    <span className="font-bold uppercase tracking-wider text-slate-500">Signal: </span>
                                    {mode.signal}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ===================== OBSERVABILITY STACK ===================== */}
            <section id="observability" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Radar className="w-4 h-4" /> Observability Stack
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">High-Fidelity Execution Graph Tracing Required</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-3xl">
                    Traditional HTTP request/response logging is <strong className="text-slate-900">completely insufficient</strong>.
                    Agent systems require High-Fidelity Tracing of the entire execution graph: every thought, action, tool observation, and state transition.
                </p>

                {/* Tool selector + detail */}
                <div className="grid lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-3">
                        {(Object.keys(obsTools) as (keyof typeof obsTools)[]).map((key) => {
                            const tool = obsTools[key];
                            return (
                                <button
                                    key={key}
                                    onClick={() => setObsTool(key)}
                                    className={`w-full text-left p-4 rounded-xl border transition cursor-pointer ${obsTool === key
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-sm">{tool.platform}</span>
                                        {obsTool === key && <Check className="w-4 h-4 text-emerald-400" />}
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${obsTool === key ? 'text-blue-300' : 'text-slate-400'}`}>
                                        {tool.strength}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${obsTools[obsTool].gradient}`}></span>
                                {obsTools[obsTool].platform} — Live Profile
                            </span>
                            <ObsIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Core Strength</div>
                                <div className="text-sm font-bold text-white mb-2">{obsTools[obsTool].strength}</div>
                                <div className="text-xs text-slate-400 leading-relaxed">{obsTools[obsTool].note}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Unique Debugging Feature</div>
                                <div className="text-sm text-slate-200 leading-relaxed">{obsTools[obsTool].feature}</div>
                            </div>
                        </div>
                        <div className="mt-4 p-4 rounded-xl border border-blue-900/60 bg-blue-950/30 text-xs text-blue-200 leading-relaxed">
                            <strong className="text-blue-300 font-bold">Trace fidelity is the debugging currency.</strong> Capture every step: thought, action, observation, and state transition — then inspect token-by-token, latency breakdowns, and failure categories.
                        </div>
                    </div>
                </div>

                {/* Comparison table */}
                <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs border-collapse min-w-[720px]">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-mono">
                                <th className="p-4 font-bold">Platform</th>
                                <th className="p-4 font-bold">Core Strength</th>
                                <th className="p-4 font-bold">Unique Debugging Feature</th>
                                <th className="p-4 font-bold">Integration Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr className="hover:bg-slate-50/60 transition">
                                <td className="p-4 font-extrabold text-emerald-600">MLflow</td>
                                <td className="p-4 font-semibold text-slate-900">Unified Platform</td>
                                <td className="p-4 text-slate-600">One-line autolog supports 50+ frameworks; auto-mirrors traces from Langfuse.</td>
                                <td className="p-4 text-slate-500">Framework-agnostic Python SDK — centralized monitoring without breaking existing infrastructure.</td>
                            </tr>
                            <tr className="hover:bg-slate-50/60 transition">
                                <td className="p-4 font-extrabold text-amber-600">Langfuse</td>
                                <td className="p-4 font-semibold text-slate-900">Self-Hosting & Privacy</td>
                                <td className="p-4 text-slate-600">Default open-source choice for secure data; deep step-level tracing at optimal cost.</td>
                                <td className="p-4 text-slate-500">Detailed per-token UI, latency breakdown, and a trace visualizer.</td>
                            </tr>
                            <tr className="hover:bg-slate-50/60 transition">
                                <td className="p-4 font-extrabold text-blue-600">LangSmith</td>
                                <td className="p-4 font-semibold text-slate-900">Fidelity & Scaling</td>
                                <td className="p-4 text-slate-600">Insights clusters traces into failure categories via automatic LLM analysis.</td>
                                <td className="p-4 text-slate-500">Complete LangChain/LangGraph ecosystem; dataset curation from production traces.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ===================== DEBUGGING METHODOLOGIES ===================== */}
            <section id="debug-loop" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">Methodologies</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">Debugging Methodologies</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Agent debugging is not catching syntax exceptions — it is locating the divergence point in probabilistic reasoning space.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {methods.map((m) => {
                        const MIcon = m.icon;
                        return (
                            <div key={m.title} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:shadow-md hover:border-indigo-200 transition group">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <MIcon className="w-5 h-5" />
                                    </span>
                                    <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1 font-bold uppercase tracking-wider">
                                        {m.en}
                                    </span>
                                </div>
                                <h3 className="text-sm font-extrabold text-slate-900 mb-2">{m.title}</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ===================== STABILITY PATTERNS ===================== */}
            <section id="patterns" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Layers className="w-4 h-4" /> Stability & Accuracy Patterns
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Mini Patterns for Stable AI Workflows</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-3xl">
                    To tame probabilistic uncertainty and stop the <span className="font-mono text-slate-800">pass = p<sup>k</sup></span> decay,
                    agentic systems apply a core set of Mini Patterns combined with deterministic orchestration mechanisms.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patternList.map((pat) => (
                        <div key={pat.n} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:shadow-md hover:border-blue-200 transition">
                            <div className={`inline-flex items-center gap-2 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${pat.color}`}>
                                <Zap className="w-3 h-3" /> Pattern {pat.n}
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-900 mt-3 mb-2">{pat.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{pat.desc}</p>
                        </div>
                    ))}

                    {/* CTA card to full interactive page */}
                    <button
                        onClick={() => scrollToAnchor('patterns')}
                        className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-500/20 transition group text-left cursor-pointer flex flex-col justify-between"
                    >
                        <div>
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-200 mb-2">Interactive Playground</div>
                            <h3 className="text-base font-extrabold mb-2">Explore the Full AI Patterns Guide</h3>
                            <p className="text-xs text-blue-100 leading-relaxed">
                                Five deeper interactive sections with live simulations: Divide & Conquer, Enrichment, Reflection, Branch → Merge, and FSM anchoring.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-sm font-bold group-hover:translate-x-1 transition-transform">
                            Open Patterns Hub <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </section>

            {/* ===================== FSM VISUALIZER ===================== */}
            <section className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className="w-full lg:w-5/12">
                        <div className="flex items-center gap-2 text-indigo-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                            <GitMerge className="w-4 h-4" /> Pattern 05
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Convert Autonomous to Deterministic</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">
                            Instead of letting the LLM freely decide the flow at every step, convert the probabilistic flow into a{" "}
                            <strong className="text-slate-800">deterministic State Machine (FSM)</strong>. Code logic anchors state; the LLM only executes logic inside each node.
                        </p>
                        <div className="space-y-3 text-xs text-slate-600 mb-6">
                            <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                                <span><strong className="text-slate-900">Workflow Anchoring:</strong> Enforce mandatory checkpoints in code that the Agent cannot skip.</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                                <span><strong className="text-slate-900">Finite State Machines (FSM):</strong> Constrain state transitions with rule-based code instead of letting the LLM guess the next move.</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFsmMode('autonomous')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${fsmMode === 'autonomous'
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'
                                    }`}
                            >
                                Unconstrained (Risky)
                            </button>
                            <button
                                onClick={() => setFsmMode('fsm')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${fsmMode === 'fsm'
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                                    }`}
                            >
                                Deterministic FSM Gate
                            </button>
                        </div>
                    </div>

                    {/* Visualizer */}
                    <div className="w-full lg:w-7/12 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${fsmMode === 'fsm' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                {fsmMode === 'fsm' ? 'Deterministic FSM Gate (Reliable)' : 'Unconstrained Autonomous (Risky)'}
                            </span>
                            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${fsmMode === 'fsm' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                }`}>
                                {fsmMode === 'fsm' ? '100% Reliable Transitions' : 'High Variance / Error'}
                            </span>
                        </div>

                        {fsmMode === 'fsm' ? (
                            <div className="space-y-5 py-2">
                                <div className="flex items-center gap-3 justify-center">
                                    <div className="p-3 px-5 rounded-xl border border-slate-700 bg-slate-900 text-center">
                                        <div className="text-[10px] font-mono text-slate-500 uppercase">State A</div>
                                        <div className="text-sm font-bold text-white">Intent Parsed</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="h-0.5 w-8 bg-emerald-500"></span>
                                        <span className="text-[9px] font-mono text-emerald-400 mt-1">gate</span>
                                    </div>
                                    <div className="p-3 px-5 rounded-xl border border-emerald-700 bg-emerald-950/40 text-center">
                                        <div className="text-[10px] font-mono text-emerald-400 uppercase">Validator (Code)</div>
                                        <div className="text-xs font-bold text-emerald-200">Schema Check ✅</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="h-0.5 w-8 bg-emerald-500"></span>
                                        <span className="text-[9px] font-mono text-emerald-400 mt-1">gate</span>
                                    </div>
                                    <div className="p-3 px-5 rounded-xl border border-slate-700 bg-slate-900 text-center">
                                        <div className="text-[10px] font-mono text-slate-500 uppercase">State B</div>
                                        <div className="text-sm font-bold text-white">Tool Executed</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 text-xs text-emerald-200 leading-relaxed">
                                    <strong className="text-emerald-300 font-bold">Deterministic Flow:</strong> Every transition is validated by hard code gates. The model cannot skip, loop, or reorder — transitions are 100% reliable.
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5 py-2">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="p-3 px-5 rounded-xl border border-slate-700 bg-slate-900 text-center">
                                        <div className="text-[10px] font-mono text-slate-500 uppercase">Start</div>
                                        <div className="text-sm font-bold text-white">User Prompt</div>
                                    </div>
                                    <span className="text-rose-400 font-mono text-[10px]">LLM decides…</span>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2.5 px-4 rounded-xl border border-rose-900 bg-rose-950/40 text-center">
                                            <div className="text-[10px] font-mono text-rose-400">Tool A?</div>
                                        </div>
                                        <div className="p-2.5 px-4 rounded-xl border border-rose-900 bg-rose-950/40 text-center">
                                            <div className="text-[10px] font-mono text-rose-400">Tool B?</div>
                                        </div>
                                        <div className="p-2.5 px-4 rounded-xl border border-rose-900 bg-rose-950/40 text-center">
                                            <div className="text-[10px] font-mono text-rose-400">Loop…</div>
                                        </div>
                                    </div>
                                    <span className="text-rose-400 font-mono text-[10px]">LLM decides…</span>
                                    <div className="p-3 px-5 rounded-xl border border-rose-700 bg-rose-950/40 text-center">
                                        <div className="text-[10px] font-mono text-rose-400">Any Action?</div>
                                        <div className="text-xs font-bold text-rose-200">High Variance / Error</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 text-xs text-rose-200 leading-relaxed">
                                    <strong className="text-rose-300 font-bold">Unconstrained Flow:</strong> The model guesses every next move. Each guess multiplies risk — exactly the <span className="font-mono">pass = p<sup>k</sup></span> decay highlighted above.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===================== GOVERNANCE ===================== */}
            <section id="governance" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4" /> Governance & Strategic Add-ons
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Operational Guardrails</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-3xl">
                    Governance infrastructure keeps Agent systems operating safely within allowed budget and risk limits.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {governance.map((g) => {
                        const GIcon = g.icon;
                        return (
                            <div key={g.title} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:shadow-md hover:border-emerald-200 transition">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${g.bg}`}>
                                    <GIcon className={`w-5 h-5 ${g.color}`} />
                                </div>
                                <h3 className="text-sm font-extrabold text-slate-900 mb-4">{g.title}</h3>
                                <div className="space-y-3">
                                    {g.items.map((item) => (
                                        <div key={item.label} className="p-3 rounded-xl bg-white border border-slate-200">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                                                <Lock className="w-3 h-3 text-slate-400" /> {item.label}
                                            </div>
                                            <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* HITL confidence threshold */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-100">
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <FileCheck className="w-4 h-4" />
                            </span>
                            <div>
                                <div className="text-sm font-extrabold text-slate-900">Strategic Human-In-The-Loop</div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    Auto-escalate to a human when model confidence drops below the trust threshold.
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-slate-500">confidence</span>
                            <div className="w-32 h-2 rounded-full bg-emerald-100 overflow-hidden">
                                <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-amber-400"></div>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg px-2.5 py-1">85%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== FINAL TAKEAWAY ===================== */}
            <section className="bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50 border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-10">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                    <Gauge className="w-4 h-4" /> Final Takeaway
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5 leading-tight">
                    Convert probabilistic chaos into observable, anchored determinism
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-900">Trace everything:</strong> HTTP logs are not enough — capture the full execution graph: thought, action, observation, state.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-900">Localize divergence:</strong> Debug the point where reasoning branched off the optimal trajectory, not just the final failure.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-900">Anchor with code:</strong> Use FSM gates, checkpoints, loop caps, and hard budgets to stop <span className="font-mono">p<sup>k</sup></span> decay.</span>
                        </li>
                    </ul>
                    <div className="p-5 rounded-xl bg-white/80 border border-rose-200 shadow-sm">
                        <div className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider mb-3">The Load-Bearing Sentence</div>
                        <p className="text-sm text-slate-700 leading-relaxed italic">
                            In deterministic systems you catch exceptions; in agentic systems you{" "}
                            <strong>pinpoint the silent divergence</strong> — then rewind, patch, and roll out from that exact checkpoint.
                        </p>
                        <p className="mt-4 text-xs text-slate-500 border-t border-slate-200 pt-3">
                            Master probabilistic reliability: observability first, deterministic anchoring second, autonomy last.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer chip */}
            <div className="text-center">
                <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                    {t.footer.debugText} — Full reference: <code className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">references_doc/agentic_debug/README.md</code>
                </p>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  Small inline chart icon (p^k curve)                                */
/* ------------------------------------------------------------------ */

const ChartPkIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="M5 17c4-8 8-10 14-11" className="text-rose-400" style={{ stroke: 'currentColor', opacity: 0.8 }} />
        <circle cx="19" cy="6" r="1.5" />
    </svg>
);

export default AgenticDebug;