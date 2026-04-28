import React, { useState } from 'react'
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home'; 
import EyebrowQuiz from './pages/EyebrowQuiz';
import Service from './pages/Services';
import Booking from './pages/Booking';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';

export default function App() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div 
        className="fixed inset-0 -z-10 h-svh w-full bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/hanji-bg.png')" }}
      />
      <div className="relative min-h-svh">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div 
          onClick={() => setIsMenuOpen(false)} 
          className={`fixed inset-0 bg-black/2 backdrop-blur-xs z-40 transition-opacity duration-600 
            ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />
        <div className={`transition-all duration-700 ${isMenuOpen ? 'blur-sm grayscale-[0.2]' : 'blur-0'}`}>
          <AnimatePresence mode="wait">
            <BrowserRouter basename="/hanol-studio">
              <Routes location={location} key={location.pathname}>
                <Route 
                  path="/" 
                  element={<PageTransition><Home /></PageTransition>} />
                <Route 
                  path="/quiz" 
                  element={<PageTransition><EyebrowQuiz /></PageTransition>} />
                <Route 
                  path="/services" 
                  element={<PageTransition><Service /></PageTransition>} />
                <Route 
                  path="/booking" 
                  element={<PageTransition><Booking /></PageTransition>} />
                <Route 
                  path="/portfolio" 
                  element={<PageTransition><Portfolio /></PageTransition>} />
                <Route 
                  path="/contact" 
                  element={<PageTransition><Contact /></PageTransition>} />
              </Routes>
            </BrowserRouter>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}