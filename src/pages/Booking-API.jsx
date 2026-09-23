import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Accordion from '../components/Accordion';
import { faq } from '../data/faqData';
import { checklist } from '../data/bookingChecklist';
import ScrollTransition from '../components/ScrollTransition';
import SqBookingWidget from '../components/SqBookingWidget';
import { ChevronsRight, ChevronLeft, Loader2, ChevronsDown } from 'lucide-react';
import { HeartStraightIcon } from "@phosphor-icons/react";
import { bookingSteps } from '../data/bookingSteps';
import { stepTitles } from '../data/bookingSteps';
import { bookingRequest } from '../data/bookingRequest';
import Toggle from '../components/Toggle';
import { Link } from 'react-router-dom';
import { Payment } from '../components/Payment';
import Select from '../components/booking-steps/Select';
import Form from '../components/booking-steps/Form';

export default function BookingAPI() {
  const [checkedIds, setCheckedIds] = useState([]);
  const [checklistComplete, setChecklistComplete] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);
  const tabs = ['booking', 'faq'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const stepHeaderRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleToggle = (id) => setOpenId(openId === id ? null : id);

  const handleCheckboxChange = (id) => {
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const allChecked = checkedIds.length === checklist.length;

  useEffect(() => {
    if (allChecked && !checklistComplete) {
      startBookingFlow();
    }
  }, [allChecked, checklistComplete]);

  const startBookingFlow = () => {
    setTimeout(() => {
      // Step 1 → "Preparing..."
      setChecklistComplete(true);
      // Step 2 → widget loading starts AFTER step change
      setIsWidgetLoading(true);

      setTimeout(() => {
        const element = stepHeaderRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();

        // If the element is NOT already near the top, scroll
        if (rect.top > 100 || rect.top < 0) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 1400);

      setTimeout(() => {
        setIsWidgetLoading(false);
      }, 2200); // widget loading
    }, 1200); // "preparing" phase
  };

  useEffect(() => {
    if (checkedIds.length === checklist.length && checklist.length > 0) {
      const timer = setTimeout(() => {
        setCurrentStep(2);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [checkedIds, checklist.length]);

  return (
    <main className="pt-26 md:portrait:pt-40 landscape:pt-36 pb-24 px-8 md:px-16 mx-auto flex flex-col lg:px-20 xl:px-30 lg:flex-row lg:justify-between lg:portrait:items-center lg:portrait:h-screen">
      <ScrollTransition />

      <Toggle
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        portrait={"lg:portrait:hidden"}
      />

      {/* LEFT: FAQ */}
      <section className={`${activeTab === 'faq' ? 'block' : 'hidden'} landscape:block lg:portrait:block w-full lg:w-1/3 mb-16 landscape:mb-0`}>
        <div className="landscape:sticky lg:portrait:sticky landscape:top-16 lg:portrait:top-8 self-start">
          <div className="space-y-2">
            {faq.map((item) => (
              <Accordion
                key={item.id}
                question={item.q}
                answer={item.a}
                linkText={item.linkText}
                linkUrl={item.linkUrl}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT: Booking */}
      <section className={`${activeTab === 'booking' ? 'flex' : 'hidden'} lg:flex flex-col lg:w-3/5 lg:pl-8 lg:portrait:items-center`}>
        {/* RIGHT-TOP: Booking Process */}
        <div className="md:portrait:mt-4 mb-12 md:mb-16 lg:mb-10">
          <h2 className="hidden landscape:block lg:portrait:block text-[10px] uppercase tracking-[0.4em] opacity-60 mb-6 border-b border-hanol-charcoal/30 pb-1.5">
            Booking Process
          </h2>
          <div className="flex flex-col justify-center border-hanol-charcoal/5">
            <div className="flex flex-col gap-2 md:grid grid-cols-4 md:gap-3 relative">
              {bookingSteps.map((step, index) => {
                const isLastStep = index === bookingSteps.length - 1;
                // apply if isLastStep: "font-primary normal-case opacity-90 font-semibold text-[11px] md:portrait:mb-3"
                return (
                  <div key={step.id} className="flex flex-col relative text-center px-2 md:portrait:px-3 uppercase text-hanol-charcoal/80">
                    <p className="mb-2 text-[9px] underline underline-offset-4 tracking-[0.2em] leading-normal opacity-60">
                      {`Step 0${step.id}`}
                    </p>
                    <div className="flex flex-col justify-center grow min-h-8">
                      <p className='text-[10.5px] tracking-[0.05em] flex justify-center items-center leading-normal'>
                        {step.text}
                    </p>
                    </div>
                        {/* {isLastStep ? (
                          <>
                            Request sent!
                            <HeartStraightIcon size={14} weight="fill" className="text-hanol-red ml-0.5" />
                          </>
                        ) : (
                          `Step 0${step.id}`
                        )} */}

                    {!isLastStep && (
                      <div className="text-hanol-charcoal/80">
                        <ChevronsRight size={16} strokeWidth={1} className="hidden md:block md:absolute -right-3 top-1/2 -translate-y-1/2 " />
                        {/* <ChevronsDown size={16} strokeWidth={1} className="md:hidden mt-2" /> */}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className='mt-8 px-3'>
            {bookingRequest.map((note) => (
              <div key={note.id} className="flex gap-2 justify-start text-hanol-charcoal/95">
                <div className="opacity-60">
                  <HeartStraightIcon size={14} weight="fill" className="text-hanol-red mt-0.5" />
                </div>
                <p className="font-primary text-[0.85rem] tracking-wide leading-4 mb-2">
                  {note.linkUrl ? (
                    <>
                      {note.prefix}
                      <a
                        className="font-semibold underline underline-offset-1 decoration-dotted"
                        href={note.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {note.linkText}
                      </a>
                      {note.suffix}
                    </>
                  ) : (
                    note.text
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT-LEFT: Booking Widget */}
        <div
          ref={stepHeaderRef}
          style={{ scrollMarginTop: '30px' }}
        >
          <div
            className="text-[12px] uppercase tracking-[0.17em] md:tracking-[0.3em] opacity-60 mb-6 border-b border-hanol-charcoal/80 pb-1.5 scroll-mt-32"
          >
            <h2>
              Step {' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`step-num-${currentStep}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {currentStep}
                </motion.span>
              </AnimatePresence>
              {' '} of 4: {' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`step-title-${currentStep}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block font-bold"
                >
                  {stepTitles[currentStep]}
                </motion.span>
              </AnimatePresence>
            </h2>
          </div>
          <motion.div
            layout
            transition={{
              layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.4 }
            }}
            className="w-full bg-white/50 backdrop-blur-md rounded-4xl border border-hanol-charcoal/5 shadow-sm md:py-4 px-0 md:p-10"
          >
            <AnimatePresence mode="wait">
              {/* STEP 1: POLICIES CHECKLIST */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  <div className="space-y-4 flex-col grow p-4 md:p-0">
                    {checklist.map((policy, index) => {
                      const isLastItem = index === checklist.length - 1;
                      const isChecked = checkedIds.includes(policy.id);

                      return (
                        <motion.div
                          key={policy.id || index}
                          className="flex gap-2.5 items-start group cursor-pointer"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                          <input
                            type="checkbox"
                            id={policy.id}
                            className="cursor-pointer w-3 transition-all accent-hanol-charcoal/80"
                            onChange={() => handleCheckboxChange(policy.id)}
                            checked={isChecked}
                          />

                          <label
                            htmlFor={policy.id}
                            className="opacity-60 group-hover:opacity-100 transition-opacity text-[12px] tracking-wide leading-4 cursor-pointer"
                          >
                            {policy.text}
                            {policy.linkText && (
                              <>
                                <a
                                  href={policy.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-hanol-red underline decoration-dotted transition-colors"
                                  onClick={(e) => e.stopPropagation()} // Prevents clicking the link from toggling the checkbox
                                >
                                  {policy.linkText}
                                </a>
                                <span>.</span>
                              </>
                            )}
                          </label>
                        </motion.div>
                      );
                    })}
                  </div>
                  {/* Reveal button only when all are checked */}
                  <div className="w-full pb-4 md:pb-0 mt-4 md:mt-12 text-center text-hanol-charcoal/50 uppercase text-[10px] tracking-[0.2em]">
                    <AnimatePresence mode="wait">
                      {!allChecked ? (
                        <motion.span
                          key="instruction"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="block"
                        >
                          Select all boxes to proceed
                        </motion.span>
                      ) : (
                        <motion.span
                          key="processing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-2 text-hanol-red/70"
                        >
                          <Loader2 size={12} className="animate-spin" />
                          <span className="opacity-80">Step 2 loading…</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setCheckedIds([]);
                }}
                className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-hanol-red transition-all flex cursor-pointer gap-2 md:pb-1 mb-0 md:mb-8 p-6 md:p-0"
              >
                <ChevronLeft size={12} />
                Back
              </button>
              {/* STEP 2: SERVICE & SCHEDULE */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full flex flex-col"
                >
                  {/* The Widget Wrapper */}
                  <div className="relative w-full rounded-2xl bg-white/30 overflow-hidden min-h-125">
                    <AnimatePresence>
                      {isWidgetLoading && (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                          className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
                        >
                          <div className="mt-4 w-12 h-0.75 md:h-px bg-hanol-charcoal/10 relative overflow-hidden">
                            <motion.div
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                              className="absolute inset-0 bg-hanol-charcoal/40 w-1/2"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={`${isWidgetLoading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}`}>
                      <Select 
                        onServiceAndDateSelected={(selectedData) => {
                        // Save selected service/slot details if needed
                        setCurrentStep(3); // Advance to Jotform screening
                      }} />
                    </div>
                  </div>
                </motion.div>
              )}
              {/* STEP 3: MEDICAL SCREENING (JOTFORM) */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full flex flex-col"
                >
                  {/* Embedded Jotform Step */}
                  <Form
                    // formId="YOUR_JOTFORM_ID"
                    onBack={() => setCurrentStep(2)}
                    onFormComplete={() => setCurrentStep(4)}
                  />
                </motion.div>
              )}

              {/* STEP 4: DEPOSIT PAYMENT */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex justify-between items-end mb-4 md:mb-8 p-4 md:p-0">
                    <div>
                      <h3 className="text-[18px] font-primary tracking-[0.5px] text-hanol-charcoal">
                        Confirm & Pay Deposit
                      </h3>
                    </div>

                    <button
                      onClick={() => setCurrentStep(3)}
                      className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-hanol-red transition-all flex items-center gap-2 md:pb-1 cursor-pointer"
                    >
                      <ChevronLeft size={12} />
                      Back
                    </button>
                  </div>

                  {/* Step 4 Payment Form Component Goes Here */}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}