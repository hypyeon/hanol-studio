import React, { useState } from 'react';
import Logo from '../components/Logo';

export default function Service() {
  return (
    <main className="h-dvh pt-24 overflow-hidden flex justify-center items-center">
      <Logo size="sm" className="fixed top-10 left-10 z-60" />

      <div className='text-center'>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-hanol-charcoal/80 mb-4">
          Hanol is currently finding its form
        </p>
        <p className="text-[14px] font-primary text-hanol-charcoal/80 italic tracking-wide max-w-sm leading-relaxed">
          Platform in showcase mode. <br />
          Details will be unveiled upon our official opening.        </p>
      </div>
    </main>
  );
}