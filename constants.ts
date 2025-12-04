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
      image: "https://images.unsplash.com/photo-1492551557933-34265f7af79e?q=80&w=2940&auto=format&fit=crop",
      description: "A futuristic landing page for a tech conference.",
      link: "#"
    },
    {
      id: "2",
      title: "Abstract Shapes",
      category: "Branding",
      year: "2023",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop",
      description: "Brand identity for a modern architecture firm.",
      link: "#"
    },
    {
      id: "3",
      title: "E-Commerce App",
      category: "Product Design",
      year: "2022",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      description: "Mobile application redesign for a fashion retailer.",
      link: "#"
    },
     {
      id: "4",
      title: "Minimalist Portfolio",
      category: "Development",
      year: "2022",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2855&auto=format&fit=crop",
      description: "A clean portfolio template built with Next.js.",
      link: "#"
    }
  ],
  experience: [
    {
      id: "1",
      company: "Google",
      role: "Senior Product Designer",
      period: "2021 — Present",
      description: "Leading design systems and interaction patterns for consumer products."
    },
    {
      id: "2",
      company: "Spotify",
      role: "Product Designer",
      period: "2018 — 2021",
      description: "Contributed to the mobile app redesign and web player experience."
    }
  ],
  skills: [
    {
      id: "1",
      category: "Design",
      items: ["Figma", "Prototyping", "Motion Design", "UI/UX"]
    },
    {
      id: "2",
      category: "Development",
      items: ["React", "TypeScript", "TailwindCSS", "Next.js"]
    }
  ],
  theme: {
    darkMode: false
  }
};

export const GITHUB_CONFIG_KEY = 'portfolio_github_config';
export const CACHE_KEY = 'portfolio_content_cache';