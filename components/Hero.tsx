import React from 'react';
import { motion } from 'framer-motion';
import { SiteContent } from '../types';

export const Hero: React.FC<{ content: SiteContent }> = ({ content }) => {
  return (
    <section className="min-h-screen flex flex-col justify-end px-6 md:px-12 pb-24 pt-40 md:pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-sm md:text-base font-medium tracking-widest uppercase text-neutral-500 mb-4">
            {content.profile.role}
          </h2>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-neutral-900 mb-8 max-w-5xl"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {content.profile.heroHeadline}
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-neutral-600 max-w-2xl font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {content.profile.heroSubline}
        </motion.p>
      </div>
      
      <motion.div 
        className="absolute bottom-12 right-6 md:right-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </motion.div>
    </section>
  );
};