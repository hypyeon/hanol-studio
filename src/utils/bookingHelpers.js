export const getDayStatus = (date, allSlots) => {
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon...

  const calendarDateStr = date.toLocaleDateString('en-CA');

  // 1. Filter allSlots to find ONLY the ones on this specific date
  const slotsForThisDay = (allSlots || []).filter(slot => {
    if (!slot.startAt) return false;
    const slotDateStr = new Date(slot.startAt).toLocaleDateString('en-CA');
    return slotDateStr === calendarDateStr;
  });

  const count = slotsForThisDay.length;

  // Rule 1: Monday (Day 1) is always closed
  if (dayOfWeek === 1) {
    return { color: '#d1d1d1', selectable: false, dot: null };
  }

  // Rule 2: Determine Max Slots for that day (Sun = 1, Others = 2)
  const maxPossible = (dayOfWeek === 0) ? 1 : 2;

  // Rule 3: Logic for dots and colors based on the actual COUNT
  if (count === 0) {
    // No slots found in Square for this day
    return { color: '#d1d1d1', selectable: false, dot: null };
  } else if (count >= maxPossible) {
    // 2 slots (Tue-Sat) or 1 slot (Sun) available
    return { color: '#1a1a1a', selectable: true, dot: 'green' }; 
  } else {
    // Only 1 slot left on a day that usually has 2
    return { color: '#1a1a1a', selectable: true, dot: 'yellow' }; 
  }
};