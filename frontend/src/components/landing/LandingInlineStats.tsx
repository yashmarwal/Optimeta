'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

export default function LandingInlineStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-8 px-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-3xl font-black gradient-text">
            {inView ? <CountUp start={0} end={490} duration={1.8} suffix="M+" /> : '0M+'}
          </p>
          <p className="text-text-muted text-sm mt-1">
            Facebook users in India
            <cite className="block text-xs text-[#606080] mt-1">Source: Meta Q1 2026</cite>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-3xl font-black gradient-text">
            {inView ? (
              <>₹<CountUp start={0} end={60} duration={1.5} />–<CountUp start={0} end={120} duration={1.8} /></>
            ) : '₹0'}
          </p>
          <p className="text-text-muted text-sm mt-1">
            Average CPM in metro cities
            <cite className="block text-xs text-[#606080] mt-1">India Meta Ads Benchmark 2026</cite>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-3xl font-black gradient-text">
            {inView ? <CountUp start={0} end={3.2} duration={1.8} decimals={1} suffix="x" /> : '0x'}
          </p>
          <p className="text-text-muted text-sm mt-1">
            Average ROAS for Indian D2C brands
            <cite className="block text-xs text-[#606080] mt-1">Optimeta Campaign Data 2026</cite>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
