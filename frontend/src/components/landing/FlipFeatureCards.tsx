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
  const [flipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollLocked = useRef(false);
  const touchStartY = useRef(0);

  const goToNext = () => {
    if (scrollLocked.current || currentIndex >= cards.length - 1) return false;
    scrollLocked.current = true;
    setDirection('forward');
    setFlipping(true);
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setFlipping(false);
      setTimeout(() => { scrollLocked.current = false; }, 400);
    }, 350);
    return true;
  };

  const goToPrev = () => {
    if (scrollLocked.current || currentIndex <= 0) return false;
    scrollLocked.current = true;
    setDirection('backward');
    setFlipping(true);
    setTimeout(() => {
      setCurrentIndex(i => i - 1);
      setFlipping(false);
      setTimeout(() => { scrollLocked.current = false; }, 400);
    }, 350);
    return true;
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top >= -100 && rect.bottom <= window.innerHeight + 100;
      if (!inView) return;

      if (e.deltaY > 30 && currentIndex < cards.length - 1) {
        e.preventDefault();
        goToNext();
      } else if (e.deltaY < -30 && currentIndex > 0) {
        e.preventDefault();
        goToPrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const inView = rect.top >= -150 && rect.bottom <= window.innerHeight + 150;
      if (!inView) return;

      if (diff > 0 && currentIndex < cards.length - 1) {
        e.preventDefault();
        goToNext();
      } else if (diff < 0 && currentIndex > 0) {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, cards.length]);

  const card = cards[currentIndex];

  return (
    <div ref={containerRef} className="relative w-full" style={{ perspective: '1000px', minHeight: '320px' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          initial={direction === 'forward' ? { rotateX: 90, opacity: 0 } : { rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={direction === 'forward' ? { rotateX: -90, opacity: 0 } : { rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
          className="w-full"
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
                <span className="text-[#606080] text-xs animate-bounce">Scroll to see more ↓</span>
              ) : (
                <span className="text-[#22c55e] text-xs font-semibold">All features explored ✓</span>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {cards.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              if (scrollLocked.current) return;
              setDirection(i > currentIndex ? 'forward' : 'backward');
              setFlipping(true);
              setTimeout(() => { setCurrentIndex(i); setFlipping(false); }, 350);
            }}
            animate={{
              width: i === currentIndex ? 20 : 6,
              background: i === currentIndex ? '#C026D3' : '#1E1E3A',
            }}
            transition={{ duration: 0.2 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>

      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-3"
        >
          <span className="text-[#404060] text-xs">Swipe up to explore features</span>
        </motion.div>
      )}
    </div>
  );
}
