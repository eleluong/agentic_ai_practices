import { useState, useEffect, useRef } from 'react';
import { 
  GitFork, 
  Layers, 
  RotateCw, 
  Network, 
  Play, 
  Zap, 
  Cpu, 
  Check, 
  Terminal, 
  GitBranch, 
  GitCommit,
  GitMerge,
  Search, 
  PenTool 
} from 'lucide-react';

export const AIPatterns = () => {
  // --- Pattern 1: Divide & Conquer Simulation State ---
  const [divideStep, setDivideStep] = useState<number>(0); // 0: idle, 1: decompose, 2: parallel, 3: aggregate, 4: complete
  const divideTimerRef = useRef<number[]>([]);

  const resetDivideSim = () => {
    divideTimerRef.current.forEach(clearTimeout);
    divideTimerRef.current = [];
    setDivideStep(0);
  };

  const runDivideSim = () => {
    resetDivideSim();
    setDivideStep(1);

    const t1 = window.setTimeout(() => {
      setDivideStep(2);
    }, 1000);

    const t2 = window.setTimeout(() => {
      setDivideStep(3);
    }, 2000);

    const t3 = window.setTimeout(() => {
      setDivideStep(4);
    }, 3000);

    divideTimerRef.current = [t1, t2, t3];
  };

  // --- Pattern 2: Enrichment Simulation State ---
  const [enrichStep, setEnrichStep] = useState<number>(0); // 0: ready, 1: processing, 2: complete
  const enrichTimerRef = useRef<number[]>([]);

  const resetEnrichSim = () => {
    enrichTimerRef.current.forEach(clearTimeout);
    enrichTimerRef.current = [];
    setEnrichStep(0);
  };

  const runEnrichSim = () => {
    resetEnrichSim();
    setEnrichStep(1);

    const t1 = window.setTimeout(() => {
      setEnrichStep(2);
    }, 1200);

    enrichTimerRef.current = [t1];
  };

  // --- Pattern 3: Reflection Simulation State ---
  const [reflectStep, setReflectStep] = useState<number>(0); // 0: idle, 1: draft bug, 2: issue found, 3: corrected draft, 4: verified
  const reflectTimerRef = useRef<number[]>([]);

  const resetReflectSim = () => {
    reflectTimerRef.current.forEach(clearTimeout);
    reflectTimerRef.current = [];
    setReflectStep(0);
  };

  const runReflectSim = () => {
    resetReflectSim();
    setReflectStep(1); // Draft with bug

    const t1 = window.setTimeout(() => {
      setReflectStep(2); // Evaluator flags issue
    }, 1000);

    const t2 = window.setTimeout(() => {
      setReflectStep(3); // Generator self-corrects
    }, 2200);

    const t3 = window.setTimeout(() => {
      setReflectStep(4); // Accepted
    }, 3200);

    reflectTimerRef.current = [t1, t2, t3];
  };

  // --- Pattern 4: Branch -> Resolve -> Merge Simulation State ---
  // 0: idle (c1 ready)
  // 1: main thread advances c1 -> c2
  // 2: branch forks to b1 while c2 stays active
  // 3: parallel execution (main c2 -> c3 & branch b1 -> b2 validated)
  // 4: merged into c3 (c1->c2->c3 trunk + verified branch unified)
  const [branchStep, setBranchStep] = useState<number>(0);
  const branchTimerRef = useRef<number[]>([]);

  const resetBranchSim = () => {
    branchTimerRef.current.forEach(clearTimeout);
    branchTimerRef.current = [];
    setBranchStep(0);
  };

  const runBranchSim = () => {
    resetBranchSim();
    setBranchStep(1); // Step 1: Main thread advances c1 -> c2

    const t1 = window.setTimeout(() => {
      setBranchStep(2); // Step 2: Fork sub-agent branch b1 (while main holds at c2)
    }, 1200);

    const t2 = window.setTimeout(() => {
      setBranchStep(3); // Step 3: Parallel execution (main continues towards c3, branch resolves at b2)
    }, 2400);

    const t3 = window.setTimeout(() => {
      setBranchStep(4); // Step 4: Both paths converge and merge cleanly into c3
    }, 3800);

    branchTimerRef.current = [t1, t2, t3];
  };

  // --- Sandbox Simulation State ---
  const [sbTask, setSbTask] = useState<'code' | 'research' | 'customer'>('code');
  const [useDivide, setUseDivide] = useState(true);
  const [useEnrich, setUseEnrich] = useState(true);
  const [useReflect, setUseReflect] = useState(true);
  const [useBranch, setUseBranch] = useState(true);

  const [sbRunning, setSbRunning] = useState(false);
  const [sbProgress, setSbProgress] = useState(0);
  const [sbLogs, setSbLogs] = useState<{ text: string; color: string }[]>([
    { text: '// System initialized. Configure parameters and click "Run Agentic Workflow".', color: 'text-slate-400' }
  ]);
  const [sbStatus, setSbStatus] = useState<'Ready' | 'Executing...' | 'Finished'>('Ready');
  const [metrics, setMetrics] = useState({ rel: '99.4%', reuse: '78%', retries: 0 });
  const sandboxTimerRef = useRef<number[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  const executeSandbox = () => {
    sandboxTimerRef.current.forEach(clearTimeout);
    sandboxTimerRef.current = [];

    setSbRunning(true);
    setSbStatus('Executing...');
    setSbProgress(5);

    const taskLabel = 
      sbTask === 'code' ? 'Refactor Legacy Codebase with Security Patching' :
      sbTask === 'research' ? 'Aggregate & Synthesize 10 Research Papers' :
      'Automate Enterprise Refund & Dispute Resolution';

    setSbLogs([
      { text: `[START] Initializing workflow execution for task: ${taskLabel}`, color: 'text-blue-400' }
    ]);

    let delay = 500;
    let step = 10;
    const timers: number[] = [];

    const addLog = (text: string, color: string, progressIncrement: number) => {
      const t = window.setTimeout(() => {
        setSbLogs(prev => [...prev, { text, color }]);
        step += progressIncrement;
        setSbProgress(Math.min(step, 92));
      }, delay);
      timers.push(t);
      delay += 800;
    };

    if (useDivide) {
      addLog('⚡ [Divide & Conquer] Decomposing monolithic request into 3 structured sub-tasks...', 'text-blue-400', 15);
      addLog('   ├─ Subtask A: Schema Extraction & Setup', 'text-slate-400', 10);
      addLog('   ├─ Subtask B: Core Business Logic Processing', 'text-slate-400', 10);
      addLog('   └─ Subtask C: Formatting & Edge Case Alignment', 'text-slate-400', 10);
    } else {
      addLog('⚠️ [Monolithic Step] Sending entire massive prompt directly to LLM without decomposition...', 'text-amber-400', 25);
    }

    if (useBranch) {
      addLog('🌿 [Branch → Resolve → Merge] Subtask B encountered missing references. Forking sub-agent branch #b12...', 'text-purple-400', 15);
      addLog('   └─ Branch #b12: Resolving context in isolation without blocking main state... Merged!', 'text-purple-300', 10);
    }

    if (useEnrich) {
      addLog('✨ [Enrichment] Ingesting dynamic tool outputs. Injecting delta updates into preserved output state...', 'text-emerald-400', 15);
    }

    if (useReflect) {
      addLog('🔄 [Reflection] Critic Agent inspecting combined state...', 'text-amber-400', 10);
      addLog('   ├─ Check 1: Schema validation -> PASS', 'text-slate-400', 5);
      addLog('   └─ Check 2: Constraint compliance -> PASS', 'text-slate-400', 5);
    }

    const finalT = window.setTimeout(() => {
      setSbProgress(100);
      setSbStatus('Finished');
      setSbLogs(prev => [
        ...prev, 
        { text: '[SUCCESS] Workflow completed cleanly with high predictability!', color: 'text-emerald-400 font-bold' }
      ]);
      setSbRunning(false);

      const numPatterns = [useDivide, useEnrich, useReflect, useBranch].filter(Boolean).length;
      setMetrics({
        rel: `${(85 + numPatterns * 3.5).toFixed(1)}%`,
        reuse: `${20 + numPatterns * 15}%`,
        retries: useReflect ? 1 : 0
      });
    }, delay);

    timers.push(finalT);
    sandboxTimerRef.current = timers;
  };

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sbLogs]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      divideTimerRef.current.forEach(clearTimeout);
      enrichTimerRef.current.forEach(clearTimeout);
      reflectTimerRef.current.forEach(clearTimeout);
      branchTimerRef.current.forEach(clearTimeout);
      sandboxTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto pt-6">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest inline-flex items-center mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
          Architectural Guide for Reliable Agentic Systems
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 leading-tight">
          Mini Patterns for Stable AI Workflows
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Stop relying on brittle monolithic LLM calls. Control complexity, isolate failure modes, and maintain predictable state using four lightweight design patterns.
        </p>

        {/* 4 Overview Pillar Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left mt-10">
          <button 
            onClick={() => scrollToAnchor('divide-conquer')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider mb-1">Pattern 1</div>
            <div className="text-base font-bold text-slate-900">Divide & Conquer</div>
            <div className="text-xs text-slate-500 mt-1">Split complex tasks into subtasks</div>
          </button>

          <button 
            onClick={() => scrollToAnchor('enrichment')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">Pattern 2</div>
            <div className="text-base font-bold text-slate-900">Enrichment</div>
            <div className="text-xs text-slate-500 mt-1">Enhance state without full regeneration</div>
          </button>

          <button 
            onClick={() => scrollToAnchor('reflection')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <RotateCw className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider mb-1">Pattern 3</div>
            <div className="text-base font-bold text-slate-900">Reflection</div>
            <div className="text-xs text-slate-500 mt-1">Inspect & correct before accept</div>
          </button>

          <button 
            onClick={() => scrollToAnchor('branch-merge')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-md transition group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GitFork className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-purple-600 font-bold uppercase tracking-wider mb-1">Pattern 4</div>
            <div className="text-base font-bold text-slate-900">Branch → Merge</div>
            <div className="text-xs text-slate-500 mt-1">Fork & resolve in isolation</div>
          </button>
        </div>
      </div>

      {/* Pattern 1: Divide & Conquer Section Card */}
      <section id="divide-conquer" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Details */}
          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Network className="w-4 h-4" /> Pattern 01
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span>Divide & Conquer</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-5">
              Break a complex, high-entropy prompt into small, independent subtasks. Instead of demanding one monolithic LLM solve an entire problem in a single pass, isolate the logic.
            </p>

            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-950 text-xs leading-relaxed mb-6 font-mono">
              <strong className="text-blue-700 font-bold block mb-1">CORE PRINCIPLE:</strong>
              Complexity is easier to control, debug, and model accurately when isolated into smaller units.
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <span><strong className="text-slate-900">Decompose:</strong> Structure the complex prompt into distinct mini-prompts.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <span><strong className="text-slate-900">Solve Independently:</strong> Run subtasks in parallel or sequential isolated steps.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <span><strong className="text-slate-900">Aggregate:</strong> Combine deterministic schemas into the final output.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={runDivideSim}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Simulate Step-by-Step
              </button>
              <button 
                onClick={resetDivideSim}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Visual Simulator (Clean dark canvas) */}
          <div className="w-full lg:w-7/12 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-slate-100 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span> Flowchart: Divide & Conquer
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                divideStep === 0 ? 'bg-slate-800 text-slate-400' :
                divideStep === 1 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                divideStep === 2 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                divideStep === 3 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {divideStep === 0 && 'Idle'}
                {divideStep === 1 && 'Step 1: Decomposing'}
                {divideStep === 2 && 'Step 2: Parallel Subtasks'}
                {divideStep === 3 && 'Step 3: Aggregating'}
                {divideStep === 4 && 'Complete'}
              </span>
            </div>

            <div className="relative py-4 flex flex-col items-center justify-center gap-6">
              {/* Top Input Node */}
              <div className={`p-3.5 px-6 rounded-xl border text-center transition-all duration-300 w-64 ${
                divideStep >= 1 ? 'border-blue-500 bg-blue-950/50 shadow-md shadow-blue-500/20' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Input Task</div>
                <div className="text-sm font-semibold text-white">Complex Reasoning Task</div>
              </div>

              {/* Arrow Down */}
              <div className="h-6 w-0.5 bg-slate-800 relative">
                <div className={`absolute inset-0 bg-blue-500 transition-all duration-300 ${divideStep >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>

              {/* Decomposer Node */}
              <div className={`p-3 px-6 rounded-xl border text-center transition-all duration-300 w-56 ${
                divideStep >= 1 ? 'ring-2 ring-blue-500 bg-blue-900/50 border-blue-400' : 'bg-blue-950/40 border-blue-800/60'
              }`}>
                <div className="text-xs font-mono text-blue-400 font-semibold">STEP 1: DECOMPOSE</div>
                <div className="text-xs font-medium text-slate-200">Planner / Router AI</div>
              </div>

              {/* Split Connector Lines */}
              <div className="w-full max-w-md h-6 relative">
                <svg className="w-full h-full text-slate-800" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M 50 0 L 50 10 L 15 10 L 15 24 M 50 10 L 50 24 M 50 10 L 85 10 L 85 24" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path 
                    d="M 50 0 L 50 10 L 15 10 L 15 24 M 50 10 L 50 24 M 50 10 L 85 10 L 85 24" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2.5" 
                    className={`transition-opacity duration-300 ${divideStep >= 2 ? 'opacity-100' : 'opacity-0'}`} 
                  />
                </svg>
              </div>

              {/* 3 Subtask Nodes */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
                <div className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                  divideStep >= 2 ? 'border-blue-500 bg-blue-900/40 scale-105 shadow-md shadow-blue-500/20' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="text-[10px] font-mono text-slate-400">SUBTASK 1</div>
                  <div className="text-xs font-medium text-slate-200 mt-0.5">Parse Data</div>
                </div>
                <div className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                  divideStep >= 2 ? 'border-blue-500 bg-blue-900/40 scale-105 shadow-md shadow-blue-500/20' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="text-[10px] font-mono text-slate-400">SUBTASK 2</div>
                  <div className="text-xs font-medium text-slate-200 mt-0.5">Analyze Logic</div>
                </div>
                <div className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                  divideStep >= 2 ? 'border-blue-500 bg-blue-900/40 scale-105 shadow-md shadow-blue-500/20' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="text-[10px] font-mono text-slate-400">SUBTASK 3</div>
                  <div className="text-xs font-medium text-slate-200 mt-0.5">Format Schema</div>
                </div>
              </div>

              {/* Merge Lines */}
              <div className="w-full max-w-md h-6 relative">
                <svg className="w-full h-full text-slate-800" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M 15 0 L 15 14 L 50 14 L 50 24 M 50 0 L 50 24 M 85 0 L 85 14 L 50 14 L 50 24" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path 
                    d="M 15 0 L 15 14 L 50 14 L 50 24 M 50 0 L 50 24 M 85 0 L 85 14 L 50 14 L 50 24" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2.5" 
                    className={`transition-opacity duration-300 ${divideStep >= 3 ? 'opacity-100' : 'opacity-0'}`} 
                  />
                </svg>
              </div>

              {/* Aggregator Node */}
              <div className={`p-3 px-6 rounded-xl border text-center transition-all duration-300 w-56 ${
                divideStep >= 3 ? 'ring-2 ring-blue-500 bg-blue-900/50 border-blue-400' : 'bg-blue-950/40 border-blue-800/60'
              }`}>
                <div className="text-xs font-mono text-blue-400 font-semibold">STEP 2: AGGREGATE</div>
                <div className="text-xs font-medium text-slate-200">Synthesizer Agent</div>
              </div>

              <div className="h-4 w-0.5 bg-slate-800"></div>

              {/* Final Result Node */}
              <div className={`p-3.5 px-6 rounded-xl border text-center transition-all duration-300 w-64 ${
                divideStep === 4 ? 'border-emerald-500 bg-emerald-950/40 scale-105 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="text-[10px] font-mono text-emerald-400 font-bold">OUTPUT</div>
                <div className="text-xs font-bold text-white">Final High-Precision Result</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern 2: Enrichment, Not Replacement Section Card */}
      <section id="enrichment" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row-reverse items-start gap-8">
          {/* Right Details */}
          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" /> Pattern 02
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span>Enrichment, Not Replacement</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-5">
              Use new information to selectively update or expand an existing result rather than regenerating everything from scratch.
            </p>

            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-950 text-xs leading-relaxed mb-6 font-mono">
              <strong className="text-emerald-700 font-bold block mb-1">CORE PRINCIPLE:</strong>
              Incremental improvement preserves state, avoids context collapse, and reduces latency compared to full rewrites.
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <span><strong className="text-slate-900">Preserve Output:</strong> Lock verified output fields (e.g., base code structure).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <span><strong className="text-slate-900">Inject Context:</strong> Retrieve search results, user context, or dynamic tools.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <span><strong className="text-slate-900">Delta Update:</strong> Append missing details without disturbing verified content.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={runEnrichSim}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Simulate Enrichment
              </button>
              <button 
                onClick={resetEnrichSim}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Visualizer Canvas */}
          <div className="w-full lg:w-7/12 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Flowchart: Enrichment Engine
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                enrichStep === 0 ? 'bg-slate-800 text-slate-400' :
                enrichStep === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {enrichStep === 0 && 'Ready'}
                {enrichStep === 1 && 'Merging Info...'}
                {enrichStep === 2 && 'Success (No Regeneration)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Source A */}
              <div className={`p-4 rounded-xl border transition-all ${
                enrichStep >= 1 ? 'border-emerald-500 bg-emerald-950/20' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Existing State</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Preserved</span>
                </div>
                <div className="text-xs font-mono text-slate-300 bg-black/40 p-2.5 rounded border border-slate-800">
                  {`{\n  "title": "Quarterly Report",\n  "status": "Draft"\n}`}
                </div>
              </div>

              {/* Source B */}
              <div className={`p-4 rounded-xl border transition-all ${
                enrichStep >= 1 ? 'border-blue-500 bg-blue-950/20' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400 font-semibold">New Context</span>
                  <span className="text-[10px] bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded">Delta</span>
                </div>
                <div className="text-xs font-mono text-slate-300 bg-black/40 p-2.5 rounded border border-slate-800">
                  + Live Financial Metrics<br />
                  + Q4 Citation Sources
                </div>
              </div>
            </div>

            {/* Processor Node */}
            <div className="flex items-center justify-center my-4">
              <div className={`w-full max-w-md p-3.5 rounded-xl border text-center transition-all duration-300 ${
                enrichStep >= 1 ? 'ring-2 ring-emerald-500 scale-105 bg-emerald-950/40 border-emerald-700' : 'bg-emerald-950/30 border-emerald-800/60'
              }`}>
                <div className="text-xs font-mono text-emerald-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> ENRICHMENT PROCESSOR
                </div>
                <div className="text-xs text-slate-300">Merges Context into Preserved Model State</div>
              </div>
            </div>

            {/* Output */}
            <div className={`p-4 rounded-xl border transition-all duration-300 ${
              enrichStep === 2 ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-500/10' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">Improved Output (Preserved + Enriched)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  enrichStep === 2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {enrichStep === 2 ? 'Preserved & Extended' : 'Waiting...'}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 bg-black/60 p-3 rounded border border-slate-800 min-h-[95px] whitespace-pre-wrap">
                {enrichStep < 2 ? (
                  '// Run simulation to observe incremental state enrichment without full regeneration...'
                ) : (
                  <div>
                    <span className="text-slate-400">{'{'}<br /></span>
                    <span className="text-emerald-400">&nbsp;&nbsp;"title": "Quarterly Report", // (Preserved)<br /></span>
                    <span className="text-emerald-400">&nbsp;&nbsp;"status": "Draft", // (Preserved)<br /></span>
                    <span className="text-amber-300">&nbsp;&nbsp;"metrics": {'{ "Q4_Revenue": "$2.4M", "Growth": "+18%" }'}, // (Enriched)<br /></span>
                    <span className="text-amber-300">&nbsp;&nbsp;"verified_sources": ["SEC-10K", "Internal Audit"] // (Enriched)<br /></span>
                    <span className="text-slate-400">{'}'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern 3: Reflection Section Card */}
      <section id="reflection" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Details */}
          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <RotateCw className="w-4 h-4" /> Pattern 03
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span>Reflection Loop</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-5">
              Introduce an explicit verification step before accepting an output. Separate the generation model from the evaluation model to catch hallucinations and logic bugs.
            </p>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-100 text-amber-950 text-xs leading-relaxed mb-6 font-mono">
              <strong className="text-amber-700 font-bold block mb-1">CORE PRINCIPLE:</strong>
              Separate generation from verification. AI self-evaluates outputs against explicit rules before releasing.
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <span><strong className="text-slate-900">Generate:</strong> Produce an initial draft response.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <span><strong className="text-slate-900">Reflect:</strong> Critic agent inspects output for errors, missed edge cases, or format flaws.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <span><strong className="text-slate-900">Correct or Accept:</strong> If issues are found, re-route to generator with feedback. Repeat until valid.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={runReflectSim}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Trigger Reflection Loop
              </button>
              <button 
                onClick={resetReflectSim}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Visualizer Canvas */}
          <div className="w-full lg:w-7/12 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span> Loop Diagram: Reflection & Revision
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Iter Loop:</span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {reflectStep === 0 ? '0' : reflectStep <= 2 ? '1' : '2'}
                </span>
              </div>
            </div>

            {/* Node Pairs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div className={`p-4 rounded-xl border transition-all duration-300 ${
                reflectStep >= 1 ? 'border-amber-500 bg-amber-950/20' : 'bg-slate-900 border-slate-800'
              } ${reflectStep >= 3 ? 'ring-2 ring-amber-500' : ''}`}>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold mb-2">
                  <PenTool className="w-4 h-4 text-amber-400" /> Generator Agent
                </div>
                <div className="text-xs text-slate-400 mb-3">Drafting code or text solution...</div>
                <div className="text-xs font-mono p-2 rounded bg-black/50 border border-slate-800 text-slate-300 whitespace-pre-wrap min-h-[60px]">
                  {reflectStep === 0 && <span className="text-slate-500">Pending generation...</span>}
                  {reflectStep === 1 && "def parse_data(raw):\n    return raw.split(',') # Missed null check"}
                  {reflectStep === 2 && "def parse_data(raw):\n    return raw.split(',') # Missed null check"}
                  {reflectStep >= 3 && "def parse_data(raw):\n    if not raw: return []\n    return [x.strip() for x in raw.split(',')]"}
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-all duration-300 ${
                reflectStep >= 2 ? 'border-amber-500 bg-amber-950/20' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold">
                    <Search className="w-4 h-4 text-amber-400" /> Evaluator / Inspector
                  </div>
                </div>
                <div className="text-xs text-slate-400 mb-3">Checking for hallucinations/bugs...</div>
                <div className="text-xs font-mono p-2 rounded bg-black/50 border border-slate-800 text-slate-300 min-h-[60px]">
                  {reflectStep < 2 && <span className="text-slate-500">Idle</span>}
                  {reflectStep === 2 && <span className="text-red-400">❌ Issue Detected: Fails if 'raw' is None or contains trailing whitespace.</span>}
                  {reflectStep === 3 && <span className="text-amber-300">Re-evaluating corrected draft...</span>}
                  {reflectStep === 4 && <span className="text-emerald-400">✅ Verification Passed! Zero syntax or boundary errors.</span>}
                </div>
              </div>
            </div>

            {/* Decision Fork */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Decision Fork</div>
                  <div className="text-sm font-semibold text-white">
                    {reflectStep === 0 && 'Awaiting Evaluation'}
                    {reflectStep === 1 && 'Generating initial draft...'}
                    {reflectStep === 2 && 'Rejecting Draft → Requesting Correction'}
                    {reflectStep === 3 && 'Validating revised draft...'}
                    {reflectStep === 4 && 'Verified Safe for Production Execution'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded border text-xs font-mono ${
                    reflectStep === 2 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    reflectStep === 4 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    Issues: {reflectStep === 2 ? 'Found (1)' : reflectStep === 4 ? 'Clean' : 'Unknown'}
                  </div>
                  <div className={`px-3 py-1 rounded border text-xs font-mono ${
                    reflectStep === 4 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    Status: {reflectStep === 4 ? 'ACCEPTED' : 'Unverified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern 4: Branch -> Resolve -> Merge Section Card */}
      <section id="branch-merge" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row-reverse items-start gap-8">
          {/* Right Details */}
          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-2 text-purple-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <GitFork className="w-4 h-4" /> Pattern 04
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span>Branch → Resolve → Merge</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-5">
              Keep the primary workflow thread running safely while isolating uncertain subproblems or long-running debugging steps into temporary sub-agent branches.
            </p>

            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-100 text-purple-950 text-xs leading-relaxed mb-6 font-mono">
              <strong className="text-purple-700 font-bold block mb-1">KEY IDEA:</strong>
              Don't block or crash the main agent pipeline. Fork the problem, fix and validate in isolation, and merge back clean context.
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <span><strong className="text-slate-900">Branch:</strong> Fork state when encountering an ambiguity, error, or mini-task.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <span><strong className="text-slate-900">Resolve:</strong> Mini-agent resolves the isolated issue without corrupting main memory.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <span><strong className="text-slate-900">Merge & Continue:</strong> Integrate only the verified fix and continue primary execution.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={runBranchSim}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Simulate Git-Style Branch
              </button>
              <button 
                onClick={resetBranchSim}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Visualizer Canvas */}
          <div className="w-full lg:w-7/12 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span> Interactive Git-Style DAG Diagram
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                branchStep === 0 ? 'bg-slate-800 text-slate-400' :
                branchStep === 1 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                branchStep === 2 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                branchStep === 3 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {branchStep === 0 && 'Main Branch Active'}
                {branchStep === 1 && 'Main Running: c1 ──► c2'}
                {branchStep === 2 && 'Forked: feature/isolate-task'}
                {branchStep === 3 && 'Parallel Resolving (c2 active & b2 resolved)'}
                {branchStep === 4 && 'Merged to Main (Clean FF)'}
              </span>
            </div>

            {/* Git Branch Canvas Visual */}
            <div className="relative py-4 min-h-[300px] flex flex-col justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-4 overflow-x-auto">
              <div className="w-[500px] mx-auto relative">
                {/* SVG Connections */}
                <svg className="w-full h-48 absolute inset-0 pointer-events-none z-0" viewBox="0 0 500 180" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="mainGradient" x1="60" y1="45" x2="440" y2="45" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="branchGradient" x1="90" y1="45" x2="410" y2="45" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="70%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Main Branch Rail Line */}
                  <path d="M 60 45 L 440 45" stroke="#334155" strokeWidth="4" strokeDasharray="6 6" />
                  <path 
                    id="git-main-path" 
                    d="M 60 45 L 440 45" 
                    stroke="url(#mainGradient)" 
                    strokeWidth="4" 
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="380" 
                    strokeDashoffset={
                      branchStep === 0 ? 380 :
                      branchStep === 1 ? 190 :
                      branchStep === 2 ? 190 :
                      branchStep === 3 ? 95 : 0
                    }
                    className="transition-all duration-700" 
                  />

                  {/* Fork Curve (Main M1 -> Branch B1 -> Merge M3) */}
                  <path d="M 90 45 C 130 45, 130 135, 170 135 L 330 135 C 370 135, 370 45, 410 45" stroke="#334155" strokeWidth="3" fill="none" strokeDasharray="4 4" />
                  <path 
                    id="git-branch-path" 
                    d="M 90 45 C 130 45, 130 135, 170 135 L 330 135 C 370 135, 370 45, 410 45" 
                    stroke="url(#branchGradient)" 
                    strokeWidth="3.5" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray="600"
                    strokeDashoffset={
                      branchStep < 2 ? 600 :
                      branchStep === 2 ? 300 :
                      branchStep === 3 ? 300 : 0
                    }
                    className="transition-all duration-700" 
                  />
                </svg>

                {/* DAG Nodes Container */}
                <div className="relative z-10 grid grid-rows-2 gap-12 py-2">
                  {/* Main Branch Line Nodes */}
                  <div className="flex items-center justify-between px-2">
                    {/* Node M1 */}
                    <div className="flex flex-col items-center group cursor-pointer transition-all duration-300">
                      <div className="flex items-center gap-1.5 mb-1 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-mono text-blue-400">
                        <GitCommit className="w-2.5 h-2.5" /> main
                      </div>
                      <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center text-blue-400 text-xs font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                        c1
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 mt-1 font-semibold">Initial Context</span>
                    </div>

                    {/* Node M2 */}
                    <div className="flex flex-col items-center group cursor-pointer transition-all duration-300">
                      <div className={`flex items-center gap-1.5 mb-1 px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        branchStep >= 1 ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}>
                        <GitCommit className="w-2.5 h-2.5" /> main
                      </div>
                      <div className={`w-9 h-9 rounded-full bg-slate-900 border-2 flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-all ${
                        branchStep >= 1 ? 'border-blue-400 text-blue-300 shadow-lg shadow-blue-500/20 scale-105' : 'border-slate-700 text-slate-400'
                      }`}>
                        c2
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">Main Stays Active</span>
                    </div>

                    {/* Node M3 (Merge Commit) */}
                    <div className="flex flex-col items-center group cursor-pointer transition-all duration-300">
                      <div className={`flex items-center gap-1.5 mb-1 px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        branchStep === 4 ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}>
                        <GitMerge className="w-2.5 h-2.5" /> merge
                      </div>
                      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-all ${
                        branchStep === 4 ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/40 scale-110' : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}>
                        c3
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 font-semibold">State Integrated</span>
                    </div>
                  </div>

                  {/* Feature / Sub-Agent Branch Nodes */}
                  <div className="flex items-center justify-center gap-16 px-12">
                    {/* Node B1 */}
                    <div className={`flex flex-col items-center group cursor-pointer transition-all duration-300 ${
                      branchStep >= 2 ? 'opacity-100' : 'opacity-40'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-mono text-purple-400">
                        <GitBranch className="w-2.5 h-2.5" /> feature/isolate-task
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-all ${
                        branchStep >= 2 ? 'border-purple-400 text-purple-300 shadow-lg shadow-purple-500/30 scale-110' : 'border-purple-500/50 text-purple-400'
                      }`}>
                        b1
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">Fork & Isolate</span>
                    </div>

                    {/* Node B2 */}
                    <div className={`flex flex-col items-center group cursor-pointer transition-all duration-300 ${
                      branchStep >= 3 ? 'opacity-100' : 'opacity-40'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-mono text-purple-400">
                        <Check className="w-2.5 h-2.5" /> validated
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-all ${
                        branchStep >= 3 ? 'border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/30 scale-110' : 'border-purple-500/50 text-purple-400'
                      }`}>
                        b2
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">Resolve & Test</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Status Card below DAG */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  <span className="text-slate-300">
                    {branchStep === 0 && 'Main pipeline initialized at commit c1 (Context stable).'}
                    {branchStep === 1 && '▶️ Main thread running: c1 ──► c2. Pipeline stays uninterrupted.'}
                    {branchStep === 2 && '🌿 Forked sub-agent branch (b1) to solve isolated error without blocking main thread.'}
                    {branchStep === 3 && '✅ Sub-agent resolved & verified fix (b2). Main thread continued running (c2 ──► c3).'}
                    {branchStep === 4 && '🔀 Merged verified fix into main execution path (c3). Pipeline running cleanly.'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded shrink-0 ml-2">
                  {branchStep === 0 && 'HEAD: main (c1)'}
                  {branchStep === 1 && 'HEAD: main (c2)'}
                  {branchStep === 2 && 'HEAD: feature/isolate-task (b1)'}
                  {branchStep === 3 && 'HEAD: feature/isolate-task (b2)'}
                  {branchStep === 4 && 'HEAD: main (c3: merge)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Workflow Sandbox Section Card */}
      <section id="sandbox" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            Interactive Playground
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">Live AI Workflow Execution Simulator</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select a complex task scenario and toggle which Mini Patterns to apply. Watch live execution logs and state visualizer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sandbox Controls Column */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-5">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-600 uppercase mb-2">1. Select AI Task Scenario</label>
              <select 
                value={sbTask}
                onChange={(e) => setSbTask(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="code">Refactor Legacy Codebase with Security Patching</option>
                <option value="research">Aggregate & Synthesize 10 Research Papers</option>
                <option value="customer">Automate Enterprise Refund & Dispute Resolution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-600 uppercase mb-2">2. Enabled Patterns</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300 shadow-xs">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <Network className="w-4 h-4 text-blue-600" /> Pattern 1: Divide & Conquer
                  </span>
                  <input 
                    type="checkbox" 
                    checked={useDivide} 
                    onChange={(e) => setUseDivide(e.target.checked)} 
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300 shadow-xs">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" /> Pattern 2: Enrichment
                  </span>
                  <input 
                    type="checkbox" 
                    checked={useEnrich} 
                    onChange={(e) => setUseEnrich(e.target.checked)} 
                    className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300 shadow-xs">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-amber-600" /> Pattern 3: Reflection Loop
                  </span>
                  <input 
                    type="checkbox" 
                    checked={useReflect} 
                    onChange={(e) => setUseReflect(e.target.checked)} 
                    className="rounded text-amber-600 focus:ring-0 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300 shadow-xs">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-purple-600" /> Pattern 4: Branch & Merge
                  </span>
                  <input 
                    type="checkbox" 
                    checked={useBranch} 
                    onChange={(e) => setUseBranch(e.target.checked)} 
                    className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <button 
              onClick={executeSandbox} 
              disabled={sbRunning}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" /> Run Agentic Workflow
            </button>
          </div>

          {/* Live Stream Console */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between text-slate-100 shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" /> Workflow Execution Logs
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  sbStatus === 'Ready' ? 'bg-slate-800 text-slate-400' :
                  sbStatus === 'Executing...' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {sbStatus}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 mb-4 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-emerald-400 to-purple-500 h-1.5 transition-all duration-300"
                  style={{ width: `${sbProgress}%` }}
                ></div>
              </div>

              {/* Console Output */}
              <div className="font-mono text-xs text-slate-300 bg-black/70 rounded-xl p-4 h-64 overflow-y-auto border border-slate-850 space-y-2">
                {sbLogs.map((log, i) => (
                  <div key={i} className={log.color} dangerouslySetInnerHTML={{ __html: log.text }}></div>
                ))}
                <div ref={consoleBottomRef} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">RELIABILITY</div>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">{metrics.rel}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">TOKEN REUSE</div>
                <div className="font-bold text-blue-400 text-sm mt-0.5">{metrics.reuse}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">RETRIES</div>
                <div className="font-bold text-amber-400 text-sm mt-0.5">{metrics.retries}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern Summary & Comparison Matrix Card */}
      <section id="matrix" className="scroll-mt-24 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">The Pattern Matrix</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A concise architectural comparison of the 4 core mechanisms for building predictable AI systems.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-mono">
                <th className="p-4 font-bold">Pattern</th>
                <th className="p-4 font-bold">Purpose</th>
                <th className="p-4 font-bold">Core Mechanism</th>
                <th className="p-4 font-bold">When To Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-4 font-bold text-blue-600 font-mono flex items-center gap-2">
                  <Network className="w-4 h-4" /> Divide & Conquer
                </td>
                <td className="p-4 font-semibold text-slate-900">Control complexity</td>
                <td className="p-4 text-slate-600">Split a large task into smaller, independent subtasks → Aggregate</td>
                <td className="p-4 text-slate-500">Multi-step document processing, long code synthesis, multi-variable analysis</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-4 font-bold text-emerald-600 font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Enrichment, Not Replacement
                </td>
                <td className="p-4 font-semibold text-slate-900">Preserve stability</td>
                <td className="p-4 text-slate-600">Improve existing state with new context without full regeneration</td>
                <td className="p-4 text-slate-500">Live search integration, updating structured JSON schemas, draft refinement</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-4 font-bold text-amber-600 font-mono flex items-center gap-2">
                  <RotateCw className="w-4 h-4" /> Reflection
                </td>
                <td className="p-4 font-semibold text-slate-900">Catch errors & hallucinations</td>
                <td className="p-4 text-slate-600">Generate → Inspect via critic model → Correct before finalizing</td>
                <td className="p-4 text-slate-500">Code syntax checks, compliance validation, mathematical reasoning</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-4 font-bold text-purple-600 font-mono flex items-center gap-2">
                  <GitFork className="w-4 h-4" /> Branch → Resolve → Merge
                </td>
                <td className="p-4 font-semibold text-slate-900">Isolate failures</td>
                <td className="p-4 text-slate-600">Fork main thread → solve sub-problem in isolation → merge validated fix</td>
                <td className="p-4 text-slate-500">Long-running autonomous agents, bug fix loops, optional tool discovery</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Overall Philosophy Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 text-center">
          <div className="text-xs font-mono text-indigo-700 font-bold uppercase tracking-widest mb-2">Unifying Philosophy</div>
          <p className="text-sm sm:text-base text-slate-800 max-w-3xl mx-auto font-medium">
            "Decompose complexity, preserve useful state, verify continuously, and isolate problems without disrupting the main workflow."
          </p>
        </div>
      </section>
    </div>
  );
};

export default AIPatterns;
