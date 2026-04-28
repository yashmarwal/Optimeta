'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7B2FBE 0%, #C026D3 100%)' }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 text-center px-8 py-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl font-black text-white mb-6"
            >
              Ready to Build Your<br />First Campaign?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-lg mb-10 max-w-xl mx-auto"
            >
              Join 500+ Indian brands who stopped guessing and started winning on Meta.
              Your first campaign blueprint is free.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Link href="/register">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-white text-primary font-bold text-lg px-10 py-4 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Generate Free Campaign
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <p className="text-white/50 text-sm mt-4">No credit card required. 1 free blueprint included.</p>
              <p className="text-white/50 text-sm mt-3">
                Have questions?{' '}
                <a
                  href="mailto:optimeta@outlook.com"
                  className="text-white/80 underline underline-offset-2 hover:text-white transition-colors"
                >
                  Contact us at optimeta@outlook.com
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
