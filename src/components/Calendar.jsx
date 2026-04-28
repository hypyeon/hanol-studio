import React from 'react';
import { getDayStatus } from '../utils/bookingHelpers';

const Calendar = ({ currentDate, slotsFromServer, isSelected, onClick }) => {
  const { color, selectable, dot } = getDayStatus(currentDate, slotsFromServer);
  
  return (
    <button 
      onClick={selectable ? onClick : null}
      disabled={!selectable}
      className={`relative flex flex-col items-center justify-center aspect-square transition-all ${
        isSelected ? 'bg-hanol-charcoal text-white' : ''
      }`}
      style={{ color: isSelected ? 'white' : color, cursor: selectable ? 'pointer' : 'default' }}
    >
      <span className="text-[11px] font-light">{currentDate.getDate()}</span>
      {/* Your Dot logic here */}
      {!isSelected && dot && (
         <div className={`absolute bottom-1 w-1 h-1 rounded-full ${dot === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} />
      )}
    </button>
  );
};

export default Calendar;