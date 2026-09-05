import {
  StudentProfile,
  CareerDefinition,
  SkillGapItem,
  ReadinessAnalysis,
  LearningTask,
  RecommendedProject,
  ProficiencyLevel,
} from '../types';
import { CAREER_DEFINITIONS } from '../data/careers';

// Map proficiency levels to base percentage scores
export function levelToPercentage(level: ProficiencyLevel): number {
  switch (level) {
    case 'Beginner':
      return 30;
    case 'Intermediate':
      return 65;
    case 'Advanced':
      return 85;
    case 'Expert':
      return 95;
    default:
      return 20;
  }
}

export function percentageToLevel(pct: number): ProficiencyLevel {
  if (pct >= 90) return 'Expert';
  if (pct >= 75) return 'Advanced';
  if (pct >= 45) return 'Intermediate';
  return 'Beginner';
}

// Find career definition by ID or title
export function findCareer(targetCareer: string): CareerDefinition {
  const found = CAREER_DEFINITIONS.find(
    (c) =>
      c.title.toLowerCase() === targetCareer.toLowerCase() ||
      c.id.toLowerCase() === targetCareer.toLowerCase() ||
      targetCareer.toLowerCase().includes(c.title.toLowerCase())
  );
  return found || CAREER_DEFINITIONS[0];
}

