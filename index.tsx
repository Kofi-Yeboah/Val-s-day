import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Heart, Sparkles, Laptop } from 'lucide-react';

// Declaration for the global confetti function from the script tag
declare const confetti: any;

const App = () => {
  const [accepted, setAccepted] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ top: 'auto', left: 'auto', position: 'static' });
  const [hoverCount, setHoverCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Phrases that appear when trying to click 'No'
  const phrases = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you absolutely certain?",
    "This could be a mistake!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;(",
  ];

  const handleNoHover = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnWidth = 100; // Approx width
      const btnHeight = 50; // Approx height

      // Calculate new random position within the container padding
      // Using 80% of the container to keep it somewhat reachable but elusive
      const newLeft = Math.random() * (containerRect.width - btnWidth - 40) + 20;
      const newTop = Math.random() * (containerRect.height - btnHeight - 40) + 20;

      setNoBtnPosition({
        position: 'absolute',
        left: `${newLeft}px`,
        top: `${newTop}px`
      });
      
      setHoverCount(prev => prev + 1);
    }
  };

  const handleYesClick = () => {
    setAccepted(true);
    triggerConfetti();
  };

  const handleReset = () => {
    setAccepted(false);
    setNoBtnPosition({ top: 'auto', left: 'auto', position: 'static' });
    setHoverCount(0);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <>
      {/* Mobile Blocker Overlay */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-rose-200 p-6 text-center md:hidden">
        <div className="glass-card w-full max-w-sm rounded-3xl p-8 shadow-xl">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 animate-pulse rounded-full bg-rose-300 opacity-40 blur-lg"></div>
              <Laptop className="relative h-16 w-16 text-rose-500" />
            </div>
          </div>
          <h2 className="mb-3 font-script text-5xl text-rose-600">Oh no!</h2>
          <p className="font-sans text-lg text-gray-700">
            Please view this on a laptop or computer for the best experience.
            <br />
            <span className="mt-2 block text-sm text-rose-500">(The magic needs a mouse! 🖱️)</span>
          </p>
        </div>
      </div>

      {/* Main Desktop App */}
      <div className="hidden md:flex min-h-screen w-full items-center justify-center p-4 overflow-hidden relative selection:bg-rose-200">
        {/* Background Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute text-rose-300 opacity-20 ${i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 3 + 1}rem`,
                animationDuration: `${Math.random() * 5 + 3}s`
              }}
            >
              ♥
            </div>
          ))}
        </div>

        <div 
          ref={containerRef}
          className="glass-card relative w-full max-w-md p-8 md:p-12 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-8 transition-all duration-500 ease-in-out transform hover:scale-[1.02]"
          style={{ minHeight: '400px' }}
        >
          {!accepted ? (
            <>
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-rose-400 blur opacity-40 animate-pulse"></div>
                <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-heartbeat relative z-10 drop-shadow-lg" />
              </div>
              
              <h1 className="font-script text-6xl md:text-7xl text-rose-600 drop-shadow-sm leading-tight pt-4">
                Will you be my Valentine?
              </h1>

              <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center mt-4 h-32 md:h-20">
                <button
                  onClick={handleYesClick}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-10 rounded-full text-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center gap-2"
                >
                  Yes <Sparkles className="w-5 h-5" />
                </button>
                
                <button
                  onMouseEnter={handleNoHover}
                  // onTouchStart removed as this is now desktop only
                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold py-3 px-10 rounded-full text-xl shadow-md transition-all duration-200 ease-out whitespace-nowrap z-50"
                  style={noBtnPosition as React.CSSProperties}
                >
                  {phrases[Math.min(hoverCount, phrases.length - 1)]}
                </button>
              </div>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center">
               <div className="relative mb-6">
                 <div className="absolute -inset-4 bg-rose-200 rounded-full blur-xl opacity-50"></div>
                 <div className="text-9xl relative z-10 animate-bounce">
                    🥳
                 </div>
               </div>
              
              <h1 className="font-script text-7xl text-rose-600 mb-4 drop-shadow-sm">
                Yayyy!
              </h1>
              
              <p className="font-sans text-xl text-gray-700 max-w-xs">
                I knew you'd say yes! <br/>
                Can't wait to spend the day with you. ❤️
              </p>

              <button 
                onClick={handleReset}
                className="mt-8 text-sm text-rose-400 hover:text-rose-600 underline decoration-rose-300 underline-offset-4"
              >
                Play again
              </button>
            </div>
          )}
        </div>
        
        <footer className="absolute bottom-4 text-rose-800/40 text-sm font-sans">
          Made with ❤️
        </footer>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);