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
  progress,
}: {
  card: Card;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const y = useTransform(
    progress,
    [(index - 1) / total, index / total],
    ['100%', '0%']
  );

  return (
    <motion.div
      style={{
        y: index === 0 ? '0%' : y,
        zIndex: index + 1,
      }}
      className="absolute inset-0 rounded-2xl p-6 bg-[#0F0F1A] border border-[#1E1E3A]"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] flex items-center justify-center mb-4 text-2xl">
        {card.icon}
      </div>

      <h3 className="text-white font-bold text-xl mb-3">{card.title}</h3>

      <p className="text-[#A0A0C0] text-sm leading-relaxed">{card.description}</p>

      <div className="absolute bottom-4 right-4 text-xs text-[#606080]">
        {index + 1}/{total}
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
      ref={containerRef}
      style={{ height: `${cards.length * 80}vh` }}
      className="relative md:hidden"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center px-4 py-8">
        <div className="text-center mb-8">
          {sectionTitle && (
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-[#7B2FBE]/30 border border-[#7B2FBE]/50 px-3 py-1 rounded-full mb-3">
              {sectionTitle}
            </span>
          )}
          <h2 className="text-3xl font-black text-white leading-tight">
            {titleLine1}
            <br />
            <span className="bg-gradient-to-r from-[#7B2FBE] to-[#C026D3] bg-clip-text text-transparent">
              {titleLine2}
            </span>
          </h2>
          {sectionSubtitle && (
            <p className="text-[#A0A0C0] text-sm mt-2 px-4">{sectionSubtitle}</p>
          )}
        </div>

        <div className="relative w-full max-w-sm mx-auto" style={{ height: '280px' }}>
          {cards.map((card, index) => (
            <StackCard
              key={index}
              card={card}
              index={index}
              total={cards.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <p className="text-center text-[#606080] text-xs mt-6">Scroll to see more ↓</p>
      </div>
    </div>
  );
}
