import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from './Logo'; // Importing your existing flexible Logo

export default function ScrollTransition() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculates 25% of the current viewport height
      const threshold = window.innerHeight * 0.1;
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* --- LOGO (Top Left) --- */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            key="logo-nav"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-8 left-8 md:top-10 md:left-10 z-60"
          >
            <Logo size="sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SCROLL TO TOP (Bottom Right) --- */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            key="scroll-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-60 p-4 bg-white/60 backdrop-blur-md border border-hanol-charcoal/10 rounded-full shadow-sm hover:bg-white transition-all group active:scale-90"
          >
            <svg 
              width="20" height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-hanol-charcoal group-hover:-translate-y-1 transition-transform duration-300"
            >
              <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}