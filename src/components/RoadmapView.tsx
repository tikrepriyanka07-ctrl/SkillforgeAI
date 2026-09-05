import React, { useState } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  ArrowRight,
  Sparkles,
  Award,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StudentProfile, RoadmapStage, ActiveTab } from '../types';

interface RoadmapViewProps {
  profile: StudentProfile;
  roadmap: RoadmapStage[];
  onUpdateStageStatus: (stageId: string, status: 'completed' | 'in-progress' | 'not-started') => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  profile,
  roadmap,
  onUpdateStageStatus,
  setActiveTab,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(
    roadmap.find((s) => s.status === 'in-progress')?.id || roadmap[0]?.id || ''
  );

  const selectedStage = roadmap.find((s) => s.id === selectedStageId) || roadmap[0];

  const completedCount = roadmap.filter((s) => s.status === 'completed').length;
  const inProgressCount = roadmap.filter((s) => s.status === 'in-progress').length;
  const progressPct = Math.round((completedCount / Math.max(1, roadmap.length)) * 100);

  // WOW FEATURE C: Career Readiness Timeline Projection Data
  const timelineData = [
    { month: 'Start', readiness: 28, milestone: 'Baseline', readyFor: 'Beginner Projects' },
    { month: 'Month 1', readiness: 42, milestone: 'Foundations Solid', readyFor: 'Open Source PRs' },
    { month: 'Month 3', readiness: 65, milestone: 'Core Competency', readyFor: 'Internship Ready' },
    { month: 'Month 6', readiness: 82, milestone: 'Advanced Systems', readyFor: 'Junior Engineer Ready' },
    { month: 'Month 12', readiness: 94, milestone: 'Autonomous Builder', readyFor: 'Full Stack / Tier-1 Ready' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Milestone className="w-3.5 h-3.5" />
            <span>Interactive Learning Path</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Career Roadmap for {profile.targetCareer}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            A milestone-by-milestone guided trajectory tailored to your current skills and study hours.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 min-w-[220px] shrink-0">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Roadmap Progress</span>
            <span className="font-mono font-bold text-cyan-400">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{completedCount} of {roadmap.length} Stages Complete</span>
            <span className="text-emerald-400 font-semibold">{inProgressCount} In Progress</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL STEP-BY-STEP VISUAL PROGRESSION PIPELINE */}
      <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Visual Progression Path
          </div>
          <span className="text-xs text-slate-500">Click any stage to view syllabus & projects</span>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex items-center min-w-[700px] gap-2">
            {/* YOU ARE HERE indicator */}
            <div className="flex flex-col items-center shrink-0 pr-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider animate-pulse">
                You Are Here
              </span>
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50 mt-1" />
            </div>

            {roadmap.map((stage, idx) => {
              const isSelected = stage.id === selectedStageId;
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in-progress';

              return (
                <React.Fragment key={stage.id}>
                  {/* Stage Card Button */}
                  <button
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-blue-600/20 border-cyan-400 shadow-lg shadow-cyan-500/10'
                        : isCompleted
                        ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                        : isInProgress
                        ? 'bg-slate-900/80 border-blue-500/40 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-slate-500">STAGE {idx + 1}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isInProgress ? (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>

                    <div className="text-xs font-bold text-white truncate">{stage.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{stage.estimatedDuration}</div>

                    {isSelected && (
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-cyan-400" />
                    )}
                  </button>

                  {/* Connecting Arrow */}
                  {idx < roadmap.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}

            {/* CAREER READY ENDPOINT */}
            <div className="flex flex-col items-center shrink-0 pl-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Career Ready!
              </span>
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED STAGE DEEP DIVE PANEL */}
      {selectedStage && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
                  STAGE {selectedStage.stageNumber} OF {roadmap.length}
                </span>
                <span className="text-xs text-slate-400">{selectedStage.difficulty} Tier</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1.5">{selectedStage.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedStage.description}</p>
            </div>

            {/* Stage Status Toggle */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
              {(['not-started', 'in-progress', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStageStatus(selectedStage.id, status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedStage.status === status
                      ? status === 'completed'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                        : status === 'in-progress'
                        ? 'bg-cyan-500 text-slate-900 shadow-sm font-bold'
                        : 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What to Learn */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>What To Master In This Stage</span>
              </div>
              <ul className="space-y-2">
                {selectedStage.topics.map((topic, tIdx) => (
                  <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why It Matters */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Why This Stage Matters</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedStage.whyItMatters}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1.5">Prerequisites:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStage.prerequisites.map((prereq, pIdx) => (
                      <span key={pIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Estimated Commitment: <span className="text-white font-bold">{selectedStage.estimatedDuration}</span>
              </div>
            </div>
          </div>

          {/* Recommended Projects for this stage */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <FolderGit2 className="w-4 h-4" />
                <span>Hands-On Milestone Projects</span>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>View Full Projects Library</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedStage.projects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{proj}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Stage {selectedStage.stageNumber} Portfolio Artifact</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Resources */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Curated Courses & Documentation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedStage.resources.map((res, rIdx) => (
                <a
                  key={rIdx}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {res.name}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 mt-1 inline-block">
                      {res.type}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WOW FEATURE C: CAREER READINESS TIMELINE & TRAJECTORY */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Career Readiness Timeline & Projected Curve</h3>
              <p className="text-xs text-slate-400">
                Estimated progression curve assuming {profile.dailyStudyHours} hours daily focused practice.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            Month 6: 82% Job Ready
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(value: any) => [`${value}% Readiness`, 'Projected Score']}
              />
              <Line
                type="monotone"
                dataKey="readiness"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {timelineData.map((t, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-mono">{t.month}</div>
              <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">{t.readiness}%</div>
              <div className="text-[10px] text-white font-semibold mt-1 truncate">{t.milestone}</div>
              <div className="text-[9px] text-emerald-400 mt-0.5 truncate">{t.readyFor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
