'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

function CountUp({
  target,
  prefix = '',
  suffix = '',
  duration = 2000,
  start,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  start: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let animFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [start, target, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

function AnimatedBar({
  height,
  color,
  delay,
  start,
}: {
  height: number;
  color: string;
  delay: number;
  start: boolean;
}) {
  return (
    <motion.div
      className="rounded-t-sm w-full"
      style={{ backgroundColor: color }}
      initial={{ height: 0 }}
      animate={start ? { height } : { height: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    />
  );
}

export function HeroDashboardAnimation({ children }: { children?: React.ReactNode }) {
  const [animStart, setAnimStart] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const played = sessionStorage.getItem('hero_animation_played');
    if (played) {
      setAnimStart(true);
      return;
    }
    const timer = setTimeout(() => {
      setAnimStart(true);
      sessionStorage.setItem('hero_animation_played', 'true');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { label: 'Amount Spent', value: 1669, prefix: '₹', suffix: '', color: '#C026D3' },
    { label: 'Impressions', value: 34070, prefix: '', suffix: '', color: '#7B2FBE' },
    { label: 'Reach', value: 17282, prefix: '', suffix: '', color: '#9B3FDA' },
    { label: 'Purchases', value: 297, prefix: '', suffix: '', color: '#C026D3' },
  ];

  const bars = [
    { height: 48, color: '#7B2FBE', delay: 0.2 },
    { height: 72, color: '#9B3FDA', delay: 0.35 },
    { height: 56, color: '#AB49E8', delay: 0.5 },
    { height: 88, color: '#C026D3', delay: 0.65 },
    { height: 64, color: '#7B2FBE', delay: 0.8 },
    { height: 96, color: '#C026D3', delay: 0.95 },
    { height: 80, color: '#9B3FDA', delay: 1.1 },
  ];

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.97 }}
        animate={animStart ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : {}}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="relative"
      >
        <div className="relative">
          {children}

          {/* Animated overlay with metrics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={animStart ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent p-4 rounded-b-2xl"
          >
            <div className="grid grid-cols-4 gap-3 mb-3">
              {metrics.map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={animStart ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="text-sm font-bold" style={{ color: metric.color }}>
                    <CountUp
                      target={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      duration={1800}
                      start={animStart}
                    />
                  </div>
                  <div className="text-[10px] text-[#606080] mt-0.5">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-end gap-1 h-24 px-2">
              {bars.map((bar, i) => (
                <div key={i} className="flex-1 flex items-end h-full">
                  <AnimatedBar height={bar.height} color={bar.color} delay={bar.delay} start={animStart} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={animStart ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#0A0A0F]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#1E1E3A]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-[#A0A0C0]">Live Results</span>
          </motion.div>

          {/* Glowing border */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ boxShadow: '0 0 0px rgba(123,47,190,0)' }}
            animate={animStart ? {
              boxShadow: [
                '0 0 0px rgba(123,47,190,0)',
                '0 0 30px rgba(123,47,190,0.4)',
                '0 0 20px rgba(123,47,190,0.2)',
              ],
            } : {}}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={animStart ? { opacity: 1 } : {}}
        transition={{ delay: 2.0 }}
        className="text-center text-[11px] text-[#606080] mt-3"
      >
        Real results from Optimeta users
      </motion.p>
    </div>
  );
}
