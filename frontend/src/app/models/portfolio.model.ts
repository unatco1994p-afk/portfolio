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
  category: string;
  description: string;
  metrics: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  status: string;
}

export interface SkillCertification {
  name: string;
  issuer: string;
  issueDate: string;
  badge: string;
}

export interface TechSkill {
  id: string;
  name: string;
  category: string;
  experience: string;
  icon: string;
  highlights: string[];
  certification?: SkillCertification;
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

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  specialization?: string;
  period: string;
  location: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  badgeUrl?: string;
  description: string;
}

export interface Interest {
  id: string;
  icon: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

export interface PortfolioData {
  profile: UserProfile;
  metrics: SystemMetric[];
  projects: Project[];
  skills: TechSkill[];
  experiences: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
  interests: Interest[];
}

