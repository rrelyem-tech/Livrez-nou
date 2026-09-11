import React, { useState, useEffect, useRef } from 'react';
import { Screen, User } from '../types';
import BottomNav from '../components/BottomNav';
import { useLanguage, Language } from '../context/LanguageContext';
import { storageService } from '../services/storageService';

interface Props {
  navigate: (s: Screen) => void;
}

export default function ProfileScreen({ navigate }: Props) {
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getUser());

  // Modals state
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Ref pou input fichye (File Upload)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [topUpAmount, setTopUpAmount] = useState<string>('500');
  const [topUpMethod, setTopUpMethod] = useState<'moncash' | 'natcash'>('moncash');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser.phone || '');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>(currentUser.photo || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(storageService.getUser());
  }, []);

  const getLanguageLabel = (code: Language) => {
    switch (code) {
      case 'fr': return 'Français 🇫🇷';
      case 'en': return 'English 🇺🇸';
      default: return 'Kreyòl Ayisyen 🇭🇹';
    }
  };

  // Traite kliche / chwa foto nan galri aparèy la
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Konvèti foto an Base64 pou ka sove l an tan reyèl nan localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Traite rechajman bous la
  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);

    if (isNaN(amount) || amount < 50) {
      alert('Tanpri antre yon montan ki pi gwo oswa egal ak 50 HTG.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newBalance = currentUser.balance + amount;
      const updatedUser = storageService.updateBalance(newBalance);

      setCurrentUser(updatedUser);
      setIsProcessing(false);
      setShowTopUpModal(false);

      setSuccessMessage(`Ou rechaje bous ou ak ${amount.toLocaleString()} HTG via ${topUpMethod === 'moncash' ? 'MonCash' : 'Natcash'}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1200);
  };

  // Traite chanjman foto pwofil la ak sovgad nan StorageService
  const handlePhotoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const updatedUser = storageService.updateUserProfilePhoto(newPhotoUrl);
    setCurrentUser(updatedUser);
    setShowPhotoModal(false);
    setSuccessMessage('Foto pwofil ou mete ajou ak siksè!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  ];

  const sections = [
    {
      title: 'Peman & Bous Dijital',
      items: [
        {
          icon: '💳',
          label: 'Bours Livrez-Nou',
          value: `${currentUser.balance.toLocaleString()} HTG`,
          action: () => setShowTopUpModal(true),
          badge: '+ Rechaje'
        },
        { icon: '🏦', label: 'Mwayen peman sipòte', value: 'MonCash, Natcash, Kach' },
      ],
    },
    {
      title: 'Kont mwen',
      items: [
        { icon: '👤', label: 'Non konplè', value: currentUser.name },
        { icon: '📞', label: 'Telefòn', value: currentUser.phone },
        { icon: '📧', label: 'Imel', value: currentUser.email || 'Pa gen imel' },
      ],
    },
    {
      title: 'Preferans',
      items: [
        { icon: '🔔', label: 'Notifikasyon', value: 'Aktive (Push & SMS)' },
        {
          icon: '🌐',
          label: 'Lang aplikasyon',
          value: getLanguageLabel(language),
          action: () => setShowLanguageModal(true)
        },
      ],
    },
    {
      title: 'Sipò ak Enfòmasyon',
      items: [
        { icon: '🆘', label: 'Èd ak sipò', value: 'Sèvis Kliyan 24/7' },
        { icon: '🔒', label: 'Politik konfidansyalite', value: 'Proteksyon done' },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none relative">

      {/* Mesaj siksè flotan */}
      {successMessage && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl text-xs font-bold text-center animate-bounce">
          ✓ {successMessage}
        </div>
      )}

      {/* ── Top Header Pwofil ── */}
      <div className="bg-navy px-5 pt-12 pb-10 relative overflow-hidden shrink-0 shadow-md">
        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-brand/10 blur-xl pointer-events-none" />

        <div className="flex flex-col items-center relative z-10 text-center">
          <div className="relative">
            <img
              src={currentUser.photo}
              alt={currentUser.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white/10 shadow-lg"
            />
            {/* Bouton Chanje Foto */}
            <button
              type="button"
              onClick={() => setShowPhotoModal(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center shadow-md border-2 border-navy text-xs font-bold active:scale-90 transition-transform"
            >
              ✏️
            </button>
          </div>

          <h1 className="font-display font-black text-white text-xl mt-3 leading-tight">
            {currentUser.name}
          </h1>
          <p className="text-white/60 text-xs mt-0.5 font-mono">{currentUser.phone}</p>

          <span className="mt-2 px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-brand text-[10px] font-extrabold uppercase font-display tracking-wider">
            {currentUser.role === 'driver' ? 'Livreur Verifye 🏍️' : 'Kliyan Verifye ✓'}
          </span>
        </div>
      </div>

      {/* ── Bwat Statisik & Solde Flotan ── */}
      <div className="mx-5 -mt-6 bg-white rounded-3xl shadow-lg shadow-navy/5 border border-slate-100 p-4 flex items-center justify-between relative z-20 shrink-0">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Solde Bous Dijital</p>
          <p className="font-display font-black text-navy text-xl sm:text-2xl mt-0.5">
            {currentUser.balance.toLocaleString()} <span className="text-xs text-brand font-bold">HTG</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTopUpModal(true)}
          className="h-10 px-4 rounded-2xl bg-brand text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand/20 active:scale-95 transition-all"
        >
          <span>+</span>
          <span>Rechaje</span>
        </button>
      </div>

      {/* ── Lis Seksyon Yo ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-6 pb-28 space-y-5">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-[10px] font-extrabold text-slate-400 font-display uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {section.items.map((item, idx) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 active:bg-slate-50 transition-colors text-left ${
                    idx < section.items.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-lg shrink-0 border border-slate-100">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-navy text-xs sm:text-sm">{item.label}</p>
                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{item.value}</p>
                  </div>
                  {item.badge ? (
                    <span className="px-2.5 py-1 rounded-full bg-orange-100 text-brand text-[10px] font-extrabold font-display">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">➔</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Bouton Dekonekte */}
        <button
          type="button"
          onClick={() => navigate('auth')}
          className="w-full h-12 rounded-2xl border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-50 font-display font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>Dekonekte nan kont sa a</span>
        </button>
      </div>

      {/* ── MODAL CHANJE FOTO PWOFIL (FILE UPLOAD & AVATAR) ── */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-navy text-base">Mete ajou foto pwofil</h3>
              <button 
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePhotoUpdate} className="space-y-4">
              
              {/* 1. Bouton Telechaje Foto nan Galri Aparèy la */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider block mb-2">
                  Chwazi yon foto sou aparèy ou
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                    {newPhotoUrl ? (
                      <img src={newPhotoUrl} alt="Avanse" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-slate-300">📷</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 px-4 rounded-2xl bg-navy text-white text-xs font-bold font-display hover:bg-navy/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>📁</span>
                    <span>Klike pou w chwazi foto</span>
                  </button>
                </div>
              </div>

              {/* 2. Seleksyon Avatar Rapid */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider block mb-2">
                  Oswa chwazi yon avatar
                </label>
                <div className="flex justify-between gap-2">
                  {AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Avatar"
                      onClick={() => setNewPhotoUrl(url)}
                      className={`w-12 h-12 rounded-2xl object-cover cursor-pointer border-2 transition-all ${
                        newPhotoUrl === url ? 'border-brand scale-105 shadow-md' : 'border-slate-100 opacity-60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 3. Antre Lyen URL (Opsyonèl) */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider block mb-1">
                  Oswa antre yon lyen (URL) foto
                </label>
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-mono text-navy focus:outline-none focus:border-brand"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-brand text-white font-display font-bold text-xs shadow-lg shadow-brand/20 active:scale-98 transition-all"
              >
                Sove foto pwofil la
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL RECHAJE BOUS (TOP-UP) ── */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-navy text-base">Rechaje Bous Dijital</h3>
              <button 
                onClick={() => setShowTopUpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider block mb-1.5">
                  Chwazi Operatè Peman
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTopUpMethod('moncash')}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2 transition-all ${
                      topUpMethod === 'moncash'
                        ? 'border-brand bg-orange-50 text-brand shadow-sm font-bold'
                        : 'border-slate-100 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xl">📱</span>
                    <span className="text-xs font-display">MonCash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTopUpMethod('natcash')}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2 transition-all ${
                      topUpMethod === 'natcash'
                        ? 'border-brand bg-orange-50 text-brand shadow-sm font-bold'
                        : 'border-slate-100 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xl">📲</span>
                    <span className="text-xs font-display">Natcash</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider block mb-1">
                  Nimewo Telefòn {topUpMethod === 'moncash' ? 'Digicel' : 'Natcom'}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+509 XXXX-XXXX"
                  required
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold font-mono text-navy focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider block mb-1">
                  Montan pou Rechaje (HTG)
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Egz: 500"
                  required
                  className="w-full p-3 rounded-2xl border border-slate-200 text-base font-black font-display text-navy focus:outline-none focus:border-brand"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 rounded-2xl bg-brand text-white font-display font-bold text-xs shadow-lg shadow-brand/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Rechajman ankou...</span>
                ) : (
                  <span>Konfime ak Peye {topUpAmount ? `${parseFloat(topUpAmount).toLocaleString()} HTG` : ''}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL SELEKSYON LANG ── */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-navy text-base text-center">
              {t('selectLanguage')}
            </h3>

            <div className="space-y-2">
              {[
                { code: 'ht', label: 'Kreyòl Ayisyen', flag: '🇭🇹' },
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'en', label: 'English', flag: '🇺🇸' },
              ].map(opt => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code as Language);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between font-display text-xs font-bold transition-all ${
                    language === opt.code
                      ? 'border-brand bg-orange-50 text-brand shadow-sm'
                      : 'border-slate-100 bg-slate-50 text-navy hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </span>
                  {language === opt.code && <span>✓</span>}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowLanguageModal(false)}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-navy"
            >
              Fèmen
            </button>
          </div>
        </div>
      )}

      <BottomNav active="profile" navigate={navigate} />
    </div>
  );
}