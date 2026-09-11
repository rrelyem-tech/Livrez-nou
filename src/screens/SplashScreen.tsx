import { useEffect } from 'react';
import { Screen } from '../types';

interface Props {
  navigate: (s: Screen) => void;
  // Ou ka pase URL logo a kòm prop oswa sèvi ak yon bwat pa defo
  logoUrl?: string;
}

export default function SplashScreen({ navigate, logoUrl = '/logo.png' }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigate('onboarding'), 3200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-navy select-none">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,107,0,0.18) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 30% 70%, rgba(26,51,102,0.6) 0%, transparent 60%)',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 rounded-full border border-brand/10 pointer-events-none" />

      {/* Main content */}
      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Animated logo container */}
        <div className="anim-scale flex flex-col items-center gap-5">
          
          {/* Icon / Image Logo Box */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl anim-ripple bg-brand/20 pointer-events-none" />
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-brand shadow-2xl shadow-brand/40 flex items-center justify-center relative overflow-hidden p-3 border border-white/20">
              
              {/* Chek si imaj la egziste, sinon montre fallback SVG sèlman si imaj la echwe */}
              <img
                src={logoUrl}
                alt="Logo Livrez-Nou"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Si imaj /logo.png an pa jwenn nan dosye public la, l ap kouvri l ak yon SVG pa defo
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />

              {/* Fallback SVG si pa gen imaj deyò a */}
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" className="hidden">
                <path d="M1 10V16C1 16.55 1.45 17 2 17H3C3 18.66 4.34 20 6 20C7.66 20 9 18.66 9 17H15C15 18.66 16.34 20 18 20C19.66 20 21 18.66 21 17H22C22.55 17 23 16.55 23 16V13L20 8H16V4H2C1.45 4 1 4.45 1 5V10Z" fill="white" />
                <circle cx="6" cy="17.5" r="1.8" fill="#FF6B00" />
                <circle cx="18" cy="17.5" r="1.8" fill="#FF6B00" />
                <path d="M16 9H19.5L22 13H16V9Z" fill="rgba(0,0,0,0.15)" />
              </svg>

            </div>
          </div>

          {/* Brand name */}
          <div className="text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight anim-up delay-2">
              Livrez-Nou
            </h1>
          </div>
        </div>

        {/* Slogan */}
        <div className="anim-fade delay-4 flex items-center gap-3">
          {['FIABLE', 'RAPIDE', 'PRÈS'].map((word, i) => (
            <span key={word} className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-white/80 font-display">
                {word}
              </span>
              {i < 2 && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom loading dots */}
      <div className="absolute bottom-16 flex items-center gap-2 anim-fade delay-5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-brand dot-bounce"
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        ))}
      </div>

      {/* Tagline */}
      <p className="absolute bottom-8 text-white/30 text-[10px] font-display tracking-widest uppercase anim-fade delay-6">
        HAÏTI • LIVREZON
      </p>
    </div>
  );
}