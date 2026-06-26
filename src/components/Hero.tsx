import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
  return (
    <div className="text-center max-w-4xl mx-auto mb-16 px-4 pt-8">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-700 leading-tight sm:leading-none">
        Beyond Checklists: Dynamic & Embedded AI Governance
      </h1>
      <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
        Google, Anthropic, and OpenAI are converging on a highly mature, multi-layered governance philosophy.
        Discover how static regulatory frameworks are shifting toward{' '}
        <strong className="text-indigo-600 font-semibold">dynamic, adaptive, and technically embedded architectures</strong>.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={() => scrollToSection('explorer')}
          className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition duration-150 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Explore Theme Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => scrollToSection('simulator')}
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 shadow-sm font-semibold rounded-xl transition duration-150 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          <span>Launch Scenario Simulator</span>
        </button>
      </div>
    </div>
  );
};
export default Hero;
