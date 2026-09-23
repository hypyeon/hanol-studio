import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsRight } from 'lucide-react';
import Availability from '../Availability';
import { SERVICES_DATA } from '../../data/serviceList';
import { CATEGORIES } from '../../data/serviceList';

export default function Select({ onServiceAndDateSelected }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Price Calculations
  const rawTotalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const isCombo = selectedServices.length === 2;
  const discountAmount = isCombo ? rawTotalPrice * 0.10 : 0;
  const finalTotalPrice = rawTotalPrice - discountAmount;

  const handleCategoryClick = (category) => {
    setSelectedDate('');
    setSelectedTimeSlot('');

    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
      setSelectedServices(selectedServices.filter((srv) => srv.category !== category));
    } else {
      if (selectedCategories.length < 2) {
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  const handleServiceClick = (service) => {
    setSelectedDate('');
    setSelectedTimeSlot('');

    const exists = selectedServices.some((s) => s.id === service.id);

    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      const filtered = selectedServices.filter((s) => s.category !== service.category);
      setSelectedServices([...filtered, service]);
    }
  };

  const isReady = selectedServices.length > 0 && selectedDate && selectedTimeSlot;

  const handleProceed = () => {
  const selectedData = {
    services: selectedServices,
    date: selectedDate,
    slot: selectedTimeSlot,
  };

  // Safe check before calling
  if (typeof onServiceAndDateSelected === 'function') {
    onServiceAndDateSelected(selectedData);
  } else if (typeof onProceed === 'function') {
    onProceed(selectedData);
  }
};

  return (
    <div className="max-w-2xl mx-auto px-4 pb-4 md:p-6 space-y-8 text-neutral-800">
      {/* 1. CATEGORY SELECTION */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center justify-between flex-col md:flex-row mb-3 min-h-12 md:min-h-8">
            <h3 className="text-[12.5px] md:text-sm uppercase font-medium text-neutral-500 text-start w-full md:w-auto">
              Select up to 2 for same-day booking
            </h3>
            {/* DISCOUNT PROMO BADGE */}
            <AnimatePresence>
              {selectedServices.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9, y: 3 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -3 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full md:w-auto flex justify-end"
                >
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 whitespace-nowrap'>
                    ✨ Save 10% on 2 services
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 md:gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              const isDisabled = !isSelected && selectedCategories.length >= 2;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  disabled={isDisabled}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition ${
                    isSelected
                      ? 'bg-neutral-900 text-white'
                      : isDisabled
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {cat} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* SERVICES LISTING */}
        {selectedCategories.length > 0 && (
          <div className="space-y-6">
            {selectedCategories.map((categoryName) => (
              <div key={categoryName} className="space-y-3">
                <h3 className="text-[12px] md:text-sm font-medium uppercase tracking-wider text-hanol-charcoal/80 border-b pb-1">
                  {categoryName} Services
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICES_DATA.filter((s) => s.category === categoryName).map((service) => {
                    const isServiceSelected = selectedServices.some((s) => s.id === service.id);

                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceClick(service)}
                        className={`flex flex-col justify-between gap-2 leading-4 md:leading-6 p-4 text-left border rounded-xl transition ${
                          isServiceSelected
                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <div className="font-primary font-semibold text-neutral-800">{service.name}</div>
                        <div className="text-right text-xs text-neutral-500 mt-1">
                          {service.duration} • ${service.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REWARD CARD FOR SELECTING 2 SERVICES */}
        {isCombo && (
          <div className="bg-amber-50/80 border border-amber-200 p-2 md:p-4 rounded-xl flex flex-col md:flex-row items-center justify-between text-amber-900 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <span className="md:text-lg">🎉</span>
              <div>
                <div className="font-semibold text-[14px] md:text-sm">Same-Day Combo Special Applied!</div>
                <div className="text-xs text-amber-700">10% off both treatments (-${discountAmount.toFixed(2)})</div>
              </div>
            </div>
            <div className="pt-2 md:pt-0 text-right font-bold text-[16px] md:text-sm text-amber-950">
              {isCombo ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="line-through text-neutral-400 text-[14px] md:text-xs">${rawTotalPrice}</span>
                  <span className="text-hanol-charcoal font-bold">${finalTotalPrice}</span>
                </span>
              ) : (
                <span>${rawTotalPrice}</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. CALENDAR AREA */}
      <Availability
        selectedCategories={selectedCategories}
        selectedServices={selectedServices}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
      />

      <button
        onClick={handleProceed}
        disabled={!isReady}
        className={`py-4 w-full rounded-xl text-sm font-semibold tracking-widest uppercase transition flex items-center justify-center gap-2 ${
          isReady
            ? 'bg-hanol-charcoal/90 text-white hover:bg-hanol-charcoal cursor-pointer'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
        }`}
      >
        <span>Continue to Booking Form</span> 
        <ChevronsRight size={18} strokeWidth={2} />
      </button>
    </div>
  );
}