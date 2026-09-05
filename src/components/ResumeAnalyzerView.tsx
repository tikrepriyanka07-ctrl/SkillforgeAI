import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCode,
  Zap,
  Tag,
  Cpu,
} from 'lucide-react';
import { StudentProfile, ActiveTab } from '../types';
import { CAREER_DEFINITIONS } from '../data/careers';

interface ResumeAnalyzerViewProps {
  profile: StudentProfile;
  setActiveTab: (tab: ActiveTab) => void;
}

const SAMPLE_RESUME_TEXT = `Alex Chen
Computer Science & Engineering Student | Stanford University
Email: alex.chen@example.edu | GitHub: github.com/alexchen-dev

EDUCATION
Bachelor of Science in Computer Science | Stanford University (2022 - 2026)
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Linear Algebra, Probability & Statistics.

TECHNICAL SKILLS
Languages: Python, C++, SQL, JavaScript
Frameworks & Libraries: React, Node.js, Express, Git/GitHub, Pandas, NumPy
Core Concepts: Relational Databases, RESTful APIs, OOP, Time & Space Complexity

PROJECTS
1. Smart Campus Attendance Manager
- Developed a web application using React, Node.js, and PostgreSQL for 2,000+ students.
- Implemented JWT authentication and automated email reminders with NodeMailer.

2. Sentiment Analysis Classifier
- Built a text sentiment classification script using Python and Pandas on Twitter dataset.
- Cleaned text data using regex and evaluated classification accuracy with basic metrics.

EXPERIENCE
Undergraduate Research Assistant | Stanford AI & Vision Lab (June 2024 - Present)
- Assisted PhD candidates with dataset preprocessing and video frame extraction in Python.
- Wrote unit tests for evaluation scripts and maintained internal repository documentation.

CERTIFICATIONS
- Coursera Python for Everybody Specialization (University of Michigan)
- Meta Front-End Developer Professional Certificate (Foundations)`;

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  profile,
  setActiveTab,
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_TEXT);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);

    try {
      const res = await fetch('/api/gemini/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetCareer: profile.targetCareer,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          setResult(data.analysis);
          setAnalyzing(false);
          return;
        }
      }
    } catch {
      // Network or API key missing, run deterministic local analyzer
    }

    // Local Deterministic Resume Analyzer
    const localResult = runLocalResumeAnalysis(resumeText, profile.targetCareer);
    setResult(localResult);
    setAnalyzing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text || SAMPLE_RESUME_TEXT);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Resume Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resume Skill Gap & ATS Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Upload or paste your resume. We extract skills, compare against <span className="text-white font-semibold">{profile.targetCareer}</span> requirements, and detect missing ATS keywords.
          </p>
        </div>

        <button
          onClick={() => setResumeText(SAMPLE_RESUME_TEXT)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/50 transition-all shrink-0"
        >
          <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          <span>Load Sample Resume (Alex)</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Paste Form */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Resume Content</span>
            </h3>
            <span className="text-xs text-slate-400">Target Role: {profile.targetCareer}</span>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => setResumeText((event.target?.result as string) || SAMPLE_RESUME_TEXT);
                reader.readAsText(file);
              }
            }}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
              dragOver ? 'border-cyan-400 bg-cyan-950/30' : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600'
            }`}
          >
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-300">Drag & drop your resume file (.txt, .pdf, .docx)</p>
            <label className="mt-2 inline-block px-3 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white cursor-pointer transition-colors">
              <span>Browse File</span>
              <input type="file" accept=".txt,.pdf,.docx" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-400">Or paste raw resume text:</label>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume here..."
              className="w-full p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !resumeText.trim()}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.25)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Benchmarking Resume with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Resume Skill Gap Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between space-y-6">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
              <FileText className="w-12 h-12 text-slate-700" />
              <div className="text-sm font-semibold text-slate-400">No Resume Scanned Yet</div>
              <p className="text-xs max-w-sm">
                Click &quot;Run Resume Skill Gap Scan&quot; to parse your resume against {profile.targetCareer} hiring criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Score Header */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div>
                  <div className="text-xs font-bold text-white">Resume Match Score</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Benchmarked for {profile.targetCareer}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-cyan-400 font-mono">
                    {result.readinessScore}%
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      result.readinessScore >= 75
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {result.readinessScore >= 75 ? 'Strong ATS Match' : 'Needs Optimization'}
                  </span>
                </div>
              </div>

              {/* Detected vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Detected Skills */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Detected Target Skills ({result.detectedSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detectedSkills?.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-red-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missing Role Skills ({result.missingSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills?.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800/60 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ATS Keywords to Add */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Tag className="w-3.5 h-3.5" />
                  <span>High-Impact ATS Keywords to Add</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywordsToAdd?.map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Actionable Bullet Improvements
                </div>
                <ul className="space-y-1.5">
                  {result.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Build Missing Projects on Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Deterministic local resume fallback logic
function runLocalResumeAnalysis(text: string, targetCareer: string) {
  const lower = text.toLowerCase();
  const career = CAREER_DEFINITIONS.find((c) => c.title.toLowerCase() === targetCareer.toLowerCase()) || CAREER_DEFINITIONS[0];

  const detectedSkills: string[] = [];
  const missingSkills: string[] = [];

  career.requiredSkills.forEach((req) => {
    const sNorm = req.skill.toLowerCase();
    if (lower.includes(sNorm) || (sNorm.includes('git') && lower.includes('git')) || (sNorm.includes('python') && lower.includes('python'))) {
      detectedSkills.push(req.skill);
    } else {
      missingSkills.push(req.skill);
    }
  });

  const readinessScore = Math.min(92, Math.max(35, Math.round((detectedSkills.length / career.requiredSkills.length) * 100)));

  return {
    readinessScore,
    detectedSkills,
    missingSkills,
    keywordsToAdd: [
      'Docker containerization',
      'FastAPI REST endpoints',
      'Scikit-learn cross validation',
      'PyTorch loss optimization',
      'Model latency benchmarks',
      'Git version control & CI/CD',
    ],
    recommendations: [
      'Quantify project outcomes: Replace "Built a sentiment classifier" with "Trained sentiment classifier on 50k tweets achieving 88% precision and 15ms latency".',
      'Highlight production tools: Explicitly mention Docker, REST APIs, or cloud platforms used during deployment.',
      'Showcase testing: Add bullet points mentioning unit test coverage or CI/CD pipelines.',
    ],
  };
}
