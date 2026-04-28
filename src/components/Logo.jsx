import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = "lg", className = "" }) {
  const sizeMap = {
    xs: {
      text: "text-xl md:text-2xl",
      seal: "border-[1.5px] rounded-[3px] -translate-y-0.5 py-0.25 leading-normal",
      char: "text-[7px] md:text-[6px]",
      han: "-mt-0.5 -ml-0.25 pr-0.25",
      ol: "-mt-[3.5px] -mr-0.25 pl-0.25 -mb-0.25"
    },
    sm: {
      text: "text-[34px] md:text-5xl",
      seal: "border-[1.75px] md:border-2 rounded-[5px] -translate-y-1 -translate-x-0.5 py-0.25 leading-snug",
      char: "text-[10px] md:text-[12px]",
      han: "-mt-1 pt-0.5 md:-mt-0.5 -ml-0.25 pr-0.5",
      ol: "-mt-1 -mr-0.25 pl-0.5"
    },
    lg: {
      text: "text-[5.5rem] md:text-8xl",
      seal: "border-3 rounded-[10px] -translate-y-1.5 -translate-x-0.5 md:-translate-y-2 md:-translate-x-1 py-0.5 leading-none",
      char: "text-2xl",
      han: "-mt-1 -ml-0.5 pr-1",
      ol: "-mt-2 -mr-0.5 pl-1"
    }
  };

  const current = sizeMap[size] || sizeMap.lg;

  return (
    <Link 
      to="/" 
      className={`flex items-center transition-opacity hover:opacity-80 w-fit cursor-pointer ${className}`}
    >
      {/* BRAND NAME */}
      <h1 className={`font-logo ${current.text} text-hanol-charcoal lowercase leading-none faked-bold tracking-wider`}>
        hanol
      </h1>
      
      {/* THE SEAL (Scaled based on 'size' prop) */}
      <div className={`border-hanol-red flex flex-col items-center justify-center ${current.seal}`}>
        <span className={`${current.char} ${current.han} font-primary text-hanol-red faked-bold`}>
          한
        </span>
        <span className={`${current.char} ${current.ol} font-primary text-hanol-red faked-bold`}>
          올
        </span>
      </div>
    </Link>
  );
}