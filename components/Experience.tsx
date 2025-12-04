import React from 'react';
import { motion } from 'framer-motion';
import { ExperienceItem } from '../types';

export const Experience: React.FC<{ experience: ExperienceItem[] }> = ({ experience }) => {
  return (
    <section id="experience" className="py-32 px-6 md:px-12 bg-[#f3f3f3]">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-16">Work Experience</h3>
        
        <div className="space-y-8">
          {experience.map((item, index) => (
            <motion.div 
              key={item.id}
              className="group flex flex-col md:flex-row md:items-start justify-between border-b border-neutral-300 pb-8 hover:border-black transition-colors duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="md:w-1/3 mb-4 md:mb-0">
                <h4 className="text-2xl font-bold text-neutral-900">{item.company}</h4>
                <p className="text-neutral-500 mt-1">{item.period}</p>
              </div>
              <div className="md:w-2/3 md:pl-12">
                <h5 className="text-lg font-medium text-neutral-900 mb-2">{item.role}</h5>
                <p className="text-neutral-600 font-light leading-relaxed max-w-2xl">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};