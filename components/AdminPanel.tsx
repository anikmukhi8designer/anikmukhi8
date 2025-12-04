import React, { useState, useEffect } from 'react';
import { SiteContent, GitHubConfig, SaveStatus, Project } from '../types';
import { saveContentToGitHub, getStoredConfig, saveConfig, fetchContentFromGitHub } from '../services/githubService';
import { DEFAULT_CONTENT } from '../constants';
import { Save, RefreshCw, Github, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminProps {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  refreshContent: () => void;
}

export const AdminPanel: React.FC<AdminProps> = ({ content, setContent, refreshContent }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'projects' | 'settings'>('content');
  const [config, setConfig] = useState<GitHubConfig>({
    owner: '',
    repo: '',
    branch: 'main',
    path: 'content.json',
    token: ''
  });
  const [status, setStatus] = useState<SaveStatus>(SaveStatus.IDLE);
  const [statusMsg, setStatusMsg] = useState('');

  // Load config on mount
  useEffect(() => {
    const stored = getStoredConfig();
    if (stored) setConfig(stored);
  }, []);

  const handleSaveToGitHub = async () => {
    if (!config.token || !config.repo) {
      alert("Please configure GitHub settings first.");
      setActiveTab('settings');
      return;
    }

    setStatus(SaveStatus.SAVING);
    setStatusMsg('Syncing with GitHub...');
    
    try {
      await saveContentToGitHub(config, content);
      setStatus(SaveStatus.SUCCESS);
      setStatusMsg('Successfully saved! Site is updating...');
      setTimeout(() => setStatus(SaveStatus.IDLE), 3000);
      refreshContent(); // Trigger re-fetch on frontend
    } catch (err: any) {
      console.error(err);
      setStatus(SaveStatus.ERROR);
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  const handlePullFromGitHub = async () => {
    if (!config.token) return;
    setStatus(SaveStatus.SAVING);
    try {
      const data = await fetchContentFromGitHub(config);
      setContent(data);
      setStatus(SaveStatus.SUCCESS);
      setStatusMsg('Content pulled from GitHub.');
      setTimeout(() => setStatus(SaveStatus.IDLE), 2000);
    } catch (err: any) {
      setStatus(SaveStatus.ERROR);
      setStatusMsg('Failed to fetch from GitHub.');
    }
  }

  const updateProfile = (field: string, value: any) => {
    setContent({
      ...content,
      profile: { ...content.profile, [field]: value }
    });
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newProjects = [...content.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setContent({ ...content, projects: newProjects });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      category: 'Design',
      year: new Date().getFullYear().toString(),
      description: '',
      image: 'https://picsum.photos/800/600',
      link: '#'
    };
    setContent({ ...content, projects: [newProject, ...content.projects] });
  };

  const removeProject = (index: number) => {
    if (confirm("Are you sure?")) {
      const newProjects = [...content.projects];
      newProjects.splice(index, 1);
      setContent({ ...content, projects: newProjects });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
           <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-black mb-4 text-sm font-medium">
             <ArrowLeft size={16} /> Back to Site
           </Link>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'content' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            General Content
          </button>
          <button 
             onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'projects' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            Portfolio Projects
          </button>
           <button 
             onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            GitHub Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
           <div className="mb-2">
             {status !== SaveStatus.IDLE && (
               <div className={`text-xs p-2 rounded mb-2 ${status === SaveStatus.SUCCESS ? 'bg-green-100 text-green-800' : status === SaveStatus.ERROR ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                 {statusMsg}
               </div>
             )}
           </div>
           <button 
            onClick={handleSaveToGitHub}
            disabled={status === SaveStatus.SAVING}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium disabled:opacity-50"
          >
            {status === SaveStatus.SAVING ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            Push Updates
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">Profile & Hero</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                   <input 
                      type="text" 
                      value={content.profile.name} 
                      onChange={(e) => updateProfile('name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Headline</label>
                   <textarea 
                      value={content.profile.heroHeadline} 
                      onChange={(e) => updateProfile('heroHeadline', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none h-24"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subheadline</label>
                   <textarea 
                      value={content.profile.heroSubline} 
                      onChange={(e) => updateProfile('heroSubline', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none h-20"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">About Text</label>
                   <textarea 
                      value={content.profile.aboutText} 
                      onChange={(e) => updateProfile('aboutText', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none h-40"
                   />
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Projects ({content.projects.length})</h2>
                <button onClick={addProject} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm hover:opacity-80">
                  <Plus size={16}/> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {content.projects.map((project, index) => (
                  <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group">
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="font-bold text-gray-400">#{index + 1}</h3>
                       <button onClick={() => removeProject(index)} className="text-red-500 hover:text-red-700 opacity-50 group-hover:opacity-100">
                         <Trash2 size={16} />
                       </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                         <input type="text" value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                         <input type="text" value={project.category} onChange={(e) => updateProject(index, 'category', e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                       </div>
                       <div className="col-span-2">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                         <input type="text" value={project.image} onChange={(e) => updateProject(index, 'image', e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                         {project.image && <img src={project.image} alt="Preview" className="h-20 w-auto object-cover mt-2 rounded border" />}
                       </div>
                       <div className="col-span-2">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                         <textarea value={project.description} onChange={(e) => updateProject(index, 'description', e.target.value)} className="w-full p-2 border border-gray-300 rounded h-20" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">GitHub Configuration</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500 mb-6">
                  Configure your repository details here. The <b>Personal Access Token</b> is stored only in your browser's LocalStorage and is used to fetch/save <code>content.json</code> directly to GitHub.
                </p>
                <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GitHub Username (Owner)</label>
                     <input 
                        type="text" 
                        value={config.owner} 
                        onChange={(e) => setConfig({...config, owner: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g. yourusername"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Repository Name</label>
                     <input 
                        type="text" 
                        value={config.repo} 
                        onChange={(e) => setConfig({...config, repo: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                         placeholder="e.g. portfolio-v2"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Branch</label>
                     <input 
                        type="text" 
                        value={config.branch} 
                        onChange={(e) => setConfig({...config, branch: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="main"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Personal Access Token (Repo Scope)</label>
                     <input 
                        type="password" 
                        value={config.token} 
                        onChange={(e) => setConfig({...config, token: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                     />
                   </div>
                   <div className="pt-4 flex gap-4">
                     <button 
                       onClick={() => { saveConfig(config); alert('Config Saved Locally'); }}
                       className="bg-black text-white px-6 py-2 rounded hover:opacity-80"
                     >
                       Save Configuration
                     </button>
                     <button
                        onClick={handlePullFromGitHub}
                        className="flex items-center gap-2 border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
                     >
                        <Github size={16}/> Test Connection & Pull
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};