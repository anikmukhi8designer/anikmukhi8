import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const PortfolioGrid: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <section id="work" className="py-32 px-6 md:px-12 bg-white rounded-t-[3rem] -mt-10 z-20 relative shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <h3 className="text-4xl font-bold tracking-tight">Selected Works</h3>
          <span className="text-sm font-mono text-neutral-400">({projects.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <motion.div
      className={`group cursor-pointer ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/project/${project.id}`}>
        <div className="relative overflow-hidden bg-neutral-100 aspect-[4/3] mb-8 rounded-lg">
          <motion.img 
            src={project.image} 
            alt={project.title}
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
            whileHover={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute top-4 right-4 bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight size={20} />
          </div>
        </div>
        
        <div className="border-t border-neutral-200 pt-6 flex justify-between items-start">
          <div>
            <h4 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">{project.title}</h4>
            <div className="flex gap-2 text-sm text-neutral-500 uppercase tracking-wide">
              <span>{project.category}</span>
            </div>
          </div>
          <span className="text-sm font-mono text-neutral-400">{project.year}</span>
        </div>
      </Link>
    </motion.div>
  );
};