// Core deterministic Skill Gap and Readiness Analysis
export function analyzeStudentProfile(profile: StudentProfile, overrideCareer?: string): ReadinessAnalysis {
  const career = findCareer(overrideCareer || profile.targetCareer);
  const studentSkillsMap = new Map<string, { level: ProficiencyLevel; percentage: number }>();

  // Normalize student skill lookup
  profile.skills.forEach((s) => {
    const norm = s.name.trim().toLowerCase();
    studentSkillsMap.set(norm, {
      level: s.level,
      percentage: s.percentage || levelToPercentage(s.level),
    });
  });

  const skillGaps: SkillGapItem[] = [];
  const strengths: SkillGapItem[] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  career.requiredSkills.forEach((req) => {
    const norm = req.skill.trim().toLowerCase();
    let currentPct = 0;

    // Check direct match or partial keyword match
    if (studentSkillsMap.has(norm)) {
      currentPct = studentSkillsMap.get(norm)!.percentage;
    } else {
      // Fuzzy lookup for combined names like "Git/GitHub", "PyTorch / TensorFlow", "HTML/CSS"
      for (const [sName, sVal] of studentSkillsMap.entries()) {
        if (
          norm.includes(sName) ||
          sName.includes(norm) ||
          (norm.includes('git') && sName.includes('git')) ||
          (norm.includes('html') && sName.includes('html')) ||
          (norm.includes('sql') && sName.includes('sql')) ||
          (norm.includes('machine learning') && sName.includes('ml')) ||
          (norm.includes('python') && sName.includes('python'))
        ) {
          currentPct = Math.max(currentPct, sVal.percentage);
        }
      }

      // If student has foundational skills, grant realistic baseline for prerequisites
      if (currentPct === 0) {
        if (norm.includes('statistics') && studentSkillsMap.has('python')) {
          currentPct = 40; // Studied basic math in college
        } else if (norm.includes('deep learning') && studentSkillsMap.has('machine learning')) {
          currentPct = 10;
        } else if (norm.includes('docker') && studentSkillsMap.has('git/github')) {
          currentPct = 15;
        } else if (norm.includes('pytorch') && studentSkillsMap.has('python')) {
          currentPct = 20;
        } else {
          currentPct = 0;
        }
      }
    }

    const gap = Math.max(0, req.requiredScore - currentPct);
    const item: SkillGapItem = {
      skill: req.skill,
      category: req.category,
      current: currentPct,
      required: req.requiredScore,
      gap,
      currentLevel: percentageToLevel(currentPct),
      requiredLevel: req.requiredLevel,
      priority: gap > 40 ? 'High' : gap > 20 ? 'Medium' : 'Low',
      isStrength: currentPct >= req.requiredScore - 5,
      whyItMatters: getWhyItMatters(req.skill, career.title),
      recommendedNextStep: getRecommendedNextStep(req.skill, currentPct),
    };

    if (item.isStrength) {
      strengths.push(item);
    } else {
      skillGaps.push(item);
    }

    // Weighted scoring for technical skill proficiency
    const normalizedCompetency = Math.min(100, (currentPct / req.requiredScore) * 100);
    totalWeightedScore += normalizedCompetency * req.weight;
    totalWeight += req.weight;
  });

  // Sort gaps by severity (largest gap first)
  skillGaps.sort((a, b) => b.gap - a.gap);

  // Technical skills score
  const technicalSkillsScore = Math.round(totalWeightedScore / Math.max(1, totalWeight));

  // Projects score based on relevant tech, count, and difficulty
  let projectScore = 35; // base
  if (profile.projects.length >= 1) projectScore += 20;
  if (profile.projects.length >= 2) projectScore += 15;
  if (profile.projects.length >= 3) projectScore += 10;
  profile.projects.forEach((p) => {
    if (p.difficulty === 'Intermediate') projectScore += 5;
    if (p.difficulty === 'Advanced') projectScore += 10;
  });
  projectScore = Math.min(95, projectScore);

  // Experience score
  let expScore = 30;
  if (profile.experiences.length > 0) {
    expScore += profile.experiences.length * 20;
  }
  expScore = Math.min(90, expScore);

  // Certifications score
  let certScore = 25;
  if (profile.certifications.length > 0) {
    certScore += profile.certifications.length * 25;
  }
  certScore = Math.min(88, certScore);

  // Problem Solving score (inferred from DSA, languages, hackathons)
  let problemSolvingScore = 65;
  if (studentSkillsMap.has('python') || studentSkillsMap.has('c++') || studentSkillsMap.has('java')) {
    problemSolvingScore += 12;
  }
  if (profile.experiences.some((e) => e.type === 'Hackathon')) {
    problemSolvingScore += 8;
  }
  problemSolvingScore = Math.min(92, problemSolvingScore);

  // Communication score (inferred from academic/lab roles, projects)
  let communicationScore = 70;
  if (profile.experiences.some((e) => e.type === 'Academic' || e.type === 'Internship')) {
    communicationScore += 12;
  }
  communicationScore = Math.min(90, communicationScore);

  // Career Preparation (portfolio, resume readiness, interview prep stage)
  const careerPrepScore = Math.round(
    (technicalSkillsScore * 0.4 + projectScore * 0.3 + expScore * 0.3)
  );

  // Overall Career Readiness formula
  // Technical (40%), Projects (25%), Experience (15%), Problem Solving (10%), Certs (5%), Comm (5%)
  const overallReadiness = Math.round(
    technicalSkillsScore * 0.4 +
    projectScore * 0.25 +
    expScore * 0.15 +
    problemSolvingScore * 0.10 +
    certScore * 0.05 +
    communicationScore * 0.05
  );

  // Identify highest impact next action
  const topGap = skillGaps[0] || {
    skill: 'Machine Learning',
    gap: 50,
    current: 25,
    required: 85,
    recommendedNextStep: 'Build an end-to-end model with Scikit-learn and deploy it as a FastAPI service.',
  };

  const topRecommendation = {
    skill: topGap.skill,
    action: topGap.recommendedNextStep,
    impact: `Closing this gap will boost your ${career.title} readiness by +${Math.round(topGap.gap * 0.22)}%`,
    projectIdea: getProjectIdeaForSkill(topGap.skill),
  };

  // Find Best Career Match across all available careers
  const allCareerMatches = CAREER_DEFINITIONS.map((c) => {
    let weighted = 0;
    let wTotal = 0;
    c.requiredSkills.forEach((req) => {
      const norm = req.skill.trim().toLowerCase();
      let p = 0;
      if (studentSkillsMap.has(norm)) {
        p = studentSkillsMap.get(norm)!.percentage;
      } else {
        for (const [sName, sVal] of studentSkillsMap.entries()) {
          if (norm.includes(sName) || sName.includes(norm)) {
            p = Math.max(p, sVal.percentage);
          }
        }
      }
      weighted += (p / req.requiredScore) * 100 * req.weight;
      wTotal += req.weight;
    });
    const matchScore = Math.round(weighted / Math.max(1, wTotal));
    return {
      careerTitle: c.title,
      readinessScore: Math.min(95, Math.max(30, matchScore)),
    };
  });

  allCareerMatches.sort((a, b) => b.readinessScore - a.readinessScore);
  const bestMatch = allCareerMatches[0];

  return {
    careerReadiness: Math.min(98, Math.max(15, overallReadiness)),
    breakdown: {
      technicalSkills: technicalSkillsScore,
      projects: projectScore,
      experience: expScore,
      certifications: certScore,
      problemSolving: problemSolvingScore,
      communication: communicationScore,
      careerPreparation: careerPrepScore,
    },
    skillGaps,
    strengths,
    topRecommendation,
    bestCareerMatch: {
      careerTitle: bestMatch.careerTitle,
      readinessScore: bestMatch.readinessScore,
      reason: `Your existing strength in ${profile.skills.map((s) => s.name).slice(0, 3).join(', ')} gives you immediate high leverage in ${bestMatch.careerTitle}.`,
    },
  };
}

