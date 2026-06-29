import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBadges from './components/TrustBadges';
import ThemeExplorer from './components/ThemeExplorer';
import GovernanceStack from './components/GovernanceStack';
import ScenarioSimulator from './components/ScenarioSimulator';
import GovernanceMatrix from './components/GovernanceMatrix';
import PlaybookConsole from './components/PlaybookConsole';
import GeneralSynthesis from './components/GeneralSynthesis';
import PortalLanding from './components/PortalLanding';
import AIOptimization from './components/AIOptimization';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { translations } from './data/translations';

function AppContent() {
  const [currentView, setCurrentView] = useState<'portal' | 'governance' | 'optimization'>('portal');
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const scrollToSection = (id: string) => {
    if (id === 'root') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="root-container" className="relative min-h-screen">
      {/* Background Ambient Pastels */}
      <div className="absolute top-0 left-1/4 w-[35rem] h-[35rem] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[40rem] h-[40rem] bg-blue-100/30 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Sticky Navigation Header */}
      <Header 
        scrollToSection={scrollToSection} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Page Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {currentView === 'portal' && (
          <PortalLanding onSelectTopic={setCurrentView} />
        )}
        
        {currentView === 'governance' && (
          <>
            <Hero scrollToSection={scrollToSection} />
            <TrustBadges />
            <ThemeExplorer />
            <GovernanceStack />
            <ScenarioSimulator />
            <GovernanceMatrix />
            <PlaybookConsole />
            <GeneralSynthesis />
          </>
        )}

        {currentView === 'optimization' && (
          <AIOptimization />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-12 bg-white text-center text-xs text-slate-500 relative z-10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2">
            {currentView === 'portal' && t.footer.portalText}
            {currentView === 'governance' && t.footer.govText}
            {currentView === 'optimization' && t.footer.optText}
          </p>
          <p>{t.footer.copyText}</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
