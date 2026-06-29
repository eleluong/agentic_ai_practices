import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const GeneralSynthesis = () => {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section className="mb-16 bg-gradient-to-tr from-slate-100 via-indigo-50/40 to-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-3xl relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
          {t.synthesis.title}
        </h3>
        <p className="text-slate-655 text-xs sm:text-sm sm:text-base leading-relaxed mb-6">
          {t.synthesis.desc}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div>
            <div className="text-indigo-600 font-extrabold text-lg sm:text-2xl">{t.synthesis.antiStatic}</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              {t.synthesis.antiStaticDesc}
            </p>
          </div>
          <div>
            <div className="text-emerald-600 font-extrabold text-lg sm:text-2xl">{t.synthesis.auditable}</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              {t.synthesis.auditableDesc}
            </p>
          </div>
          <div>
            <div className="text-amber-600 font-extrabold text-lg sm:text-2xl">{t.synthesis.embedded}</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              {t.synthesis.embeddedDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GeneralSynthesis;