// Generate weekly dynamic learning tasks tailored to largest skill gaps and study hours
export function generateWeeklyLearningPlan(profile: StudentProfile, skillGaps: SkillGapItem[]): LearningTask[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const topGaps = skillGaps.slice(0, 4);
  const hours = profile.dailyStudyHours || 2;
  const durationMins = hours * 60;

  const plan: LearningTask[] = [
    {
      id: 'task-mon',
      day: 'Monday',
      skill: topGaps[0]?.skill || 'Machine Learning',
      durationMinutes: durationMins,
      title: `${topGaps[0]?.skill || 'Machine Learning'} Theory & Deep Concept Review`,
      focusArea: 'Mathematical formulas, core algorithms, and foundational mechanics',
      completed: true,
    },
    {
      id: 'task-tue',
      day: 'Tuesday',
      skill: topGaps[1]?.skill || 'Statistics',
      durationMinutes: durationMins,
      title: `${topGaps[1]?.skill || 'Statistics'} Hands-on Problem Sets`,
      focusArea: 'Calculations, distributions, hypothesis testing, and notebook exercises',
      completed: true,
    },
    {
      id: 'task-wed',
      day: 'Wednesday',
      skill: topGaps[0]?.skill || 'Machine Learning',
      durationMinutes: durationMins,
      title: `Implementation & Algorithmic Code Practice`,
      focusArea: 'Writing vectorised implementations from scratch without helper libraries',
      completed: false,
    },
    {
      id: 'task-thu',
      day: 'Thursday',
      skill: topGaps[2]?.skill || 'Deep Learning',
      durationMinutes: durationMins,
      title: `${topGaps[2]?.skill || 'Deep Learning'} PyTorch Tensor Architecture`,
      focusArea: 'Custom neural layers, autograd backpropagation, and loss functions',
      completed: false,
    },
    {
      id: 'task-fri',
      day: 'Friday',
      skill: topGaps[1]?.skill || 'Statistics',
      durationMinutes: durationMins,
      title: 'Real-World Dataset Sanitization & Exploratory Analysis',
      focusArea: 'Pandas profiling, outlier removal, and correlation heatmaps',
      completed: false,
    },
    {
      id: 'task-sat',
      day: 'Saturday',
      skill: 'Portfolio Project',
      durationMinutes: Math.round(durationMins * 1.5),
      title: 'Milestone Build Sprint for Portfolio Project',
      focusArea: 'Modular code structuring, GitHub documentation, and Docker packaging',
      completed: false,
    },
    {
      id: 'task-sun',
      day: 'Sunday',
      skill: 'System Review',
      durationMinutes: Math.round(durationMins * 0.75),
      title: 'Weekly Retrospective & LeetCode/Hackerrank Problem Solving',
      focusArea: 'Algorithm review, interview mock questions, and progress tracking',
      completed: false,
    },
  ];

  return plan;
}

