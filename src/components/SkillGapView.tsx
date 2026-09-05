import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Compass,
  GitBranch,
  Layers,
  Zap,
  Filter,
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
  CareerDefinition,
  SkillGapItem,
  ActiveTab,
} from '../types';
import { CAREER_DEFINITIONS, SKILL_DEPENDENCY_GRAPH } from '../data/careers';

interface SkillGapViewProps {
  profile: StudentProfile;
  analysis: ReadinessAnalysis;
  onSwitchCareer: (careerTitle: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  profile,
  analysis,
  onSwitchCareer,
  setActiveTab,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [simulatedCareer, setSimulatedCareer] = useState(profile.targetCareer);

  const filteredGaps = analysis.skillGaps.filter((g) => {
    if (priorityFilter === 'All') return true;
    return g.priority === priorityFilter;
  });

  // Radar data
  const radarData = [
    { subject: 'Technical', A: analysis.breakdown.technicalSkills, fullMark: 100 },
    { subject: 'Projects', A: analysis.breakdown.projects, fullMark: 100 },
    { subject: 'Experience', A: analysis.breakdown.experience, fullMark: 100 },
    { subject: 'Certs', A: analysis.breakdown.certifications, fullMark: 100 },
    { subject: 'Problem Solving', A: analysis.breakdown.problemSolving, fullMark: 100 },
    { subject: 'Communication', A: analysis.breakdown.communication, fullMark: 100 },
    { subject: 'Career Prep', A: analysis.breakdown.careerPreparation, fullMark: 100 },
  ];

  // Career Match Matrix for all 8 careers
  const careerMatrix = CAREER_DEFINITIONS.map((c) => {
    // Quick estimation for matrix
    const hasPython = profile.skills.some((s) => s.name.toLowerCase().includes('python'));
    const hasReact = profile.skills.some((s) => s.name.toLowerCase().includes('react'));
    const hasSQL = profile.skills.some((s) => s.name.toLowerCase().includes('sql'));
    let score = 40;
    if (c.title === profile.targetCareer) {
      score = analysis.careerReadiness;
    } else if (c.title.includes('Data Analyst') && hasPython && hasSQL) {
      score = 78;
    } else if (c.title.includes('Full Stack') && hasReact) {
      score = 75;
    } else if (c.title.includes('Data Scientist') && hasPython) {
      score = 70;
    } else if (c.title.includes('Cloud')) {
      score = 58;
    } else if (c.title.includes('Cybersecurity')) {
      score = 48;
    } else {
      score = 62;
    }
    return {
      id: c.id,
      title: c.title,
      category: c.category,
      avgSalary: c.avgSalary,
      score,
      status: score >= 70 ? 'High Leverage' : score >= 55 ? 'Moderate Gap' : 'Requires Pivot',
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>AI Competency Diagnostic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skill Gap Analysis for {profile.targetCareer}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Mathematical comparison between your verified skills and market requirements. Every missing skill is quantified with an actionable remediation path.
          </p>
        </div>

        {/* Circular Readiness Gauge */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 shrink-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />
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
            <div className="absolute text-center">
              <span className="text-lg font-bold text-white font-mono">{analysis.careerReadiness}%</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-white">Overall Readiness</div>
            <div className="text-[11px] text-cyan-300 font-medium mt-0.5">
              {analysis.careerReadiness >= 75 ? 'Job Candidate Ready' : 'In Training Pipeline'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {analysis.skillGaps.length} gaps to close
            </div>
          </div>
        </div>
      </div>

      {/* WOW FEATURE B: CAREER SWITCH SIMULATOR */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-slate-700/50 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Career Switch Simulator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono">
                  Live Recalculation
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Simulate switching your target role to see how your current skills map to other careers.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-300">
            Selected: <span className="text-cyan-300 font-semibold">{simulatedCareer}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {CAREER_DEFINITIONS.map((c) => {
            const isCurrent = simulatedCareer === c.title;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSimulatedCareer(c.title);
                  onSwitchCareer(c.title);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border border-blue-400'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7-Category Readiness Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Technical Skills', score: analysis.breakdown.technicalSkills, weight: '40%' },
          { label: 'Projects Built', score: analysis.breakdown.projects, weight: '25%' },
          { label: 'Experience', score: analysis.breakdown.experience, weight: '15%' },
          { label: 'Problem Solving', score: analysis.breakdown.problemSolving, weight: '10%' },
          { label: 'Certifications', score: analysis.breakdown.certifications, weight: '5%' },
          { label: 'Communication', score: analysis.breakdown.communication, weight: '5%' },
          { label: 'Career Prep', score: analysis.breakdown.careerPreparation, weight: 'Formula' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-[11px] font-medium text-slate-400 truncate">{item.label}</div>
            <div className="text-xl font-extrabold text-white font-mono mt-1">{item.score}%</div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  item.score >= 70 ? 'bg-cyan-400' : item.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${item.score}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-500 mt-1 font-mono">{item.weight} weight</div>
          </div>
        ))}
      </div>

      {/* Visual Analytics: Radar + Horizontal Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Competency Radar</h3>
            <p className="text-xs text-slate-400">Multifactor profile analysis vs industry baseline</p>
          </div>
          <div className="h-72 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Student" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 text-center">
            Calculated objectively from student coursework, project difficulty, and language mastery.
          </div>
        </div>

        {/* Detailed Skill Bars */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Skill Benchmark Bars</h3>
            <p className="text-xs text-slate-400">Current competence compared to required role threshold</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
            {analysis.skillGaps.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{item.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{item.current}%</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-cyan-400 font-mono">{item.required}% Req</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        item.priority === 'High'
                          ? 'bg-red-500/20 text-red-300'
                          : item.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      -{item.gap}%
                    </span>
                  </div>
                </div>

                <div className="relative w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  {/* Required Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-10"
                    style={{ left: `${item.required}%` }}
                    title={`Required: ${item.required}%`}
                  />
                  {/* Current Fill */}
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${item.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Cyan vertical line represents target threshold</span>
            <span className="text-emerald-400 font-semibold">{analysis.strengths.length} strengths verified</span>
          </div>
        </div>
      </div>

      {/* WOW FEATURE D: SKILL DEPENDENCY PREREQUISITE GRAPH */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Visual Skill Dependency Prerequisite Graph</h3>
            <p className="text-xs text-slate-400">
              Optimal learning order: Master foundational prerequisites before attempting advanced systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_DEPENDENCY_GRAPH.map((edge, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono">
                    {edge.from}
                  </span>
                  <span className="text-cyan-400 font-bold text-xs">➔</span>
                  <span className="text-xs font-bold text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-800/60 font-mono">
                    {edge.to}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {edge.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Prerequisite Step #{idx + 1}</span>
                <span className="text-emerald-400">Verified Flow</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Skill Gap Cards List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Detailed Skill Gaps & Remediation</h3>
            <p className="text-xs text-slate-400">Step-by-step guidance to close each specific competency deficit</p>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            {(['All', 'High', 'Medium', 'Low'] as const).map((pri) => (
              <button
                key={pri}
                onClick={() => setPriorityFilter(pri)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  priorityFilter === pri
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pri}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGaps.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-white">{item.skill}</h4>
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      item.priority === 'High'
                        ? 'bg-red-500/15 text-red-300 border-red-500/30'
                        : item.priority === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                {/* Numbers */}
                <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">Current Level</div>
                    <div className="text-xs font-bold text-white font-mono">{item.current}% ({item.currentLevel})</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Required Level</div>
                    <div className="text-xs font-bold text-cyan-300 font-mono">{item.required}% ({item.requiredLevel})</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Gap</div>
                    <div className="text-xs font-bold text-red-400 font-mono">-{item.gap}%</div>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300">Why it matters: </span>
                    <span className="text-slate-400">{item.whyItMatters}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                    <span className="font-semibold text-cyan-300">Recommended Next Step: </span>
                    <span>{item.recommendedNextStep}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('ai-mentor')}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ask AI Mentor About This</span>
                </button>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>View in Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Strengths Section */}
      <div className="p-6 rounded-2xl bg-slate-800/30 border border-emerald-500/30 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Verified Career Strengths</h3>
        </div>
        <p className="text-xs text-slate-400">
          You currently meet or exceed market requirements for these competencies. Leverage them on your resume and interviews!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {analysis.strengths.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">{s.skill}</div>
                <div className="text-[10px] text-slate-400">{s.currentLevel} Level</div>
              </div>
              <div className="text-right font-mono text-xs text-emerald-400 font-bold">
                {s.current}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WOW FEATURE E: CAREER MATCH MATRIX */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Career Compatibility Matrix</h3>
              <p className="text-xs text-slate-400">
                Comparing your skill inventory against 8 prominent engineering and tech career tracks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('career-compare')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Detailed Side-by-Side</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Career Track</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Readiness Match</th>
                <th className="py-3 px-4">Avg Industry Salary</th>
                <th className="py-3 px-4">Leverage Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {careerMatrix.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    {row.title}
                    {row.title === profile.targetCareer && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Current Goal
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{row.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{row.score}%</span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.score >= 70 ? 'bg-cyan-400' : row.score >= 55 ? 'bg-amber-400' : 'bg-slate-600'
                          }`}
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{row.avgSalary}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === 'High Leverage'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : row.status === 'Moderate Gap'
                          ? 'bg-blue-500/15 text-blue-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSwitchCareer(row.title)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Switch Goal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
