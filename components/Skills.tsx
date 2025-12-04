import React from 'react';
import { motion } from 'framer-motion';
import { SkillGroup } from '../types';

export const Skills: React.FC<{ skills: SkillGroup[] }> = ({ skills }) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#f3f3f3]">
      <div className="max-w-7xl mx-auto">
         <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-16">Expertise</h3>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {skills.map((group, index) => (
              <motion.div 
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="text-xl font-bold mb-6 pb-4 border-b border-neutral-300">{group.category}</h4>
                <div className="flex flex-wrap gap-3">
                  {group.items.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-white rounded-full text-sm text-neutral-700 border border-transparent hover:border-neutral-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
};