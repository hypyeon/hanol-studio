import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Accordion({ question, answer, linkText, linkUrl, isOpen, onToggle }) {

  return (
    <div className="border-b border-hanol-charcoal/10">
      <button 
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-6 text-left group transition-all"
      >
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-hanol-charcoal/40">
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="font-primary text-lg text-hanol-charcoal/80 group-hover:text-hanol-charcoal cursor-pointer">
          {question}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="pb-8 pl-8 font-sans text-sm text-hanol-charcoal/60 leading-relaxed max-w-md">
              {answer}
              {linkText && (
                <>
                  <a 
                  href={linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-hanol-red underline decoration-dotted decoration-hanol-red/40 hover:decoration-hanol-red transition-all duration-300"
                  >
                    {linkText}
                  </a>
                  <span>.</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}