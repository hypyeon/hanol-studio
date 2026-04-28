import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const ZStroke = ({ isActive }) => (
  <svg 
    className="absolute -bottom-2 left-0 w-full h-4 z-10 pointer-events-none overflow-visible" 
    viewBox="0 0 100 20" 
    fill="none"
  >
    <path 
      d="M 2,4 L 98,6 L 5,14 L 95,16" 
      stroke="#E20421" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`path-animation opacity-0 group-hover:opacity-60 transition-opacity duration-100 ${isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'}`}
    />
  </svg>
)

export default function Sidebar({ isMenuOpen, setIsMenuOpen }) {
  const location = useLocation();

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[68vw] md:portrait:w-[40vw] landscape:w-[25vw] bg-hanji-white z-50 transform transition-all duration-500 ease-in-out 
      
        ${isMenuOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none'}`}
    >
      <div className="flex flex-col h-full justify-between pt-32 pb-36 px-8 md:px-12">
        <ul className="flex flex-col gap-10 font-primary text-2xl tracking-wider text-hanol-charcoal">
          {['services', 'booking', 'portfolio', 'contact'].map((item) => {
            const isActive = location.pathname === `/${item}`;

            return (
              <li key={item} className="relative group cursor-pointer w-fit">
                <Link 
                  to={`/${item}`} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="relative z-20 block"
                >
                  <span 
                    className="inline-block transition-transform duration-400 ease-out group-hover:translate-x-2 relative z-20"
                  >
                    {item}
                  </span>
                  <ZStroke isActive={isActive} />
                </Link>
              </li>
            );
          })}
        </ul>
        <footer className="flex gap-2 items-center absolute bottom-12 right-8 text-right text-[10px] tracking-normal leading-tight">
          <div className="opacity-60 font-sans">
            Copyright © 2026<br />designed & developed by Hayeong
          </div>
        </footer>
      </div>
    </div>
  )
}