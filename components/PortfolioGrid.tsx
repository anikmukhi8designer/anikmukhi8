import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';

export const PortfolioGrid: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <section id="work" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 border-b border-neutral-200 pb-4">
          <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400">Selected Work ({projects.length})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
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
  // Stagger odd items down on desktop for that "masonry" feel
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      className={`group cursor-pointer ${!isEven ? 'md:mt-24' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="relative overflow-hidden bg-neutral-100 aspect-[4/3] mb-6">
        <motion.img 
          src={project.image} 
          alt={project.title}
          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
          whileHover={{ scale: 1.05 }}
        />
      </div>
      
      <div className="flex justify-between items-baseline border-b border-transparent group-hover:border-neutral-200 pb-2 transition-colors duration-300">
        <div>
          <h4 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">{project.title}</h4>
          <p className="text-neutral-500 text-sm">{project.category}</p>
        </div>
        <span className="text-xs font-mono text-neutral-400">{project.year}</span>
      </div>
    </motion.div>
  );
};