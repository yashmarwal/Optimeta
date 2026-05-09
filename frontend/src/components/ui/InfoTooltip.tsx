'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const DEFINITIONS: Record<string, string> = {
  'TOFU': 'Top of Funnel — People who have never heard of your brand. Cold audience. Focus: awareness and reach.',
  'MOFU': 'Middle of Funnel — People who know your brand but haven\'t bought yet. Warm audience. Focus: consideration and engagement.',
  'BOFU': 'Bottom of Funnel — People who are close to buying. Hot audience. Focus: conversion and purchase.',
  'ROAS': 'Return on Ad Spend — How much revenue you earn for every ₹1 spent on ads. ROAS of 3x means ₹3 earned for every ₹1 spent.',
  'CTR': 'Click Through Rate — Percentage of people who clicked your ad after seeing it. Higher CTR = more relevant ad.',
  'CPM': 'Cost Per 1000 Impressions — How much you pay for 1000 people to see your ad. Lower CPM = cheaper reach.',
  'CPC': 'Cost Per Click — How much you pay each time someone clicks your ad.',
  'CPA': 'Cost Per Acquisition — How much you pay to get one customer or lead.',
  'CPL': 'Cost Per Lead — How much you pay to get one person to fill your form or contact you.',
  'Advantage+': 'Meta\'s AI-powered targeting system. Instead of you manually selecting audiences, Meta\'s algorithm finds the best buyers automatically.',
  'Advantage+ Shopping': 'Meta\'s AI campaign type that automatically finds buyers and optimises budget. Best for D2C brands with pixel installed.',
  'Lookalike Audience': 'A new audience Meta creates that looks similar to your existing customers. If you upload 1000 buyers, Meta finds millions of similar people.',
  'Retargeting': 'Showing ads to people who already visited your website or interacted with your brand but didn\'t buy yet.',
  'Engaged Shoppers': 'A Meta behavior targeting option. These are people who have clicked "Shop Now" on Facebook ads in the last 7 days — high purchase intent.',
  'CAPI': 'Conversions API — A server-side tracking tool by Meta. Helps track purchases accurately even when iOS privacy blocks pixel tracking.',
  'Learning Phase': 'The first 7-14 days when Meta\'s algorithm is testing different audiences and creatives to find what works best. Do NOT edit campaigns during this period.',
  'Cold Audience': 'People who have never interacted with your brand. Requires more convincing. Use awareness and interest-based ads.',
  'Warm Audience': 'People who have visited your website, watched your videos, or engaged with your content. More likely to buy.',
  'Hot Audience': 'People who added to cart, initiated checkout, or are past customers. Highest purchase intent. Best for retargeting.',
  'ASC': 'Advantage+ Shopping Campaign — Meta\'s most automated campaign type. Combines prospecting and retargeting in one campaign.',
  'Full Funnel': 'Running ads for all three stages (TOFU + MOFU + BOFU) simultaneously to capture customers at every stage.',
  'Creative Fatigue': 'When your target audience has seen your ad too many times and stops engaging. CTR drops, costs rise. Fix: refresh creatives every 3-4 weeks.',
  'UGC': 'User Generated Content — Videos or photos created by real customers or creators in a natural, authentic style. Performs 3-5x better than studio content.',
  'Break Even ROAS': 'The minimum ROAS you need to cover your costs. If product costs ₹200 and sells for ₹500, break even ROAS is 500/300 = 1.67x.',
};

interface InfoTooltipProps {
  term: string;
  className?: string;
}

export function InfoTooltip({ term, className = '' }: InfoTooltipProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const definition = DEFINITIONS[term];
  if (!definition) return null;

  const show = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const halfWidth = 128; // half of w-64 (256px)
    const left = Math.min(
      Math.max(halfWidth + 8, rect.left + rect.width / 2),
      window.innerWidth - halfWidth - 8
    );
    setPos({ top: rect.top - 8, left });
  };

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        ref={buttonRef}
        className="
          w-4 h-4 rounded-full
          bg-[#7B2FBE]/20
          border border-[#7B2FBE]/40
          text-[#7B2FBE]
          text-[10px] font-bold
          flex items-center justify-center
          ml-1.5 flex-shrink-0
          hover:bg-[#7B2FBE]/40
          transition-all duration-200
          cursor-pointer
          focus:outline-none
        "
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        onClick={() => (pos ? setPos(null) : show())}
        aria-label={`What is ${term}?`}
      >
        i
      </button>

      {pos && createPortal(
        <span
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 99999,
          }}
          className="w-64 bg-[#0F0F1A] border border-[#7B2FBE]/40 rounded-xl p-3 shadow-[0_0_20px_rgba(123,47,190,0.3)] pointer-events-none"
        >
          <span className="block text-[#7B2FBE] font-bold text-xs mb-1">
            {term}
          </span>
          <span className="block text-[#A0A0C0] text-xs leading-relaxed">
            {definition}
          </span>
          <span className="
            absolute -bottom-1.5
            left-1/2 -translate-x-1/2
            w-3 h-3
            bg-[#0F0F1A]
            border-r border-b
            border-[#7B2FBE]/40
            rotate-45
          " />
        </span>,
        document.body
      )}
    </span>
  );
}
