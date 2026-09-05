import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  Zap,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Bot,
  FileSearch,
  Code2,
  Layers,
  Award,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { CAREER_DEFINITIONS } from '../data/careers';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onExploreCareers: () => void;
  onLoadDemo: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onExploreCareers,
  onLoadDemo,
  setActiveTab,
}) => {
  const floatingSkills = [
    { name: 'Python', level: '90%', top: '10%', left: '8%', delay: '0s', color: 'from-blue-500 to-indigo-600' },
    { name: 'Machine Learning', level: '85%', top: '22%', right: '10%', delay: '1s', color: 'from-purple-500 to-pink-600' },
    { name: 'React', level: '85%', bottom: '25%', left: '12%', delay: '2s', color: 'from-cyan-400 to-blue-600' },
    { name: 'SQL', level: '75%', bottom: '15%', right: '14%', delay: '1.5s', color: 'from-emerald-400 to-teal-600' },
    { name: 'Cloud', level: '70%', top: '5%', right: '28%', delay: '0.5s', color: 'from-amber-400 to-orange-500' },
    { name: 'Data Structures', level: '80%', bottom: '8%', left: '38%', delay: '2.5s', color: 'from-violet-500 to-indigo-500' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Current Skills Intake',
      description: 'Input your programming languages, frameworks, projects, and coursework with verified proficiency tiers.',
      icon: Code2,
    },
    {
      number: '02',
      title: 'AI Gap Diagnosis',
      description: 'Our engine benchmarks your exact inventory against thousands of verified job requirements and industry roles.',
      icon: BrainCircuit,
    },
    {
      number: '03',
      title: 'Adaptive Roadmap',
      description: 'Receive an actionable, stage-by-stage learning plan with prioritized milestones, curated resources, and project sprints.',
      icon: TrendingUp,
    },
    {
      number: '04',
      title: 'Career Readiness',
      description: 'Track your readiness percentage, practice with your dedicated AI Career Mentor, and land target internships.',
      icon: ShieldCheck,
    },
  ];

  const features = [
    {
      icon: Target,
      title: 'Skill Gap Radar & Analysis',
      description: 'Mathematical breakdown across Technical Skills, Projects, Experience, and Certifications with instant current vs required charts.',
    },
    {
      icon: Compass,
      title: 'Interactive Career Roadmap',
      description: 'Visual step-by-step guidance from your current baseline to your dream role with milestone tracking and time estimates.',
    },
    {
      icon: Bot,
      title: 'Dedicated AI Career Mentor',
      description: 'Context-aware advisor answering questions on study plans, internship readiness, project selection, and interview prep.',
    },
    {
      icon: FileSearch,
      title: 'Intelligent Resume Scanner',
      description: 'Analyze your resume against target career descriptions, uncover missing keywords, and get ATS score improvements.',
    },
    {
      icon: Layers,
      title: 'Career Switch Simulator',
      description: 'Simulate switching between 8+ target paths in real-time to discover where your existing skills offer highest leverage.',
    },
    {
      icon: Award,
      title: 'Professional Gamification',
      description: 'Earn XP, unlock verified achievement badges, and celebrate milestones as you build genuine engineering competency.',
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden">
      {/* Background Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Skill Badges */}
      <div className="hidden lg:block pointer-events-none">
        {floatingSkills.map((badge, idx) => (
          <div
            key={idx}
            style={{
              top: badge.top,
              bottom: badge.bottom,
              left: badge.left,
              right: badge.right,
              animationDelay: badge.delay,
            }}
            className="absolute z-10 animate-float"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-md">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${badge.color}`} />
              <span className="text-xs font-semibold text-white">{badge.name}</span>
              <span className="text-[10px] text-cyan-400 font-mono font-medium">{badge.level}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Buildathon Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-8 shadow-inner shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>SkillForge AI — Know where you are. Discover where you can go.</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Turn Your Skills Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
            Your Career.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          SkillForge AI analyzes your current skills, compares them with your dream career, and creates a personalized roadmap to help you become career-ready.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-btn-analyze"
            onClick={onStartAnalysis}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Analyze My Skills</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            id="hero-btn-explore"
            onClick={onExploreCareers}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-medium text-sm hover:bg-slate-800/80 hover:border-slate-600 transition-all"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Explore Careers</span>
          </button>

          <button
            id="hero-btn-demo"
            onClick={onLoadDemo}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium text-sm hover:bg-emerald-500/20 transition-all"
          >
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span>⚡ Load Demo Profile (Alex)</span>
          </button>
        </div>

        {/* Visual Pipeline Hero Graphic */}
        <div className="mt-16 pt-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
              The SkillForge AI Transformation Pipeline
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-center">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div className="text-xs font-semibold text-slate-300">Current Skills</div>
                <div className="text-[11px] text-slate-500 mt-1">Python, SQL, DSA</div>
              </div>

              <div className="flex justify-center text-cyan-400">
                <ArrowRight className="w-5 h-5 sm:rotate-0 rotate-90" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/40 shadow-md shadow-cyan-500/10">
                <div className="text-xs font-bold text-cyan-300 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Analysis
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Gap & Readiness Metric</div>
              </div>

              <div className="flex justify-center text-cyan-400">
                <ArrowRight className="w-5 h-5 sm:rotate-0 rotate-90" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/40">
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Career Goal
                </div>
                <div className="text-[11px] text-slate-400 mt-1">AI/ML Engineer</div>
              </div>
            </div>

            {/* Sub Pipeline Step Details */}
            <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="text-xs">
                <span className="text-slate-400">Target Role:</span>{' '}
                <span className="text-white font-medium">AI/ML Engineer</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400">Readiness Score:</span>{' '}
                <span className="text-cyan-300 font-mono font-bold">72%</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400">Primary Gap:</span>{' '}
                <span className="text-amber-300 font-medium">Machine Learning</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400">Next Action:</span>{' '}
                <span className="text-emerald-300 font-medium">FastAPI Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">How It Works</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Four Steps From Student To Hired Engineer
          </h3>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Eliminate guesswork. Benchmark your real skills against rigorous industry criteria and follow a guided timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all hover:-translate-y-0.5 group"
              >
                <div className="text-3xl font-extrabold text-slate-700 group-hover:text-cyan-500/40 font-mono transition-colors">
                  {step.number}
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center my-4 text-cyan-400 group-hover:text-cyan-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Engine Features</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built For Serious Career Preparedness
          </h3>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Every feature is engineered to provide mathematical clarity on where you stand and what to build next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mt-4">{feat.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Career Paths */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Career Taxonomies</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Popular Target Roles</h3>
            <p className="text-slate-400 mt-1.5 text-xs sm:text-sm">Pre-calibrated benchmark criteria based on top tech hiring standards.</p>
          </div>
          <button
            onClick={onExploreCareers}
            className="mt-4 md:mt-0 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <span>Compare All 8 Roles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_DEFINITIONS.slice(0, 6).map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
                    {c.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{c.avgSalary}</span>
                </div>
                <h4 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{c.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.requiredSkills.slice(0, 4).map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900/60 text-slate-300 border border-slate-700/50 font-medium"
                    >
                      {s.skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-400">{c.stages.length} Roadmap Stages</span>
                <button
                  onClick={() => {
                    setActiveTab('career-compare');
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Evaluate</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why SkillForge AI */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why SkillForge AI Over Generic Job Portals?
            </h3>
            <p className="text-slate-300 mt-3 leading-relaxed text-xs sm:text-sm">
              Standard job boards show you hundreds of open postings without telling you what you are missing. SkillForge AI flips the script: we diagnose your current baseline, quantify exact skill gaps, and provide a bespoke, day-by-day execution roadmap to make you undeniably qualified.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">Deterministic mathematical scoring — never random scores</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">Dual-engine AI mentor with live & contextual fallback</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">Custom weekly study schedule distributed by available hours</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">100% persistent local memory & resume ATS optimizer</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartAnalysis}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all"
              >
                Start My Skill Analysis
              </button>
              <button
                onClick={onLoadDemo}
                className="px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-700/50 text-slate-200 font-medium text-xs hover:bg-slate-800 transition-colors"
              >
                Inspect Alex Demo Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-400">SkillForge AI</span>
          <span>— Buildathon Ready Student Skill Gap Analyzer</span>
        </div>
        <div>
          <span>Crafted for tech students & engineering aspirants</span>
        </div>
      </footer>
    </div>
  );
};
