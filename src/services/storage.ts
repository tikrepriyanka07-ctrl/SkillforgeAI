import { StudentProfile, RoadmapStage, LearningTask, Achievement } from '../types';
import { DEMO_STUDENT_PROFILE } from '../data/demoProfile';
import { CAREER_DEFINITIONS } from '../data/careers';

const STORAGE_KEYS = {
  PROFILE: 'skillforge_profile_v1',
  ROADMAP: 'skillforge_roadmap_v1',
  TASKS: 'skillforge_tasks_v1',
  ACHIEVEMENTS: 'skillforge_achievements_v1',
  SETTINGS: 'skillforge_settings_v1',
  XP: 'skillforge_xp_v1',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-analysis',
    title: 'First Analysis',
    description: 'Completed your first comprehensive AI skill gap evaluation.',
    iconName: 'Sparkles',
    unlocked: true,
    unlockedAt: new Date().toLocaleDateString(),
    xpValue: 100,
  },
  {
    id: 'ach-career-explorer',
    title: 'Career Explorer',
    description: 'Compared 3 or more potential career paths.',
    iconName: 'Compass',
    unlocked: true,
    unlockedAt: new Date().toLocaleDateString(),
    xpValue: 150,
  },
  {
    id: 'ach-project-builder',
    title: 'Project Builder',
    description: 'Added or verified 2+ technical portfolio projects.',
    iconName: 'FolderGit2',
    unlocked: true,
    unlockedAt: new Date().toLocaleDateString(),
    xpValue: 200,
  },
  {
    id: 'ach-skill-master',
    title: 'Skill Master',
    description: 'Achieved Advanced proficiency in a core programming language.',
    iconName: 'Award',
    unlocked: true,
    unlockedAt: new Date().toLocaleDateString(),
    xpValue: 250,
  },
  {
    id: 'ach-7day-streak',
    title: '7-Day Streak',
    description: 'Maintained continuous daily study tasks for 7 consecutive days.',
    iconName: 'Flame',
    unlocked: false,
    xpValue: 300,
  },
  {
    id: 'ach-job-ready',
    title: 'Job Ready',
    description: 'Attained an overall Career Readiness score of 80% or higher.',
    iconName: 'Briefcase',
    unlocked: false,
    xpValue: 500,
  },
];

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse stored profile:', err);
  }
  return DEMO_STUDENT_PROFILE;
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save profile to storage:', err);
  }
}

export function getStoredRoadmap(careerId?: string): RoadmapStage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load roadmap stages:', err);
  }
  const defaultCareer = CAREER_DEFINITIONS.find((c) => c.id === careerId) || CAREER_DEFINITIONS[0];
  return defaultCareer.stages;
}

export function saveStoredRoadmap(stages: RoadmapStage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(stages));
  } catch (err) {
    console.warn('Failed to save roadmap to storage:', err);
  }
}

export function getStoredTasks(): LearningTask[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load stored tasks:', err);
  }
  return null;
}

export function saveStoredTasks(tasks: LearningTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.warn('Failed to save tasks to storage:', err);
  }
}

export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load achievements:', err);
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveStoredAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (err) {
    console.warn('Failed to save achievements:', err);
  }
}

export function getStoredXP(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.XP);
    if (raw) return parseInt(raw, 10);
  } catch {}
  return 720;
}

export function saveStoredXP(xp: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.XP, xp.toString());
  } catch {}
}

export function exportAllData(): string {
  const data = {
    profile: getStoredProfile(),
    roadmap: getStoredRoadmap(),
    tasks: getStoredTasks(),
    achievements: getStoredAchievements(),
    xp: getStoredXP(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.ROADMAP);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  localStorage.removeItem(STORAGE_KEYS.XP);
}
