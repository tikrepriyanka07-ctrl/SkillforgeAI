import { StudentProfile, SkillGapItem, ChatMessage } from '../types';

export interface MentorResponse {
  text: string;
  source: 'gemini-3.8-flash' | 'local_engine';
  suggestedFollowUps: string[];
}

export async function askCareerMentor(
  query: string,
  profile: StudentProfile,
  skillGaps: SkillGapItem[],
  chatHistory: ChatMessage[]
): Promise<MentorResponse> {
  // Attempt to call server-side Gemini API endpoint
  try {
    const res = await fetch('/api/gemini/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        profile,
        career: profile.targetCareer,
        skillGaps,
        chatHistory: chatHistory.map((m) => ({ sender: m.sender, text: m.text })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.available && data.response) {
        return {
          text: data.response,
          source: 'gemini-3.8-flash',
          suggestedFollowUps: getFollowUpSuggestions(query),
        };
      }
    }
  } catch {
    // Network or server issue, seamlessly fall through to local engine
  }

  // Deterministic local career mentor engine
  const localAnswer = generateDeterministicMentorResponse(query, profile, skillGaps);
  return {
    text: localAnswer,
    source: 'local_engine',
    suggestedFollowUps: getFollowUpSuggestions(query),
  };
}

function generateDeterministicMentorResponse(
  query: string,
  profile: StudentProfile,
  skillGaps: SkillGapItem[]
): string {
  const q = query.toLowerCase();
  const topGap: SkillGapItem = skillGaps[0] || {
    skill: 'Machine Learning',
    category: 'Core AI',
    current: 25,
    required: 85,
    gap: 60,
    currentLevel: 'Beginner',
    requiredLevel: 'Advanced',
    priority: 'High',
    isStrength: false,
    whyItMatters: 'Core foundation for predictive modeling and pattern extraction in technical roles.',
    recommendedNextStep: 'Start with Scikit-learn tutorials and build your first regression pipeline.',
  };
  const secondGap: SkillGapItem = skillGaps[1] || {
    skill: 'Statistics',
    category: 'Mathematics',
    current: 40,
    required: 80,
    gap: 40,
    currentLevel: 'Intermediate',
    requiredLevel: 'Advanced',
    priority: 'Medium',
    isStrength: false,
    whyItMatters: 'Underpins hypothesis testing, probability distributions, and model evaluation metrics.',
    recommendedNextStep: 'Complete practical statistics problem sets and exploratory data analysis exercises.',
  };
  const targetCareer = profile.targetCareer;

  if (q.includes('learn next') || q.includes('what should i study') || q.includes('priority')) {
    return `### Priority Recommendation: Focus on **${topGap.skill}** & **${secondGap.skill}**

Based on your current profile as an aspiring **${targetCareer}**, your single highest leverage move right now is bridging your gap in **${topGap.skill}** (currently at **${topGap.current}%**, required **${topGap.required}%**).

#### Why this matters:
${topGap.whyItMatters || `In technical evaluations for ${targetCareer}, this skill is heavily tested in practical coding rounds.`}

#### Your 3-Step Action Plan:
1. **Week 1-2: Core Theory & Foundations**
   - Spend 45 minutes/day mastering the core mathematical mechanics and algorithms.
2. **Week 3-4: Applied Implementation**
   - Build a hands-on project using real-world messy datasets instead of clean toy benchmarks.
3. **Week 5: Code Documentation & Benchmark**
   - Publish your clean repository with a detailed README, test coverage, and benchmark charts.

*Next immediate step:* ${topGap.recommendedNextStep}`;
  }

  if (q.includes('internship') || q.includes('ready') || q.includes('apply')) {
    const isReady = profile.skills.some((s) => s.level === 'Advanced') && profile.projects.length >= 2;
    return `### Internship Readiness Assessment for **${profile.name}**

Current Readiness Level: **${isReady ? 'Competitive with targeted gaps' : 'Building Foundations'}**

#### Strengths to Highlight on Your Resume:
- Strong base in **${profile.skills.filter((s) => s.percentage >= 60).map((s) => s.name).join(', ') || 'Core Programming'}**
- Practical project experience with *"${profile.projects[0]?.name || 'Course Projects'}"*

#### Gaps to Address Before Tier-1 Tech Interviews:
1. **${topGap.skill}**: Most technical screens will probe this area. Get this to at least **65%+**.
2. **System Context**: Be prepared to explain why you chose specific libraries and how your projects would scale under 10,000 concurrent requests.

#### Verdict & Advice:
You **can** start applying for early-career internships right now! Do not wait for 100% perfection. Target fast-growing startups where your strong foundations in **Python/C++** will be immediately useful, while continuing your weekly sprint on **${topGap.skill}**.`;
  }

  if (q.includes('project') || q.includes('what projects') || q.includes('build')) {
    return `### Recommended Projects to Bridge Your Specific Gaps

Employers in **${targetCareer}** want to see projects that solve real problems, rather than standard tutorial clones.

#### 1. Flagship Project: **AI Resume & Skill Gap Intelligence Engine**
- **Target Skills:** ${topGap.skill}, Python, API Design, Data Analysis
- **What to build:** An automated pipeline that parses unstructured documents, matches entities against taxonomy standards, and outputs visual analytics.
- **Why it stands out:** Solves a tangible problem, showcases both algorithmic logic and product thinking.

#### 2. Applied System: **Predictive ML Classification Pipeline**
- **Target Skills:** ${secondGap.skill}, Scikit-Learn / XGBoost, Docker
- **What to build:** Train an end-to-end model with cross-validation, feature importance attribution with SHAP, and a containerized FastAPI endpoint.

#### Pro Tip for GitHub:
Include a 30-second screen recording GIF in your README, clear instructions to run via \`docker compose up\`, and a write-up of what failed and how you debugged it!`;
  }

  if (q.includes('1 hour') || q.includes('one hour') || q.includes('busy') || q.includes('plan')) {
    return `### High-Efficiency 1-Hour Daily Sprint Protocol

With only **60 minutes per day**, consistency and deep focus beat marathon weekend cramming every single time.

| Day | Focus Area | 60-Minute Allocation |
|---|---|---|
| **Monday** | ${topGap.skill} Theory | 45m concepts + 15m summary notes |
| **Tuesday** | Hands-on Coding | 50m targeted exercises / coding |
| **Wednesday** | ${secondGap.skill} Math | 40m problem sets + 20m code check |
| **Thursday** | ${topGap.skill} Lab | 60m building miniature module |
| **Friday** | Code Review & Refactor | 45m cleaning repo + 15m Git commit |
| **Weekend** | Milestone Integration | 60m combining modules into project |

**Rule of thumb:** Never spend your 1 hour passively watching videos. Spend at least 40 minutes typing code with the debugger open!`;
  }

  if (q.includes('profile') || q.includes('improve') || q.includes('resume') || q.includes('linkedin')) {
    return `### How to Upgrade Your Profile to Attract Recruiters

Here are 4 specific upgrades for your **${targetCareer}** journey:

1. **Quantify Project Impact**
   - In *"${profile.projects[0]?.name || 'Your Projects'}"*, change descriptive statements into metrics.
   - *Example:* Instead of *"Created a prediction model"*, write *"Engineered XGBoost model achieving 89.2% F1-score, reducing inference latency by 35% with vectorization."*

2. **Certify Your Biggest Gap**
   - Earning a recognized credential in **${topGap.skill}** (e.g. DeepLearning.AI or AWS/GCP specialty) will immediately offset the gap on recruiter searches.

3. **Open-Source Contribution**
   - Make 1-2 small PRs fixing documentation or bug tests in popular open-source libraries related to ${topGap.skill}.

4. **Public Learning**
   - Write a 500-word post on LinkedIn or Dev.to explaining a tricky concept in **${topGap.skill}** that you just mastered. Recruiters love proactive learners.`;
  }

  // Default response
  return `### Career Mentor Insights for **${profile.name}**

Target Career: **${targetCareer}** | Primary Focus: **${topGap.skill}**

I have analyzed your current skill inventory against industry benchmarks. Your foundation in **${profile.skills.slice(0, 2).map((s) => s.name).join(' & ')}** is an excellent springboard.

To accelerate your trajectory:
1. Spend the next 2 weeks primarily on **${topGap.skill}** (gap of ${topGap.gap}%).
2. Connect your code to a live portfolio project that demonstrates end-to-end engineering rigor.
3. Stay consistent with your daily study allocation of **${profile.dailyStudyHours} hours**.

Feel free to ask me to drill down into study roadmaps, project architectures, or mock interview questions!`;
}

function getFollowUpSuggestions(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes('learn next')) {
    return [
      'What projects should I build?',
      'Am I ready for an internship?',
      'I only have 1 hour per day. Make me a plan.',
    ];
  }
  if (q.includes('internship')) {
    return [
      'What technical questions will they ask?',
      'How can I improve my profile?',
      'What should I learn next?',
    ];
  }
  return [
    'What should I learn next?',
    'Am I ready for an internship?',
    'What projects should I build?',
    'I only have 1 hour per day. Make me a plan.',
  ];
}
