import { ShieldCheck, Cpu, Lock, ArrowRight, Activity, Code, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

interface PortalLandingProps {
  onSelectTopic: (topic: 'governance' | 'optimization') => void;
}

export const PortalLanding = ({ onSelectTopic }: PortalLandingProps) => {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16 pt-8">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest inline-flex items-center mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5 animate-pulse"></span>
          {t.portal.tag}
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 leading-tight">
          {t.portal.title}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
          {t.portal.subtitle}
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1: AI Governance */}
        <div 
          onClick={() => onSelectTopic('governance')}
          className="group relative bg-white/80 border border-slate-200/80 rounded-2xl p-8 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition duration-300 flex flex-col justify-between cursor-pointer min-h-[420px]"
        >
          {/* Active Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl pointer-events-none"></div>
          
          <div>
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 group-hover:scale-110 transition duration-300">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition">
              {t.portal.govCardTitle}
            </h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">
              {t.portal.govCardDesc}
            </p>

            {/* Micro-visualizer */}
            <div className="mt-6 border-t border-slate-100 pt-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>{t.portal.govCardVisualizer}</span>
                <span className="text-indigo-600">{t.portal.govCardActive}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-medium">{t.portal.govCardGoogle}</span>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded font-bold">L1 - L4</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-medium">{t.portal.govCardAnthropic}</span>
                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded font-bold">ASL Tiers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition duration-150">
            <span>{t.portal.govCardExplore}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        {/* Card 2: AI Optimization */}
        <div 
          onClick={() => onSelectTopic('optimization')}
          className="group relative bg-white/80 border border-slate-200/80 rounded-2xl p-8 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/5 transition duration-300 flex flex-col justify-between cursor-pointer min-h-[420px]"
        >
          {/* Active Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl pointer-events-none"></div>

          <div>
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 group-hover:scale-110 transition duration-300">
              <Cpu className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-600 transition">
              {t.portal.optCardTitle}
            </h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">
              {t.portal.optCardDesc}
            </p>

            {/* Micro-visualizer */}
            <div className="mt-6 border-t border-slate-100 pt-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>{t.portal.optCardVisualizer}</span>
                <span className="text-emerald-600">{t.portal.optCardActive}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 text-center">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center justify-center">
                  <Server className="w-4 h-4 text-emerald-500 mb-1" />
                  <span>{t.portal.optCardVllm}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center justify-center">
                  <Activity className="w-4 h-4 text-teal-500 mb-1" />
                  <span>{t.portal.optCardQuant}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center text-emerald-600 font-bold text-sm group-hover:translate-x-1 transition duration-150">
            <span>{t.portal.optCardExplore}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        {/* Card 3: AI Safety & Guardrails (Teaser) */}
        <div className="relative bg-slate-50/50 border border-slate-200/60 rounded-2xl p-8 flex flex-col justify-between min-h-[420px] select-none">
          <div className="absolute top-4 right-4">
            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
              {t.portal.safetyCardRoadmap}
            </span>
          </div>

          <div>
            <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mb-6 text-slate-400">
              <Lock className="w-5 h-5" />
            </div>

            <h2 className="text-2xl font-bold text-slate-400 tracking-tight">
              {t.portal.safetyCardTitle}
            </h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              {t.portal.safetyCardDesc}
            </p>

            {/* Micro-visualizer Placeholder */}
            <div className="mt-6 border-t border-slate-200/60 pt-6 space-y-3 opacity-50">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span>{t.portal.safetyCardVisualizer}</span>
                <span>{t.portal.safetyCardSoon}</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="bg-indigo-300 h-full w-1/3 rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400">{t.portal.safetyCardDrafting}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center text-slate-400 font-bold text-sm">
            <span>{t.portal.safetyCardLocked}</span>
            <Lock className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>

      {/* Dynamic Statistics Bar / Bottom Section */}
      <div className="mt-16 bg-white/70 border border-slate-200/80 rounded-2xl p-6 backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{t.portal.statsTitle}</h3>
            <p className="text-slate-500 text-xs mt-0.5">{t.portal.statsDesc}</p>
          </div>
        </div>
        <div className="flex space-x-8 text-center shrink-0">
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">2</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.portal.statsHubs}</span>
          </div>
          <div className="border-r border-slate-200"></div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">6+</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.portal.statsPlaybooks}</span>
          </div>
          <div className="border-r border-slate-200"></div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">2026</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.portal.statsVersion}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortalLanding;
