import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7B2FBE',
        accent: '#C026D3',
        'bg-dark': '#0A0A0F',
        'bg-card': '#0F0F1A',
        'bg-card-hover': '#141428',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0C0',
        'text-muted': '#505070',
        'border-color': 'rgba(123,47,190,0.2)',
        'border-glow': 'rgba(123,47,190,0.6)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7B2FBE 0%, #C026D3 100%)',
        'dot-grid': 'radial-gradient(rgba(123,47,190,0.15) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '32px 32px',
      },
      boxShadow: {
        glow: '0 0 30px rgba(123,47,190,0.35), 0 0 60px rgba(192,38,211,0.15)',
        'glow-sm': '0 0 15px rgba(123,47,190,0.25)',
        'glow-lg': '0 0 50px rgba(123,47,190,0.5), 0 0 100px rgba(192,38,211,0.2)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-rotate': 'gradientRotate 3s linear infinite',
        'typewriter': 'typewriter 0.05s steps(1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-8px) rotate(-2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(123,47,190,0.35), 0 0 60px rgba(192,38,211,0.15)' },
          '50%': { boxShadow: '0 0 50px rgba(123,47,190,0.6), 0 0 100px rgba(192,38,211,0.3)' },
        },
        gradientRotate: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
