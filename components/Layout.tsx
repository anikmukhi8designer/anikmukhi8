import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { SiteContent } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  content: SiteContent;
}

export const Layout: React.FC<LayoutProps> = ({ children, content }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white p-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
           <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
            {content.profile.name.toUpperCase()}
          </Link>
        </div>
        <div className="pointer-events-auto flex gap-6 text-sm font-medium tracking-wide">
          <a href="#work" className="hover:underline decoration-1 underline-offset-4">WORK</a>
          <a href="#about" className="hover:underline decoration-1 underline-offset-4">ABOUT</a>
          <a href="#contact" className="hover:underline decoration-1 underline-offset-4">CONTACT</a>
        </div>
      </nav>

      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-neutral-500 text-sm">
              &copy; {new Date().getFullYear()} {content.profile.name}
            </p>
          </div>
          <div className="flex gap-6">
            {content.profile.socials.map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm uppercase tracking-wider hover:text-white transition-colors"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 text-xs text-neutral-700 text-center">
            <Link to="/admin" className="hover:text-neutral-500">Admin Access</Link>
        </div>
      </footer>
    </div>
  );
};