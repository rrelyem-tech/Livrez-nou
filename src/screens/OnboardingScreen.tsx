import React, { useState, useRef } from 'react';
import { Screen } from '../types';

interface Props {
  navigate: (s: Screen) => void;
}

interface Slide {
  illustration: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  badge: string;
}

const slides: Slide[] = [
  {
    badge: 'LIVREZON SOU MEZI',
    color: '#FF6B00',
    title: 'Sa w bezwen, nou livre l.',
    subtitle: 'Livrez-Nou konekte ou ak livreur serye ki ka pote nenpòt bagay ou bezwen, nenpòt ki lè.',
    illustration: (
      <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" fill="none">
        <circle cx="100" cy="90" r="75" fill="#FFF4ED" />
        <rect x="55" y="65" width="90" height="60" rx="14" fill="#0B1F4A" />
        <rect x="65" y="75" width="70" height="40" rx="8" fill="#1E3A8A" />
        <path d="M65 95 L100 115 L135 95" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="83" r="10" fill="#FF6B00" />
        <path d="M96 83 L99 86 L104 80" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="35" y="108" width="24" height="16" rx="5" fill="#FF6B00" />
        <circle cx="47" cy="116" r="4" fill="white" />
      </svg>
    ),
  },
  {
    badge: 'VITÈS AK PRESIZYON',
    color: '#FF6B00',
    title: 'Livrezon rapid & efikas',
    subtitle: 'Jwenn yon livreur nan mwens pase 5 minit epi swiv deplasman pakè ou an tan reyèl sou kat la.',
    illustration: (
      <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" fill="none">
        <circle cx="100" cy="90" r="75" fill="#FFF4ED" />
        <path d="M40 125 C70 90 130 90 160 125" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 6" />
        <circle cx="100" cy="80" r="32" fill="#FF6B00" className="animate-pulse" />
        <path d="M100 60 L106 74 L121 76 L110 87 L113 102 L100 95 L87 102 L90 87 L79 76 L94 74 Z" fill="white" />
        <rect x="135" y="100" width="30" height="18" rx="6" fill="#0B1F4A" />
        <text x="150" y="112" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">5 MIN</text>
      </svg>
    ),
  },
  {
    badge: 'SEKIRITE GARANTI',
    color: '#16A34A',
    title: 'Pakè ou an sekirite',
    subtitle: 'Chak livrezon gen yon kòd konfimasyon ak asirans. Pakè ou ap rive san okenn domaj.',
    illustration: (
      <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" fill="none">
        <circle cx="100" cy="90" r="75" fill="#DCFCE7" />
        <circle cx="100" cy="85" r="38" fill="#16A34A" fillOpacity="0.15" />
        <circle cx="100" cy="85" r="26" fill="#16A34A" />
        <path d="M92 85 L98 91 L109 79" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="65" y="125" width="70" height="20" rx="8" fill="#0B1F4A" />
        <text x="100" y="138" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">GARANTI 100%</text>
      </svg>
    ),
  },
  {
    badge: 'LIVREUR AVALIZE',
    color: '#0B1F4A',
    title: 'Livreur serye & verifye',
    subtitle: 'Tout livreur nou yo pase nan yon pwosesis verifikasyon strik pou ba ou pi bon sèvis la.',
    illustration: (
      <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" fill="none">
        <circle cx="100" cy="90" r="75" fill="#E2E8F0" />
        <circle cx="100" cy="80" r="28" stroke="#FF6B00" strokeWidth="4" fill="#0B1F4A" />
        <path d="M100 66 A 14 14 0 0 1 100 94 A 14 14 0 0 1 100 66 Z" fill="#FF6B00" />
        <g transform="translate(120, 55)">
          <rect width="42" height="24" rx="8" fill="#FF6B00" />
          <text x="21" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="800">4.9 ★</text>
        </g>
      </svg>
    ),
  },
];

export default function OnboardingScreen({ navigate }: Props) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const isLast = current === slides.length - 1;
  const slide = slides[current];

  const handleNext = () => {
    if (isLast) navigate('auth');
    else setCurrent(c => c + 1);
  };

  // Sipò pou glise ak dwèt (Swipe Gestures)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    
    if (distance > 50 && !isLast) {
      setCurrent(c => c + 1); // Swipe goch -> Pwochen
    } else if (distance < -50 && current > 0) {
      setCurrent(c => c - 1); // Swipe dwat -> Anvan
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-full flex flex-col justify-between bg-slate-50 select-none overflow-hidden relative"
    >
      {/* Header Top Bar */}
      <div className="flex justify-between items-center px-6 pt-12 pb-2 z-10">
        <span className="text-xs font-bold font-display px-3 py-1 rounded-full bg-slate-200/60 text-slate-600">
          {current + 1} / {slides.length}
        </span>
        {!isLast && (
          <button
            type="button"
            onClick={() => navigate('auth')}
            className="text-xs font-bold text-slate-400 hover:text-navy font-display uppercase tracking-wider transition-colors"
          >
            Sote
          </button>
        )}
      </div>

      {/* Illustration & Badge */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 my-auto">
        <span className="text-[10px] font-extrabold tracking-widest font-display text-brand bg-orange-50 border border-orange-100 px-3.5 py-1 rounded-full mb-6 uppercase">
          {slide.badge}
        </span>
        
        <div className="w-64 h-64 sm:w-72 sm:h-72 transition-all duration-500 ease-out transform scale-100 hover:scale-105">
          {slide.illustration}
        </div>
      </div>

      {/* Content Text Box */}
      <div className="px-8 space-y-3 text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-black text-navy leading-tight">
          {slide.title}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto">
          {slide.subtitle}
        </p>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 py-6">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Ale nan paj ${i + 1}`}
            className="focus:outline-none"
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-brand' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Action CTA */}
      <div className="px-6 pb-10 space-y-3">
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-14 rounded-2xl bg-brand text-white font-display font-bold text-base shadow-lg shadow-brand/30 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>{isLast ? 'Kòmanse gratis' : 'Kontinye'}</span>
          <span className="text-xl">➔</span>
        </button>

        {isLast && (
          <button
            type="button"
            onClick={() => navigate('auth')}
            className="w-full text-center text-xs font-bold text-navy font-display py-2 hover:underline"
          >
            Ou gentan gen yon kont? <span className="text-brand">Konekte kounye a</span>
          </button>
        )}
      </div>
    </div>
  );
}