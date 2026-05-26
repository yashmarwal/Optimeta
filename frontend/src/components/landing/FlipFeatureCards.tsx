'use client';

import { useState, useEffect, useRef }
  from 'react';
import { motion, AnimatePresence }
  from 'framer-motion';

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
  const [currentIndex, setCurrentIndex] =
    useState(0);
  const [direction, setDirection] =
    useState<'forward' | 'backward'>('forward');
  const locked = useRef(false);
  const touchStartY = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const next = () => {
    if (locked.current) return;
    if (currentIndex >= cards.length - 1) return;
    locked.current = true;
    setDirection('forward');
    setCurrentIndex(i => i + 1);
    setTimeout(() => {
      locked.current = false;
    }, 500);
  };

  const prev = () => {
    if (locked.current) return;
    if (currentIndex <= 0) return;
    locked.current = true;
    setDirection('backward');
    setCurrentIndex(i => i - 1);
    setTimeout(() => {
      locked.current = false;
    }, 500);
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();

      const inView =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

      if (!inView) return;

      if (e.deltaY > 0 &&
          currentIndex >= cards.length - 1) {
        return;
      }

      if (e.deltaY < 0 && currentIndex <= 0) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY > 0) next();
      else prev();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

      if (!inView) return;

      const diff =
        touchStartY.current - e.touches[0].clientY;

      if (diff > 0 &&
          currentIndex >= cards.length - 1) {
        return;
      }

      if (diff < 0 && currentIndex <= 0) {
        return;
      }

      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

      if (!inView) return;

      const diff =
        touchStartY.current -
        e.changedTouches[0].clientY;

      if (Math.abs(diff) < 40) return;

      if (diff > 0 &&
          currentIndex < cards.length - 1) {
        next();
      } else if (diff < 0 && currentIndex > 0) {
        prev();
      }
    };

    window.addEventListener(
      'wheel', onWheel,
      { passive: false }
    );
    window.addEventListener(
      'touchstart', onTouchStart,
      { passive: true }
    );
    window.addEventListener(
      'touchmove', onTouchMove,
      { passive: false }
    );
    window.addEventListener(
      'touchend', onTouchEnd,
      { passive: false }
    );

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentIndex, cards.length]);

  const card = cards[currentIndex];

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: '40px 16px 32px',
      }}
    >
      {/* Heading */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
      }}>
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
          marginBottom: '12px',
        }}>
          Features
        </span>
        <h2 style={{
          color: '#ffffff',
          fontSize: '28px',
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

      {/* Card with perspective */}
      <div style={{
        perspective: '1000px',
        width: '100%',
      }}>
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={currentIndex}
            initial={
              direction === 'forward'
                ? { rotateX: 80, opacity: 0, scale: 0.9 }
                : { rotateX: -80, opacity: 0, scale: 0.9 }
            }
            animate={{
              rotateX: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={
              direction === 'forward'
                ? { rotateX: -80, opacity: 0, scale: 0.9 }
                : { rotateX: 80, opacity: 0, scale: 0.9 }
            }
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
            }}
          >
            <div style={{
              background: currentIndex === 0
                ? 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(192,38,211,0.1))'
                : '#0F0F1A',
              border: `1px solid ${
                currentIndex === 0
                  ? 'rgba(123,47,190,0.4)'
                  : '#1E1E3A'
              }`,
              borderRadius: '20px',
              padding: '28px 24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>

              <div>
                {/* Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(123,47,190,0.25), rgba(192,38,211,0.25))',
                  border: '1px solid rgba(123,47,190,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}>
                  {card.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '20px',
                  marginBottom: '12px',
                  lineHeight: 1.3,
                  margin: '0 0 12px 0',
                }}>
                  {card.title}
                </h3>

                {/* Description */}
                <p style={{
                  color: '#A0A0C0',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {card.description}
                </p>
              </div>

              {/* Bottom */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '24px',
              }}>
                <span style={{
                  color: '#404060',
                  fontSize: '12px',
                }}>
                  {currentIndex + 1} / {cards.length}
                </span>

                {currentIndex < cards.length - 1 ? (
                  <motion.span
                    animate={{ y: [0, 4, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                    }}
                    style={{
                      color: '#606080',
                      fontSize: '12px',
                    }}
                  >
                    Swipe up ↑
                  </motion.span>
                ) : (
                  <span style={{
                    color: '#22c55e',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    All features ✓
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons for tap */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '16px',
        justifyContent: 'center',
      }}>
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          style={{
            background: currentIndex === 0
              ? '#1E1E3A'
              : 'rgba(123,47,190,0.2)',
            border: '1px solid',
            borderColor: currentIndex === 0
              ? '#1E1E3A'
              : 'rgba(123,47,190,0.4)',
            borderRadius: '10px',
            padding: '8px 16px',
            color: currentIndex === 0
              ? '#404060'
              : '#A0A0C0',
            fontSize: '13px',
            cursor: currentIndex === 0
              ? 'not-allowed'
              : 'pointer',
            opacity: currentIndex === 0 ? 0.4 : 1,
          }}
        >
          ← Prev
        </button>

        {/* Dots */}
        <div style={{
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
          padding: '0 8px',
        }}>
          {cards.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                if (locked.current) return;
                setDirection(
                  i > currentIndex
                    ? 'forward'
                    : 'backward'
                );
                locked.current = true;
                setCurrentIndex(i);
                setTimeout(() => {
                  locked.current = false;
                }, 500);
              }}
              animate={{
                width: i === currentIndex ? 18 : 6,
                opacity: i === currentIndex ? 1 : 0.3,
              }}
              style={{
                height: '6px',
                borderRadius: '3px',
                background: i === currentIndex
                  ? '#C026D3'
                  : '#606080',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={currentIndex === cards.length - 1}
          style={{
            background: currentIndex === cards.length - 1
              ? '#1E1E3A'
              : 'linear-gradient(135deg, #7B2FBE, #C026D3)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            color: '#ffffff',
            fontSize: '13px',
            cursor: currentIndex === cards.length - 1
              ? 'not-allowed'
              : 'pointer',
            opacity: currentIndex === cards.length - 1
              ? 0.4 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
