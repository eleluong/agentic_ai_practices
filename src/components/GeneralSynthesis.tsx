export const GeneralSynthesis = () => {
  return (
    <section className="mb-16 bg-gradient-to-tr from-slate-100 via-indigo-50/40 to-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-3xl relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
          The Synthesis: "Preparedness-Based, Human-Centered Dynamism"
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm sm:text-base leading-relaxed mb-6">
          A clear blueprint is standardizing. AI governance fails entirely when it is static (risks outpace rules),
          black-boxed (uninterpretable systems), or externally detached (lacking real-world technical execution).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div>
            <div className="text-indigo-600 font-extrabold text-lg sm:text-2xl">Anti-Static</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              Iterative scaling thresholds built directly into response systems.
            </p>
          </div>
          <div>
            <div className="text-emerald-600 font-extrabold text-lg sm:text-2xl">Auditable</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              Fully transparent rules and Explainable AI tracing models step-by-step.
            </p>
          </div>
          <div>
            <div className="text-amber-600 font-extrabold text-lg sm:text-2xl">Embedded</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              Constitutional mechanisms actively running within compilation stages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GeneralSynthesis;
