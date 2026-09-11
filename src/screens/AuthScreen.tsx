import React, { useState, type ReactNode } from 'react';
import { Screen, UserRole } from '../types';
import Logo from '../components/Logo';
import { storageService } from '../services/storageService';

interface Props {
  navigate: (s: Screen) => void;
  onLogin: (role: UserRole) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthScreen({ navigate, onLogin }: Props) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('client');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasyon Senp
    if (!form.phone) {
      setErrorMsg('Tanpri antre nimewo telefòn ou');
      return;
    }
    if (mode !== 'forgot' && !form.password) {
      setErrorMsg('Tanpri antre modpas ou');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      if (mode === 'login') {
        // Tcheke si nimewo a gen yon kont ki egziste deja
        const user = storageService.loginWithPhone(form.phone);
        
        if (!user) {
          setErrorMsg('Nimewo telefòn sa a pa gen yon kont. Tanpri klike sou "Kreye kont" pou w enskri.');
          setIsLoading(false);
          return;
        }

        // Si kont lan egziste, konekte l
        onLogin(user.role);
        if (user.role === 'driver') {
          navigate('driver-dashboard');
        } else {
          navigate('client-home');
        }
      } else if (mode === 'register') {
        if (!form.name) {
          setErrorMsg('Tanpri antre non konplè ou pou kreye kont la.');
          setIsLoading(false);
          return;
        }

        // Enskri yon nouvo kont
        const newUser = storageService.registerUser(
          form.name,
          form.phone,
          form.email,
          role
        );

        onLogin(newUser.role);
        if (newUser.role === 'driver') {
          navigate('driver-dashboard');
        } else {
          navigate('client-home');
        }
      } else {
        alert('Yon kòd reyinitalizasyon voye sou telefòn ou.');
        setMode('login');
      }
    } catch {
      setErrorMsg('Yon erè rive. Tanpri eseye ankò.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header Fose (Navy) */}
      <div className="bg-navy px-6 pt-12 pb-8 relative overflow-hidden shrink-0">
        <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[30%] w-24 h-24 rounded-full bg-brand/10 pointer-events-none" />
        
        <Logo size="md" variant="white" />

        <div className="mt-6">
          <h1 className="font-display text-3xl font-black text-white leading-tight">
            {mode === 'login' ? 'Konekte' : mode === 'register' ? 'Kreye kont' : 'Reyinitalize modpas'}
          </h1>
          <p className="text-white/70 text-sm mt-1 font-medium">
            {mode === 'login' 
              ? 'Antre enfòmasyon ou pou devamse' 
              : mode === 'register' 
              ? 'Ranpli fòm anba a pou kreye yon kont' 
              : 'N ap voye yon kòd konfimasyon sou telefòn ou'}
          </p>
        </div>
      </div>

      {/* Bouton Chanje mòd (Konekte / Kreye kont) */}
      {mode !== 'forgot' && (
        <div className="flex mx-6 mt-5 bg-slate-100 rounded-2xl p-1 shrink-0">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold font-display transition-all ${
                mode === m ? 'bg-white shadow-sm text-navy' : 'text-slate-500 hover:text-navy'
              }`}
            >
              {m === 'login' ? 'Konekte' : 'Kreye kont'}
            </button>
          ))}
        </div>
      )}

      {/* Fòm Kontni */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
        
        {/* Mesaj Erè */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Seleksyon Wòl (Kliyan / Livreur) */}
        {mode === 'register' && (
          <div>
            <label className="text-[11px] font-bold text-slate-400 font-display tracking-wider uppercase mb-2 block">
              Ou se yon
            </label>
            <div className="flex gap-3">
              {(['client', 'driver'] as UserRole[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition-all ${
                    role === r
                      ? 'border-brand bg-orange-50/50'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl" role="img" aria-label={r}>{r === 'client' ? '🙋' : '🏍️'}</span>
                  <span className={`text-xs font-bold font-display ${role === r ? 'text-brand' : 'text-navy'}`}>
                    {r === 'client' ? 'Kliyan' : 'Livreur'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Non Konplè (sèlman sou Enskripsyon) */}
        {mode === 'register' && (
          <InputField
            label="Non konplè"
            placeholder="Jean-Pierre Estimé"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8BA6" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" strokeLinecap="round" />
              </svg>
            }
          />
        )}

        {/* Nimewo Telefòn */}
        <InputField
          label="Nimewo telefòn"
          placeholder="+509 XXXX-XXXX"
          value={form.phone}
          onChange={v => setForm(f => ({ ...f, phone: v }))}
          type="tel"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8BA6" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />

        {/* Imel (Opsyonèl) */}
        {mode !== 'forgot' && (
          <InputField
            label="Imel (opsyonèl)"
            placeholder="ou@gmail.com"
            value={form.email}
            onChange={v => setForm(f => ({ ...f, email: v }))}
            type="email"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8BA6" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 8L12 13.5L21 8" strokeLinecap="round" />
              </svg>
            }
          />
        )}

        {/* Modpas */}
        {mode !== 'forgot' && (
          <div>
            <label className="text-[11px] font-bold text-slate-400 font-display tracking-wider uppercase mb-1.5 block">
              Modpas
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8BA6" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V11" />
                </svg>
              </div>

              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 karaktè"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-navy font-medium text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors"
              />

              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                aria-label={showPass ? 'Kache modpas' : 'Montre modpas'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {showPass ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12C1.69 10.24 2.81 8.69 4.19 7.46M9.9 4.24C10.59 4.09 11.3 4 12 4C17 4 21.27 7.61 23 12M1 1L23 23" strokeLinecap="round" />
                  ) : (
                    <>
                      <path d="M1 12C2.73 7.61 7 4 12 4C17 4 21.27 7.61 23 12C21.27 16.39 17 20 12 20C7 20 2.73 16.39 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Lyen Bliye Modpas */}
        {mode === 'login' && (
          <button
            type="button"
            onClick={() => { setMode('forgot'); setErrorMsg(''); }}
            className="text-right text-xs font-semibold text-brand font-display -mt-1 hover:underline"
          >
            Bliye modpas ou?
          </button>
        )}

        {/* Bouton Soumèt Prensipal */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-13 rounded-2xl bg-brand text-white font-display font-bold text-base shadow-lg shadow-brand/25 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : mode === 'login' ? (
            'Konekte'
          ) : mode === 'register' ? (
            'Kreye kont'
          ) : (
            'Voye kòd reyinitalizasyon'
          )}
        </button>

        {/* Bouton Retounen nan mòd Bliye Modpas */}
        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => setMode('login')}
            className="text-center text-xs font-semibold text-navy font-display py-2 hover:underline"
          >
            ← Retounen nan paj koneksyon
          </button>
        )}

        {/* Demo Aksè Rapid */}
        <div className="mt-auto pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider mb-2.5 text-center">
              Aksè rapid (Mòd Demo)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  storageService.registerUser('Kliyan Demo', '50937000000', 'demo@livrez-nou.ht', 'client');
                  onLogin('client');
                  navigate('client-home');
                }}
                className="flex-1 py-2 rounded-xl bg-navy text-white text-xs font-bold font-display hover:bg-navy/90 transition-colors"
              >
                Kliyan
              </button>
              <button
                type="button"
                onClick={() => {
                  storageService.registerUser('Chofè Demo', '50938000000', 'driver@livrez-nou.ht', 'driver');
                  onLogin('driver');
                  navigate('driver-dashboard');
                }}
                className="flex-1 py-2 rounded-xl bg-brand text-white text-xs font-bold font-display hover:bg-brand/90 transition-colors"
              >
                Livreur
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon: ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-slate-400 font-display tracking-wider uppercase mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-navy font-medium text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors"
        />
      </div>
    </div>
  );
}