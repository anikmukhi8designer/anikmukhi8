import React from 'react';
import { motion } from 'framer-motion';
import { SiteContent } from '../types';

export const Hero: React.FC<{ content: SiteContent }> = ({ content }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden bg-[#f3f3f3]">
      <div className="max-w-7xl mx-auto w-full pt-20">
        <div className="overflow-hidden mb-6">
          <motion.p
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="text-sm md:text-base font-medium tracking-widest uppercase text-neutral-500"
          >
            {content.profile.role}
          </motion.p>
        </div>
        
        <div className="overflow-hidden mb-2">
           <motion.h1 
            className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-[#111]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          >
            {content.profile.heroHeadline.split(" ")[0]} 
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
           <motion.h1 
            className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-[#111]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
          >
            {content.profile.heroHeadline.split(" ").slice(1).join(" ")}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-xl"
        >
          <p className="text-xl md:text-2xl text-neutral-600 font-light leading-relaxed">
            {content.profile.heroSubline}
          </p>
        </motion.div>
      </div>
    </section>
  );
};