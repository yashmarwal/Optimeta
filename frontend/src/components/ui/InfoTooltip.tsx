'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const DEFINITIONS: Record<string, string> = {
  'TOFU': 'Top of Funnel — People who have never heard of your brand. Cold audience. Goal: awareness and reach.',
  'MOFU': 'Middle of Funnel — People who know your brand but haven\'t bought yet. Warm audience. Goal: consideration.',
  'BOFU': 'Bottom of Funnel — People ready to buy. Hot audience. Goal: conversion and purchase.',
  'ROAS': 'Return on Ad Spend — Revenue earned per ₹1 spent. ROAS of 3x = ₹3 earned for every ₹1 spent on ads.',
  'CTR': 'Click Through Rate — % of people who clicked your ad after seeing it. Higher CTR = more relevant ad.',
  'CPM': 'Cost Per 1000 Impressions — How much you pay for 1000 people to see your ad.',
  'CPC': 'Cost Per Click — Amount you pay each time someone clicks your ad.',
  'CPA': 'Cost Per Acquisition — Amount you pay to get one customer or conversion.',
  'CPL': 'Cost Per Lead — Amount you pay to get one person to contact you or fill a form.',
  'Advantage+': 'Meta\'s AI targeting system. Instead of manual audience selection, Meta\'s AI automatically finds the best buyers for you.',
  'Advantage+ Shopping': 'Meta\'s smartest campaign type. AI handles audience, budget and delivery automatically. Best for D2C brands.',
  'Lookalike Audience': 'New audience Meta creates that resembles your existing customers. Upload 1000 buyers, Meta finds millions of similar people.',
  'Retargeting': 'Showing ads to people who visited your website or engaged with your brand but didn\'t purchase yet.',
  'Engaged Shoppers': 'Meta behavior: people who clicked "Shop Now" on Facebook ads in the last 7 days. Very high purchase intent.',
  'CAPI': 'Conversions API — Server-side tracking by Meta. Accurately tracks purchases even when iOS privacy settings block pixel.',
  'Learning Phase': 'First 7-14 days when Meta\'s AI tests audiences and creatives. Do NOT edit campaigns during this — it resets the learning.',
  'Cold Audience': 'People who have never interacted with your brand. Needs more convincing. Use awareness-focused ads.',
  'Warm Audience': 'People who visited your website or engaged with content. More likely to buy than cold audiences.',
  'Hot Audience': 'People who added to cart or are past customers. Highest purchase intent. Best for retargeting campaigns.',
  'ASC': 'Advantage+ Shopping Campaign — Meta\'s most automated D2C campaign. Combines prospecting and retargeting in one.',
  'Full Funnel': 'Running ads for all stages (awareness + consideration + conversion) simultaneously to capture buyers at every stage.',
  'Creative Fatigue': 'When audience has seen your ad too many times — CTR drops, costs rise. Fix: refresh creatives every 3-4 weeks.',
  'UGC': 'User Generated Content — Videos or photos by real customers in natural style. Performs 3-5x better than studio content.',
  'Break Even ROAS': 'Minimum ROAS needed to cover costs. If product costs ₹200 and sells for ₹500, break even ROAS = 500/300 = 1.67x.',
};

interface InfoTooltipProps {
  term: string;
  className?: string;
}

export function InfoTooltip({ term, className = '' }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const definition = DEFINITIONS[term];

  if (!definition) return null;

  const showTooltip = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const halfWidth = 128;
    const left = Math.min(
      Math.max(halfWidth + 8, rect.left + rect.width / 2),
      window.innerWidth - halfWidth - 8
    );
    setCoords({ top: rect.top - 8, left });
    setVisible(true);
  };

  const hideTooltip = () => setVisible(false);

  return (
    <>
      <button
        ref={btnRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={() => (visible ? hideTooltip() : showTooltip())}
        className={`
          inline-flex items-center justify-center
          w-[18px] h-[18px] rounded-full
          bg-[#7B2FBE]/15 border border-[#7B2FBE]/30
          text-[#7B2FBE] text-[10px] font-bold
          leading-none align-middle ml-1
          cursor-pointer flex-shrink-0
          hover:bg-[#7B2FBE]/30 hover:border-[#7B2FBE]/60 hover:scale-110
          active:scale-95 transition-all duration-150
          focus:outline-none focus:ring-1 focus:ring-[#7B2FBE]/50
          ${className}
        `}
        aria-label={`What is ${term}?`}
        type="button"
      >
        i
      </button>

      {visible && createPortal(
        <div
          className="fixed pointer-events-none"
          style={{
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 99999,
          }}
        >
          <div className="relative bg-[#0F0F1A] border border-[#7B2FBE]/50 rounded-xl px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(123,47,190,0.2)] w-64 backdrop-blur-md mb-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C026D3] flex-shrink-0" />
              <span className="text-[#C026D3] font-bold text-xs tracking-wide">{term}</span>
            </div>
            <p className="text-[#A0A0C0] text-xs leading-relaxed">{definition}</p>
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0F0F1A] border-r border-b border-[#7B2FBE]/50 rotate-45" />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
