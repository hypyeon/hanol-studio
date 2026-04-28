import React, { useState } from 'react'

export default function Navbar({isMenuOpen, setIsMenuOpen}) {
  return (
    <nav className="fixed top-0 right-0 p-8 md:p-10 z-70">
      <div 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex flex-col gap-1.5 cursor-pointer group w-8 h-6 justify-center relative"
      >
        <div className={`w-8 h-[1.5px] bg-hanol-charcoal transition-all duration-500 absolute ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
        <div className={`w-8 h-[1.5px] bg-hanol-charcoal transition-all duration-500 absolute ${isMenuOpen ? 'opacity-0 translate-x-4' : 'opacity-100'}`} />
        <div className={`w-8 h-[1.5px] bg-hanol-charcoal transition-all duration-500 absolute ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
      </div>
    </nav>
  )
}