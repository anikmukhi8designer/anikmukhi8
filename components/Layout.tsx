import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiteContent } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  content: SiteContent;
}

export const Layout: React.FC<LayoutProps> = ({ children, content }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen bg-gray-100 font-sans">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#111] selection:bg-black selection:text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 mix-blend-difference text-white pointer-events-none">
        <div className="pointer-events-auto">
           <Link to="/" className="text-lg font-bold tracking-tight uppercase hover:opacity-70 transition-opacity">
            {content.profile.name}
          </Link>
        </div>
        <div className="pointer-events-auto hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase">
          <a href="#work" className="hover:text-neutral-300 transition-colors">Work</a>
          <a href="#experience" className="hover:text-neutral-300 transition-colors">Experience</a>
          <a href="#about" className="hover:text-neutral-300 transition-colors">About</a>
        </div>
        <div className="pointer-events-auto">
          <a href={`mailto:${content.profile.email}`} className="text-sm font-medium uppercase border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all">
            Let's Talk
          </a>
        </div>
      </nav>

      <main className="relative z-10 w-full overflow-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111] text-white py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="max-w-xl">
             <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
               Have a project in mind?
             </h2>
             <a href={`mailto:${content.profile.email}`} className="inline-flex items-center gap-2 text-xl underline underline-offset-4 hover:text-neutral-400 transition-colors">
               {content.profile.email} <ArrowUpRight size={20} />
             </a>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6">
            <div className="flex gap-6">
              {content.profile.socials.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm uppercase tracking-wider hover:text-neutral-400 transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>
            <p className="text-neutral-500 text-xs mt-8">
              &copy; {new Date().getFullYear()} {content.profile.name}. All rights reserved.
            </p>
             <Link to="/admin" className="text-neutral-700 text-xs hover:text-neutral-500 mt-2">
               Admin Login
             </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};