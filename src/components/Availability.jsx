import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Availability({
  selectedCategories = [],
  selectedServices = [],
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
}) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isGated =
    selectedCategories.length === 0 ||
    selectedServices.length < selectedCategories.length;

  // --- CALENDAR GENERATION LOGIC ---
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Working days: Tuesday (2) to Saturday (6)
  const isWorkingDay = (dayOfWeek) => dayOfWeek >= 2 && dayOfWeek <= 6;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    // Don't allow navigating into past months
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Format date string YYYY-MM-DD safely without timezone shifts
  const formatDateString = (dayNum) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // --- SQUARE AVAILABILITY FETCH ---
  useEffect(() => {
    if (!selectedDate || isGated) {
      setAvailableSlots([]);
      return;
    }

    async function fetchSquareAvailability() {
      setIsLoadingSlots(true);
      setFetchError(null);
      setSelectedTimeSlot(null);

      try {
        const serviceIds = selectedServices.map((s) => s.id);

        const res = await fetch('/api/availability', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
           },
          body: JSON.stringify({
            serviceIds,
            startRangeDate: selectedDate,
          }),
        });

        const rawText = await res.text();
        
        if (!rawText || rawText.trim() === '') {
          throw new Error(`Server returned an empty response (Status: ${res.status})`);
        }

        let data;
        try {
          data = JSON.parse(rawText);
        } catch (parseErr) {
          console.error('Non-JSON response body received:', rawText);
          throw new Error(`Server returned an invalid format (Status: ${res.status}). Check server proxy/route.`);
        }

        if (res.ok) {
          setAvailableSlots(data.slots || []);
        } else {
          setFetchError(data.error || 'Unable to load schedule.');
        }
      } catch (err) {
        console.error('DEBUG FETCH ERROR:', err);
        setFetchError(err.message || 'Network error while checking calendar availability.');
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchSquareAvailability();
  }, [selectedDate, selectedServices, isGated, setSelectedTimeSlot]);

  return (
    <section className="relative min-h-95 border border-neutral-200 rounded-3xl py-4 px-1 md:p-8 bg-white/80 backdrop-blur-md shadow-sm md:space-y-6">
      <div className="flex items-center justify-center md:justify-between border-b pb-4 border-neutral-100">
        <div className='hidden md:block'>
          <h3 className="text-sm font-semibold text-neutral-700">Initial & Maintenance</h3>
          <p className="text-xs text-neutral-500">Tue – Sat • 10am - 4pm</p>
        </div>
        
        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2 md:gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-neutral-100 transition text-neutral-600 disabled:opacity-30"
          >
            <ChevronLeft className='text-hanol-charcoal/70' size={20} />
          </button>
          <span className="text-md font-primary font-semibold tracking-wide text-neutral-800 min-w-30 text-center">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-neutral-100 transition text-neutral-600"
          >
            <ChevronRight className='text-hanol-charcoal/70' size={20} />
          </button>
        </div>
      </div>

      {/* GATING OVERLAY */}
      {isGated && (
        <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 text-center rounded-3xl">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg border border-neutral-200">
            <p className="font-medium text-neutral-600 text-sm">
              {selectedCategories.length === 0
                ? 'Select a treatment area above to get started'
                : `Select a service for each area above to unlock calendar availability (${selectedServices.length}/${selectedCategories.length})`}
            </p>
          </div>
        </div>
      )}

      {/* MONTH GRID CALENDAR */}
      <div className="space-y-2">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-neutral-400 tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {/* Empty lead-in spaces for month alignment */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {/* Render Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateObj = new Date(year, month, dayNum);
            const dayOfWeek = dateObj.getDay();
            const dateStr = formatDateString(dayNum);

            const isPast = dateObj < today;
            const isOpenDay = isWorkingDay(dayOfWeek);
            const isClickable = !isPast && isOpenDay;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dayNum}
                type="button"
                disabled={!isClickable}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-11 rounded-2xl text-xs font-medium transition-all duration-150 flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-bold shadow-md scale-105 z-1'
                    : isClickable
                    ? 'bg-neutral-50 hover:bg-neutral-900/10 text-neutral-900 font-semibold border border-neutral-200/60'
                    : 'bg-neutral-50/40 text-neutral-300 cursor-not-allowed border border-transparent line-through'
                }`}
              >
                <span>{dayNum}</span>
                {isClickable && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TIME SLOTS AREA */}
      {selectedDate && (
        <div className="px-4 md:px-0 border-t border-neutral-100 pt-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Available Times for {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}:
          </div>

          {isLoadingSlots && (
            <div className="text-xs text-neutral-400 animate-pulse py-2">
              Searching Square real-time calendar slots...
            </div>
          )}

          {fetchError && (
            <div className="text-xs text-red-500 py-1 font-medium">{fetchError}</div>
          )}

          {!isLoadingSlots && !fetchError && availableSlots.length === 0 && (
            <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
              No open time slots found on this date for your selected treatments. Please try another Tuesday–Saturday.
            </div>
          )}

          {!isLoadingSlots && availableSlots.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {availableSlots.map((slot) => {
                const isSelected = selectedTimeSlot?.isoString === slot.isoString;
                return (
                  <button
                    key={slot.isoString}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`px-5 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-400 text-neutral-800 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    {slot.timeLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}