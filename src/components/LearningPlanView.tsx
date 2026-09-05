import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react';
import { StudentProfile, LearningTask, ActiveTab } from '../types';

interface LearningPlanViewProps {
  profile: StudentProfile;
  tasks: LearningTask[];
  onToggleTask: (taskId: string) => void;
  onUpdateDailyHours: (hours: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const LearningPlanView: React.FC<LearningPlanViewProps> = ({
  profile,
  tasks,
  onToggleTask,
  onUpdateDailyHours,
  setActiveTab,
}) => {
  // Focus Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'25' | '50'>('25');

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      // Timer finished
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const resetTimer = (mode: '25' | '50') => {
    setTimerActive(false);
    setTimerMode(mode);
    setTimerSeconds(mode === '25' ? 25 * 60 : 50 * 60);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / Math.max(1, tasks.length)) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Study Routine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Weekly Learning Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Distributed daily tasks mapped to your biggest skill gaps in {profile.targetCareer}. Complete tasks to unlock badges and maintain your streak.
          </p>
        </div>

        {/* Study Allocation Selector */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50 shrink-0 space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400 block">Daily Study Target</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((hr) => (
              <button
                key={hr}
                onClick={() => onUpdateDailyHours(hr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  profile.dailyStudyHours === hr
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/80 border border-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                {hr}h / day
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Timer & Weekly Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Built-in Pomodoro Focus Sprint Widget */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col items-center justify-between text-center space-y-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Deep Work Sprint Timer</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => resetTimer('25')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  timerMode === '25' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900/80 border border-slate-700/50 text-slate-400'
                }`}
              >
                25m
              </button>
              <button
                onClick={() => resetTimer('50')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  timerMode === '50' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900/80 border border-slate-700/50 text-slate-400'
                }`}
              >
                50m
              </button>
            </div>
          </div>

          <div className="text-5xl font-black font-mono text-white tracking-widest my-2">
            {formatTimer(timerSeconds)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] ${
                timerActive
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900'
              }`}
            >
              {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-900" />}
              <span>{timerActive ? 'Pause' : 'Start Focus Sprint'}</span>
            </button>
            <button
              onClick={() => resetTimer(timerMode)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Eliminate distractions. Work through today&apos;s scheduled practice without context switching.
          </p>
        </div>

        {/* Weekly Progress Bar */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">This Week's Execution Sprint</h3>
              <p className="text-xs text-slate-400">
                {completedCount} of {tasks.length} tasks completed ({progressPct}%)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Flame className="w-4 h-4" />
              <span>5 Day Active Streak</span>
            </div>
          </div>

          <div className="w-full bg-slate-900/80 h-3 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Scheduled Time</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {profile.dailyStudyHours * 7}h / week
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Completed Time</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                {Math.round((completedCount * profile.dailyStudyHours * 60) / 60)}h
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="text-[10px] text-slate-400">XP Earned</div>
              <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
                +{completedCount * 50} XP
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Next Milestone</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5 truncate">
                Level {(Math.floor(completedCount / 3) + 1)} Sprint
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monday - Sunday Daily Tasks List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Monday to Sunday Daily Tasks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-900/40 border-emerald-500/30 opacity-90'
                  : 'bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-slate-600'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{task.day}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {task.skill}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {task.durationMinutes}m
                  </span>
                </div>

                <h4
                  className={`text-sm font-bold ${
                    task.completed ? 'text-slate-400 line-through' : 'text-white'
                  }`}
                >
                  {task.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">{task.focusArea}</p>
              </div>

              <button
                onClick={() => onToggleTask(task.id)}
                className={`p-2 rounded-xl transition-all shrink-0 ${
                  task.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900/80 text-slate-500 border border-slate-700/50 hover:text-white'
                }`}
                title={task.completed ? 'Mark as Incomplete' : 'Complete Task'}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
