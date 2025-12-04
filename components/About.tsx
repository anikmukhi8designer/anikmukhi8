import React from 'react';
import { motion } from 'framer-motion';
import { SiteContent } from '../types';

export const About: React.FC<{ content: SiteContent }> = ({ content }) => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-32">
        <div className="md:w-1/3">
           <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-8 sticky top-24">Profile</h3>
        </div>
        
        <div className="md:w-2/3">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl md:text-4xl font-light leading-tight text-neutral-800 mb-12">
              {content.profile.aboutText}
            </p>
          </motion.div>

          <div id="contact" className="pt-12 border-t border-neutral-200">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-4">Get in touch</h4>
                  <a href={`mailto:${content.profile.email}`} className="text-xl md:text-2xl hover:text-neutral-500 transition-colors">
                    {content.profile.email}
                  </a>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-neutral-900 mb-4">Social</h4>
                   <ul className="space-y-2">
                     {content.profile.socials.map((s, i) => (
                       <li key={i}>
                         <a href={s.url} target="_blank" rel="noreferrer" className="text-lg hover:underline decoration-1 underline-offset-4">
                           {s.platform}
                         </a>
                       </li>
                     ))}
                   </ul>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};