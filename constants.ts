import { SiteContent } from './types';

export const DEFAULT_CONTENT: SiteContent = {
  profile: {
    name: "Alex Doe",
    role: "Digital Designer & Developer",
    heroHeadline: "Creating digital experiences that matter.",
    heroSubline: "Based in San Francisco. Specializing in UI/UX and React.",
    aboutText: "I am a multidisciplinary designer and developer with a focus on interaction and motion. I believe that good design is invisible and that the best experiences are the ones that feel natural. I have worked with clients ranging from early-stage startups to Fortune 500 companies.",
    email: "hello@example.com",
    socials: [
      { platform: "Twitter", url: "https://twitter.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "Instagram", url: "https://instagram.com" }
    ]
  },
  projects: [
    {
      id: "1",
      title: "Neon Horizon",
      category: "Web Design",
      year: "2023",
      image: "https://picsum.photos/800/600?random=1",
      description: "A futuristic landing page for a tech conference.",
      link: "#"
    },
    {
      id: "2",
      title: "Abstract Shapes",
      category: "Branding",
      year: "2023",
      image: "https://picsum.photos/800/800?random=2",
      description: "Brand identity for a modern architecture firm.",
      link: "#"
    },
    {
      id: "3",
      title: "E-Commerce App",
      category: "Product Design",
      year: "2022",
      image: "https://picsum.photos/800/1000?random=3",
      description: "Mobile application redesign for a fashion retailer.",
      link: "#"
    },
     {
      id: "4",
      title: "Minimalist Portfolio",
      category: "Development",
      year: "2022",
      image: "https://picsum.photos/800/600?random=4",
      description: "A clean portfolio template built with Next.js.",
      link: "#"
    }
  ],
  theme: {
    darkMode: false
  }
};

export const GITHUB_CONFIG_KEY = 'portfolio_github_config';
export const CACHE_KEY = 'portfolio_content_cache';