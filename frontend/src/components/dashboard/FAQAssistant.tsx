'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FAQAssistant() {
  const router = useRouter();

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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] shadow-[0_4px_20px_rgba(123,47,190,0.5)] flex items-center justify-center text-white"
        aria-label="Open AI assistant"
      >
        <MessageCircle size={22} />
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] animate-ping opacity-20" />
      </motion.button>
    </AnimatePresence>
  );
}
