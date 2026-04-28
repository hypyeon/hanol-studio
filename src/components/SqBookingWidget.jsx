import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SqBookingWidget = () => {
  const widgetId = import.meta.env.VITE_SQ_WIDGET_ID; 
  const locationId = import.meta.env.VITE_SQ_LOCATION_ID;
  const containerRef = useRef(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // DELETE ONCE UP AND RUNNING
  const isBookingDisabled = true;

  if (isBookingDisabled) {
    return (
      <div className="w-full min-h-100 flex flex-col items-center justify-center text-center px-8 border border-hanol-charcoal/5 rounded-sm bg-white/30 backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-hanol-charcoal mb-4">
          Status Update
        </p>
        <p className="text-[14px] font-primary text-hanol-charcoal/80 italic tracking-wide max-w-xs">
          "Booking currently not available — business being set up at the moment."
        </p>
        <div className="mt-8 h-px w-12 bg-hanol-charcoal/20" />
      </div>
    );
  }
  // DELETE ^ ONCE UP AND RUNNING

  useEffect(() => {
    // 1. We watch for the blur event globally
    const handleVisibilityChange = () => {
      // If the user clicks a service and the tab opens, 
      // visibilityState often changes to 'hidden' on mobile 
      // or the window blurs on desktop.
      if (document.visibilityState === 'hidden' || !document.hasFocus()) {
        // We check if the focus was "lost" while the user was interacting with our page
        setIsRedirecting(true);
      }
    };

    window.addEventListener('blur', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const script = document.createElement('script');
    script.src = `https://square.site/appointments/buyer/widget/${widgetId}/${locationId}.js`;
    script.async = true;
    
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      window.removeEventListener('blur', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [widgetId, locationId]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {isRedirecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-100 bg-hanol-charcoal/60 backdrop-blur-md flex flex-col items-center justify-center text-center px-12"
          >
            <div className="max-w-xs md:max-w-full">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white leading-relaxed mb-4">
                You've been redirected to secure booking
              </p>
              <p className="text-[13px] text-white opacity-80 font-primary tracking-wide">
                Please complete Step 3 with Square to finalize your appointment.
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRedirecting(false);
                }}
                className="mt-12 text-[10px] text-white uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-all opacity-90 hover:font-bold cursor-pointer"
              >
                View all services again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={containerRef} 
        id="sq-embed-container" 
        className="w-full h-full bg-white py-4"
      />
    </div>
  );
};

export default SqBookingWidget;