import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { PortfolioGrid } from './components/PortfolioGrid';
import { About } from './components/About';
import { AdminPanel } from './components/AdminPanel';
import { DEFAULT_CONTENT } from './constants';
import { SiteContent } from './types';
import { getStoredConfig, fetchContentFromGitHub } from './services/githubService';

const Frontend: React.FC<{ content: SiteContent }> = ({ content }) => {
  return (
    <>
      <Hero content={content} />
      <PortfolioGrid projects={content.projects} />
      <About content={content} />
    </>
  );
};

export default function App() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    // 1. Check if we have GitHub config
    const config = getStoredConfig();
    
    if (config && config.token && config.repo) {
      try {
        console.log("Fetching latest content from GitHub...");
        const remoteContent = await fetchContentFromGitHub(config);
        setContent(remoteContent);
      } catch (error) {
        console.error("Failed to load from GitHub, falling back to default/local.", error);
        // Optional: Load from local storage backup if GitHub fails
      }
    } else {
      console.log("No GitHub config found, using default content.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse text-xs tracking-widest uppercase font-bold text-neutral-400">
          Loading Portfolio...
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout content={content}>
        <Routes>
          <Route path="/" element={<Frontend content={content} />} />
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