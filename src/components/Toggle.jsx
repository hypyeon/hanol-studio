import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Toggle({ tabs, activeTab, onTabChange, portrait }) {
  return (
    <div className={`flex landscape:hidden border-b mb-6 border-hanol-charcoal/10 ${portrait}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 text-[10px] uppercase tracking-[0.4em] transition-all duration-300 ${
            activeTab === tab 
              ? 'text-hanol-charcoal opacity-100' 
              : 'text-hanol-charcoal/30'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div 
              layoutId="activeTab" 
              className="h-px bg-hanol-charcoal mt-3 w-full"
            />
          )}
        </button>
      ))}
    </div>
  )
};