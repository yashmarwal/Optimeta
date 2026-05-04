'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface Card {
  icon: string;
  title: string;
  description: string;
}

function StackCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: Card;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const cardProgress = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [0, 1]
  );
  const y = useTransform(cardProgress, [0, 1], ['0%', '-110%']);
  const scale = useTransform(cardProgress, [0, 0.5, 1], [1, 0.95, 0.9]);
  const opacity = useTransform(cardProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <motion.div
      style={{ y, scale, opacity }}
      className="absolute inset-0 glass-card p-6 rounded-2xl"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-2xl">
        {card.icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{card.description}</p>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'bg-primary w-4' : 'bg-white/20 w-1.5'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function StickyStackCards({
  cards,
  titleLine1,
  titleLine2,
  sectionTitle,
  sectionSubtitle,
}: {
  cards: Card[];
  titleLine1: string;
  titleLine2: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      className="md:hidden"
      ref={containerRef}
      style={{ height: `${cards.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="text-center mb-8">
          {sectionTitle && (
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
              {sectionTitle}
            </span>
          )}
          <h2 className="text-3xl font-black text-white">
            {titleLine1}{' '}
            <span className="gradient-text">{titleLine2}</span>
          </h2>
          {sectionSubtitle && (
            <p className="text-text-muted text-sm mt-2 max-w-xs mx-auto">{sectionSubtitle}</p>
          )}
        </div>

        <div className="relative w-full max-w-sm h-72">
          {cards.map((card, index) => (
            <StackCard
              key={index}
              card={card}
              index={index}
              total={cards.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        <p className="text-text-muted text-xs mt-6 animate-bounce">Scroll to explore ↓</p>
      </div>
    </div>
  );
}
