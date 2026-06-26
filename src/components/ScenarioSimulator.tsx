import { useState } from 'react';
import { Terminal, ShieldAlert, GitBranch, Users, GitMerge, RotateCcw } from 'lucide-react';
import { scenarios } from '../data/governanceData';

export const ScenarioSimulator = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const data = selectedKey ? scenarios[selectedKey] : null;

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  const handleReset = () => {
    setSelectedKey(null);
  };

  return (
    <section id="simulator" className="scroll-mt-24 mb-24 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden md:block">
          <Terminal className="w-40 h-40" />
        </div>
        <div className="max-w-3xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-4">
            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Interactive Sandbox Simulator
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Simulate AI Governance Crises
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8">
            How do these layered structures act when facing critical real-world situations? Select a threat vector below
            to see Google, Anthropic, and OpenAI mechanisms activate in real-time.
          </p>
        </div>

        {/* Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Autonomous Replication */}
          <button
            onClick={() => handleSelect('replication')}
            className={`text-left p-4 rounded-xl border transition-all flex items-start space-x-3 group shadow-xs cursor-pointer ${
              selectedKey === 'replication'
                ? 'border-indigo-500 bg-indigo-50/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
            }`}
          >
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600 group-hover:scale-105 transition shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Autonomous Replication</h4>
              <p className="text-xs text-slate-500 mt-1">Model attempts to spawn instances of itself in sandboxes.</p>
            </div>
          </button>

          {/* High-Impact Persuasion */}
          <button
            onClick={() => handleSelect('persuasion')}
            className={`text-left p-4 rounded-xl border transition-all flex items-start space-x-3 group shadow-xs cursor-pointer ${
              selectedKey === 'persuasion'
                ? 'border-indigo-500 bg-indigo-50/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
            }`}
          >
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-105 transition shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">High-Impact Persuasion</h4>
              <p className="text-xs text-slate-500 mt-1">Model is found optimizing micro-targeted political content.</p>
            </div>
          </button>

          {/* Instruction Hostility */}
          <button
            onClick={() => handleSelect('conflict')}
            className={`text-left p-4 rounded-xl border transition-all flex items-start space-x-3 group shadow-xs cursor-pointer ${
              selectedKey === 'conflict'
                ? 'border-indigo-500 bg-indigo-50/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
            }`}
          >
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:scale-105 transition shrink-0">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Instruction Hostility</h4>
              <p className="text-xs text-slate-500 mt-1">User instructs model to bypass system parameters.</p>
            </div>
          </button>
        </div>

        {/* Simulation Visualizing Screen */}
        <div className="border border-slate-200 bg-slate-900 rounded-2xl p-6 relative min-h-[300px] flex flex-col justify-between shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none rounded-2xl"></div>

          {/* Simulator Head */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 z-10">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${data ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`}></div>
              <span className="text-xs font-mono text-slate-400">
                STATUS: {data ? 'ACTIVE INVESTIGATION' : 'STANDING BY'}
              </span>
            </div>
            <span className="text-xs font-mono text-indigo-300 font-semibold uppercase">
              CASE: {data ? data.id : 'NO_SCENARIO_SELECTED'}
            </span>
          </div>

          {/* Main Content */}
          <div className="my-6 z-10 space-y-6">
            {!data ? (
              <div className="text-center py-12">
                <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3 animate-pulse" />
                <h3 className="text-lg font-bold text-slate-400">System Standing By</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                  Select one of the three critical incident vectors above to run the response protocol simulation.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in duration-300">
                {/* Intro */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wide font-mono">
                    Incident Parameter Identified
                  </span>
                  <h3 className="text-lg font-bold text-white">{data.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    {data.description}
                  </p>
                </div>

                {/* Response Log Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                  {/* Google */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-blue-500/30 relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-400">GOOGLE RESPONSE LOG</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                          RESOLVED
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{data.google.action}</h4>
                      <div className="text-[10px] font-mono text-blue-300 bg-blue-950/40 px-2 py-1 rounded inline-block mb-3">
                        {data.google.status}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{data.google.detail}</p>
                  </div>

                  {/* Anthropic */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-amber-500/30 relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-400">ANTHROPIC RESPONSE LOG</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                          RESOLVED
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{data.anthropic.action}</h4>
                      <div className="text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-1 rounded inline-block mb-3">
                        {data.anthropic.status}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{data.anthropic.detail}</p>
                  </div>

                  {/* OpenAI */}
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-teal-500/30 relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-teal-400">OPENAI RESPONSE LOG</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300">
                          RESOLVED
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{data.openai.action}</h4>
                      <div className="text-[10px] font-mono text-teal-300 bg-teal-950/40 px-2 py-1 rounded inline-block mb-3">
                        {data.openai.status}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{data.openai.detail}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simulator Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-500 z-10">
            <span>Simulation reflects official safety protocols & guidelines of 2026.</span>
            {data && (
              <button
                onClick={handleReset}
                className="text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Simulator
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ScenarioSimulator;
