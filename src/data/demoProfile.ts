import { StudentProfile } from '../types';

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  name: 'Alex',
  email: 'alex.chen@university.edu',
  college: 'Institute of Technology & Computer Science',
  branch: 'Computer Science & Engineering',
  year: '3rd Year (Junior)',
  education: "Bachelor of Science in Computer Science",
  targetCareer: 'AI/ML Engineer',
  dailyStudyHours: 2,
  skills: [
    { name: 'Python', level: 'Advanced', percentage: 85, category: 'Language' },
    { name: 'C++', level: 'Intermediate', percentage: 65, category: 'Language' },
    { name: 'SQL', level: 'Intermediate', percentage: 60, category: 'Language' },
    { name: 'HTML/CSS', level: 'Advanced', percentage: 80, category: 'Language' },
    { name: 'Machine Learning', level: 'Beginner', percentage: 25, category: 'Data/ML' },
    { name: 'Git/GitHub', level: 'Intermediate', percentage: 60, category: 'DevOps/Cloud' },
  ],
  interests: ['AI/ML', 'Data Science', 'Cloud Computing', 'Neural Networks'],
  projects: [
    {
      id: 'p-1',
      name: 'Student Management System',
      description: 'Desktop CRUD application built with Java, Swing, and SQLite for managing student records, grade reports, and course enrollments.',
      technologies: ['Java', 'SQL', 'JDBC', 'Swing'],
      difficulty: 'Intermediate',
    },
    {
      id: 'p-2',
      name: 'Basic ML Prediction Project',
      description: 'Housing price prediction model using Scikit-Learn linear regression and Pandas feature preprocessing on the Boston housing dataset.',
      technologies: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
      difficulty: 'Beginner',
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Undergraduate Research Assistant',
      organization: 'Department Data Lab',
      duration: '6 Months',
      type: 'Academic',
    },
    {
      id: 'exp-2',
      role: 'Hackathon Lead Developer',
      organization: 'National Collegiate Hackathon 2025',
      duration: '3 Days',
      type: 'Hackathon',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Python for Everybody Specialization',
      issuer: 'University of Michigan (Coursera)',
      year: '2024',
    },
  ],
};
