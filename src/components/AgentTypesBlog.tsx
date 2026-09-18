import {
    MessageSquare,
    Workflow,
    Bot,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    Scale,
    Gauge,
    Coins,
    Route,
    ListChecks,
    ShieldCheck,
    Lightbulb,
    Layers,
    GitBranch,
    Copy,
    Check,
    Database,
    PenTool,
    Eye,
    Cpu,
    Play,
    RotateCcw,
    Terminal,
    Timer,
    LoaderCircle,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

/* ------------------------------------------------------------------ */
/*  Live Lab: execution data per architecture type                     */
/* ------------------------------------------------------------------ */

type SimType = 'llm' | 'workflow' | 'agent';
type SimNodeKey = 'input' | 'call' | 'gate' | 'query' | 'draft' | 'plan' | 'act' | 'observe' | 'output';

interface SimNode { label: string; icon: SimNodeKey; at: number }
interface SimLine { text: string; tone: string }

const NODE_ICONS: Record<SimNodeKey, ComponentType<{ className?: string }>> = {
    input: MessageSquare,
    call: Cpu,
    gate: ShieldCheck,
    query: Database,
    draft: PenTool,
    plan: Route,
    act: Bot,
    observe: Eye,
    output: CheckCircle2,
};

const SIM_META: Record<SimType, {
    label: string;
    tag: string;
    accentText: string;
    accentRing: string;
    bar: string;
    dot: string;
    calls: number;
    latencyMs: number;
    costX: number;
    nodes: SimNode[];
    script: SimLine[];
}> = {
    llm: {
        label: 'LLM Call',
        tag: '🎯',
        accentText: 'text-blue-600',
        accentRing: 'border-blue-400',
        bar: 'from-blue-500 to-indigo-500',
        dot: 'bg-blue-500',
        calls: 1,
        latencyMs: 800,
        costX: 1,
        nodes: [
            { label: 'Input', icon: 'input', at: 0 },
            { label: 'LLM Call', icon: 'call', at: 1 },
            { label: 'Output', icon: 'output', at: 2 },
        ],
        script: [
            { text: '▶ call #1 · POST /v1/chat/completions (zero tools)', tone: 'text-blue-400' },
            { text: '   prompt: classify + extract (few-shot, structured output)', tone: 'text-slate-400' },
            { text: '⏎ parse: { intent: "refund", priority: "high", conf: 0.93 }', tone: 'text-slate-300' },
            { text: '✅ 1 call · no loops · emit answer', tone: 'text-emerald-400' },
        ],
    },
    workflow: {
        label: 'Agentic Workflow',
        tag: '🔀',
        accentText: 'text-emerald-600',
        accentRing: 'border-emerald-400',
        bar: 'from-emerald-500 to-teal-500',
        dot: 'bg-emerald-500',
        calls: 5,
        latencyMs: 3400,
        costX: 6,
        nodes: [
            { label: 'Extract', icon: 'query', at: 0 },
            { label: 'Schema Gate', icon: 'gate', at: 1 },
            { label: 'Query KB', icon: 'query', at: 2 },
            { label: 'Draft', icon: 'draft', at: 3 },
            { label: 'Rule Gate', icon: 'gate', at: 4 },
            { label: 'Output', icon: 'output', at: 5 },
        ],
        script: [
            { text: '[1/6] extract entities from ticket', tone: 'text-blue-400' },
            { text: '[2/6] gate · schema validation → PASS', tone: 'text-emerald-400' },
            { text: '[3/6] query knowledge base (top-3 chunks)', tone: 'text-slate-300' },
            { text: '[4/6] draft response from grounded context', tone: 'text-blue-300' },
            { text: '[5/6] gate · business-rule check → PASS', tone: 'text-emerald-400' },
            { text: '[6/6] emit final answer + node telemetry', tone: 'text-slate-300' },
        ],
    },
    agent: {
        label: 'Autonomous Agent',
        tag: '🤖',
        accentText: 'text-rose-600',
        accentRing: 'border-rose-400',
        bar: 'from-rose-500 to-orange-500',
        dot: 'bg-rose-500',
        calls: 14,
        latencyMs: 9800,
        costX: 24,
        nodes: [
            { label: 'Plan', icon: 'plan', at: 0 },
            { label: 'Act #1', icon: 'act', at: 1 },
            { label: 'Observe #1', icon: 'observe', at: 3 },
            { label: 'Act #2', icon: 'act', at: 4 },
            { label: 'Observe #2', icon: 'observe', at: 6 },
            { label: 'Done', icon: 'output', at: 7 },
        ],
        script: [
            { text: '[plan] goal: resolve ticket autonomously', tone: 'text-rose-300' },
            { text: '[act] classify_ticket() → intent=refund', tone: 'text-blue-400' },
            { text: '[observe] refund policies available: 2', tone: 'text-slate-300' },
            { text: '[act] look_up_policy("refund") → 2 policies', tone: 'text-blue-400' },
            { text: '[observe] policy #1 matches: 14-day window', tone: 'text-slate-300' },
            { text: '[act] draft_reply(policy#1) → draft ok', tone: 'text-blue-400' },
            { text: '[check] confidence 0.92 ≥ 0.85 · budget left: 62%', tone: 'text-amber-300' },
            { text: '[done] goal met → emit resolution', tone: 'text-emerald-400' },
        ],
    },
};

const QUIZ_QUESTIONS: { key: 'q1' | 'q2' | 'q3'; text: string; hint: string }[] = [
    { key: 'q1', text: 'Can it be solved in ONE call with acceptable accuracy?', hint: 'No tools, no lookups, first-shot accuracy is enough.' },
    { key: 'q2', text: 'Can you enumerate the steps at design time?', hint: 'You can draw the flowchart on a whiteboard today.' },
    { key: 'q3', text: 'Is the path unknowable AND do guardrails exist?', hint: 'Budget caps, sandbox, idempotent tools, human approval.' },
];

/**
 * Agent Types Blog — LLM Call vs. Agentic Workflow vs. Autonomous Agent.
 * Mirrors references_doc/agentic_types/README.md as an interactive blog page.
 */
export const AgentTypesBlog = () => {
    const { lang } = useLanguage();
    const t = translations[lang];
    const [copied, setCopied] = useState(false);

    // ---- Live Lab: simulator state ----
    const [simType, setSimType] = useState<SimType>('workflow');
    const [simTask, setSimTask] = useState<'ticket' | 'code' | 'research'>('ticket');
    const [simRunning, setSimRunning] = useState(false);
    const [simStep, setSimStep] = useState(-1);
    const [simLogs, setSimLogs] = useState<SimLine[]>([]);
    const [simProgress, setSimProgress] = useState(0);
    const [simStatus, setSimStatus] = useState<'Ready' | 'Running…' | 'Complete'>('Ready');
    const simTimersRef = useRef<number[]>([]);
    const simConsoleRef = useRef<HTMLDivElement>(null);

    const runSim = () => {
        simTimersRef.current.forEach(clearTimeout);
        simTimersRef.current = [];
        const meta = SIM_META[simType];
        const taskWeight = simTask === 'ticket' ? 1 : simTask === 'code' ? 1.4 : 1.8;

        setSimRunning(true);
        setSimStatus('Running…');
        setSimLogs([]);
        setSimStep(-1);
        setSimProgress(4);

        const timers: number[] = [];
        let delay = 250;
        meta.script.forEach((line, i) => {
            const t = window.setTimeout(() => {
                setSimStep(i);
                setSimLogs((prev) => [...prev, line]);
                setSimProgress(Math.min(8 + Math.round(((i + 1) / meta.script.length) * 88), 96));
            }, delay);
            timers.push(t);
            delay += i === 0 ? 550 : 700;
        });

        const finish = window.setTimeout(() => {
            setSimProgress(100);
            setSimStep(meta.nodes.length);
            setSimStatus('Complete');
            setSimRunning(false);
            setSimLogs((prev) => [
                ...prev,
                {
                    text: `✅ [done] ${meta.script.length} steps · ${meta.calls} calls · ~${Math.round(meta.latencyMs * taskWeight)}ms · ${Math.round(meta.costX * taskWeight)}× cost`,
                    tone: 'text-emerald-400 font-bold',
                },
            ]);
        }, delay + 150);
        timers.push(finish);
        simTimersRef.current = timers;
    };

    const resetSim = () => {
        simTimersRef.current.forEach(clearTimeout);
        simTimersRef.current = [];
        setSimRunning(false);
        setSimStatus('Ready');
        setSimLogs([]);
        setSimStep(-1);
        setSimProgress(0);
    };

    useEffect(() => {
        if (simConsoleRef.current) {
            simConsoleRef.current.scrollTop = simConsoleRef.current.scrollHeight;
        }
    }, [simLogs]);

    useEffect(() => {
        return () => {
            simTimersRef.current.forEach(clearTimeout);
        };
    }, []);

    // ---- Live Lab: quiz state ----
    const [quiz, setQuiz] = useState<{ q1: boolean | null; q2: boolean | null; q3: boolean | null }>({ q1: null, q2: null, q3: null });
    const quizComplete = quiz.q1 !== null && quiz.q2 !== null && quiz.q3 !== null;
    const quizRecommendation: 'llm' | 'workflow' | 'agent' | 'shrink' | null = (() => {
        if (!quizComplete) return null;
        if (quiz.q1) return 'llm';
        if (quiz.q2) return 'workflow';
        if (quiz.q3) return 'agent';
        return 'shrink';
    })();
    const answerQuiz = (key: 'q1' | 'q2' | 'q3', value: boolean) => {
        setQuiz((prev) => ({ ...prev, [key]: value }));
    };

    // ---- Live Lab: meters (live per selected type) ----
    const meters = SIM_META[simType];
    const latencyPct = Math.min(100, Math.round((meters.latencyMs / 10000) * 100));
    const costPct = Math.min(100, Math.round(meters.costX * 4));

    const scrollToAnchor = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-16">
            {/* ===================== HERO ===================== */}
            <div className="text-center max-w-4xl mx-auto pt-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-widest inline-flex items-center mb-6">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5 animate-pulse"></span>
                    Agent Architecture Playbook
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 leading-tight">
                    LLM Call vs. Agentic Workflow vs. Autonomous Agent
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    These three patterns are not a ladder you must climb — they are a spectrum of{" "}
                    <strong className="text-slate-800">control vs. autonomy</strong>. The winning move is picking the{" "}
                    <em>least</em> autonomous option that still solves the problem.
                </p>

                {/* 3 quick-nav cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-10">
                    <button
                        onClick={() => scrollToAnchor('llm-call')}
                        className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition group text-left cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider mb-1">Pattern 1</div>
                        <div className="text-base font-bold text-slate-900">LLM Call</div>
                        <div className="text-xs text-slate-500 mt-1">One prompt in, one completion out. Zero tooling.</div>
                    </button>

                    <button
                        onClick={() => scrollToAnchor('agentic-workflow')}
                        className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition group text-left cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Workflow className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">Pattern 2</div>
                        <div className="text-base font-bold text-slate-900">Agentic Workflow</div>
                        <div className="text-xs text-slate-500 mt-1">Your code orchestrates fixed steps. The model thinks.</div>
                    </button>

                    <button
                        onClick={() => scrollToAnchor('autonomous-agent')}
                        className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-400 hover:shadow-md transition group text-left cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider mb-1">Pattern 3</div>
                        <div className="text-base font-bold text-slate-900">Autonomous Agent</div>
                        <div className="text-xs text-slate-500 mt-1">The model decides its own path until the goal is met.</div>
                    </button>
                </div>
            </div>

            {/* ===================== ONE-SENTENCE VERSION ===================== */}
            <section className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Lightbulb className="w-4 h-4" /> The One-Sentence Version
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-5">Who owns the control flow?</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100">
                        <div className="flex items-center gap-2 font-bold text-blue-700 mb-2 text-sm">
                            <MessageSquare className="w-4 h-4" /> LLM Call
                        </div>
                        <p className="text-xs text-blue-950 leading-relaxed">
                            You ask the model to <strong>produce something</strong> once. Zero tooling. Your code handles the rest.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100">
                        <div className="flex items-center gap-2 font-bold text-emerald-700 mb-2 text-sm">
                            <Workflow className="w-4 h-4" /> Agentic Workflow
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed">
                            <strong>You orchestrate</strong> many calls and tools along a fixed path. The model thinks; the code decides.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-100">
                        <div className="flex items-center gap-2 font-bold text-rose-700 mb-2 text-sm">
                            <Bot className="w-4 h-4" /> Autonomous Agent
                        </div>
                        <p className="text-xs text-rose-950 leading-relaxed">
                            <strong>The model decides</strong> its own path, loops until done, and calls tools on its own. It both thinks <em>and</em> decides.
                        </p>
                    </div>
                </div>
                <p className="mt-5 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-4">
                    The real axis is: <strong className="text-slate-900">who owns the control flow — your code or the model?</strong>
                </p>
            </section>

            {/* ===================== COMPARISON MATRIX ===================== */}
            <section id="comparison-matrix" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Scale className="w-4 h-4" /> Side-by-Side
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">The Comparison Matrix</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Every dimension mapped across the three agent types.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm border-collapse min-w-[720px]">
                        <thead>
                            <tr className="text-left border-b-2 border-slate-200">
                                <th className="py-3 pr-4 font-extrabold text-slate-900">Dimension</th>
                                <th className="py-3 pr-4 font-extrabold text-blue-600">🎯 LLM Call</th>
                                <th className="py-3 pr-4 font-extrabold text-emerald-600">🔀 Agentic Workflow</th>
                                <th className="py-3 font-extrabold text-rose-600">🤖 Autonomous Agent</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600">
                            {[
                                ['Who owns control flow', 'Your code (trivially)', 'Your code — steps fixed & ordered', 'The model — steps chosen per-run'],
                                ['LLM calls per task', '1', 'Multiple, deterministic', 'Many, dynamic'],
                                ['Decision-making', 'Token-level only', 'Yours — branches, validation, retries', 'Model’s — tools, order, stopping'],
                                ['Latency', 'Lowest (one round trip)', 'Medium (sequential + parallel steps)', 'Highest (planning overhead)'],
                                ['Cost per task', 'Lowest', 'Medium', 'Highest'],
                                ['Consistency / control', 'Low', 'High — same path every time', 'Low-to-medium — path varies'],
                                ['Flexibility', 'Very low', 'Medium — within written branches', 'High — handles novel situations'],
                                ['Failure behavior', 'Retry the call', 'Your bounded error-handling logic', 'Self-correction loop (unbounded)'],
                                ['Best metaphor', 'A calculator', 'An assembly line', 'A contractor with a task list'],
                            ].map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/60 border-b border-slate-100' : 'border-b border-slate-100'}>
                                    <td className="py-3 pr-4 font-semibold text-slate-900">{row[0]}</td>
                                    <td className="py-3 pr-4">{row[1]}</td>
                                    <td className="py-3 pr-4">{row[2]}</td>
                                    <td className="py-3">{row[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ===================== PATTERN 1: LLM CALL ===================== */}
            <section id="llm-call" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className="w-full lg:w-5/12">
                        <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                            <MessageSquare className="w-4 h-4" /> Pattern 01 · 🎯
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">LLM Call</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">
                            The atomic unit of everything below: <strong>one prompt in, one completion out.</strong> Add examples (few-shot) or not (zero-shot), call the API once, and your code handles the result. No tools, no loops, no second call.
                        </p>
                        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-950 text-xs leading-relaxed mb-6 font-mono">
                            <strong className="text-blue-700 font-bold block mb-1">FLOW:</strong>
                            input → [Prompt + examples] → LLM → output → your code handles it
                        </div>
                        <div className="text-xs text-slate-600">
                            <strong className="text-slate-900">Rule of thumb:</strong> if a <code className="text-blue-700 bg-blue-50 px-1 rounded">prompt_once(question) → answer</code> solves it, don’t build an agent.
                        </div>
                    </div>

                    <div className="w-full lg:w-7/12 space-y-6">
                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
                                <ListChecks className="w-4 h-4 text-blue-600" /> What it should be used for
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                                {[
                                    'Classification / tagging — sentiment, intent, priority',
                                    'Extraction — pull fields out of text (structured output)',
                                    'Summarization — condense a doc to N bullets',
                                    'Translation / rewriting — one text in, one out',
                                    'Generation — draft, headline, test case, SQL',
                                    'Quick answers over small self-contained context',
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
                                <ShieldCheck className="w-4 h-4 text-blue-600" /> When to use it — ALL must be true
                            </h3>
                            <ul className="space-y-2 text-xs text-slate-600">
                                {[
                                    'Task is self-contained — no lookups or tool calls needed',
                                    'Accuracy is good enough on the first shot',
                                    'Latency is a hard requirement (interactive, < ~1s)',
                                    'Cost of being wrong is low',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== PATTERN 2: AGENTIC WORKFLOW ===================== */}
            <section id="agentic-workflow" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className="w-full lg:w-5/12">
                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                            <Workflow className="w-4 h-4" /> Pattern 02 · 🔀
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Agentic Workflow</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">
                            A <strong>deterministic, code-orchestrated sequence</strong> of LLM calls and tools. Step 1 extract → step 2 validate schema → step 3 query the DB → step 4 draft → step 5 critique → step 6 fix. The model never decides <em>what</em> to do next; it only produces results your code routes.
                        </p>
                        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-950 text-xs leading-relaxed mb-6 font-mono">
                            <strong className="text-emerald-700 font-bold block mb-1">FLOW:</strong>
                            step 1 → check → step 2 → tool call → step 3 → validate → output
                            <span className="block mt-1 text-emerald-700">└── retry / repair / escalate if a gate fails</span>
                        </div>
                        <div className="text-xs text-slate-600">
                            <strong className="text-slate-900">Covers:</strong> prompt chaining, routing, parallelization, evaluator-optimizer, orchestrator-workers. Includes a <strong>validation gate</strong> between steps so failures stay bounded.
                        </div>
                    </div>

                    <div className="w-full lg:w-7/12 space-y-6">
                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
                                <ListChecks className="w-4 h-4 text-emerald-600" /> What it should be used for
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                                {[
                                    'RAG pipelines — retrieve → re-rank → ground → answer',
                                    'Data transformations — extract → validate → map → load',
                                    'Quality-gated generation — draft → critique → revise',
                                    'Code assistants — generate → run tests → iterate',
                                    'Customer support flows — with human approval step',
                                    'Anything with business rules (claims, compliance, moderation)',
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" /> When to use it — consistency & control
                            </h3>
                            <ul className="space-y-2 text-xs text-slate-600">
                                {[
                                    'Task has known, repeatable steps — enumerable at design time',
                                    'Outputs must meet constraints (schema, business rules, grounding)',
                                    'One call isn’t reliable enough — you need a verify pass',
                                    'You can afford seconds of latency from 2–10 sequential calls',
                                    'Failures must be bounded — you want to know where it failed',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-slate-600 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
                                <strong className="text-emerald-800">Rule of thumb:</strong> if you can draw the flowchart on a whiteboard, it’s a workflow — not an autonomous agent.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== PATTERN 3: AUTONOMOUS AGENT ===================== */}
            <section id="autonomous-agent" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className="w-full lg:w-5/12">
                        <div className="flex items-center gap-2 text-rose-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                            <Bot className="w-4 h-4" /> Pattern 03 · 🤖
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Autonomous Agent</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">
                            A <strong>model-driven loop</strong>: give the LLM a goal, a toolset, and let it plan and act until done (or it gives up). At each iteration it decides <em>what tool to call, with what arguments, whether to continue, and when to stop.</em>
                        </p>
                        <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-100 text-rose-950 text-xs leading-relaxed mb-6 font-mono">
                            <strong className="text-rose-700 font-bold block mb-1">REACT LOOP:</strong>
                            goal → plan / next action → tool call → observe → repeat
                            <span className="block mt-1 text-rose-700">└────── done? (else loop again) ──────┘</span>
                        </div>
                        <div className="text-xs text-slate-600">
                            <strong className="text-slate-900">Archetype:</strong> the <strong>ReAct</strong> loop (Reason → Act → Observe). Also multi-agent hierarchies where a supervisor delegates to specialized subagents.
                        </div>
                    </div>

                    <div className="w-full lg:w-7/12 space-y-6">
                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
                                <ListChecks className="w-4 h-4 text-rose-600" /> What it should be used for
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                                {[
                                    'Web / API research — "find the cheapest flight and book it"',
                                    'Software engineering agents — browse, edit, test, fix, repeat',
                                    'Complex data investigations — "why did revenue drop?"',
                                    'Operations / general-purpose assistants spanning services',
                                    'Concierge agents — multi-turn tasks no fixed flow covers',
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3">
                                        <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
                                <AlertTriangle className="w-4 h-4 text-rose-600" /> When to use it — only when others can’t
                            </h3>
                            <ul className="space-y-2 text-xs text-slate-600">
                                {[
                                    'Completion path is unknown at design time — can’t write the branches',
                                    'Flexibility is worth more than consistency',
                                    'Model has enough safe tools to self-correct (test loops, sandbox)',
                                    'You can absorb the cost and latency',
                                    'You can tolerate and govern non-deterministic behavior',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-slate-600 bg-rose-50/70 border border-rose-100 rounded-xl p-3">
                                <strong className="text-rose-800">Rule of thumb:</strong> reach for an autonomous agent only when “ask once” and “script the steps” are both insufficient. Autonomy is a liability, not a feature, until you have guardrails.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== DECISION FLOW ===================== */}
            <section id="decision-flow" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Route className="w-4 h-4" /> Decision Flow
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">How to Choose</h2>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white">
                        <div className="flex items-center gap-2 font-bold text-blue-700 mb-2 text-sm">
                            <MessageSquare className="w-4 h-4" /> Start: can it be solved in ONE call?
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            If yes and latency matters → <strong className="text-blue-700">🎯 LLM call</strong> (zero/few-shot + structured output). Done.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white">
                        <div className="flex items-center gap-2 font-bold text-emerald-700 mb-2 text-sm">
                            <Workflow className="w-4 h-4" /> Next: can you enumerate the steps?
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            If yes and you need consistency → <strong className="text-emerald-700">🔀 Agentic workflow</strong>. Draw the DAG, add gates.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border border-rose-200 bg-gradient-to-b from-rose-50 to-white">
                        <div className="flex items-center gap-2 font-bold text-rose-700 mb-2 text-sm">
                            <Bot className="w-4 h-4" /> Last resort: path unknowable & guardrails exist?
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            If yes → <strong className="text-rose-700">🤖 Autonomous agent</strong>. Otherwise shrink scope until a workflow fits.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm border-collapse min-w-[560px]">
                        <thead>
                            <tr className="text-left border-b-2 border-slate-200">
                                <th className="py-3 pr-4 font-extrabold text-slate-900">Your need</th>
                                <th className="py-3 font-extrabold text-slate-900">Choose</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600">
                            {[
                                ['Simple + low latency', '🎯 LLM call — 1-shot or few-shot, structured output'],
                                ['Consistent + more control', '🔀 Agentic workflow — your code owns the steps'],
                                ['Flexible + autonomous', '🤖 Autonomous agent — model owns the steps, within guardrails'],
                            ].map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/60 border-b border-slate-100' : 'border-b border-slate-100'}>
                                    <td className="py-3 pr-4 font-semibold text-slate-900">{row[0]}</td>
                                    <td className="py-3">{row[1]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ===================== IMPLEMENTATION GUIDE ===================== */}
            <section id="implementation-guide" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Layers className="w-4 h-4" /> Implementation Guide
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">Three Playbooks</h2>

                {/* Playbook 1: LLM Call */}
                <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-extrabold text-slate-900 text-lg mb-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></span>
                        1. 🎯 LLM Call — Simple & Low Latency
                    </h3>
                    <ol className="space-y-2 text-xs sm:text-sm text-slate-600 mb-4">
                        {[
                            'Start zero-shot with one clear, directive prompt. Measure accuracy.',
                            'Add 2–5 few-shot examples only if needed — stop when accuracy plateaus.',
                            'Use structured output (response_format / tool-use / response_schema), not "return JSON" + regex.',
                            'Route to the smallest capable model and trim context to keep latency low.',
                            'Move static prompt content first so prompt caching works.',
                            'Bound the failure: validate schema + rules in code, retry once, fall back to a default.',
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="text-xs text-slate-600 bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                        <strong className="text-blue-800">Anti-pattern:</strong> bolting a "loop with an LLM judge" onto a single call. If you need a second call to verify, you’ve graduated to a workflow — do it properly.
                    </p>
                </div>

                {/* Playbook 2: Agentic Workflow */}
                <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-extrabold text-slate-900 text-lg mb-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Workflow className="w-4 h-4" /></span>
                        2. 🔀 Agentic Workflow — Consistent & Controlled
                    </h3>
                    <ol className="space-y-2 text-xs sm:text-sm text-slate-600 mb-4">
                        {[
                            'Draw the DAG first. Parallelize independent branches with Promise.all / asyncio.gather — the biggest latency win.',
                            'Make every step atomic and checkpointable — serialize context before expensive calls.',
                            'Add validation gates between steps: schema → business rules → embedding grounding → LLM-as-judge only if needed.',
                            'Classify failures: transient (timeout/5xx) → retry with backoff; semantic (rule violation) → roll back + repair, never retry same context.',
                            'Route by model tier: frontier for orchestration/planning, lightweight for extraction/RAG, escalate on low confidence.',
                            'Instrument every node: model_id, tokens, latency, retries, failure_reason. Build p50/p95 views per step.',
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 text-xs leading-relaxed font-mono">
                        <strong className="text-emerald-700 font-bold block mb-1">EVALUATOR-OPTIMIZER ARCHITECTURE:</strong>
                        generator → validator → pass? → output · else generator revises (max N iterations, then escalate)
                    </div>
                </div>

                {/* Playbook 3: Autonomous Agent */}
                <div>
                    <h3 className="flex items-center gap-2 font-extrabold text-slate-900 text-lg mb-3">
                        <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Bot className="w-4 h-4" /></span>
                        3. 🤖 Autonomous Agent — Flexible & Autonomous
                    </h3>
                    <ol className="space-y-2 text-xs sm:text-sm text-slate-600 mb-4">
                        {[
                            'Start with ReAct, not multi-agent — one loop: reason → act → observe. Add hierarchies only when scope demands it.',
                            'Give a tight goal, explicit "done" definition, and a budget: max iterations / max tokens / max time.',
                            'Restrict the toolset — one tool, one job. Fewer tools = fewer hallucinated calls.',
                            'Add idempotency keys on any tool with side effects (writes, payments).',
                            'Return structured errors from tools — never silent empties; the agent needs the failure signal.',
                            'Add human-in-the-loop checkpoints before irreversible actions: send, pay, delete, deploy.',
                            'Log the full trajectory (actions + observations), not just the final answer.',
                            'Sandbox everything until proven reliable.',
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-950 text-xs leading-relaxed">
                        <strong className="text-rose-700 font-bold block mb-1">GUARDRAIL MINIMUM (non-negotiable):</strong>
                        Max steps / tokens / wall-clock · idempotency on side effects · human approval on irreversible actions · full trajectory logging.
                    </div>
                </div>

                {/* Copy snippet */}
                <div className="mt-8">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <h3 className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                            <GitBranch className="w-4 h-4 text-orange-600" /> Goal-first agent skeleton (pseudocode)
                        </h3>
                        <button
                            onClick={() => handleCopy(agentSkeleton)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition flex items-center gap-1.5 cursor-pointer"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <pre className="bg-slate-950 text-slate-200 rounded-xl p-5 overflow-x-auto text-xs leading-relaxed font-mono">
                        <code>{agentSkeleton}</code>
                    </pre>
                </div>
            </section>

            {/* ===================== LIVE DEMO LAB ===================== */}
            <section id="live-lab" className="scroll-mt-24 bg-slate-950 border border-slate-800 shadow-xl rounded-2xl p-6 sm:p-8 text-slate-100">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
                        <Terminal className="w-4 h-4" /> Live Demo Lab
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">pick a task → run the architecture → watch the difference</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">See the Trade-off, Don't Read It</h2>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Controls column */}
                    <div className="lg:col-span-2 space-y-5">
                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Task</label>
                            <select
                                value={simTask}
                                onChange={(e) => setSimTask(e.target.value as 'ticket' | 'code' | 'research')}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition cursor-pointer"
                            >
                                <option value="ticket">🎫 Support ticket triage</option>
                                <option value="code">💻 Code review (1.4× heavier)</option>
                                <option value="research">🔬 Research report (1.8× heavier)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Architecture</label>
                            <div className="space-y-2">
                                {(Object.keys(SIM_META) as SimType[]).map((key) => {
                                    const meta = SIM_META[key];
                                    const active = simType === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSimType(key);
                                                resetSim();
                                            }}
                                            className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm text-left transition cursor-pointer ${active
                                                ? `${meta.accentRing} bg-slate-900 ${meta.accentText} font-bold`
                                                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${active ? meta.dot : 'bg-slate-700'}`} />
                                                {meta.tag} {meta.label}
                                            </span>
                                            <span className={`font-mono text-[10px] ${active ? meta.accentText : 'text-slate-600'}`}>
                                                {meta.calls} call{meta.calls > 1 ? 's' : ''} · {Math.round(meta.latencyMs / 1000)}s · {meta.costX}×
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={runSim}
                                disabled={simRunning}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm px-4 py-2.5 transition cursor-pointer"
                            >
                                {simRunning ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                {simRunning ? 'Running…' : 'Run Simulation'}
                            </button>
                            <button
                                onClick={resetSim}
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 text-sm px-4 py-2.5 transition cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Metrics</span>
                                <span className={`text-[10px] font-mono ${meters.accentText} font-bold`}>{meters.tag} {meters.label}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-center">
                                    <div className="text-lg font-extrabold text-slate-100">{meters.calls}</div>
                                    <div className="text-[9px] font-mono text-slate-500 uppercase">calls</div>
                                </div>
                                <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-center">
                                    <div className="text-lg font-extrabold text-slate-100">{(meters.latencyMs / 1000).toFixed(1)}s</div>
                                    <div className="text-[9px] font-mono text-slate-500 uppercase">latency</div>
                                </div>
                                <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-center">
                                    <div className="text-lg font-extrabold text-slate-100">{meters.costX}×</div>
                                    <div className="text-[9px] font-mono text-slate-500 uppercase">cost</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1"><span>LATENCY</span><span>{latencyPct}%</span></div>
                                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                        <div className={`h-full rounded-full bg-gradient-to-r ${meters.bar} transition-all duration-500`} style={{ width: `${latencyPct}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1"><span>COST</span><span>{Math.min(100, costPct)}%</span></div>
                                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                        <div className={`h-full rounded-full bg-gradient-to-r ${meters.bar} transition-all duration-500`} style={{ width: `${costPct}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pipeline + console column */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Pipeline visualization */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Execution pipeline</span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${simStatus === 'Complete'
                                    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                    : simStatus === 'Running…'
                                        ? 'text-orange-400 border-orange-500/40 bg-orange-500/10 animate-pulse'
                                        : 'text-slate-500 border-slate-700 bg-slate-800/50'
                                    }`}>
                                    {simStatus === 'Running…' ? <LoaderCircle className="w-3 h-3 inline mr-1 animate-spin" /> : null}
                                    {simStatus}
                                </span>
                            </div>
                            <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
                                {SIM_META[simType].nodes.map((node, idx) => {
                                    const Icon = NODE_ICONS[node.icon];
                                    const isActive = simRunning && simStep === idx;
                                    const isDone = simStatus === 'Complete' || (simRunning && simStep > idx);
                                    return (
                                        <div key={idx} className="flex items-center gap-2 shrink-0">
                                            <div className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-3 py-3 min-w-[86px] transition-all duration-300 ${isActive
                                                ? `${meters.accentRing} ${meters.bar} bg-slate-800 border-2 scale-105 shadow-lg`
                                                : isDone
                                                    ? 'border-emerald-500/40 bg-emerald-500/10'
                                                    : 'border-slate-800 bg-slate-900'
                                                }`}>
                                                {isDone && !isActive ? (
                                                    <Check className={`w-5 h-5 ${simStatus === 'Complete' ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                                ) : (
                                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white animate-pulse' : 'text-slate-500'}`} />
                                                )}
                                                <span className={`text-[9px] font-mono text-center leading-tight ${isActive ? 'text-white font-bold' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {node.label}
                                                </span>
                                                {isActive && <span className="text-[8px] font-mono text-white/80 animate-pulse">● running</span>}
                                            </div>
                                            {idx < SIM_META[simType].nodes.length - 1 && (
                                                <div className="text-slate-700"><ArrowRight className="w-3.5 h-3.5" /></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div className={`h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-300`} style={{ width: `${simProgress}%` }} />
                            </div>
                        </div>

                        {/* Console */}
                        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900/70">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                                <span className="ml-2 text-[10px] font-mono text-slate-500">agent_sandbox — live execution trace</span>
                                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
                                    <Timer className="w-3 h-3" /> {simRunning ? 'streaming' : simStatus === 'Complete' ? 'finished' : 'idle'}
                                </span>
                            </div>
                            <div ref={simConsoleRef} className="h-44 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed space-y-1">
                                {simLogs.length === 0 ? (
                                    <span className="text-slate-600">$ press <span className="text-orange-400">Run Simulation</span> to stream an execution trace…</span>
                                ) : (
                                    simLogs.map((log, i) => (
                                        <div key={i} className={log.tone}>
                                            <span className="text-slate-600 select-none">› </span>{log.text}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz widget */}
                <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-slate-100 text-sm">Quick Decision Quiz — which should YOU start with?</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Answer honestly. Three questions, one recommendation. <button onClick={() => setQuiz({ q1: null, q2: null, q3: null })} className="text-orange-400 hover:text-orange-300 underline underline-offset-2 cursor-pointer">Reset quiz</button></p>
                    <div className="space-y-3">
                        {QUIZ_QUESTIONS.map((q) => {
                            return (
                                <div key={q.key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3">
                                    <div className="min-w-0">
                                        <div className="text-sm text-slate-200 font-semibold">{q.text}</div>
                                        <div className="text-[11px] text-slate-500">{q.hint}</div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => answerQuiz(q.key, true)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${quiz[q.key] === true
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                                : 'border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400'
                                                }`}
                                        >
                                            ✓ Yes
                                        </button>
                                        <button
                                            onClick={() => answerQuiz(q.key, false)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${quiz[q.key] === false
                                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                                                : 'border-slate-700 text-slate-400 hover:border-rose-500/40 hover:text-rose-400'
                                                }`}
                                        >
                                            ✗ No
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {quizRecommendation && (
                        <div className="mt-4 rounded-xl border px-4 py-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950">
                            <div>
                                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Recommendation</div>
                                <div className="font-extrabold text-slate-100 text-lg">
                                    {quizRecommendation === 'llm' && '🎯 Start with an LLM Call — keep it one-shot'}
                                    {quizRecommendation === 'workflow' && '🔀 Start with an Agentic Workflow — encode the steps'}
                                    {quizRecommendation === 'agent' && '🤖 Start with an Autonomous Agent — but add guardrails'}
                                    {quizRecommendation === 'shrink' && '✂️ Shrink the scope — it is not LLM-shaped yet'}
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 max-w-xs">
                                {quizRecommendation === 'llm' && 'One call is enough. Add structure, few-shot examples, and code-side validation. Revisit only when accuracy demands it.'}
                                {quizRecommendation === 'workflow' && 'Draw the DAG now, gate every step, parallelize the independent branches, and instrument each node.'}
                                {quizRecommendation === 'agent' && 'ReAct loop + strict budget, idempotent tools, human approval on irreversible actions, full trajectory logging.'}
                                {quizRecommendation === 'shrink' && 'Break the problem into deterministic pieces first. If it still looks loose, cut scope before adding autonomy.'}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ===================== ESCALATION PATH ===================== */}
            <section className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Route className="w-4 h-4" /> Escalation Path
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Think Before You Build</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm border-collapse min-w-[640px]">
                        <thead>
                            <tr className="text-left border-b-2 border-slate-200">
                                <th className="py-3 pr-4 font-extrabold text-slate-900">Scenario</th>
                                <th className="py-3 pr-4 font-extrabold text-slate-900">Start with</th>
                                <th className="py-3 pr-4 font-extrabold text-slate-900">Escalate to</th>
                                <th className="py-3 font-extrabold text-slate-900">Why</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600">
                            {[
                                ['Classify a support ticket', '🎯 LLM call', '🔀 Workflow if follow-up actions needed', 'One call is enough for the label'],
                                ['Summarize a long doc', '🎯 LLM call (chunked)', '🔀 Map-reduce workflow if beyond context', 'Fixed structure — no autonomy'],
                                ['Answer questions over a codebase', '🔀 RAG workflow', '🤖 Agent for multi-hop repo exploration', 'Can’t enumerate every query path'],
                                ['Fix a failing test', '🔀 Workflow (reproduce → diagnose → patch → rerun)', '🤖 Agent if fix needs unknown code exploration', 'Known steps get deterministic control'],
                                ['"Plan a trip and book it"', 'Pointless as a call', '🤖 Autonomous agent (or workflow + human approval)', 'Search count and ordering unknowable'],
                            ].map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/60 border-b border-slate-100' : 'border-b border-slate-100'}>
                                    <td className="py-3 pr-4 font-semibold text-slate-900">{row[0]}</td>
                                    <td className="py-3 pr-4">{row[1]}</td>
                                    <td className="py-3 pr-4">{row[2]}</td>
                                    <td className="py-3">{row[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ===================== COST / LATENCY REALITY CHECK ===================== */}
            <section className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Coins className="w-4 h-4" /> Reality Check
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Cost & Latency</h2>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                        <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-extrabold text-slate-900">1×</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relative cost</div>
                        <div className="text-xs text-slate-600 font-semibold mb-1">~0.3–2s</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1 call per task</div>
                    </div>
                    <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <Workflow className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <div className="text-2xl font-extrabold text-slate-900">3–10×</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relative cost</div>
                        <div className="text-xs text-slate-600 font-semibold mb-1">~1–10s</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2–10 calls per task</div>
                    </div>
                    <div className="p-5 rounded-xl bg-rose-50/70 border border-rose-100 text-center">
                        <Bot className="w-6 h-6 text-rose-600 mx-auto mb-2" />
                        <div className="text-2xl font-extrabold text-slate-900">10–50×</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relative cost</div>
                        <div className="text-xs text-slate-600 font-semibold mb-1">~10s – minutes</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">5–50+ calls per task</div>
                    </div>
                </div>

                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <strong className="text-slate-900">The pragmatic rule:</strong>
                    {" "}every pattern is a many-call pipeline with different trust in the control flow. If a 5-call workflow solves it, a 20-call agent adds risk, not capability. <strong>Autonomy should be earned, not assumed.</strong>
                </p>
            </section>

            {/* ===================== FINAL TAKEAWAY ===================== */}
            <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-emerald-50 border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-10">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                    <Gauge className="w-4 h-4" /> Final Takeaway
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5 leading-tight">
                    Prefer the least autonomous option that works
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-900">Simple + low latency</strong> → 🎯 LLM call. <strong className="text-slate-900">Consistent + controlled</strong> → 🔀 agentic workflow. <strong className="text-slate-900">Flexible + autonomous</strong> (with guardrails) → 🤖 autonomous agent.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-900">Escalate deliberately</strong> — call → workflow → agent. Each step up multiplies cost, latency, and failure surface.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-900">Defer autonomy until you have observability and guardrails</strong> — instrument first, cap iteration budgets, sandbox tools, gate irreversible actions behind a human.</span>
                        </li>
                    </ul>
                    <div className="p-5 rounded-xl bg-white/80 border border-orange-200 shadow-sm">
                        <div className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider mb-3">The Load-Bearing Sentence</div>
                        <p className="text-sm text-slate-700 leading-relaxed italic">
                            In a workflow, your code leads; in an agent, the model leads —{" "}
                            <strong>and only the model can go off-script.</strong>
                        </p>
                        <p className="mt-4 text-xs text-slate-500 border-t border-slate-200 pt-3">
                            Master the pattern choice, not the library. The tools will change; the control-vs-autonomy decision will not.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer chip */}
            <div className="text-center">
                <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                    {t.footer.agenticText} — Full reference: <code className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">references_doc/agentic_types/README.md</code>
                </p>
            </div>
        </div>
    );
};

const agentSkeleton = `# Goal-first autonomous loop (ReAct skeleton)
while not done and budget_remaining():
    thought = plan_next_action(goal, observations)
    if thought.is_final():      # done — emit answer
        break
    action = pick_tool(thought) # restricted toolset
    result = action.invoke()    # idempotency key + structured errors
    observations.append(result)
    log_trajectory(thought, action, result)`;

export default AgentTypesBlog;