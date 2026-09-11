import React, { memo } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZES = {
  sm: { icon: 28, text: 'text-base', gap: 'gap-2', rounded: 'rounded-lg' },
  md: { icon: 36, text: 'text-xl', gap: 'gap-2.5', rounded: 'rounded-xl' },
  lg: { icon: 48, text: 'text-2xl', gap: 'gap-3', rounded: 'rounded-2xl' },
  xl: { icon: 64, text: 'text-3xl', gap: 'gap-4', rounded: 'rounded-2xl' },
} as const;

export const Logo = memo(function Logo({
  size = 'md',
  variant = 'dark',
  showText = true,
  className = '',
  onClick,
}: LogoProps) {
  const s = SIZES[size];

  // Koulè tèks la selon variant ou chwazi a
  const textColor = 
    variant === 'white' 
      ? 'text-white' 
      : variant === 'light' 
      ? 'text-slate-100' 
      : 'text-navy'; // 'dark'

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${s.gap} ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
    >
      {/* Badge Ikòn */}
      <div
        style={{ width: s.icon, height: s.icon }}
        className={`bg-brand flex items-center justify-center shrink-0 shadow-lg shadow-brand/20 ${s.rounded}`}
      >
        <svg
          width={s.icon * 0.58}
          height={s.icon * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Silwèt Kamyonet Livrezon */}
          <path
            d="M1 10V16C1 16.55 1.45 17 2 17H3C3 18.66 4.34 20 6 20C7.66 20 9 18.66 9 17H15C15 18.66 16.34 20 18 20C19.66 20 21 18.66 21 17H22C22.55 17 23 16.55 23 16V13L20 8H16V4H2C1.45 4 1 4.45 1 5V10Z"
            fill="white"
            opacity="0.95"
          />
          <circle cx="6" cy="17.5" r="1.8" fill="#FF6B00" />
          <circle cx="18" cy="17.5" r="1.8" fill="#FF6B00" />
          <path d="M16 9H19.5L22 13H16V9Z" fill="#FF6B00" opacity="0.8" />
        </svg>
      </div>

      {/* Tèks Logo */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-extrabold tracking-tight ${s.text} ${textColor}`}
          >
            Livrez-Nou
          </span>
        </div>
      )}
    </div>
  );
});

export default Logo;