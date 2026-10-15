import React, { useState } from 'react';
import { ShieldCheck, Moon, Sun, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { SoundFX } from '../services/soundEffects';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenMissionIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  onOpenMissionIntro
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(SoundFX.isMuted());

  const tabs = [
    { id: 'simulator', label: 'Mission Hub' },
    { id: 'dashboard', label: 'Analyst Command' },
    { id: 'metrics', label: 'Model Evaluation' },
    { id: 'zeroday', label: 'Zero-Day Lab' },
    { id: 'npci_spec', label: 'System Blueprint' }
  ];

  const handleTabClick = (tabId: string) => {
    SoundFX.playTacticalSelect();
    onSelectTab(tabId);
  };

  const handleToggleSound = () => {
    const nextMuted = SoundFX.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      SoundFX.playHoverBlip();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-amber-950/40 dark:border-amber-500/15 bg-white/90 dark:bg-[#0e1219]/90 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Wordmark & Mission Code with Warm Golden Emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <div className="w-full h-full bg-white dark:bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <a 
                href="#simulator" 
                onClick={(e) => { e.preventDefault(); handleTabClick('simulator'); }}
                className="text-base font-heading font-extrabold tracking-tight text-slate-900 dark:text-amber-100 whitespace-nowrap"
              >
                ShieldUPI
              </a>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold tracking-widest hidden sm:inline-block">
                SECURE THE UNKNOWN
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`transition-all whitespace-nowrap cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : 'hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Controls & Mission Briefing Replay */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Mission Briefing Launch Button */}
          <button
            type="button"
            onClick={() => {
              SoundFX.playTacticalSelect();
              onOpenMissionIntro();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer font-mono"
            title="Replay Mission Briefing & Loading Screen"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">MISSION BRIEFING</span>
            <span className="sm:hidden">BRIEF</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#151a24] border border-slate-200 dark:border-amber-500/20 text-slate-600 dark:text-amber-200 hover:text-slate-900 dark:hover:text-amber-300 transition-colors cursor-pointer"
            title={isMuted ? 'Sound Effects Muted (Click to Unmute)' : 'Sound Effects Active (Click to Mute)'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Live Protection Pulse */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>NPCI SLA: 24ms</span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#151a24] border border-slate-200 dark:border-amber-500/20 text-slate-600 dark:text-amber-200 hover:text-slate-900 dark:hover:text-amber-300 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center border-t border-slate-200 dark:border-amber-500/15 bg-white/95 dark:bg-[#0e1219]/95 py-2 px-4 text-xs overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