// Generate Project Recommendations tailored to missing skills
export function generateRecommendedProjects(profile: StudentProfile, skillGaps: SkillGapItem[]): RecommendedProject[] {
  const topGaps = skillGaps.map((g) => g.skill);

  return [
    {
      id: 'rec-p1',
      name: 'AI Resume & Skill Gap Intelligence Engine',
      description: 'Full-stack AI SaaS that extracts PDF resumes, maps candidate competencies against real job market requirements, and generates personalized roadmap plans.',
      skillsDeveloped: ['Python', 'FastAPI', 'Machine Learning', 'NLP', 'React', 'TypeScript'],
      difficulty: 'Intermediate',
      estimatedTime: '2-3 weeks (20-30 hours)',
      whyRecommended: `Directly bridges your gaps in ${topGaps.slice(0, 2).join(' and ')} with a real deployed product employers love to see.`,
      keyFeatures: [
        'Deterministic and LLM-powered resume parsing',
        'Interactive skill gap radar comparison',
        'Exportable career development roadmap PDF',
      ],
      starterArchitecture: 'React Vite Frontend + FastAPI REST Backend + HuggingFace Transformers for embeddings.',
    },
    {
      id: 'rec-p2',
      name: 'Predictive Churn & Customer Lifetime Value Model',
      description: 'End-to-end machine learning system trained on tabular customer events with XGBoost, SHAP explainability values, and a live prediction API.',
      skillsDeveloped: ['Machine Learning', 'Statistics', 'Pandas', 'XGBoost', 'Docker'],
      difficulty: 'Intermediate',
      estimatedTime: '1-2 weeks (15-20 hours)',
      whyRecommended: `Demonstrates mastery of ${topGaps.find((s) => s.includes('Machine') || s.includes('Stats')) || 'Machine Learning'} applied to tangible enterprise metrics.`,
      keyFeatures: [
        'Complete exploratory data analysis & feature importance ranking',
        'Cross-validation and hyperparameter tuning with Optuna',
        'Containerized Docker image ready for AWS/GCP deployment',
      ],
      starterArchitecture: 'Scikit-Learn / XGBoost pipeline + MLflow experiment tracking + Docker container.',
    },
    {
      id: 'rec-p3',
      name: 'Multimodal Neural Search & RAG Assistant',
      description: 'Production vector search application utilizing embedding models, semantic chunking, and generative synthesis with hybrid keyword & dense retrieval.',
      skillsDeveloped: ['Deep Learning', 'PyTorch / TensorFlow', 'Vector Databases', 'Python', 'FastAPI'],
      difficulty: 'Advanced',
      estimatedTime: '3-4 weeks (35-45 hours)',
      whyRecommended: `High-value portfolio piece demonstrating modern Generative AI and deep neural architecture understanding.`,
      keyFeatures: [
        'Hybrid BM25 + Dense vector retrieval with reciprocal rank fusion',
        'Citation ground-truth attribution preventing hallucinations',
        'Streaming SSE response endpoint with latency metrics',
      ],
      starterArchitecture: 'PyTorch embeddings + Qdrant/Milvus vector store + FastAPI streaming server.',
    },
    {
      id: 'rec-p4',
      name: 'Real-Time Edge Computer Vision Detector',
      description: 'Low-latency object tracking and classification pipeline running on webcam streams using YOLOv8, OpenCV, and WebSockets.',
      skillsDeveloped: ['Deep Learning', 'Python', 'Computer Vision', 'WebSockets'],
      difficulty: 'Advanced',
      estimatedTime: '2-3 weeks (25-30 hours)',
      whyRecommended: 'Proves capability with real-time video feeds, model quantization, and frame-rate optimization.',
      keyFeatures: [
        '30 FPS inference on CPU with ONNX Runtime',
        'Multi-object tracking with DeepSORT',
        'Interactive web telemetry dashboard',
      ],
      starterArchitecture: 'YOLOv8 + ONNX Runtime + WebSocket server + HTML5 Canvas overlay.',
    },
  ];
}

// Helpers
function getWhyItMatters(skill: string, career: string): string {
  const s = skill.toLowerCase();
  if (s.includes('machine learning')) {
    return `Core foundation for predictive modeling and pattern extraction in ${career}; non-negotiable for engineering roles.`;
  }
  if (s.includes('statistics')) {
    return 'Underpins hypothesis testing, model evaluation metrics, and gradient descent optimization math.';
  }
  if (s.includes('deep learning') || s.includes('pytorch')) {
    return 'Required to construct, debug, and train modern neural architectures for vision, audio, and language.';
  }
  if (s.includes('docker') || s.includes('mlops')) {
    return 'Essential for packaging models into standardized runtime containers that run reliably in the cloud.';
  }
  if (s.includes('sql')) {
    return 'Companies store data in databases; 90% of data extraction and preparation starts with high-performance SQL.';
  }
  if (s.includes('python')) {
    return 'The industry-standard language with unmatched library ecosystems for computation and AI.';
  }
  return `Fundamental competency required for professional day-to-day responsibilities as a ${career}.`;
}

function getRecommendedNextStep(skill: string, currentPct: number): string {
  const s = skill.toLowerCase();
  if (currentPct < 30) {
    if (s.includes('machine learning')) return 'Start with Scikit-learn tutorials on Kaggle: regression, random forests, and cross-validation.';
    if (s.includes('statistics')) return 'Complete 3Blue1Brown linear algebra & Khan Academy statistics distributions module.';
    if (s.includes('deep learning')) return 'Follow the Fast.ai course and build your first CNN in PyTorch on Google Colab.';
    if (s.includes('docker')) return 'Create a Dockerfile for a basic Python script and run it inside a local container.';
    return `Enroll in a foundational course and write your first 5 mini-programs in ${skill}.`;
  }
  if (currentPct < 70) {
    return `Build an intermediate project integrating ${skill} with an automated test suite and clean documentation.`;
  }
  return `Refactor existing code to use advanced design patterns, memory optimization, and benchmark throughput.`;
}

function getProjectIdeaForSkill(skill: string): string {
  const s = skill.toLowerCase();
  if (s.includes('machine learning')) return 'Build an XGBoost model predicting loan default with SHAP explainability.';
  if (s.includes('statistics')) return 'Create an interactive A/B testing dashboard simulating hypothesis tests.';
  if (s.includes('deep learning')) return 'Train a custom PyTorch vision classifier on a unique image dataset.';
  if (s.includes('docker')) return 'Dockerize an existing full-stack project with multi-stage build optimization.';
  return `Build a GitHub project centered on ${skill} with full unit tests and a live demo.`;
}
