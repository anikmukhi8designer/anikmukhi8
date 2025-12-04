export interface SocialLink {
  platform: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string;
  year: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface SiteContent {
  profile: {
    name: string;
    role: string;
    heroHeadline: string;
    heroSubline: string;
    aboutText: string;
    email: string;
    socials: SocialLink[];
  };
  projects: Project[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  theme: {
    darkMode: boolean;
  };
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

export enum SaveStatus {
  IDLE = 'IDLE',
  SAVING = 'SAVING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}