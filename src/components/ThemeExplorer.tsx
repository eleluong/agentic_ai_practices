import { useState } from 'react';
import * as Icons from 'lucide-react';
import { themes, themesVi } from '../data/governanceData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

// Dynamically resolve icon components
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

const getReferenceUrl = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('principles') || t.includes('nguyên tắc')) return 'https://ai.google/responsibility/principles/';
  if (t.includes('constitution') || t.includes('constitutional') || t.includes('hiến pháp')) return 'https://www.anthropic.com/constitution';
  if (t.includes('scaling policy') || t.includes('rsp') || t.includes('sách bán')) return 'https://www.anthropic.com/news/responsible-scaling-policy-updates';
  if (t.includes('preparedness') || t.includes('chuẩn bị')) return 'https://openai.com/news/our-updated-preparedness-framework';
  if (t.includes('charter') || t.includes('hiến chương')) return 'https://openai.com/charter';
  return null;
};

export const ThemeExplorer = () => {
  const [activeThemeId, setActiveThemeId] = useState(1);
  const { lang } = useLanguage();
  const t = translations[lang];

  const currentThemes = lang === 'vi' ? themesVi : themes;
  const activeTheme = currentThemes.find((t) => t.id === activeThemeId) || currentThemes[0];

  return (
    <section id="explorer" className="scroll-mt-24 mb-24 px-4">
      {/* Title block */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <span className="w-2.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full inline-block"></span>
            <span>{t.governance.themeTitle}</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {t.governance.themeSubtitle}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="text-xs px-2.5 py-1 text-indigo-600 font-bold tracking-wide uppercase">
            {t.governance.themeMatrix}
          </span>
        </div>
      </div>

      {/* Swipeable Tabs for Mobile / Grid for Desktop */}
      <div 
        className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6 overflow-x-auto pb-3 md:pb-0 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {currentThemes.map((theme) => {
          const isActive = theme.id === activeThemeId;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveThemeId(theme.id)}
              className={`p-3 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[6.5rem] h-auto min-w-[160px] md:min-w-0 snap-start shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs shadow-indigo-100/50'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600">
                  {t.governance.themeTheme} 0{theme.id}
                </span>
                <IconRenderer
                  name={theme.icon}
                  className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                />
              </div>
              <span className="text-xs font-bold leading-snug line-clamp-2 mt-2">{theme.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Theme Display Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 transition-all duration-300">
        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
          <div>
            <span className="text-xs font-extrabold text-indigo-600 tracking-wider uppercase">
              {t.governance.themeTheme} {activeTheme.id}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{activeTheme.title}</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium italic">{activeTheme.subtitle}</p>
          </div>
          <div className="max-w-md text-slate-500 text-xs sm:text-sm md:text-right">
            {activeTheme.meta}
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Google Column */}
          <div className="p-6 rounded-2xl bg-slate-50/50 border border-blue-100 hover:border-blue-200 transition-all duration-200 relative overflow-hidden group shadow-xs flex flex-col justify-between">
            <div>
              <div className="absolute top-0 left-0 h-1 w-full bg-blue-500/50"></div>
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <Icons.Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t.governance.googleIntegration}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">{activeTheme.google.title}</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{activeTheme.google.text}</p>
            </div>
            {getReferenceUrl(activeTheme.google.title) && (
              <a 
                href={getReferenceUrl(activeTheme.google.title)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[10px] text-blue-600 hover:text-blue-700 font-bold mt-4 hover:underline cursor-pointer"
              >
                {t.governance.themeSource}
              </a>
            )}
          </div>

          {/* Anthropic Column */}
          <div className="p-6 rounded-2xl bg-slate-50/50 border border-amber-100 hover:border-amber-200 transition-all duration-200 relative overflow-hidden group shadow-xs flex flex-col justify-between">
            <div>
              <div className="absolute top-0 left-0 h-1 w-full bg-amber-500/50"></div>
              <div className="flex items-center space-x-2 text-amber-600 mb-4">
                <Icons.Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t.governance.anthropicIntegration}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">{activeTheme.anthropic.title}</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{activeTheme.anthropic.text}</p>
            </div>
            {getReferenceUrl(activeTheme.anthropic.title) && (
              <a 
                href={getReferenceUrl(activeTheme.anthropic.title)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[10px] text-amber-600 hover:text-amber-700 font-bold mt-4 hover:underline cursor-pointer"
              >
                {t.governance.themeSource}
              </a>
            )}
          </div>

          {/* OpenAI Column */}
          <div className="p-6 rounded-2xl bg-slate-50/50 border border-teal-100 hover:border-teal-200 transition-all duration-200 relative overflow-hidden group shadow-xs flex flex-col justify-between">
            <div>
              <div className="absolute top-0 left-0 h-1 w-full bg-teal-500/50"></div>
              <div className="flex items-center space-x-2 text-teal-600 mb-4">
                <Icons.Zap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t.governance.openaiIntegration}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">{activeTheme.openai.title}</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{activeTheme.openai.text}</p>
            </div>
            {getReferenceUrl(activeTheme.openai.title) && (
              <a 
                href={getReferenceUrl(activeTheme.openai.title)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[10px] text-teal-600 hover:text-teal-700 font-bold mt-4 hover:underline cursor-pointer"
              >
                {t.governance.themeSource}
              </a>
            )}
          </div>
        </div>

        {/* Deep-Dive Elaboration Block */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start space-x-4">
          <div className="p-2.5 rounded-xl bg-white text-indigo-600 shrink-0 shadow-xs border border-indigo-100/60">
            <Icons.Info className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-indigo-950">{t.governance.themeAnalysis}</h5>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{activeTheme.elaboration}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ThemeExplorer;

