export const TrustBadges = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20 px-4">
      {/* Google Badge */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition duration-200 flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.74-.08-1.3-.176-1.78l-10.617-.43z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Google</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Grounded in the "AI Principles" seeking positive impact while minimizing societal risks using Explainable AI.
          </p>
          <a
            href="https://ai.google/responsibility/principles/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[10px] text-blue-600 hover:text-blue-700 font-bold mt-2 hover:underline cursor-pointer"
          >
            AI Principles ↗
          </a>
        </div>
      </div>

      {/* Anthropic Badge */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition duration-200 flex items-start space-x-4">
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.2 2L4 7.2v8.5l7.2 4.3 7.2-4.3V7.2L11.2 2zm4.8 12.7l-4.8 2.9-4.8-2.9V8.5l4.8-2.9 4.8 2.9v6.2z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Anthropic</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Pioneered Constitutional AI and Responsible Scaling Policies with robust mechanical thresholds.
          </p>
          <div className="flex flex-wrap gap-x-3 mt-2">
            <a
              href="https://www.anthropic.com/constitution"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] text-amber-600 hover:text-amber-700 font-bold hover:underline cursor-pointer"
            >
              Constitution ↗
            </a>
            <a
              href="https://www.anthropic.com/news/responsible-scaling-policy-updates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] text-amber-600 hover:text-amber-700 font-bold hover:underline cursor-pointer"
            >
              Scaling Policy ↗
            </a>
          </div>
        </div>
      </div>

      {/* OpenAI Badge */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition duration-200 flex items-start space-x-4">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.2 13.5c-.2-.6-.6-1.1-1.1-1.5-.2-.1-.3-.2-.5-.3.2-.2.3-.5.3-.8 0-.4-.1-.7-.3-1 .2-.3.3-.7.3-1.1 0-.6-.3-1.2-.8-1.6l-.3-.2c.2-.4.2-.9.1-1.4-.2-.7-.7-1.2-1.4-1.4l-.5-.1c0-.4-.2-.8-.5-1.1C16 .6 15 .4 14.1.6l-.4.1c-.2-.2-.6-.4-.9-.5H11.2c-.3 0-.7.2-.9.5l-.4-.1c-.9-.2-1.9 0-2.5.4-.3.3-.5.7-.5 1.1l-.5.1C5.7 2.4 5.2 3 5 3.7c-.1.5-.1 1 0 1.4l-.3.2c-.5.4-.8 1-.8 1.6 0 .4.1.8.3 1.1-.2.3-.3.7-.3 1 0 .3.1.6.3.8-.2.1-.3.2-.5.3-.5.4-.9.9-1.1 1.5l-.2.5c-.3.8-.2 1.8.3 2.5l.3.4c-.2.4-.2.9-.1 1.4.2.7.7 1.2 1.4 1.4l.5.1c0 .4.2.8.5 1.1.6.5 1.5.7 2.4.5l.4-.1c.2.2.6.4.9.5h1.6c.3 0 .7-.2.9-.5l.4.1c.9.2 1.9 0 2.5-.4.3-.3.5-.7.5-1.1l.5-.1c.7-.2 1.2-.7 1.4-1.4.1-.5.1-1 0-1.4l.3-.2c.5-.4.8-1 .8-1.6 0-.4-.1-.8-.3-1.1.2-.3.3-.7.3-1 0-.3-.1-.6-.3-.8l.5-.3c.5-.4.9-.9 1.1-1.5l.2-.5c.3-.8.2-1.8-.3-2.5zm-3.1 3.2c-.3.4-.8.7-1.3.8l-1.3.3c-.2.1-.4.3-.4.5v1.3c0 .5-.3 1-.8 1.3l-1.1.7c-.2.1-.5.2-.7.2s-.5-.1-.7-.2l-1.1-.7c-.5-.3-.8-.8-.8-1.3v-1.3c0-.2-.2-.4-.4-.5l-1.3-.3c-.5-.1-1-.4-1.3-.8l-.7-1.1c-.3-.4-.3-1 0-1.5l.7-1.1c.1-.2.2-.3.2-.5V10c0-.5.3-1 .8-1.3l1.1-.7c.4-.3.9-.3 1.4 0l1.1.7c.2.1.4.3.4.5v1.3c0 .2.2.4.4.5l1.3.3c.5.1 1 .4 1.3.8l.7 1.1c.3.5.3 1.1 0 1.5z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">OpenAI</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Empowers the "Preparedness Framework" and granular Model Specs defining explicit instructions.
          </p>
          <div className="flex flex-wrap gap-x-3 mt-2">
            <a
              href="https://openai.com/charter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
            >
              Charter ↗
            </a>
            <a
              href="https://openai.com/news/our-updated-preparedness-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
            >
              Preparedness ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrustBadges;
