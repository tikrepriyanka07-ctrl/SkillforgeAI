import React, { useState } from 'react';
import {
  X,
  Save,
  Download,
  RotateCcw,
  Zap,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { CAREER_DEFINITIONS } from '../data/careers';
import { exportAllData } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLoadDemo: () => void;
  onResetAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  darkMode,
  setDarkMode,
  onLoadDemo,
  onResetAll,
}) => {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [branch, setBranch] = useState(profile.branch);
  const [year, setYear] = useState(profile.year);
  const [targetCareer, setTargetCareer] = useState(profile.targetCareer);
  const [studyHours, setStudyHours] = useState(profile.dailyStudyHours);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...profile,
      name,
      college,
      branch,
      year,
      targetCareer,
      dailyStudyHours: studyHours,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleExport = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillforge_profile_${profile.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Platform Settings & Data</h3>
              <p className="text-[11px] text-slate-400">Configure profile, study goals, and persistence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Personal info */}
          <div className="space-y-3">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Student Profile
            </span>
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Career Goal</label>
              <select
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                {CAREER_DEFINITIONS.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Daily Study Target</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((hr) => (
                  <button
                    key={hr}
                    onClick={() => setStudyHours(hr)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      studyHours === hr
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {hr}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Data Persistence & Reset
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center gap-2 font-medium"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  onLoadDemo();
                  onClose();
                }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 font-medium hover:bg-emerald-500/20"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Reload Alex Demo</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all saved profile, roadmap, and tasks data?')) {
                  onResetAll();
                  onClose();
                }
              }}
              className="w-full p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Application Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
