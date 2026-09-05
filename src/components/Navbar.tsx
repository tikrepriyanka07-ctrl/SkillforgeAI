import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Target,
  Milestone,
  Bot,
  FileText,
  GitCompare,
  Calendar,
  FolderGit2,
  Settings,
  Sun,
  Moon,
  Zap,
  Menu,
  X,
  Award,
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSettings: () => void;
  onLoadDemo: () => void;
  onOpenOnboarding: () => void;
  xp: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  darkMode,
  setDarkMode,
  onOpenSettings,
  onLoadDemo,
  onOpenOnboarding,
  xp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate level based on XP (every 100 XP is 1 level)
  const level = Math.floor(xp / 100) + 1;
  const xpCurrentLevel = xp % 100;

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skill-gap' as ActiveTab, label: 'Skill Gaps', icon: Target },
    { id: 'roadmap' as ActiveTab, label: 'Roadmap', icon: Milestone },
    { id: 'ai-mentor' as ActiveTab, label: 'AI Mentor', icon: Bot, highlight: true },
    { id: 'resume-analyzer' as ActiveTab, label: 'Resume', icon: FileText },
    { id: 'career-compare' as ActiveTab, label: 'Compare', icon: GitCompare },
    { id: 'learning-plan' as ActiveTab, label: 'Plan', icon: Calendar },
    { id: 'projects' as ActiveTab, label: 'Projects', icon: FolderGit2 },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#020617]/90 border-b border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white">SkillForge AI</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Career Readiness Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/40 p-1 rounded-xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-800/60 text-cyan-400 border border-slate-700/50 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.label}
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-3">
            {/* AI Engine Status Badge */}
            <div className="hidden lg:flex h-9 px-3 items-center bg-slate-800/40 rounded-full border border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-xs font-medium text-slate-300">AI Engine Active</span>
            </div>

            {/* Quick Demo Profile Button */}
            <button
              id="btn-load-demo"
              onClick={onLoadDemo}
              title="Load Demo Student Profile (Alex - AI/ML Engineer)"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/40 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Demo Profile</span>
            </button>

            {/* Level & XP Badge */}
            <div
              title={`Level ${level} Explorer: ${xpCurrentLevel}/100 XP to next level`}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/30 border border-slate-700/50 text-xs font-medium text-slate-300"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>LVL {level < 10 ? `0${level}` : level}</span>
              <div className="w-12 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${xpCurrentLevel}%` }}
                />
              </div>
            </div>

            {/* New Analysis / Onboard Button */}
            <button
              id="btn-new-analysis"
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              <span className="hidden sm:inline">New Analysis</span>
              <span className="sm:hidden">Analyze</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800/60 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Settings */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800/60 transition-colors"
              title="Settings & Export"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/50 border border-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                onLoadDemo();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Load Alex Demo</span>
            </button>

            <span className="text-xs text-slate-400">
              Student: <span className="text-white font-medium">{profile.name}</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
