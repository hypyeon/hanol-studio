import React, { useState } from 'react';
import { questions } from '../data/quizData';
import Logo from '../components/Logo';

export default function EyebrowQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleOptionSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 400); 
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="max-h-screen pt-24 overflow-hidden">
      <Logo size="sm" className="fixed top-10 left-10 z-60" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-12 font-primary text-hanol-charcoal/40 tracking-widest uppercase text-sm">
          Question {currentIndex + 1} of {questions.length}
        </div>

        <div 
          className="flex transition-transform duration-700 ease-in-out md:gap-10"
          style={{ 
            transform: `translateX(calc(50% - (var(--card-width) / 2) - (${currentIndex} * (var(--card-width) + var(--gap)))))`,
            '--card-width': 'min(90vw, 500px)',
            '--gap': '40px'
          }}
        >
          {questions.map((q, index) => {
            const isActive = index === currentIndex;
            
            return (
              <div 
                key={q.id}
                className={`shrink-0 w-[min(90vw,500px)] transition-all duration-700 
                  ${isActive ? 'opacity-100 scale-100' : 'opacity-20 scale-90 blur-[1px]'}`}
              >
                <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-sm border border-hanol-charcoal/5 max-h-full flex flex-col justify-between">
                  <div>
                    <h2 className="font-primary text-2xl text-hanol-charcoal mb-12 leading-tight">
                      {q.question}
                    </h2>
                    
                    <div className="space-y-4">
                      {q.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(q.id, option)}
                          className={`w-full text-left p-4 rounded-lg font-primary text-lg transition-all border
                            ${answers[q.id] === option 
                              ? 'border-hanol-red bg-hanol-red/5 text-hanol-red' 
                              : 'border-hanol-charcoal/10 hover:border-hanol-charcoal/40 text-hanol-charcoal/70'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-10">
                    {index !== 0 ? (
                      <button 
                        onClick={prevQuestion}
                        className="font-primary text-hanol-charcoal/50 hover:text-hanol-charcoal transition-colors"
                      >
                        ← back
                      </button>
                    ) : <div></div>}

                    {index === questions.length - 1 && (
                      <button 
                        className={`px-6 py-3 rounded-xl font-primary transition-all duration-500 shadow-sm 
                          ${!answers[q.id] ? 'bg-hanol-charcoal/10 text-hanol-charcoal/30 cursor-not-allowed shadow-none' : 'bg-hanol-charcoal text-white hover:bg-black hover:shadow-lg cursor-pointer active:scale-95'
                        }`}
                        disabled={!answers[q.id]}
                        onClick={() => alert("Analyzing your results...")}
                      >
                        See my result
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}