import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Flame,
  Milestone,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Clock,
  Compass,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  StudentProfile,
  ReadinessAnalysis,
  RoadmapStage,
  LearningTask,
  Achievement,
  ActiveTab,
} from '../types';

interface DashboardViewProps {
  profile: StudentProfile;
  analysis: ReadinessAnalysis;
  roadmap: RoadmapStage[];
  tasks: LearningTask[];
  achievements: Achievement[];
  xp: number;
  setActiveTab: (tab: ActiveTab) => void;
  onToggleTask: (taskId: string) => void;
  onSwitchCareer: (newCareer: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  analysis,
  roadmap,
  tasks,
  achievements,
  xp,
  setActiveTab,
  onToggleTask,
}) => {
  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Roadmap progress calculation
  const completedStages = roadmap.filter((s) => s.status === 'completed').length;
  const roadmapPct = Math.round((completedStages / Math.max(1, roadmap.length)) * 100);

  // Today's task (first uncompleted or first task)
  const todayTask = tasks.find((t) => !t.completed) || tasks[0];

  // Radar data for Recharts
  const radarData = [
    { subject: 'Technical', A: analysis.breakdown.technicalSkills, fullMark: 100 },
    { subject: 'Projects', A: analysis.breakdown.projects, fullMark: 100 },
    { subject: 'Experience', A: analysis.breakdown.experience, fullMark: 100 },
    { subject: 'Certs', A: analysis.breakdown.certifications, fullMark: 100 },
    { subject: 'Problem Solving', A: analysis.breakdown.problemSolving, fullMark: 100 },
    { subject: 'Communication', A: analysis.breakdown.communication, fullMark: 100 },
  ];

  // Skill gap bar comparison data (top 5 required skills)
  const barData = analysis.skillGaps.slice(0, 5).map((g) => ({
    name: g.skill.length > 12 ? `${g.skill.slice(0, 11)}..` : g.skill,
    current: g.current,
    required: g.required,
    gap: g.gap,
  }));

  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Top Banner: Greeting & Quick Profile Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Goal: {profile.targetCareer}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {profile.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            {profile.branch} at {profile.college} ({profile.year}). Track your skills and close your readiness gap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('skill-gap')}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            <Target className="w-4 h-4 text-slate-900" />
            <span>Full Gap Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-mentor')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-white text-xs rounded-lg hover:bg-slate-700/50 transition-all"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Ask AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Top Bento Row: Circular Readiness Gauge (4 cols) & AI High-Impact Action (8 cols) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Bento Cell 1: Career Readiness Circular Gauge */}
        <div className="col-span-12 md:col-span-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#22d3ee"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * analysis.careerReadiness) / 100}
                strokeLinecap="round"
                className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold font-mono tracking-tight text-white">
                {analysis.careerReadiness}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">READINESS</span>
            </div>
          </div>
          <div className="text-sm font-bold text-white mt-1">Career Readiness Score</div>
          <div className="mt-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            {analysis.careerReadiness >= 75 ? 'Tier-1 Competitive' : 'Active Growth Phase'}
          </div>
        </div>

        {/* Bento Cell 2: AI High-Impact Action "What Should I Do Next?" */}
        <div className="col-span-12 md:col-span-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2.5 max-w-2xl z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                What Should I Do Next?
              </span>
              <span className="text-xs text-slate-400 font-medium">• Highest Impact Move</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Master <span className="text-cyan-400 font-extrabold">{analysis.topRecommendation.skill}</span> to close your biggest gap
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analysis.topRecommendation.action}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{analysis.topRecommendation.impact}</span>
              </div>
              <div>
                <span className="text-slate-400">Target Project: </span>
                <span className="text-white font-semibold">{analysis.topRecommendation.projectIdea}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-5 z-10">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] flex items-center gap-1.5"
            >
              <span>Build Recommended Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('ai-mentor')}
              className="px-4 py-2.5 border border-slate-600 text-white text-xs rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask Mentor How</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Bento Row: Verified Skills, Projects Built, Learning Streak, Roadmap Progress */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verified Skills */}
        <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Verified Skills</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{profile.skills.length}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">
                {profile.skills.filter((s) => s.percentage >= 70).length} Advanced
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Projects */}
        <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Projects Built</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{profile.projects.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Score: <span className="text-cyan-300 font-semibold">{analysis.breakdown.projects}%</span>
            </div>
          </div>
        </div>

        {/* Learning Streak (Bento highlight gradient style) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-800/40 border border-indigo-500/30 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Weekly Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-400 font-mono">5 Days 🔥</div>
            <div className="text-[11px] text-slate-300 mt-1">
              {profile.dailyStudyHours}h / day target
            </div>
          </div>
        </div>

        {/* Roadmap Progress */}
        <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Roadmap Progress</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Milestone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{roadmapPct}%</div>
            <div className="w-full bg-slate-700/50 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${roadmapPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: Radar Dimension Chart & Skill Gap Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Dimension Chart */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Readiness Radar</h3>
              <p className="text-xs text-slate-400">Multi-dimensional assessment against {profile.targetCareer}</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">6 Dimensions</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-slate-400">Technical</div>
              <div className="text-xs font-bold text-white">{analysis.breakdown.technicalSkills}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Problem Solving</div>
              <div className="text-xs font-bold text-white">{analysis.breakdown.problemSolving}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Career Prep</div>
              <div className="text-xs font-bold text-white">{analysis.breakdown.careerPreparation}%</div>
            </div>
          </div>
        </div>

        {/* Skill Gap Comparison Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Current vs Required Benchmark</h3>
              <p className="text-xs text-slate-400">Largest competency gaps for {profile.targetCareer}</p>
            </div>
            <button
              onClick={() => setActiveTab('skill-gap')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="current" name="Current %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="required" name="Required %" fill="#6366f1" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500 inline-block" />
                <span className="text-slate-300">Your Current Level</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500/50 inline-block" />
                <span className="text-slate-300">Target Required</span>
              </div>
            </div>
            <span className="text-slate-500">{analysis.skillGaps.length} total gaps identified</span>
          </div>
        </div>
      </div>

      {/* Bottom Bento Row: Today's Task, Best Career Match & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Learning Task */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Current Focus</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {todayTask.durationMinutes} mins
              </span>
            </div>
            <h4 className="text-base font-bold text-white">{todayTask.title}</h4>
            <p className="text-xs text-slate-400 mt-2">{todayTask.focusArea}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onToggleTask(todayTask.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                todayTask.completed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${todayTask.completed ? 'text-emerald-400' : 'text-slate-900'}`} />
              <span>{todayTask.completed ? 'Completed (+50 XP)' : 'Mark as Done'}</span>
            </button>
            <button
              onClick={() => setActiveTab('learning-plan')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Full Schedule
            </button>
          </div>
        </div>

        {/* Best Alternate Career Match */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top Match Matrix</span>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {analysis.bestCareerMatch.readinessScore}% Match
              </span>
            </div>
            <h4 className="text-base font-bold text-white">{analysis.bestCareerMatch.careerTitle}</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {analysis.bestCareerMatch.reason}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Fast-track alternative</span>
            <button
              onClick={() => setActiveTab('career-compare')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Compare Careers</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Gamification Achievements Mini-Showcase */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Level {level} Explorer</span>
              <span className="text-xs text-slate-400 font-mono">{xp} Total XP</span>
            </div>
            <h4 className="text-base font-bold text-white">Milestone Badges</h4>
            <div className="flex items-center gap-2 mt-3">
              {achievements.slice(0, 4).map((ach) => (
                <div
                  key={ach.id}
                  title={`${ach.title}: ${ach.description}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    ach.unlocked
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked
            </span>
            <span className="text-xs text-amber-400 font-medium">Keep learning to level up</span>
          </div>
        </div>
      </div>
    </div>
  );
};
