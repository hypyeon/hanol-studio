import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { MousePointerClick, PenLine, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showDefinition, setShowDefinition] = useState(false);

  return (
    // Added layout here so the entire vertical centering adjusts smoothly
    <motion.main 
      layout="position"
      className="h-svh flex flex-col gap-2 md:gap-8 justify-center px-10 md:portrait:px-16 landscape:px-8 text-center items-start md:max-w-5xl md:mx-auto"
    >
      <Logo size="lg" />
      <motion.div layout="position" className="landscape:hidden flex flex-col gap-6 relative">
        <AnimatePresence mode="wait">
          {!showDefinition ? (
            <button 
              onClick={() => setShowDefinition(!showDefinition)}
              className="flex items-center gap-0.5 text-[10px] uppercase tracking-[0.2em] opacity-45"
            >
              <p>Find out the meaning</p>
              <motion.div
                animate={{ 
                  opacity: [0.3, 1, 0.3], // Pulsing effect
                }}
                transition={{ 
                  duration: 1.5,           // Slow 3-second cycle
                  repeat: Infinity,      // Keep going forever
                  ease: "easeInOut"      // Smooth transitions at the peaks
                }}
                className="flex items-center justify-center"
              >
                <MousePointerClick size={14} strokeWidth={2} />
              </motion.div>
            </button>
          ) : (
            <motion.div 
              layout
              initial={{ opacity: 0, height: 0, x: -5 }}
              animate={{ opacity: 1, height: "auto", x: 0 }}
              exit={{ opacity: 0, height: 0, x: -5 }}
              transition={{ 
                duration: 0.3
              }}
              className="relative pl-4 overflow-hidden"
            >
              <div className="absolute left-0 top-0 h-full w-px bg-hanol-charcoal/20" />
              <div className="space-y-2 font-primary text-left text-hanol-charcoal leading-tight opacity-90 py-1">
                <p className="text-[11px] tracking-[0.2em] leading-relaxed opacity-70 italic">
                  <span className="font-semibold not-italic">han :</span> one, every <br />
                  <span className="font-semibold not-italic">ol :</span> a single stroke
                </p>
                <p className="text-[13px] font-primary opacity-80">
                  defines artist's attention to every single line.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

          <motion.div layout className="font-primary text-left text-hanol-charcoal leading-tight opacity-90 md:portrait:hidden">
            <p>
              Refined Korean techniques in <br />
              hyper-realistic artistry for brows & lips.
            </p>
          </motion.div>
      </motion.div>

      <motion.div layout className="font-primary text-left text-hanol-charcoal leading-tight opacity-90">
        <p className="hidden md:block text-xl">
          Discover hyper-realistic machine hairstrokes, <br className="hidden md:block" />
          anchored in the clarity of Korean artistry and advanced techniques.
        </p>
      </motion.div>

      <motion.div layout className="flex flex-col mt-8 md:mt-0 md:flex-row gap-4 w-full md:w-auto">
        <Link to="/quiz" className="font-primary text-lg px-8 py-4 rounded-lg border border-hanol-charcoal/30 bg-white/10 text-hanol-charcoal hover:bg-white/60 transition-all text-center hidden md:block">
          Find my eyebrow type
        </Link>    
        <Link to="/booking" className="font-sans uppercase md:normal-case md:font-primary text-sm tracking-widest md:tracking-normal md:text-lg px-8 py-4 rounded-lg bg-hanol-charcoal text-white/80 md:text-white hover:bg-black transition-all shadow-lg cursor-pointer">
          Schedule your session
        </Link>   
        <div className="md:hidden flex justify-between">
          <Link to="/services" className="flex justify-center items-center gap-1.5 font-sans uppercase text-sm tracking-widest w-[48%] py-3 rounded-lg border border-hanol-charcoal/40 bg-white/10 text-hanol-charcoal/50 hover:bg-white/60 transition-all text-center">
            <PenLine size={15} />
            services
          </Link>
          <Link to="/contact" className="flex justify-center items-center gap-1.5 font-sans uppercase text-sm tracking-widest w-[48%] py-3 rounded-lg border border-hanol-charcoal/40 bg-white/10 text-hanol-charcoal/50 hover:bg-white/60 transition-all text-center">
            <MapPin size={15} />
            find studio
          </Link>
        </div>  
      </motion.div>
    </motion.main>
  )
}