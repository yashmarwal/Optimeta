'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

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

        {/* Orb */}
        <div className="relative w-14 h-14">
          {/* Rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #7B2FBE, #C026D3, #7B2FBE00, #7B2FBE)',
              padding: '2px',
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
          </motion.div>

          {/* Pulse glow */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(192,38,211,0.35) 0%, transparent 70%)',
            }}
          />

          {/* Counter ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full"
            style={{
              inset: '12%',
              background: 'conic-gradient(from 90deg, #C026D3, transparent, #7B2FBE, transparent)',
              padding: '1px',
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
          </motion.div>

          {/* Core */}
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#0F0F1A] to-[#141428] flex items-center justify-center border border-[#7B2FBE]/20">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 8px rgba(123,47,190,0.5)',
                  '0 0 18px rgba(192,38,211,0.8)',
                  '0 0 8px rgba(123,47,190,0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)' }}
            >
              <span className="text-white font-black text-sm leading-none">O</span>
            </motion.div>
          </div>

          {/* Sparkle */}
          <motion.span
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute -top-0.5 -right-0.5 text-[9px] text-[#C026D3]"
          >
            ✦
          </motion.span>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
