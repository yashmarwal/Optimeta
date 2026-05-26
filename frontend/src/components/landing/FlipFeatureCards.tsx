'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FlipFeatureCardsProps {
  cards: FeatureCard[];
}

export function FlipFeatureCards({ cards }: FlipFeatureCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollTop = window.scrollY;
      const scrolledIntoSection = scrollTop - sectionTop;
      const cardHeight = window.innerHeight;
      const targetIndex = Math.floor(scrolledIntoSection / cardHeight);
      const clampedIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));
      if (clampedIndex !== currentIndex) {
        setDirection(clampedIndex > currentIndex ? 'forward' : 'backward');
        setCurrentIndex(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex, cards.length]);

  const card = cards[currentIndex];

  return (
    <div ref={sectionRef} style={{ height: `${cards.length * 100}vh`, position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          overflow: 'hidden',
        }}
      >
        {/* Section heading */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-accent font-medium mb-4">
            Features
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Everything You Need to<br />
            <span className="gradient-text">Win on Meta</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            Optimeta generates what a senior performance marketer would take 3 days to build — in 15 seconds.
          </p>
        </div>

        {/* Card */}
        <div style={{ perspective: '1000px', width: '100%', maxWidth: '400px' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={direction === 'forward' ? { rotateX: 90, opacity: 0, scale: 0.95 } : { rotateX: -90, opacity: 0, scale: 0.95 }}
              animate={{ rotateX: 0, opacity: 1, scale: 1 }}
              exit={direction === 'forward' ? { rotateX: -90, opacity: 0, scale: 0.95 } : { rotateX: 90, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center', width: '100%' }}
            >
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: currentIndex === 0
                    ? 'linear-gradient(135deg, rgba(123,47,190,0.15), rgba(192,38,211,0.08))'
                    : '#0F0F1A',
                  border: '1px solid',
                  borderColor: currentIndex === 0 ? 'rgba(123,47,190,0.3)' : '#1E1E3A',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(192,38,211,0.2))',
                    border: '1px solid rgba(123,47,190,0.3)',
                  }}
                >
                  {card.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{card.title}</h3>
                <p className="text-[#A0A0C0] text-sm leading-relaxed">{card.description}</p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[#404060] text-xs">{currentIndex + 1} of {cards.length}</span>
                  {currentIndex < cards.length - 1 ? (
                    <span className="text-[#606080] text-xs">Keep scrolling to continue ↓</span>
                  ) : (
                    <span className="text-[#22c55e] text-xs font-semibold">All features explored ✓</span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-5">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === currentIndex ? 20 : 6,
                background: i === currentIndex ? '#C026D3' : '#1E1E3A',
              }}
              transition={{ duration: 0.2 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
