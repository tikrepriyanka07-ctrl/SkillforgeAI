import React, { useState } from 'react';
import {
  FolderGit2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  Code2,
  ExternalLink,
} from 'lucide-react';
import {
  StudentProfile,
  ReadinessAnalysis,
  RecommendedProject,
  ActiveTab,
} from '../types';
import { generateRecommendedProjects } from '../services/analysisEngine';

interface ProjectRecommendationsViewProps {
  profile: StudentProfile;
  analysis: ReadinessAnalysis;
  onAddProjectToProfile: (project: RecommendedProject) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ProjectRecommendationsView: React.FC<ProjectRecommendationsViewProps> = ({
  profile,
  analysis,
  onAddProjectToProfile,
  setActiveTab,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const recommendedList = generateRecommendedProjects(profile, analysis.skillGaps);

  const filtered = recommendedList.filter((p) => {
    if (filterDifficulty === 'All') return true;
    return p.difficulty === filterDifficulty;
  });

  const handleAdd = (proj: RecommendedProject) => {
    onAddProjectToProfile(proj);
    setAddedIds([...addedIds, proj.id]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Targeted Portfolio Artifacts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curated Projects For Missing Skills
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Recruiters evaluate real GitHub code over certificates. These projects are designed to explicitly eliminate your highest priority gaps in {profile.targetCareer}.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/60 border border-slate-700/50 shrink-0">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filterDifficulty === diff
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => {
          const isAdded =
            addedIds.includes(proj.id) ||
            profile.projects.some((p) => p.name.toLowerCase() === proj.name.toLowerCase());

          return (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        proj.difficulty === 'Advanced'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {proj.difficulty}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{proj.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {proj.estimatedTime}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                {/* Why Recommended */}
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                  <span className="font-bold text-cyan-300">Why recommended: </span>
                  <span>{proj.whyRecommended}</span>
                </div>

                {/* Skills Developed */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400">Target Skills Developed:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {proj.skillsDeveloped.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/60 text-slate-300 border border-slate-700/50 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400">Key Features:</span>
                  <ul className="mt-1 space-y-1">
                    {proj.keyFeatures.map((kf, kfIdx) => (
                      <li key={kfIdx} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{kf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Starter Architecture */}
                {proj.starterArchitecture && (
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                    <span className="font-semibold text-slate-300">Starter Tech Stack: </span>
                    <span className="font-mono text-cyan-400">{proj.starterArchitecture}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('ai-mentor')}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ask Mentor for Code Skeleton</span>
                </button>

                <button
                  onClick={() => handleAdd(proj)}
                  disabled={isAdded}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isAdded
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Added to Profile</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to My Projects</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
