import { useState, useEffect } from 'react';
import { Screen, ServiceType, SERVICE_ICONS, User, Order } from '../types';
import { StatusBadge, CategoryBadge } from '../components/Badge';
import BottomNav from '../components/BottomNav';
import type { ActiveOrder } from '../App';
import { storageService } from '../services/storageService';

interface Props {
  navigate: (s: Screen) => void;
  activeOrder?: ActiveOrder | null;
}

const services: ServiceType[] = ['Pakè', 'Manje', 'Acha', 'Dokiman', 'Rad', 'Biznis'];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjou';
  if (h < 18) return 'Bonswa';
  return 'Bonswa';
};

const QUICK_ADDRESSES = [
  { label: 'Kay', icon: '🏠', addr: 'Pétion-Ville, Rue Grégoire 45' },
  { label: 'Biwo', icon: '🏢', addr: 'Champs de Mars, PAP' },
  { label: 'Manman', icon: '👤', addr: 'Delmas 32, Impasse Fleur 12' },
];

export default function ClientHome({ navigate, activeOrder }: Props) {
  // Li done dinamik an tan reyèl nan storageService
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getUser());
  const [userOrders, setUserOrders] = useState<Order[]>(() => storageService.getOrders());

  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  useEffect(() => {
    setCurrentUser(storageService.getUser());
    setUserOrders(storageService.getOrders());
  }, []);

  const recentOrders = userOrders.filter(o => o.status === 'delivered').slice(0, 2);
  const unreadNotifs = 3;

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden select-none">

      {/* ── Panel Notifikasyon Modèn (Overlay ak Flou) ── */}
      {showNotifPanel && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-start transition-all">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowNotifPanel(false)} 
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-b-3xl shadow-2xl z-10 max-h-[80%] flex flex-col overflow-hidden border-t border-slate-100">
            <div className="bg-navy px-6 pt-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-black text-white text-lg">Notifikasyon</h3>
                {unreadNotifs > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand text-white text-[10px] font-bold">
                    {unreadNotifs} nouvo
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowNotifPanel(false)} 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6L18 18" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5">
              {[
                { icon: '🏍️', title: 'Livreur aksepte kòmand ou', sub: 'Rodrigue Charles ap vini pran pakè ou', time: '2 min', unread: true },
                { icon: '📦', title: 'Pakè pran', sub: 'Livreur ou pran pakè a nan Pétion-Ville', time: '15 min', unread: true },
                { icon: '🎉', title: 'Premye livrezon GRATIS!', sub: 'Itilize kòd BYENVENI pou 1ère livrezon ou', time: '1j', unread: true },
                { icon: '⭐', title: 'Note livreur ou', sub: 'Kòmand LN-2024-0842 livreye. Ba livreur yon nòt!', time: '3j', unread: false },
                { icon: '💳', title: 'Bours rechaje', sub: '5,000 HTG ajoute nan bours ou', time: '5j', unread: false },
              ].map((n, i) => (
                <div 
                  key={i} 
                  className={`flex gap-3.5 p-3.5 rounded-2xl transition-all ${
                    n.unread ? 'bg-orange-50/60 border border-orange-100' : 'bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl shrink-0 shadow-sm border border-slate-100">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-navy text-xs sm:text-sm">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug truncate">{n.sub}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 mt-0.5">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Top Header Modèn ── */}
      <div className="bg-navy px-6 pt-12 pb-6 relative overflow-hidden shrink-0 shadow-md">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full border-2 border-brand object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-navy" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-display">{greeting()} 👋</p>
              <p className="text-white font-display font-black text-lg leading-tight">
                {currentUser.name.split(' ')[0]}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNotifPanel(true)}
            className="relative w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center border border-white/10 backdrop-blur-md"
            aria-label="Notifikasyon"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadNotifs > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand ring-4 ring-navy animate-pulse" />
            )}
          </button>
        </div>

        {/* Kat Bours Dijital (Digital Wallet Card) */}
        <div className="mt-5 rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#1E293B] to-[#0F172A] p-5 relative overflow-hidden border border-white/15 shadow-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-brand/20 blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-white/50 text-[10px] font-display font-bold tracking-widest uppercase block">
                Bours Dijital
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-white font-display font-black text-3xl tracking-tight">
                  {currentUser.balance.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-brand">HTG</span>
              </div>
              <p className="text-white/40 text-[11px] mt-0.5 font-display">
                ≈ {(currentUser.balance / 131).toFixed(0)} USD
              </p>
            </div>

            <button 
              onClick={() => navigate('profile')}
              className="px-4 py-2.5 rounded-2xl bg-brand hover:bg-brand/90 active:scale-95 text-white font-display text-xs font-bold shadow-lg shadow-brand/30 transition-all flex items-center gap-1.5"
            >
              <span>+</span> Rechaje
            </button>
          </div>
        </div>
      </div>

      {/* ── Kontni sou Paj la (Scrollable Body) ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-28 space-y-6 pt-5">

        {/* Livrezon an kou Banner (Active Order Banner) */}
        {activeOrder && (
          <div className="px-5">
            <button
              onClick={() => navigate('delivery-tracking')}
              className="w-full rounded-3xl p-4 bg-gradient-to-r from-navy to-slate-800 text-white shadow-xl shadow-navy/20 border border-slate-700 active:scale-[0.98] transition-all text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Livrezon an kou
                  </span>
                </div>
                <span className="text-white/40 text-xs font-mono">{activeOrder.orderId}</span>
              </div>

              <div className="pt-3 flex items-center gap-3.5">
                <img
                  src={activeOrder.driverPhoto}
                  alt={activeOrder.driverName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand/50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{activeOrder.driverName}</p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">
                    An wout ➔ <span className="text-white">{activeOrder.deliveryAddress}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-brand font-black text-sm block">~{activeOrder.estimatedMin} min</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Swiv ➔</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* BOUTON LANCE LIVREZON (CTA Prensipal) */}
        <div className="px-5">
          <button
            onClick={() => navigate('new-delivery')}
            className="w-full h-16 rounded-3xl text-white font-display font-black text-lg shadow-xl shadow-brand/30 active:scale-[0.98] transition-all flex items-center justify-between px-6 bg-gradient-to-r from-brand to-orange-500 hover:brightness-105"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span>LIVRE YON PAKÈ KOUNYE A</span>
            </div>
            <span className="text-xl">➔</span>
          </button>
        </div>

        {/* Kategori Sèvis Yo */}
        <div>
          <div className="px-5 flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-navy text-sm tracking-wide">Sèvis disponib</h2>
            <span className="text-xs text-slate-400 font-medium">Chwazi yon opsyon</span>
          </div>
          <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide py-1">
            {services.map(s => (
              <div key={s} className="shrink-0 w-20">
                <CategoryBadge
                  label={s}
                  icon={SERVICE_ICONS[s]}
                  active={activeService === s}
                  onClick={() => {
                    setActiveService(prev => prev === s ? null : s);
                    navigate('new-delivery');
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chan Antre Adrès (Quick Location Box) */}
        <div className="mx-5 bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Kote w ap voye pakè a?
          </p>

          <div className="space-y-2">
            {/* Depa */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-brand focus-within:bg-white transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-100" />
              <input
                placeholder="Kote pran pakè a..."
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                className="flex-1 text-xs sm:text-sm text-navy font-medium placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              {pickup && (
                <button onClick={() => setPickup('')} className="text-slate-400 text-xs px-1">✕</button>
              )}
            </div>

            {/* Destinasyon */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-brand focus-within:bg-white transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-brand shrink-0 ring-4 ring-orange-100" />
              <input
                placeholder="Destinasyon pakè a..."
                value={delivery}
                onChange={e => setDelivery(e.target.value)}
                className="flex-1 text-xs sm:text-sm text-navy font-medium placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              {delivery && (
                <button onClick={() => setDelivery('')} className="text-slate-400 text-xs px-1">✕</button>
              )}
            </div>
          </div>

          {/* Adrès Rapid yo */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
            {QUICK_ADDRESSES.map(a => (
              <button
                key={a.label}
                type="button"
                onClick={() => setPickup(a.addr)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-semibold shrink-0 transition-colors"
              >
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>

          {(pickup || delivery) && (
            <button
              onClick={() => navigate('new-delivery')}
              className="w-full py-3 rounded-2xl bg-navy text-white text-xs font-bold font-display flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>Kalkile pri livrezon an</span>
              <span className="text-brand">➔</span>
            </button>
          )}
        </div>

        {/* Bannè Pwomosyon modèn */}
        <div className="mx-5">
          <div className="rounded-3xl p-5 bg-gradient-to-r from-navy via-slate-800 to-navy text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 rounded-full bg-brand/20 blur-xl pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="bg-brand/20 text-brand border border-brand/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Pwomosyon
                </span>
                <h3 className="font-display font-black text-lg leading-tight pt-1">
                  Premye livrezon <br />
                  <span className="text-brand">100% GRATIS</span>
                </h3>
                <p className="text-xs text-slate-300 font-mono pt-1">Kòd: <span className="text-white font-bold">BYENVENI</span></p>
              </div>
              <div className="text-5xl shrink-0">🎁</div>
            </div>
          </div>
        </div>

        {/* Dènye Livrezon Yo */}
        {recentOrders.length > 0 && (
          <div className="px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-navy text-sm">Dènye livrezon</p>
              <button 
                onClick={() => navigate('delivery-history')} 
                className="text-brand text-xs font-bold font-display hover:underline"
              >
                Wè tout ➔
              </button>
            </div>
            
            <div className="space-y-2.5">
              {recentOrders.map(order => (
                <button
                  key={order.id}
                  onClick={() => navigate('delivery-history')}
                  className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center gap-3.5 active:bg-slate-50 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-2xl">
                    {SERVICE_ICONS[order.serviceType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-navy font-bold font-display text-xs sm:text-sm truncate">
                      {order.deliveryAddress}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-slate-400 text-xs">
                      <span>{order.serviceType}</span>
                      <span>•</span>
                      <span className="text-navy font-bold">{order.total.toLocaleString()} HTG</span>
                    </div>
                  </div>
                  <StatusBadge status={order.status} size="sm" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Statisik Rapid yo */}
        <div className="mx-5 grid grid-cols-3 gap-3">
          {[
            { icon: '📦', value: String(userOrders.length || 12), label: 'Livrezon' },
            { icon: '⭐', value: '4.9', label: 'Nòt Kliyan' },
            { icon: '🎯', value: '98%', label: 'Siksè' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 text-center">
              <span className="text-xl block mb-1">{stat.icon}</span>
              <p className="font-display font-black text-navy text-base leading-none">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Ba Navigasyon anba an */}
      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}