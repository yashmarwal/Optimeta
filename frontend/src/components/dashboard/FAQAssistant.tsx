'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

// Exact copy of GalaxyOrb from chat/page.tsx — keep in sync
function GalaxyOrb({
  phase,
  size = 80,
}: {
  phase: 'center' | 'galaxy' | 'expanding';
  size?: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Ring 1 — slow outer */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: phase === 'galaxy' ? 3 : 6,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, #7B2FBE, #C026D3, transparent, #7B2FBE)`,
          padding: '1.5px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
      </motion.div>

      {/* Ring 2 — counter rotate */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: phase === 'galaxy' ? 2 : 4,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute rounded-full"
        style={{
          inset: '10%',
          background: `conic-gradient(from 180deg, #C026D3, transparent, #7B2FBE, transparent)`,
          padding: '1px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
      </motion.div>

      {/* Ring 3 — fast inner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: phase === 'galaxy' ? 1.2 : 2.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute rounded-full"
        style={{
          inset: '22%',
          background: `conic-gradient(from 90deg, #7B2FBE, #C026D300, #C026D3, #7B2FBE00)`,
          padding: '1px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
      </motion.div>

      {/* Orbiting particle dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{
            duration: phase === 'galaxy' ? 1.5 + i * 0.2 : 3 + i * 0.4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.1,
          }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center' }}
        >
          <motion.div
            animate={{
              opacity: phase === 'galaxy' ? [0.4, 1, 0.4] : [0.2, 0.6, 0.2],
              scale: phase === 'galaxy' ? [0.8, 1.3, 0.8] : [0.6, 1, 0.6],
            }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: '4%',
              left: '50%',
              transform: `translateX(-50%) rotate(${deg}deg) translateY(-${size * 0.42}px)`,
              background: i % 2 === 0 ? '#7B2FBE' : '#C026D3',
              boxShadow: `0 0 6px ${i % 2 === 0 ? '#7B2FBE' : '#C026D3'}`,
            }}
          />
        </motion.div>
      ))}

      {/* Pulse glow ring 1 */}
      <motion.div
        animate={{
          scale: phase === 'galaxy' ? [1, 1.8, 1] : [1, 1.3, 1],
          opacity: phase === 'galaxy' ? [0.4, 0, 0.4] : [0.2, 0, 0.2],
        }}
        transition={{ duration: phase === 'galaxy' ? 1 : 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(192,38,211,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Pulse glow ring 2 */}
      <motion.div
        animate={{
          scale: phase === 'galaxy' ? [1, 2.4, 1] : [1, 1.6, 1],
          opacity: phase === 'galaxy' ? [0.3, 0, 0.3] : [0.15, 0, 0.15],
        }}
        transition={{
          duration: phase === 'galaxy' ? 1 : 2,
          delay: 0.4,
          repeat: Infinity,
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(123,47,190,0.3) 0%, transparent 70%)',
        }}
      />

      {/* Center core */}
      <motion.div
        animate={{
          boxShadow:
            phase === 'galaxy'
              ? [
                  '0 0 20px rgba(123,47,190,0.8), 0 0 40px rgba(192,38,211,0.4)',
                  '0 0 40px rgba(192,38,211,1), 0 0 80px rgba(123,47,190,0.6)',
                  '0 0 20px rgba(123,47,190,0.8), 0 0 40px rgba(192,38,211,0.4)',
                ]
              : [
                  '0 0 10px rgba(123,47,190,0.5)',
                  '0 0 20px rgba(192,38,211,0.7)',
                  '0 0 10px rgba(123,47,190,0.5)',
                ],
        }}
        transition={{
          duration: phase === 'galaxy' ? 0.8 : 2,
          repeat: Infinity,
        }}
        className="absolute rounded-full"
        style={{
          inset: '30%',
          background: 'linear-gradient(135deg, #7B2FBE, #C026D3)',
        }}
      />
    </div>
  );
}

export function FAQAssistant() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/dashboard/chat') return null;

  const handleOpenChat = () => {
    sessionStorage.setItem('chat_opening', 'true');
    router.push('/dashboard/chat');
  };

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5 group"
        aria-label="Open Optimeta AI"
      >
        {/* Hover label */}
        <span className="text-[10px] font-semibold text-[#A0A0C0] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0F0F1A]/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#1E1E3A] whitespace-nowrap">
          Optimeta AI
        </span>

        {/* Orb — identical to chat page header */}
        <div className="relative w-14 h-14">
          <GalaxyOrb phase="center" size={56} />
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
