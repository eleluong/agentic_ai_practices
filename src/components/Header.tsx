import { useState } from 'react';
import { ShieldCheck, Cpu, Sparkles, ArrowLeft, Menu, X } from 'lucide-react';

interface HeaderProps {
  scrollToSection: (id: string) => void;
  currentView: 'portal' | 'governance' | 'optimization';
  setCurrentView: (view: 'portal' | 'governance' | 'optimization') => void;
}

export const Header = ({ scrollToSection, currentView, setCurrentView }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (target: string) => {
    if (target === 'governance-link') {
      setCurrentView('governance');
    } else if (target === 'optimization-link') {
      setCurrentView('optimization');
    } else {
      scrollToSection(target);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    setCurrentView('portal');
    setIsMobileMenuOpen(false);
  };

  // Get view-specific logo details
  const getBranding = () => {
    switch (currentView) {
      case 'governance':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-white" />,
          title: "AI Governance",
          subtitle: "Convergence Intel",
          gradient: "from-blue-600 via-indigo-500 to-purple-600"
        };
      case 'optimization':
        return {
          icon: <Cpu className="w-5 h-5 text-white" />,
          title: "AI Optimization",
          subtitle: "Performance Hub",
          gradient: "from-emerald-500 via-teal-500 to-indigo-600"
        };
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-white" />,
          title: "AI Practices Hub",
          subtitle: "Apex Blueprint",
          gradient: "from-indigo-600 via-purple-600 to-pink-600"
        };
    }
  };

  // Get view-specific navigation items
  const getNavItems = () => {
    if (currentView === 'governance') {
      return [
        { label: 'Theme Explorer', target: 'explorer' },
        { label: 'Four-Layer Stack', target: 'synthesis' },
        { label: 'Scenario Simulator', target: 'simulator' },
        { label: 'Comparison Matrix', target: 'matrix' },
      ];
    }
    if (currentView === 'optimization') {
      return [
        { label: 'Trinity Architecture', target: 'optimization-stack' },
        { label: 'Trade-Off Simulator', target: 'trade-off' },
        { label: 'Blueprints', target: 'blueprints' },
        { label: 'Observability', target: 'observability' },
        { label: 'Checklist', target: 'checklist' },
      ];
    }
    return [
      { label: 'Governance Visualizer', target: 'governance-link' },
      { label: 'Optimization Dashboard', target: 'optimization-link' },
    ];
  };

  const branding = getBranding();
  const navItems = getNavItems();

  return (
    <header className="border-b border-slate-200/80 backdrop-blur bg-white/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Branding */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={handleLogoClick}>
          <div className={`w-9 h-9 bg-gradient-to-tr ${branding.gradient} rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10`}>
            {branding.icon}
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base block leading-none">{branding.title}</span>
            <span className="text-[9px] text-indigo-600 font-bold tracking-wider uppercase block mt-1">
              {branding.subtitle}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 items-center">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNavClick(item.target)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition rounded-lg font-medium cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          
          {currentView === 'governance' && (
            <button
              onClick={() => handleNavClick('playbook')}
              className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 transition font-bold rounded-lg hover:bg-indigo-50 cursor-pointer"
            >
              Compliance Playbooks
            </button>
          )}
        </nav>

        {/* Back to Hub / Status Badge */}
        <div className="flex items-center space-x-3">
          {currentView !== 'portal' ? (
            <button
              onClick={() => setCurrentView('portal')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition duration-150 flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal Hub</span>
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5 animate-pulse"></span>
              2026 Industry Blueprints
            </span>
          )}
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-40 transition-all duration-300">
          <div className="bg-white border-b border-slate-200 p-6 flex flex-col space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => handleNavClick(item.target)}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition rounded-xl"
              >
                {item.label}
              </button>
            ))}
            
            {currentView === 'governance' && (
              <button
                onClick={() => handleNavClick('playbook')}
                className="w-full text-left px-4 py-3 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition rounded-xl"
              >
                Compliance Playbooks
              </button>
            )}

            {currentView !== 'portal' && (
              <button
                onClick={() => {
                  setCurrentView('portal');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition rounded-xl flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Portal Hub</span>
              </button>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5 animate-pulse"></span>
                2026 Industry Blueprints
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
