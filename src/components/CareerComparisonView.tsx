import React, { useState } from 'react';
import {
  GitCompare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { StudentProfile, ActiveTab } from '../types';
import { CAREER_DEFINITIONS } from '../data/careers';
import { analyzeStudentProfile } from '../services/analysisEngine';

interface CareerComparisonViewProps {
  profile: StudentProfile;
  onSwitchCareer: (careerTitle: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const CareerComparisonView: React.FC<CareerComparisonViewProps> = ({
  profile,
  onSwitchCareer,
  setActiveTab,
}) => {
  const [careerAId, setCareerAId] = useState('career-aiml');
  const [careerBId, setCareerBId] = useState('career-fullstack');
  const [careerCId, setCareerCId] = useState('career-datascientist');

  const careerA = CAREER_DEFINITIONS.find((c) => c.id === careerAId) || CAREER_DEFINITIONS[0];
  const careerB = CAREER_DEFINITIONS.find((c) => c.id === careerBId) || CAREER_DEFINITIONS[1];
  const careerC = CAREER_DEFINITIONS.find((c) => c.id === careerCId) || CAREER_DEFINITIONS[2];

  const analysisA = analyzeStudentProfile(profile, careerA.title);
  const analysisB = analyzeStudentProfile(profile, careerB.title);
  const analysisC = analyzeStudentProfile(profile, careerC.title);

  const compared = [
    { career: careerA, analysis: analysisA, id: careerAId, setId: setCareerAId },
    { career: careerB, analysis: analysisB, id: careerBId, setId: setCareerBId },
    { career: careerC, analysis: analysisC, id: careerCId, setId: setCareerCId },
  ];

  // Determine highest match
  const bestMatch = [...compared].sort(
    (a, b) => b.analysis.careerReadiness - a.analysis.careerReadiness
  )[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Career Evaluation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Side-by-Side Career Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Compare 3 target career paths simultaneously against your current skill inventory to identify the highest leverage trajectory.
          </p>
        </div>
      </div>

      {/* BEST MATCH FOR YOU SPOTLIGHT */}
      <div className="p-6 rounded-2xl bg-slate-800/30 border border-emerald-500/40 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Best Match For You
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {bestMatch.analysis.careerReadiness}% Immediate Readiness
          </span>
        </div>

        <h3 className="text-xl font-bold text-white">
          Your skills give you the highest launchpad for{' '}
          <span className="text-emerald-400 font-extrabold">{bestMatch.career.title}</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Because of your existing strength in{' '}
          <strong>{profile.skills.slice(0, 3).map((s) => s.name).join(', ')}</strong>, you need significantly fewer additional prerequisite stages to reach job-competitiveness in {bestMatch.career.title} compared to the other roles.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              onSwitchCareer(bestMatch.career.title);
              setActiveTab('skill-gap');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all flex items-center gap-1.5"
          >
            <span>Set As Target Career</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3-Column Career Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {compared.map((col, idx) => {
          const isBest = col.career.id === bestMatch.career.id;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-slate-800/30 border backdrop-blur-sm flex flex-col justify-between space-y-6 transition-all ${
                isBest ? 'border-emerald-500/50' : 'border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="space-y-4">
                {/* Career Selector Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Select Role {idx + 1}:
                  </label>
                  <select
                    value={col.id}
                    onChange={(e) => col.setId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
                  >
                    {CAREER_DEFINITIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Score & Category */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Readiness Match</span>
                    <div className="text-2xl font-black text-white font-mono mt-0.5">
                      {col.analysis.careerReadiness}%
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-cyan-400 font-mono">{col.career.avgSalary}</span>
                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">{col.career.difficulty}</div>
                  </div>
                </div>

                {/* Matching Skills */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matching Skills ({col.analysis.strengths.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {col.analysis.strengths.slice(0, 5).map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 font-mono"
                      >
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Skill Gaps to Close ({col.analysis.skillGaps.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {col.analysis.skillGaps.slice(0, 4).map((g, gIdx) => (
                      <span
                        key={gIdx}
                        className="text-[11px] px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/50 font-mono"
                      >
                        {g.skill} (-{g.gap}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Roadmap Length */}
                <div className="pt-2 border-t border-slate-700/50 text-xs text-slate-400 flex items-center justify-between">
                  <span>Roadmap Stages:</span>
                  <span className="text-white font-bold">{col.career.stages.length} Stages (~6-9 mos)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSwitchCareer(col.career.title);
                  setActiveTab('skill-gap');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Select & View Gap Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
