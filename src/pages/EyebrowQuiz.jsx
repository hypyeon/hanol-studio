import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { questions, evaluateQuizResults } from '../data/quizData';
import Toggle from '../components/Toggle';
import ScrollTransition from '../components/ScrollTransition';

export default function EyebrowQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 350);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleCalculateResult = () => {
    setShowResult(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
  };

  const results = showResult ? evaluateQuizResults(answers) : null;

  return (
    <main className="h-dvh w-screen overflow-hidden pt-26 landscape:pt-30 md:portrait:pt-40 pb-24 px-8 md:px-16 landscape:mx-auto flex flex-col landscape:flex-row landscape:gap-16 md:portrait:justify-center md:portrait:gap-24 md:items-start md:justify-center">
      <ScrollTransition />
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {!showResult ? (
          <>
            <div className="text-center mb-8 font-primary text-hanol-charcoal/80 tracking-widest uppercase text-xs">
              Question {currentIndex + 1} of {questions.length}
            </div>

            <div 
              className="flex transition-transform duration-700 ease-in-out md:gap-10"
              style={{ 
                transform: `translateX(calc(50% - (var(--card-width) / 2) - (${currentIndex} * (var(--card-width) + var(--gap)))))`,
                '--card-width': 'min(90vw, 520px)',
                '--gap': '40px'
              }}
            >
              {questions.map((q, index) => {
                const isActive = index === currentIndex;
                
                return (
                  <div 
                    key={q.id}
                    className={`shrink-0 w-[min(90vw,520px)] transition-all duration-700 
                      ${isActive ? 'opacity-100 scale-100' : 'opacity-20 scale-90 blur-[1px]'}`}
                  >
                    <div className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-sm border border-hanol-charcoal/5 flex flex-col justify-between min-h-115">
                      <div>
                        <h2 className="font-primary text-xl md:text-2xl text-hanol-charcoal mb-12 leading-snug">
                          {q.question}
                        </h2>
                        
                        <div className="space-y-3">
                          {q.options.map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() => handleOptionSelect(q.id, opt.key)} // Pass the key ("1a", "1b", etc.)
                              className={`w-full text-left p-4 rounded-xl font-primary text-sm transition-all border leading-relaxed
                                ${answers[q.id] === opt.key 
                                  ? 'border-hanol-red bg-hanol-red/5 text-hanol-red font-medium shadow-xs' 
                                  : 'border-hanol-charcoal/10 hover:border-hanol-charcoal/40 text-hanol-charcoal/80 bg-white/40'}`}
                            >
                              {opt.answer} {/* Display the human-readable text */}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-8 pt-4 border-t border-hanol-charcoal/5">
                        {index !== 0 ? (
                          <button 
                            onClick={prevQuestion}
                            className="font-primary text-xs uppercase tracking-widest text-hanol-charcoal/50 hover:text-hanol-charcoal transition-colors"
                          >
                            ← Back
                          </button>
                        ) : <div />}

                        {index === questions.length - 1 && (
                          <button 
                            className={`px-6 py-3 rounded-xl font-primary text-xs tracking-widest uppercase transition-all duration-300 shadow-sm 
                              ${!answers[q.id] 
                                ? 'bg-hanol-charcoal/10 text-hanol-charcoal/30 cursor-not-allowed shadow-none' 
                                : 'bg-hanol-charcoal text-white hover:bg-black hover:shadow-md cursor-pointer active:scale-95'
                            }`}
                            disabled={!answers[q.id]}
                            onClick={handleCalculateResult}
                          >
                            See My Results
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Result View */
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-6 md:py-8 md:px-12 landscape:mb-6 rounded-2xl border border-hanol-charcoal/10 shadow-sm text-hanol-charcoal space-y-6 animate-fadeIn">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 mb-2">Personal Analysis</p>
              <h3 className="text-1xl font-light tracking-wide border-b border-hanol-charcoal/20 pb-4">
                Recommended Technique & Service
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono text-hanol-red/90 font-medium">
              {results.hashtags.map((tag) => (
                <span key={tag} className="bg-hanol-red/5 px-3 py-1 rounded-full border border-hanol-red/15">
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-hanol-charcoal/5 p-5 rounded-xl border border-hanol-charcoal/5">
                <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Top Recommendation</p>
                <p className="text-lg font-semibold text-hanol-charcoal">{results.topChoice}</p>
              </div>

              {results.anotherRec && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Alternative Choice</p>
                  <p className="text-sm opacity-80 leading-relaxed">{results.anotherRec}</p>
                </div>
              )}

              <div className="pt-4 border-t border-hanol-charcoal/10">
                <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Session Type & Next Steps</p>
                <p className="text-xs md:text-sm leading-relaxed opacity-85 bg-white/60 p-4 rounded-xl border border-hanol-charcoal/5">
                  {results.sessionAdvice}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-hanol-charcoal/10">
              <button 
                onClick={resetQuiz}
                className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
              >
                Retake Quiz
              </button>
              
              <Link 
                to="/booking"
                className="w-full sm:w-auto px-8 py-3 bg-hanol-charcoal text-white text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all text-center shadow-sm"
              >
                Proceed to Booking →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}