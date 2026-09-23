// src/components/booking-steps/StepThreeForm.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function Form({ formId = '262645553986169', clientData = {}, onFormComplete, onBack }) {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Build Pre-population URL parameters
  // Match parameter keys to Jotform's field "Unique Names" (e.g. ?name[first]=...&email=...)
  const queryParams = new URLSearchParams({
    'name[first]': clientData.firstName || '',
    'name[last]': clientData.lastName || '',
    email: clientData.email || '',
    phoneNumber: clientData.phone || '',
  }).toString();

  const embedUrl = `https://form.jotform.com/${formId}?${queryParams}`;

  useEffect(() => {
    // 2. Listen for Jotform postMessages (Heights & Submissions)
    const handleMessage = (e) => {
      // Security Check: Only accept messages from Jotform
      if (typeof e.data !== 'string' && typeof e.data !== 'object') return;

      const data = typeof e.data === 'string' ? parseData(e.data) : e.data;

      if (!data) return;

      // Handling Height Adjustments
      if (data.action === 'setHeight' || data.type === 'setHeight') {
        const newHeight = parseInt(data.height || data.value, 10);
        if (newHeight && !isNaN(newHeight)) {
          setIframeHeight(newHeight + 20); // Add 20px padding to avoid scrollbars
        }
      }

      // Handling Form Submission Completion
      if (
        data.action === 'submission-completed' ||
        data.event === 'form-submit' ||
        data.type === 'submit'
      ) {
        console.log('Jotform submitted successfully:', data);
        setIsSubmitted(true);
        if (onFormComplete) {
          onFormComplete(data);
        }
      }
    };

    const parseData = (str) => {
      try {
        if (str.includes(':')) {
          const parts = str.split(':');
          if (parts[0] === 'setHeight') {
            return { action: 'setHeight', height: parts[1] };
          }
        }
        return JSON.parse(str);
      } catch (err) {
        return null;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onFormComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Jotform Embedded iFrame */}
      <div className="w-full overflow-scroll min-h-125">
        <iframe
          ref={iframeRef}
          id={`JotFormIFrame-${formId}`}
          title="Booking Form"
          src={embedUrl}
          style={{
            width: '100%',
            height: `${iframeHeight}px`,
            border: 'none',
            transition: 'height 0.2s ease-out',
            margin: '0 0 -84px 0'
          }}
          scrolling="no"
        />
      </div>

      {/* Manual Fallback Advance Button if user completed form */}
      <div className="mt-6">

        <button
          onClick={() => onFormComplete && onFormComplete()}
          disabled={!isSubmitted}
          className={`w-full py-3.5 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
            isSubmitted
              ? 'bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <span>Secure Booking →</span>
        </button>
      </div>
    </div>
  );
}