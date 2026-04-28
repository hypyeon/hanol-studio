import React, { useState } from 'react';
import { Files, Check } from 'lucide-react';

const CopyableText = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for mobile / older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // prevent scrolling
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  } catch (err) {
    console.error("Copy failed", err);
  }
};

  return (
    <button
      type="button"
      className="relative inline-flex items-center group/copy cursor-pointer mx-1 active:scale-95 transition-transform"
      onClick={handleCopy}
    >
      {copied ? (
        <span className="inline-flex items-center gap-1">
          <span className="underline decoration-dotted uppercase opacity-100 text-hanol-red">
            {text}
          </span>
          <Check 
            size={12} 
            className="text-hanol-red animate-in zoom-in" />
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          <span className="underline decoration-dotted uppercase opacity-80 group-hover/copy:opacity-100 transition-opacity">
            {text}
          </span>
          <Files 
            size={12} 
            className="group-hover/copy:opacity-100 transition-opacity" />
        </span>
      )}

      {/* Subtle "Copied" Tooltip */}
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-hanol-charcoal text-white text-[10px] py-1 px-2 rounded tracking-tighter animate-bounce z-50">
          COPIED
        </span>
      )}
    </button>
  );
};

export default CopyableText;