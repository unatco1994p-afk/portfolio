export interface UserProfile {
  name: string;
  title: string;
  avatarUrl: string;
  status: string;
  bio: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface SystemMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  status: 'optimal' | 'good' | 'warning';
}

export interface Project {
  id: string;
  title: string;
  category: 'cloud' | 'backend' | 'fullstack' | 'devops';
  description: string;
  metrics: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  status: string;
}

export interface TechSkill {
  id: string;
  name: string;
  category: 'Cloud & Infrastructure' | 'Backend & JVM' | 'Frontend & Web' | 'DevOps & CI/CD';
  proficiency: number; // 0 to 100
  experience: string;
  icon: string;
  highlights: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  technologies: string[];
  isCurrent?: boolean;
}

export interface PortfolioData {
  profile: UserProfile;
  metrics: SystemMetric[];
  projects: Project[];
  skills: TechSkill[];
  experiences: WorkExperience[];
}
