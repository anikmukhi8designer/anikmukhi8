export interface SocialLink {
  platform: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string; // URL to image
  description: string;
  link?: string;
  year: string;
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
  theme: {
    darkMode: boolean;
  };
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string; // e.g., 'content.json'
  token: string;
}

export enum SaveStatus {
  IDLE = 'IDLE',
  SAVING = 'SAVING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}