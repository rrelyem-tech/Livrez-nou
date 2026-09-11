import React, { memo } from 'react';
import { Screen, ClientTab } from '../types';

interface BottomNavProps {
  active: ClientTab;
  navigate: (screen: Screen) => void;
  unreadMessagesCount?: number; // Opsyon pou ajoute yon ti badge mesaj
}

interface TabItem {
  id: ClientTab;
  label: string;
  screen: Screen;
  ariaLabel: string;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'Kay', screen: 'client-home', ariaLabel: 'Ale sou paj akèy' },
  { id: 'deliveries', label: 'Livrezon', screen: 'delivery-history', ariaLabel: 'Gade istorik livrezon yo' },
  { id: 'new', label: '', screen: 'new-delivery', ariaLabel: 'Kreye yon nouvo livrezon' },
  { id: 'messages', label: 'Mesaj', screen: 'messages', ariaLabel: 'Gade mesaj ou yo' },
  { id: 'profile', label: 'Profil', screen: 'profile', ariaLabel: 'Gade kont ak profil ou' },
];

export const BottomNav = memo(function BottomNav({ 
  active, 
  navigate,
  unreadMessagesCount = 0
}: BottomNavProps) {
  return (
    <nav 
      aria-label="Navigasyon prensipal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg flex items-center justify-around"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const isCenter = tab.id === 'new';

        if (isCenter) {
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.screen)}
              aria-label={tab.ariaLabel}
              className="relative -top-5 flex items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white shadow-xl shadow-brand/35 hover:bg-brand/90 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 shrink-0"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.screen)}
            aria-label={tab.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex-1 flex flex-col items-center justify-center py-1 min-w-[56px] transition-all duration-150 active:scale-90 focus:outline-none ${
              isActive ? 'text-brand font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            {/* Ikòn yo */}
            <div className="relative">
              <TabIcon id={tab.id} active={isActive} />

              {/* Badge si gen mesaj ki pa li */}
              {tab.id === 'messages' && unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none ring-2 ring-white">
                  {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                </span>
              )}
            </div>

            {/* Etikèt */}
            <span className="text-[10px] font-display tracking-tight leading-none mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
});

// Konpozan pou rann ikòn yo san fann oswa refè tout bagay
function TabIcon({ id, active }: { id: ClientTab; active: boolean }) {
  const activeColor = '#FF6B00';
  const inactiveColor = '#7A8BA6';
  const strokeColor = active ? activeColor : inactiveColor;

  switch (id) {
    case 'home':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
            fill={active ? activeColor : 'none'}
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'deliveries':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            fill={active ? activeColor : 'none'}
            stroke={strokeColor}
            strokeWidth="1.8"
          />
          <path
            d="M7 8H17M7 12H14M7 16H11"
            stroke={active ? 'white' : inactiveColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'messages':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 18 20 18H6L2 22V6C2 4.9 2.9 4 4 4Z"
            fill={active ? activeColor : 'none'}
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'profile':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="8"
            r="4"
            fill={active ? activeColor : 'none'}
            stroke={strokeColor}
            strokeWidth="1.8"
          />
          <path
            d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default BottomNav;