'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';

const stats = [
  { value: 1000, prefix: '', suffix: '+', label: 'Campaigns Generated', decimals: 0 },
  { value: 4.2, prefix: '', suffix: 'x', label: 'Avg ROAS Improvement', decimals: 1 },
  { value: 200, prefix: '', suffix: '+', label: 'Indian Brands', decimals: 0 },
  { value: 15, prefix: '', suffix: ' Min', label: 'Avg Setup Time', decimals: 0 },
];

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black gradient-text mb-2">
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={1.5}
                      decimals={stat.decimals}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  ) : (
                    <span>{stat.prefix}0{stat.suffix}</span>
                  )}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
