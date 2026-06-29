import { useState } from 'react';
import { Search } from 'lucide-react';
import { themes, themesVi } from '../data/governanceData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const GovernanceMatrix = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'mechanism' | 'philosophy'>('all');
  const { lang } = useLanguage();
  const t = translations[lang];

  const currentThemes = lang === 'vi' ? themesVi : themes;

  const filteredThemes = currentThemes.filter((theme) => {
    // Search match
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      theme.title.toLowerCase().includes(searchLower) ||
      theme.google.title.toLowerCase().includes(searchLower) ||
      theme.google.text.toLowerCase().includes(searchLower) ||
      theme.anthropic.title.toLowerCase().includes(searchLower) ||
      theme.anthropic.text.toLowerCase().includes(searchLower) ||
      theme.openai.title.toLowerCase().includes(searchLower) ||
      theme.openai.text.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Category filter match
    if (activeFilter === 'mechanism' && ![2, 3, 6].includes(theme.id)) return false;
    if (activeFilter === 'philosophy' && ![1, 4, 5].includes(theme.id)) return false;

    return true;
  });

  return (
    <section id="matrix" className="scroll-mt-24 mb-24 px-4">
      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
          <span className="w-2.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full inline-block"></span>
          <span>{t.governance.matrixTitle}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {t.governance.matrixSubtitle}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.governance.matrixSearchPlaceholder}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            {t.governance.matrixAllThemes}
          </button>
          <button
            onClick={() => setActiveFilter('mechanism')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
              activeFilter === 'mechanism'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            {t.governance.matrixAction}
          </button>
          <button
            onClick={() => setActiveFilter('philosophy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
              activeFilter === 'philosophy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            {t.governance.matrixPhilosophy}
          </button>
        </div>
      </div>

      {/* Responsive View Switcher */}
      {/* Desktop view: Table */}
      <div className="hidden md:block border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">
                  {t.governance.matrixHeaderLayer}
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-blue-600 w-1/4">
                  {t.governance.matrixHeaderGoogle}
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-amber-600 w-1/4">
                  {t.governance.matrixHeaderAnthropic}
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-teal-600 w-1/4">
                  {t.governance.matrixHeaderOpenAI}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredThemes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                    {t.governance.matrixNoResults}
                  </td>
                </tr>
              ) : (
                filteredThemes.map((theme) => (
                  <tr key={theme.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="p-4 align-top border-r border-slate-100">
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded flex items-center justify-center shrink-0 mt-0.5">
                          L{theme.id}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{theme.title}</h4>
                          <p className="text-slate-500 text-xs mt-0.5">{theme.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top border-r border-slate-100">
                      <span className="text-xs font-bold text-blue-600 block mb-1">
                        {theme.google.title}
                      </span>
                      <p className="text-slate-605 text-xs leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-200">
                        {theme.google.text}
                      </p>
                    </td>
                    <td className="p-4 align-top border-r border-slate-100">
                      <span className="text-xs font-bold text-amber-600 block mb-1">
                        {theme.anthropic.title}
                      </span>
                      <p className="text-slate-605 text-xs leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-200">
                        {theme.anthropic.text}
                      </p>
                    </td>
                    <td className="p-4 align-top">
                      <span className="text-xs font-bold text-teal-600 block mb-1">
                        {theme.openai.title}
                      </span>
                      <p className="text-slate-605 text-xs leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-200">
                        {theme.openai.text}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view: Stacked Card Layout */}
      <div className="md:hidden space-y-4">
        {filteredThemes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm shadow-xs">
            {t.governance.matrixNoResults}
          </div>
        ) : (
          filteredThemes.map((theme) => (
            <div key={theme.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              {/* Card Header */}
              <div className="flex items-start space-x-3 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  L{theme.id}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{theme.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{theme.subtitle}</p>
                </div>
              </div>

              {/* Provider Blocks */}
              <div className="space-y-3">
                {/* Google */}
                <div className="bg-blue-50/20 border border-blue-50/60 rounded-xl p-3">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      Google: {theme.google.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{theme.google.text}</p>
                </div>

                {/* Anthropic */}
                <div className="bg-amber-50/20 border border-amber-50/60 rounded-xl p-3">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      Anthropic: {theme.anthropic.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{theme.anthropic.text}</p>
                </div>

                {/* OpenAI */}
                <div className="bg-teal-50/20 border border-teal-50/60 rounded-xl p-3">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                      OpenAI: {theme.openai.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{theme.openai.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
export default GovernanceMatrix;
