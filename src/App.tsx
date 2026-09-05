import React, { useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  ActiveTab,
  RoadmapStage,
  LearningTask,
  Achievement,
  RecommendedProject,
} from './types';
import { DEMO_STUDENT_PROFILE } from './data/demoProfile';
import { CAREER_DEFINITIONS } from './data/careers';
import {
  analyzeStudentProfile,
  generateWeeklyLearningPlan,
} from './services/analysisEngine';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredRoadmap,
  saveStoredRoadmap,
  getStoredTasks,
  saveStoredTasks,
  getStoredAchievements,
  saveStoredAchievements,
  getStoredXP,
  saveStoredXP,
  resetAllData,
} from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { SkillGapView } from './components/SkillGapView';
import { RoadmapView } from './components/RoadmapView';
import { AIMentorView } from './components/AIMentorView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { CareerComparisonView } from './components/CareerComparisonView';
import { LearningPlanView } from './components/LearningPlanView';
import { ProjectRecommendationsView } from './components/ProjectRecommendationsView';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('skillforge_theme') !== 'light';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('skillforge_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('skillforge_theme', 'light');
    }
  }, [darkMode]);

  // Core State
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile);
  const [xp, setXp] = useState<number>(getStoredXP);
  const [achievements, setAchievements] = useState<Achievement[]>(getStoredAchievements);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Derived Skill Gap Analysis
  const analysis = useMemo(() => {
    return analyzeStudentProfile(profile);
  }, [profile]);

  // Roadmap Stages (synced to career)
  const [roadmap, setRoadmap] = useState<RoadmapStage[]>(() => {
    const stored = getStoredRoadmap();
    if (stored && stored.length > 0) return stored;
    const career = CAREER_DEFINITIONS.find((c) => c.title === profile.targetCareer) || CAREER_DEFINITIONS[0];
    return career.stages;
  });

  // Weekly Learning Tasks
  const [tasks, setTasks] = useState<LearningTask[]>(() => {
    const stored = getStoredTasks();
    if (stored && stored.length > 0) return stored;
    return generateWeeklyLearningPlan(profile, analysis.skillGaps);
  });

  // Toast Helper
  const addToast = (title: string, description?: string, type: 'success' | 'xp' | 'achievement' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add XP and trigger notifications
  const addXP = (amount: number, reason: string) => {
    const updated = xp + amount;
    setXp(updated);
    saveStoredXP(updated);
    addToast(`+${amount} XP Earned!`, reason, 'xp');

    // Check achievement for 80% readiness
    if (analysis.careerReadiness >= 80) {
      unlockAchievement('ach-job-ready', 'Job Ready Master');
    }
  };

  const unlockAchievement = (achId: string, name: string) => {
    setAchievements((prev) => {
      const exists = prev.find((a) => a.id === achId);
      if (exists && !exists.unlocked) {
        addToast(`Achievement Unlocked: ${name}!`, exists.description, 'achievement');
        const updated = prev.map((a) => (a.id === achId ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleDateString() } : a));
        saveStoredAchievements(updated);
        return updated;
      }
      return prev;
    });
  };

  // Save Profile Handler
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);

    // If career changed, update roadmap stages to match new career
    const career = CAREER_DEFINITIONS.find((c) => c.title === newProfile.targetCareer) || CAREER_DEFINITIONS[0];
    setRoadmap(career.stages);
    saveStoredRoadmap(career.stages);

    // Regenerate learning tasks
    const newAnalysis = analyzeStudentProfile(newProfile);
    const newTasks = generateWeeklyLearningPlan(newProfile, newAnalysis.skillGaps);
    setTasks(newTasks);
    saveStoredTasks(newTasks);

    addToast('Profile Updated', `Benchmarked for ${newProfile.targetCareer}`);
    addXP(100, 'Profile calibration & evaluation complete');
  };

  // Switch Target Career
  const handleSwitchCareer = (careerTitle: string) => {
    const updatedProfile: StudentProfile = {
      ...profile,
      targetCareer: careerTitle,
    };
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);

    const career = CAREER_DEFINITIONS.find((c) => c.title === careerTitle) || CAREER_DEFINITIONS[0];
    setRoadmap(career.stages);
    saveStoredRoadmap(career.stages);

    const newAnalysis = analyzeStudentProfile(updatedProfile, careerTitle);
    const newTasks = generateWeeklyLearningPlan(updatedProfile, newAnalysis.skillGaps);
    setTasks(newTasks);
    saveStoredTasks(newTasks);

    addToast('Target Career Switched', `Now optimizing roadmap for ${careerTitle}`);
  };

  // Load Demo Student Profile (Alex)
  const handleLoadDemo = () => {
    setProfile(DEMO_STUDENT_PROFILE);
    saveStoredProfile(DEMO_STUDENT_PROFILE);

    const aimlCareer = CAREER_DEFINITIONS[0];
    setRoadmap(aimlCareer.stages);
    saveStoredRoadmap(aimlCareer.stages);

    const newAnalysis = analyzeStudentProfile(DEMO_STUDENT_PROFILE);
    const newTasks = generateWeeklyLearningPlan(DEMO_STUDENT_PROFILE, newAnalysis.skillGaps);
    setTasks(newTasks);
    saveStoredTasks(newTasks);

    addToast('Demo Profile Loaded', 'Loaded Alex (AI/ML Engineer, 72% Readiness)', 'success');
  };

  // Toggle Learning Task
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          addXP(50, `Completed task: ${t.title}`);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);
  };

  // Update Roadmap Stage
  const handleUpdateStageStatus = (stageId: string, status: 'completed' | 'in-progress' | 'not-started') => {
    const updated = roadmap.map((s) => (s.id === stageId ? { ...s, status } : s));
    setRoadmap(updated);
    saveStoredRoadmap(updated);

    if (status === 'completed') {
      addXP(150, 'Roadmap stage completed');
    }
  };

  // Add Recommended Project to Profile
  const handleAddProjectToProfile = (project: RecommendedProject) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: project.name,
      description: project.description,
      technologies: project.skillsDeveloped,
      difficulty: project.difficulty,
    };

    const updatedProfile = {
      ...profile,
      projects: [...profile.projects, newProj],
    };

    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    addToast('Project Added to Portfolio', project.name, 'success');
    addXP(100, `Added "${project.name}" milestone`);
    unlockAchievement('ach-project-builder', 'Project Builder');
  };

  // Reset all
  const handleResetAll = () => {
    resetAllData();
    setProfile(DEMO_STUDENT_PROFILE);
    setRoadmap(CAREER_DEFINITIONS[0].stages);
    setTasks(generateWeeklyLearningPlan(DEMO_STUDENT_PROFILE, analysis.skillGaps));
    setXp(100);
    addToast('Data Reset', 'All cached data cleared');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900'} transition-colors duration-200 flex flex-col`}>
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadDemo={handleLoadDemo}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        xp={xp}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'landing' && (
          <LandingPage
            onStartAnalysis={() => setIsOnboardingOpen(true)}
            onExploreCareers={() => setActiveTab('career-compare')}
            onLoadDemo={handleLoadDemo}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            analysis={analysis}
            roadmap={roadmap}
            tasks={tasks}
            achievements={achievements}
            xp={xp}
            setActiveTab={setActiveTab}
            onToggleTask={handleToggleTask}
            onSwitchCareer={handleSwitchCareer}
          />
        )}

        {activeTab === 'skill-gap' && (
          <SkillGapView
            profile={profile}
            analysis={analysis}
            onSwitchCareer={handleSwitchCareer}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            profile={profile}
            roadmap={roadmap}
            onUpdateStageStatus={handleUpdateStageStatus}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ai-mentor' && (
          <AIMentorView
            profile={profile}
            analysis={analysis}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'resume-analyzer' && (
          <ResumeAnalyzerView
            profile={profile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'career-compare' && (
          <CareerComparisonView
            profile={profile}
            onSwitchCareer={handleSwitchCareer}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'learning-plan' && (
          <LearningPlanView
            profile={profile}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onUpdateDailyHours={(hours) => {
              const updated = { ...profile, dailyStudyHours: hours };
              setProfile(updated);
              saveStoredProfile(updated);
              const newTasks = generateWeeklyLearningPlan(updated, analysis.skillGaps);
              setTasks(newTasks);
              saveStoredTasks(newTasks);
              addToast('Study Schedule Recalibrated', `${hours} hours daily allocation`);
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectRecommendationsView
            profile={profile}
            analysis={analysis}
            onAddProjectToProfile={handleAddProjectToProfile}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Multi-step Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLoadDemo={handleLoadDemo}
        onResetAll={handleResetAll}
      />

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
