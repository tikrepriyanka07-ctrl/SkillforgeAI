import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  FolderGit2,
  Award,
} from 'lucide-react';
import { StudentProfile, ProficiencyLevel, SkillItem, ProjectItem } from '../types';
import { CAREER_DEFINITIONS } from '../data/careers';
import { DEMO_STUDENT_PROFILE } from '../data/demoProfile';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: StudentProfile) => void;
}

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Machine Learning',
  'Deep Learning', 'SQL', 'C++', 'Java', 'Docker', 'AWS', 'Data Structures & Algorithms',
  'Git/GitHub', 'Statistics', 'HTML/CSS', 'FastAPI', 'Pandas', 'PostgreSQL', 'Linux',
];

const COMMON_INTERESTS = [
  'AI/ML', 'Web Development', 'Cybersecurity', 'Data Science', 'Cloud',
  'Mobile Development', 'UI/UX', 'Game Development', 'DevOps', 'Distributed Systems',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [education, setEducation] = useState("Bachelor's Degree in Computer Science");

  const [skills, setSkills] = useState<SkillItem[]>([
    { name: 'Python', level: 'Intermediate', percentage: 65, category: 'Language' },
    { name: 'SQL', level: 'Intermediate', percentage: 60, category: 'Language' },
    { name: 'Git/GitHub', level: 'Intermediate', percentage: 60, category: 'DevOps/Cloud' },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>('Intermediate');

  const [interests, setInterests] = useState<string[]>(['AI/ML', 'Data Science']);
  const [customInterest, setCustomInterest] = useState('');

  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'proj-1',
      name: 'College Portal Application',
      description: 'Full stack management system with user authentication and grade reports.',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      difficulty: 'Intermediate',
    },
  ]);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDiff, setNewProjDiff] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const [experienceRole, setExperienceRole] = useState('Research Assistant');
  const [experienceOrg, setExperienceOrg] = useState('University AI Lab');
  const [certName, setCertName] = useState('Coursera Python Specialization');
  const [certIssuer, setCertIssuer] = useState('University of Michigan');

  const [targetCareer, setTargetCareer] = useState('AI/ML Engineer');
  const [customCareer, setCustomCareer] = useState('');
  const [dailyHours, setDailyHours] = useState(2);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const pct =
      newSkillLevel === 'Beginner'
        ? 35
        : newSkillLevel === 'Intermediate'
        ? 65
        : newSkillLevel === 'Advanced'
        ? 85
        : 95;

    setSkills([
      ...skills,
      {
        name: newSkillName.trim(),
        level: newSkillLevel,
        percentage: pct,
        category: 'Language',
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleAddCustomInterest = () => {
    if (!customInterest.trim()) return;
    if (!interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
    }
    setCustomInterest('');
  };

  const handleAddProject = () => {
    if (!newProjName.trim()) return;
    const techs = newProjTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setProjects([
      ...projects,
      {
        id: `proj-${Date.now()}`,
        name: newProjName.trim(),
        description: newProjDesc.trim() || 'Software engineering portfolio project.',
        technologies: techs.length ? techs : ['General'],
        difficulty: newProjDiff,
      },
    ]);
    setNewProjName('');
    setNewProjDesc('');
    setNewProjTech('');
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleAutoFillDemo = () => {
    setName(DEMO_STUDENT_PROFILE.name);
    setCollege(DEMO_STUDENT_PROFILE.college);
    setBranch(DEMO_STUDENT_PROFILE.branch);
    setYear(DEMO_STUDENT_PROFILE.year);
    setEducation(DEMO_STUDENT_PROFILE.education);
    setSkills(DEMO_STUDENT_PROFILE.skills);
    setInterests(DEMO_STUDENT_PROFILE.interests);
    setProjects(DEMO_STUDENT_PROFILE.projects);
    setTargetCareer(DEMO_STUDENT_PROFILE.targetCareer);
    setDailyHours(DEMO_STUDENT_PROFILE.dailyStudyHours);
  };

  const handleSubmit = () => {
    const finalCareer = customCareer.trim() ? customCareer.trim() : targetCareer;
    const newProfile: StudentProfile = {
      name: name.trim() || 'Alex',
      college: college.trim() || 'University Institute of Technology',
      branch: branch.trim() || 'Computer Science & Engineering',
      year: year || '3rd Year',
      education: education || 'Bachelor of Science in CS',
      skills: skills.length > 0 ? skills : DEMO_STUDENT_PROFILE.skills,
      interests: interests.length > 0 ? interests : ['AI/ML', 'Data Science'],
      projects: projects.length > 0 ? projects : DEMO_STUDENT_PROFILE.projects,
      experiences: experienceRole
        ? [
            {
              id: 'exp-1',
              role: experienceRole,
              organization: experienceOrg || 'Academic Lab',
              duration: '6 Months',
              type: 'Academic',
            },
          ]
        : [],
      certifications: certName
        ? [
            {
              id: 'cert-1',
              name: certName,
              issuer: certIssuer || 'Online Platform',
              year: '2025',
            },
          ]
        : [],
      targetCareer: finalCareer,
      dailyStudyHours: dailyHours,
    };

    onSaveProfile(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Student Profile Setup</h3>
              <p className="text-xs text-slate-400">Step {step} of 6 — Calibrating your baseline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillDemo}
              title="Autofill with Alex sample data"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
            >
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
              <span>Autofill Alex</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Personal & Academic Information</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course / Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option>1st Year (Freshman)</option>
                    <option>2nd Year (Sophomore)</option>
                    <option>3rd Year (Junior)</option>
                    <option>4th Year (Senior)</option>
                    <option>Graduate / Master's</option>
                    <option>Recent Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Education Level</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills & Proficiency */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <Code className="w-4 h-4" />
                <span>Current Technical Skills & Proficiency</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs text-slate-400">Add a skill and select your proficiency level:</div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="e.g. Python, React, PyTorch"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as ProficiencyLevel)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="Beginner">Beginner (30%)</option>
                    <option value="Intermediate">Intermediate (65%)</option>
                    <option value="Advanced">Advanced (85%)</option>
                    <option value="Expert">Expert (95%)</option>
                  </select>
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Popular Skill quick chips */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-1.5">Quick add common skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SKILLS.map((skill) => {
                      const alreadyAdded = skills.some((s) => s.name.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={skill}
                          disabled={alreadyAdded}
                          onClick={() => {
                            setSkills([
                              ...skills,
                              { name: skill, level: 'Intermediate', percentage: 65, category: 'Language' },
                            ]);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                            alreadyAdded
                              ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500 hover:text-cyan-300'
                          }`}
                        >
                          + {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Current Skills List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Added Skills ({skills.length})</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{skill.name}</span>
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300">
                          {skill.level}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <Heart className="w-4 h-4" />
                <span>Areas of Interest</span>
              </div>
              <p className="text-xs text-slate-400">Select the domains you are most passionate about:</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_INTERESTS.map((item) => {
                  const selected = interests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                        selected
                          ? 'bg-blue-600/20 border-cyan-400 text-cyan-200 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{item}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom interest */}
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomInterest()}
                  placeholder="Add custom interest..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddCustomInterest}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Projects */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <FolderGit2 className="w-4 h-4" />
                <span>Technical Projects</span>
              </div>
              <p className="text-xs text-slate-400">List projects you have built to boost your project readiness score.</p>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
                <div>
                  <input
                    type="text"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="Project Name (e.g. AI Resume Analyzer)"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    placeholder="Short Description of what it does..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newProjTech}
                    onChange={(e) => setNewProjTech(e.target.value)}
                    placeholder="Technologies (comma separated, e.g. Python, FastAPI)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={newProjDiff}
                    onChange={(e) => setNewProjDiff(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    onClick={handleAddProject}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400"
                  >
                    Add Project
                  </button>
                </div>
              </div>

              {/* Projects list */}
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{proj.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {proj.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveProject(proj.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Experience & Certifications */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <Award className="w-4 h-4" />
                <span>Experience & Certifications</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">Relevant Experience / Internship / Lab</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Role / Position</label>
                    <input
                      type="text"
                      value={experienceRole}
                      onChange={(e) => setExperienceRole(e.target.value)}
                      placeholder="e.g. Research Assistant or SWE Intern"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Company or Lab</label>
                    <input
                      type="text"
                      value={experienceOrg}
                      onChange={(e) => setExperienceOrg(e.target.value)}
                      placeholder="e.g. University ML Research Lab"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">Verified Certification</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Certificate Title</label>
                    <input
                      type="text"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="e.g. Amazon Web Services / Coursera"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400">
                You can add more certifications and internships later anytime in your settings.
              </div>
            </div>
          )}

          {/* STEP 6: Target Career & Study Allocation */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <Briefcase className="w-4 h-4" />
                <span>Select Your Target Career Goal</span>
              </div>
              <p className="text-xs text-slate-400">SkillForge AI will calibrate skill gaps and generate a roadmap for this role:</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {CAREER_DEFINITIONS.map((c) => {
                  const isSelected = targetCareer === c.title;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setTargetCareer(c.title);
                        setCustomCareer('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{c.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{c.difficulty} Path</div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{c.avgSalary}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Career option */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Or enter custom career target:</label>
                <input
                  type="text"
                  value={customCareer}
                  onChange={(e) => {
                    setCustomCareer(e.target.value);
                    if (e.target.value) setTargetCareer(e.target.value);
                  }}
                  placeholder="e.g. Blockchain Security Engineer"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Daily study hours */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  How many hours can you dedicate to study per day?
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((hr) => (
                    <button
                      key={hr}
                      onClick={() => setDailyHours(hr)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        dailyHours === hr
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {hr}h / day
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Skill Analysis</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
