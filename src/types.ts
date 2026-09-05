export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillItem {
  name: string;
  level: ProficiencyLevel;
  percentage: number; // 0 - 100
  category?: 'Language' | 'Framework' | 'Data/ML' | 'DevOps/Cloud' | 'Foundations' | 'Soft Skills';
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  link?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  duration: string;
  type: 'Internship' | 'Academic' | 'Hackathon' | 'Freelance';
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface StudentProfile {
  name: string;
  email?: string;
  college: string;
  branch: string;
  year: string;
  education: string;
  skills: SkillItem[];
  interests: string[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  certifications: CertificationItem[];
  targetCareer: string;
  dailyStudyHours: number;
}

export interface RoadmapStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  status: 'not_started' | 'in_progress' | 'completed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: string;
  whatToLearn: string[];
  whyItMatters: string;
  prerequisites: string[];
  recommendedProjects: string[];
  resources: { name: string; url: string; type: 'Course' | 'Docs' | 'Book' | 'Practice' }[];
}

export interface CareerDefinition {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  difficulty: 'Moderate' | 'Demanding' | 'Challenging';
  avgSalary: string;
  requiredSkills: {
    skill: string;
    requiredLevel: ProficiencyLevel;
    requiredScore: number; // 0 - 100
    category: string;
    weight: number;
  }[];
  recommendedSkills: string[];
  projectExpectations: string[];
  stages: RoadmapStage[];
}

export interface SkillGapItem {
  skill: string;
  category: string;
  current: number; // 0 - 100
  required: number; // 0 - 100
  gap: number; // required - current (clamped >= 0)
  currentLevel: ProficiencyLevel;
  requiredLevel: ProficiencyLevel;
  whyItMatters: string;
  recommendedNextStep: string;
  priority: 'High' | 'Medium' | 'Low';
  isStrength: boolean;
}

export interface DimensionScore {
  name: string;
  score: number; // 0 - 100
  maxScore: number;
  description: string;
}

export interface ReadinessAnalysis {
  careerReadiness: number; // 0 - 100
  breakdown: {
    technicalSkills: number;
    projects: number;
    experience: number;
    certifications: number;
    problemSolving: number;
    communication: number;
    careerPreparation: number;
  };
  skillGaps: SkillGapItem[];
  strengths: SkillGapItem[];
  topRecommendation: {
    skill: string;
    action: string;
    impact: string;
    projectIdea: string;
  };
  bestCareerMatch: {
    careerTitle: string;
    readinessScore: number;
    reason: string;
  };
}

export interface LearningTask {
  id: string;
  day: string; // 'Monday', 'Tuesday', ...
  skill: string;
  durationMinutes: number;
  title: string;
  focusArea: string;
  completed: boolean;
}

export interface RecommendedProject {
  id: string;
  name: string;
  description: string;
  skillsDeveloped: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  whyRecommended: string;
  keyFeatures: string[];
  starterArchitecture: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpValue: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  source?: 'gemini-3.8-flash' | 'local_engine';
  suggestedFollowUps?: string[];
}

export interface ResumeAnalysisResult {
  score: number;
  detectedSkills: string[];
  missingTargetSkills: string[];
  strengths: string[];
  weaknesses: string[];
  atsKeywordsToAdd: string[];
  actionableImprovements: string[];
  summary: string;
}

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'skill-gap'
  | 'roadmap'
  | 'ai-mentor'
  | 'resume-analyzer'
  | 'career-compare'
  | 'learning-plan'
  | 'projects';
