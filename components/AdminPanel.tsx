import React, { useState, useEffect } from 'react';
import { SiteContent, GitHubConfig, SaveStatus, Project, ExperienceItem, SkillGroup } from '../types';
import { saveContentToGitHub, getStoredConfig, saveConfig, fetchContentFromGitHub } from '../services/githubService';
import { Save, RefreshCw, Github, Plus, Trash2, ArrowLeft, MoveVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminProps {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  refreshContent: () => void;
}

export const AdminPanel: React.FC<AdminProps> = ({ content, setContent, refreshContent }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'projects' | 'experience' | 'skills' | 'settings'>('content');
  const [config, setConfig] = useState<GitHubConfig>({
    owner: '',
    repo: '',
    branch: 'main',
    path: 'content.json',
    token: ''
  });
  const [status, setStatus] = useState<SaveStatus>(SaveStatus.IDLE);
  const [statusMsg, setStatusMsg] = useState('');

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
      
      // Attempt to refresh local data immediately
      await refreshContent();
      
      setTimeout(() => setStatus(SaveStatus.IDLE), 3000);
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
      setStatusMsg('Failed to fetch: ' + err.message);
    }
  }

  // Helper updates
  const updateProfile = (field: string, value: any) => {
    setContent({ ...content, profile: { ...content.profile, [field]: value } });
  };

  // Projects CRUD
  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newArr = [...content.projects];
    newArr[index] = { ...newArr[index], [field]: value };
    setContent({ ...content, projects: newArr });
  };
  const addProject = () => {
    const newItem: Project = { id: Date.now().toString(), title: 'New Project', category: 'Design', year: '2024', description: '', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2727&auto=format&fit=crop', link: '#' };
    setContent({ ...content, projects: [newItem, ...content.projects] });
  };
  const removeProject = (index: number) => {
    if (confirm("Delete this project?")) {
      const newArr = [...content.projects];
      newArr.splice(index, 1);
      setContent({ ...content, projects: newArr });
    }
  };

  // Experience CRUD
  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const newArr = [...content.experience];
    newArr[index] = { ...newArr[index], [field]: value };
    setContent({ ...content, experience: newArr });
  };
  const addExperience = () => {
    const newItem: ExperienceItem = { id: Date.now().toString(), company: 'Company', role: 'Role', period: '2024', description: 'Description...' };
    setContent({ ...content, experience: [newItem, ...content.experience] });
  };
  const removeExperience = (index: number) => {
    if (confirm("Delete this experience?")) {
      const newArr = [...content.experience];
      newArr.splice(index, 1);
      setContent({ ...content, experience: newArr });
    }
  };

  // Skills CRUD
  const updateSkillGroup = (index: number, field: keyof SkillGroup, value: any) => {
    const newArr = [...content.skills];
    // @ts-ignore
    newArr[index] = { ...newArr[index], [field]: value };
    setContent({ ...content, skills: newArr });
  };
  const updateSkillItems = (index: number, value: string) => {
    const items = value.split(',').map(s => s.trim());
    const newArr = [...content.skills];
    newArr[index] = { ...newArr[index], items };
    setContent({ ...content, skills: newArr });
  };
  const addSkillGroup = () => {
    const newItem: SkillGroup = { id: Date.now().toString(), category: 'New Category', items: ['Skill 1'] };
    setContent({ ...content, skills: [...content.skills, newItem] });
  };
  const removeSkillGroup = (index: number) => {
    const newArr = [...content.skills];
    newArr.splice(index, 1);
    setContent({ ...content, skills: newArr });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
        <div className="p-6 border-b border-gray-100">
           <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-black mb-4 text-sm font-medium">
             <ArrowLeft size={16} /> Back to Site
           </Link>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {['content', 'projects', 'experience', 'skills', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors capitalize ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 bg-gray-50">
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
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium disabled:opacity-50 transition-colors shadow-sm"
          >
            {status === SaveStatus.SAVING ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            Push Updates
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto pb-20">
          
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">Profile & Hero</h2>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Name</label>
                   <input 
                      type="text" 
                      value={content.profile.name} 
                      onChange={(e) => updateProfile('name', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Role</label>
                     <input type="text" value={content.profile.role} onChange={(e) => updateProfile('role', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email</label>
                     <input type="text" value={content.profile.email} onChange={(e) => updateProfile('email', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hero Headline</label>
                   <textarea 
                      value={content.profile.heroHeadline} 
                      onChange={(e) => updateProfile('heroHeadline', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg h-24 focus:border-black outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hero Subline</label>
                   <textarea 
                      value={content.profile.heroSubline} 
                      onChange={(e) => updateProfile('heroSubline', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg h-24 focus:border-black outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2">About Text</label>
                   <textarea 
                      value={content.profile.aboutText} 
                      onChange={(e) => updateProfile('aboutText', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg h-40 focus:border-black outline-none"
                   />
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Projects</h2>
                <button onClick={addProject} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">
                  <Plus size={16}/> Add
                </button>
              </div>
              <div className="space-y-4">
                {content.projects.map((project, index) => (
                  <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 group relative">
                    <button onClick={() => removeProject(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2">
                       <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image URL</label>
                         <div className="flex gap-4">
                           <input type="text" value={project.image} onChange={(e) => updateProject(index, 'image', e.target.value)} className="flex-1 p-2 border border-gray-200 rounded-lg" />
                           <img src={project.image} alt="" className="h-10 w-10 object-cover rounded bg-gray-100" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                         <input type="text" value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                         <input type="text" value={project.category} onChange={(e) => updateProject(index, 'category', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Experience</h2>
                <button onClick={addExperience} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">
                  <Plus size={16}/> Add
                </button>
              </div>
              <div className="space-y-4">
                {content.experience.map((item, index) => (
                  <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
                     <button onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2">
                       <Trash2 size={16} />
                    </button>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Company</label>
                          <input type="text" value={item.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg" />
                        </div>
                         <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Period</label>
                          <input type="text" value={item.period} onChange={(e) => updateExperience(index, 'period', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Role</label>
                          <input type="text" value={item.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                          <textarea value={item.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg h-20" />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Skills</h2>
                <button onClick={addSkillGroup} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">
                  <Plus size={16}/> Add Group
                </button>
              </div>
              <div className="space-y-4">
                 {content.skills.map((group, index) => (
                   <div key={group.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
                      <button onClick={() => removeSkillGroup(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2">
                       <Trash2 size={16} />
                      </button>
                      <div className="mb-4">
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category Name</label>
                         <input type="text" value={group.category} onChange={(e) => updateSkillGroup(index, 'category', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg font-bold" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Skills (Comma separated)</label>
                         <textarea 
                           value={group.items.join(', ')} 
                           onChange={(e) => updateSkillItems(index, e.target.value)} 
                           className="w-full p-2 border border-gray-200 rounded-lg h-20 bg-gray-50"
                         />
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">GitHub Configuration</h2>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">GitHub Username</label>
                     <input type="text" value={config.owner} onChange={(e) => setConfig({...config, owner: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="username" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Repository</label>
                     <input type="text" value={config.repo} onChange={(e) => setConfig({...config, repo: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="repo-name" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">File Path</label>
                     <input type="text" value={config.path} onChange={(e) => setConfig({...config, path: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="content.json" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Personal Access Token</label>
                     <input type="password" value={config.token} onChange={(e) => setConfig({...config, token: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="ghp_..." />
                   </div>
                   <div className="pt-6 flex gap-4">
                     <button onClick={() => { saveConfig(config); alert('Saved!'); }} className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity">
                       Save Config
                     </button>
                     <button onClick={handlePullFromGitHub} className="flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        <Github size={18}/> Test & Pull
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