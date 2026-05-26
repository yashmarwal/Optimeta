'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FlipFeatureCards({
  cards,
}: {
  cards: FeatureCard[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const locked = useRef(false);
  const touchStartY = useRef(0);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hijackActive = useRef(false);  // true = scroll hijack is on
  const snapDisabled = useRef(false);  // true = don't re-snap after boundary exit
  const sectionRef = useRef<HTMLDivElement>(null);

  const navigate = (dir: 'forward' | 'backward') => {
    setDirection(dir);
    setCurrentIndex(i =>
      dir === 'forward'
        ? Math.min(i + 1, cards.length - 1)
        : Math.max(i - 1, 0)
    );
  };

  useEffect(() => {
    const getRect = () =>
      sectionRef.current?.getBoundingClientRect() ?? null;

    const isCentered = (rect: DOMRect) => {
      const mid = window.innerHeight / 2;
      return rect.top < mid && rect.bottom > mid;
    };

    const snapToCenter = (rect: DOMRect) => {
      const sectionMid = rect.top + rect.height / 2;
      const vMid = window.innerHeight / 2;
      const target = window.scrollY + (sectionMid - vMid);
      window.scrollTo({ top: Math.round(target), behavior: 'smooth' });
    };

    // Scroll listener — detects section entering center even during fast scroll,
    // then snaps the page and enables hijack mode.
    const onPageScroll = () => {
      if (snapDisabled.current) return;
      const rect = getRect();
      if (!rect) return;

      if (isCentered(rect)) {
        if (!hijackActive.current) {
          hijackActive.current = true;
          snapToCenter(rect);
        }
      } else {
        hijackActive.current = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!hijackActive.current) return;

      // At boundary — release hijack and let page scroll naturally
      if (e.deltaY > 0 && currentIndex >= cards.length - 1) {
        hijackActive.current = false;
        snapDisabled.current = true;
        setTimeout(() => { snapDisabled.current = false; }, 1500);
        return;
      }
      if (e.deltaY < 0 && currentIndex <= 0) {
        hijackActive.current = false;
        snapDisabled.current = true;
        setTimeout(() => { snapDisabled.current = false; }, 1500);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // One card per scroll gesture (debounce unlock on scroll end)
      if (!locked.current) {
        locked.current = true;
        navigate(e.deltaY > 0 ? 'forward' : 'backward');
      }

      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = setTimeout(() => {
        locked.current = false;
      }, 900);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!hijackActive.current) return;
      const diff = touchStartY.current - e.touches[0].clientY;
      if (diff > 0 && currentIndex >= cards.length - 1) return;
      if (diff < 0 && currentIndex <= 0) return;
      if (Math.abs(diff) > 10) e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!hijackActive.current || locked.current) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;

      if (diff > 0 && currentIndex < cards.length - 1) {
        locked.current = true;
        navigate('forward');
        setTimeout(() => { locked.current = false; }, 700);
      } else if (diff < 0 && currentIndex > 0) {
        locked.current = true;
        navigate('backward');
        setTimeout(() => { locked.current = false; }, 700);
      }
    };

    window.addEventListener('scroll', onPageScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('scroll', onPageScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, [currentIndex, cards.length]);

  const card = cards[currentIndex];

  return (
    <div
      ref={sectionRef}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#ffffff',
          background: 'rgba(123,47,190,0.2)',
          border: '1px solid rgba(123,47,190,0.4)',
          padding: '4px 12px',
          borderRadius: '20px',
          marginBottom: '10px',
        }}>
          Features
        </span>
        <h2 style={{
          color: '#ffffff',
          fontSize: '26px',
          fontWeight: 900,
          lineHeight: 1.2,
          margin: 0,
        }}>
          Everything You Need to{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7B2FBE, #C026D3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Win on Meta
          </span>
        </h2>
      </div>

      {/* Card */}
      <div style={{ perspective: '1000px', width: '100%' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={
              direction === 'forward'
                ? { rotateX: 75, opacity: 0, scale: 0.92 }
                : { rotateX: -75, opacity: 0, scale: 0.92 }
            }
            animate={{ rotateX: 0, opacity: 1, scale: 1 }}
            exit={
              direction === 'forward'
                ? { rotateX: -75, opacity: 0, scale: 0.92 }
                : { rotateX: 75, opacity: 0, scale: 0.92 }
            }
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
          >
            <div style={{
              background: currentIndex === 0
                ? 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(192,38,211,0.1))'
                : '#0F0F1A',
              border: `1px solid ${currentIndex === 0 ? 'rgba(123,47,190,0.4)' : '#1E1E3A'}`,
              borderRadius: '20px',
              padding: '28px 24px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(123,47,190,0.25), rgba(192,38,211,0.25))',
                  border: '1px solid rgba(123,47,190,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '18px',
                }}>
                  {card.icon}
                </div>

                <h3 style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '20px',
                  lineHeight: 1.3,
                  margin: '0 0 10px 0',
                }}>
                  {card.title}
                </h3>

                <p style={{
                  color: '#A0A0C0',
                  fontSize: '14px',
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {card.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
              }}>
                <span style={{ color: '#404060', fontSize: '12px' }}>
                  {currentIndex + 1} / {cards.length}
                </span>
                {currentIndex < cards.length - 1 ? (
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ color: '#606080', fontSize: '12px' }}
                  >
                    Swipe up ↑
                  </motion.span>
                ) : (
                  <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>
                    All features ✓
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / dots / Next */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '14px',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <button
          onClick={() => {
            if (locked.current || currentIndex === 0) return;
            locked.current = true;
            navigate('backward');
            setTimeout(() => { locked.current = false; }, 700);
          }}
          disabled={currentIndex === 0}
          style={{
            background: currentIndex === 0 ? '#1E1E3A' : 'rgba(123,47,190,0.2)',
            border: '1px solid',
            borderColor: currentIndex === 0 ? '#1E1E3A' : 'rgba(123,47,190,0.4)',
            borderRadius: '10px',
            padding: '7px 14px',
            color: currentIndex === 0 ? '#404060' : '#A0A0C0',
            fontSize: '13px',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.4 : 1,
          }}
        >
          ← Prev
        </button>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '0 4px' }}>
          {cards.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                if (locked.current) return;
                locked.current = true;
                setDirection(i > currentIndex ? 'forward' : 'backward');
                setCurrentIndex(i);
                setTimeout(() => { locked.current = false; }, 700);
              }}
              animate={{
                width: i === currentIndex ? 18 : 6,
                opacity: i === currentIndex ? 1 : 0.3,
              }}
              style={{
                height: '6px',
                borderRadius: '3px',
                background: i === currentIndex ? '#C026D3' : '#606080',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (locked.current || currentIndex === cards.length - 1) return;
            locked.current = true;
            navigate('forward');
            setTimeout(() => { locked.current = false; }, 700);
          }}
          disabled={currentIndex === cards.length - 1}
          style={{
            background: currentIndex === cards.length - 1
              ? '#1E1E3A'
              : 'linear-gradient(135deg, #7B2FBE, #C026D3)',
            border: 'none',
            borderRadius: '10px',
            padding: '7px 14px',
            color: '#ffffff',
            fontSize: '13px',
            cursor: currentIndex === cards.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === cards.length - 1 ? 0.4 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
