import { useState, useMemo } from 'react';
import { ShieldCheck, ShieldAlert, CheckSquare, ChevronDown, ChevronUp, AlertCircle, FileText } from 'lucide-react';
import { globalChecklist, globalChecklistVi, vnChecklist } from '../data/governanceData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const PlaybookConsole = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'vn'>('global');
  const { lang } = useLanguage();
  const t = translations[lang];

  // Interactive state for checklists
  const [globalChecked, setGlobalChecked] = useState<Record<string, boolean>>({});
  const [vnChecked, setVnChecked] = useState<Record<string, boolean>>({});

  // Interactive state for gates
  const [globalGates, setGlobalGates] = useState<Record<string, boolean>>({
    safety: false,
    oversight: false,
    transparency: false,
  });
  const [vnGates, setVnGates] = useState<Record<string, boolean>>({
    risk: false,
    watermark: false,
    rep: false,
  });

  // Keep track of which phases are expanded in mobile/accordion view
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    '01': true, // Keep first phase open by default
  });

  const togglePhase = (phaseNumber: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNumber]: !prev[phaseNumber],
    }));
  };

  // Toggle checks helper
  const handleCheck = (id: string, tab: 'global' | 'vn') => {
    if (tab === 'global') {
      setGlobalChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    } else {
      setVnChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  // Toggle gates helper
  const handleGateCheck = (gateKey: string, tab: 'global' | 'vn') => {
    if (tab === 'global') {
      setGlobalGates((prev) => ({ ...prev, [gateKey]: !prev[gateKey] }));
    } else {
      setVnGates((prev) => ({ ...prev, [gateKey]: !prev[gateKey] }));
    }
  };

  const currentChecklist = useMemo(() => {
    return activeTab === 'global'
      ? (lang === 'vi' ? globalChecklistVi : globalChecklist)
      : vnChecklist;
  }, [activeTab, lang]);

  // Calculate totals and statistics
  const stats = useMemo(() => {
    const totalTasks = currentChecklist.reduce((acc, phase) => acc + phase.items.length, 0);
    const checkedTasks = activeTab === 'global'
      ? Object.values(globalChecked).filter(Boolean).length
      : Object.values(vnChecked).filter(Boolean).length;

    if (activeTab === 'global') {
      const gatesChecked = Object.values(globalGates).every(Boolean);
      const isBlocked = checkedTasks < totalTasks || !gatesChecked;
      const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;

      // Unresolved items for debug log
      const missingTasksCount = totalTasks - checkedTasks;
      const missingGates: string[] = [];
      if (!globalGates.safety) missingGates.push(t.governance.pbGlobalGate1Title);
      if (!globalGates.oversight) missingGates.push(t.governance.pbGlobalGate2Title);
      if (!globalGates.transparency) missingGates.push(t.governance.pbGlobalGate3Title);

      return {
        totalTasks,
        checkedTasks,
        gatesChecked,
        isBlocked,
        percentage,
        missingTasksCount,
        missingGates,
      };
    } else {
      const gatesChecked = Object.values(vnGates).every(Boolean);
      const isBlocked = checkedTasks < totalTasks || !gatesChecked;
      const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;

      // Unresolved items for debug log
      const missingTasksCount = totalTasks - checkedTasks;
      const missingGates: string[] = [];
      if (!vnGates.risk) missingGates.push(t.governance.pbVnGate1Title);
      if (!vnGates.watermark) missingGates.push(t.governance.pbVnGate2Title);
      if (!vnGates.rep) missingGates.push(t.governance.pbVnGate3Title);

      return {
        totalTasks,
        checkedTasks,
        gatesChecked,
        isBlocked,
        percentage,
        missingTasksCount,
        missingGates,
      };
    }
  }, [activeTab, currentChecklist, globalChecked, vnChecked, globalGates, vnGates, t]);

  return (
    <section id="playbook" className="scroll-mt-24 mb-24 px-4">
      {/* Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <span className="w-2.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full inline-block"></span>
            <span>{t.governance.pbConsoleTitle}</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {t.governance.pbConsoleDesc}
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'global' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {t.governance.pbGlobalTab}
          </button>
          <button
            onClick={() => setActiveTab('vn')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'vn' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {t.governance.pbVnTab}
          </button>
        </div>
      </div>

      {/* Console Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left/Center Panel: Progress Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between lg:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'global' ? t.governance.pbGlobalTitle : t.governance.pbVnTitle}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                  stats.isBlocked
                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    stats.isBlocked ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'
                  }`}
                ></span>
                {stats.isBlocked
                  ? activeTab === 'global'
                    ? 'STAGE-GATE BLOCKED'
                    : 'CHƯA ĐỦ ĐIỀU KIỆN'
                  : activeTab === 'global'
                  ? 'DEPLOYMENT READY'
                  : 'ĐỦ ĐIỀU KIỆN LƯU HÀNH'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {activeTab === 'global' ? t.governance.pbGlobalDesc : t.governance.pbVnDesc}
            </p>
          </div>

          {/* Sticky/Responsive Progress Trackers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>{activeTab === 'global' ? t.governance.pbVerificationTasks : t.governance.pbVnProgress}</span>
                <span className="font-bold text-slate-900">{stats.checkedTasks}</span> / <span>{stats.totalTasks}</span>
              </span>
              <span className="font-bold text-emerald-600">{stats.percentage}% {t.governance.pbComplete}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Panel: Executive Gates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>{activeTab === 'global' ? t.governance.pbGlobalGateTitle : t.governance.pbVnGateTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {activeTab === 'global' ? t.governance.pbGlobalGateDesc : t.governance.pbVnGateDesc}
            </p>

            {/* Dynamic switcher for gates */}
            {activeTab === 'global' ? (
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={globalGates.safety}
                    onChange={() => handleGateCheck('safety', 'global')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">{t.governance.pbGlobalGate1Title}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {t.governance.pbGlobalGate1Desc}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={globalGates.oversight}
                    onChange={() => handleGateCheck('oversight', 'global')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">{t.governance.pbGlobalGate2Title}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {t.governance.pbGlobalGate2Desc}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={globalGates.transparency}
                    onChange={() => handleGateCheck('transparency', 'global')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">{t.governance.pbGlobalGate3Title}</span>
                    <span className="text-[10px] text-slate-500 block">{t.governance.pbGlobalGate3Desc}</span>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={vnGates.risk}
                    onChange={() => handleGateCheck('risk', 'vn')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">{t.governance.pbVnGate1Title}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {t.governance.pbVnGate1Desc}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={vnGates.watermark}
                    onChange={() => handleGateCheck('watermark', 'vn')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">{t.governance.pbVnGate2Title}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {t.governance.pbVnGate2Desc}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={vnGates.rep}
                    onChange={() => handleGateCheck('rep', 'vn')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">{t.governance.pbVnGate3Title}</span>
                    <span className="text-[10px] text-slate-500 block">{t.governance.pbVnGate3Desc}</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic System Instruction Logs */}
      <div
        className={`p-4 rounded-xl border text-xs flex items-start gap-3 mb-8 transition duration-300 shadow-xs ${
          stats.isBlocked
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}
      >
        {stats.isBlocked ? (
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
        ) : (
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
        )}
        <div className="space-y-1">
          <span className="font-bold block uppercase tracking-wide">
            {activeTab === 'global' ? t.governance.pbPipelineMessage : t.governance.pbVnPipelineMessage}
          </span>
          <div className="text-slate-700 leading-relaxed">
            {stats.isBlocked ? (
              activeTab === 'global' ? (
                <>
                  {t.governance.pbGlobalBlockedMsg}
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 font-medium">
                    {stats.missingTasksCount > 0 && (
                      <li>{t.governance.pbGlobalTasksLeftMsg.replace('{count}', String(stats.missingTasksCount))}</li>
                    )}
                    {stats.missingGates.map((gate) => (
                      <li key={gate}>{t.governance.pbGlobalGate1Miss.replace('"Safety Gate"', `"${gate}"`)}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  {t.governance.pbVnBlockedMsg}
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 font-medium">
                    {stats.missingTasksCount > 0 && (
                      <li>{t.governance.pbVnTasksLeftMsg.replace('{count}', String(stats.missingTasksCount))}</li>
                    )}
                    {stats.missingGates.map((gate) => (
                      <li key={gate}>{gate === t.governance.pbVnGate1Title ? t.governance.pbVnGate1Miss : (gate === t.governance.pbVnGate2Title ? t.governance.pbVnGate2Miss : t.governance.pbVnGate3Miss)}</li>
                    ))}
                  </ul>
                </>
              )
            ) : activeTab === 'global' ? (
              t.governance.pbGlobalSuccessMsg
            ) : (
              t.governance.pbVnSuccessMsg
            )}
          </div>
        </div>
      </div>

      {/* Accordion / Responsive Checklist Grid */}
      <div className="space-y-4">
        {currentChecklist.map((phase) => {
          const isExpanded = !!expandedPhases[phase.phaseNumber];
          const phaseCheckedCount = phase.items.filter((item) =>
            activeTab === 'global' ? globalChecked[item.id] : vnChecked[item.id]
          ).length;
          const isPhaseComplete = phaseCheckedCount === phase.items.length;

          return (
            <div
              key={phase.phaseNumber}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition duration-150"
            >
              {/* Accordion Header */}
              <button
                onClick={() => togglePhase(phase.phaseNumber)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border text-${phase.colorClass}-600 bg-${phase.colorClass}-50/30 border-${phase.colorClass}-100`}>
                    {t.governance.pbPhase} {phase.phaseNumber}: {phase.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{phase.phaseName}</h3>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                      isPhaseComplete
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {phaseCheckedCount}/{phase.items.length} {activeTab === 'global' ? t.governance.pbDone : t.governance.pbVnDone}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/20 divide-y divide-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {phase.items.map((item) => {
                      const isChecked = activeTab === 'global' ? !!globalChecked[item.id] : !!vnChecked[item.id];
                      return (
                        <label
                          key={item.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                            isChecked
                              ? 'border-emerald-200 bg-emerald-50/10'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheck(item.id, activeTab)}
                            className="w-4 h-4 rounded mt-0.5 text-emerald-500 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                          />
                          <div className="text-xs">
                            <span className={`font-bold block transition-all ${isChecked ? 'text-slate-800 line-through decoration-slate-400/80' : 'text-slate-900'}`}>
                              {item.title}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                              {item.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vietnam Act specific Explanation */}
      {activeTab === 'vn' && (
        <div className="mt-16 bg-gradient-to-tr from-slate-100 via-indigo-50/40 to-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs animate-in fade-in duration-300">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-4xl relative z-10">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-650" />
              <span>{t.governance.pbExplainTitle}</span>
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              {t.governance.pbExplainDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
              <div>
                <div className="text-indigo-600 font-extrabold text-sm sm:text-base">{t.governance.pbExplainCol1Title}</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {t.governance.pbExplainCol1Desc}
                </p>
              </div>
              <div>
                <div className="text-emerald-600 font-extrabold text-sm sm:text-base">{t.governance.pbExplainCol2Title}</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {t.governance.pbExplainCol2Desc}
                </p>
              </div>
              <div>
                <div className="text-amber-600 font-extrabold text-sm sm:text-base">{t.governance.pbExplainCol3Title}</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {t.governance.pbExplainCol3Desc}
                </p>
              </div>
              <div>
                <div className="text-purple-600 font-extrabold text-sm sm:text-base">{t.governance.pbExplainCol4Title}</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {t.governance.pbExplainCol4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default PlaybookConsole;
