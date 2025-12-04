import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { PortfolioGrid } from './components/PortfolioGrid';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { About } from './components/About';
import { AdminPanel } from './components/AdminPanel';
import { DEFAULT_CONTENT } from './constants';
import { SiteContent } from './types';
import { getStoredConfig, fetchContentFromGitHub } from './services/githubService';
import { ArrowLeft } from 'lucide-react';

const Frontend: React.FC<{ content: SiteContent }> = ({ content }) => {
  return (
    <>
      <Hero content={content} />
      <PortfolioGrid projects={content.projects} />
      <Experience experience={content.experience} />
      <Skills skills={content.skills} />
      <About content={content} />
    </>
  );
};

const ProjectDetail: React.FC<{ content: SiteContent }> = ({ content }) => {
  const { id } = useParams();
  const project = content.projects.find(p => p.id === id);

  if (!project) return <div className="pt-40 px-6">Project not found</div>;

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-500 hover:text-black mb-12">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <div className="mb-12">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">{project.title}</h1>
        <div className="flex flex-wrap gap-8 text-neutral-500 border-t border-b border-neutral-200 py-6">
          <div>
            <span className="block text-xs uppercase tracking-widest mb-1">Year</span>
            <span className="text-black">{project.year}</span>
          </div>
           <div>
            <span className="block text-xs uppercase tracking-widest mb-1">Category</span>
            <span className="text-black">{project.category}</span>
          </div>
        </div>
      </div>
      <div className="mb-16">
        <img src={project.image} alt={project.title} className="w-full h-auto rounded-xl shadow-sm" />
      </div>
      <div className="max-w-3xl">
        <h3 className="text-2xl font-bold mb-6">About the project</h3>
        <p className="text-xl text-neutral-600 leading-relaxed">{project.description}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const config = getStoredConfig();
    
    if (config && config.token && config.repo) {
      try {
        console.log("Fetching latest content from GitHub...");
        const remoteContent = await fetchContentFromGitHub(config);
        setContent(remoteContent);
      } catch (error) {
        console.error("Failed to load from GitHub, falling back to default.", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin"></div>
           <div className="text-xs tracking-widest uppercase font-bold text-neutral-400">Loading</div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout content={content}>
        <Routes>
          <Route path="/" element={<Frontend content={content} />} />
          <Route path="/project/:id" element={<ProjectDetail content={content} />} />
          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                content={content} 
                setContent={setContent} 
                refreshContent={loadData}
              />
            } 
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
}