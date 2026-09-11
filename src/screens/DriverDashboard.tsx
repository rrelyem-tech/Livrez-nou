import { useState, useEffect, useMemo } from 'react';
import { Screen, OrderStatus } from '../types';
import { mockDriver, mockAvailableOrders, driverEarningsHistory } from '../mockData';

interface Props {
  navigate: (s: Screen) => void;
}

const DRIVER_STATUS_FLOW: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
  { status: 'accepted', label: 'Mwen rive', icon: '📍', desc: 'Mwen rive nan adrès pran an' },
  { status: 'picked_up', label: 'Pakè pran', icon: '📦', desc: 'Mwen pran pakè a, ap pati' },
  { status: 'on_the_way', label: 'An route', icon: '🚀', desc: 'Mwen an route pou livrezon' },
  { status: 'delivered', label: 'Livrez', icon: '✅', desc: 'Pakè livreye avèk siksè!' },
];

export default function DriverDashboard({ navigate }: Props) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'earnings' | 'profile'>('orders');
  const [currentStatusIdx, setCurrentStatusIdx] = useState<number | null>(null);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [showCompletedBanner, setShowCompletedBanner] = useState(false);

  const currentOrder = useMemo(
    () => mockAvailableOrders.find(o => o.id === acceptedId),
    [acceptedId]
  );

  const available = useMemo(
    () => mockAvailableOrders.filter(o => o.id !== acceptedId && !dismissed.has(o.id)),
    [acceptedId, dismissed]
  );

  const maxEarn = useMemo(
    () => Math.max(...driverEarningsHistory.map(d => d.amount)),
    []
  );

  // Timer pou kòmand aktyèl la
  useEffect(() => {
    if (currentStatusIdx === null) return;
    const t = setInterval(() => setElapsedSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [currentStatusIdx]);

  const handleAccept = (id: string) => {
    setAcceptedId(id);
    setCurrentStatusIdx(0);
    setElapsedSec(0);
  };

  const handleAdvance = () => {
    if (currentStatusIdx === null) return;
    if (currentStatusIdx < DRIVER_STATUS_FLOW.length - 1) {
      setCurrentStatusIdx(i => (i ?? 0) + 1);
    } else {
      setAcceptedId(null);
      setCurrentStatusIdx(null);
      setElapsedSec(0);
      setShowCompletedBanner(true);
      setTimeout(() => setShowCompletedBanner(false), 4000);
    }
  };

  const currentStepInfo = currentStatusIdx !== null ? DRIVER_STATUS_FLOW[currentStatusIdx] : null;
  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      
      {/* ── Top Header Dashboard ── */}
      <div className="bg-navy px-5 pt-12 pb-5 relative overflow-hidden shrink-0 shadow-md">
        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-brand/10 blur-xl pointer-events-none" />

        {/* Profil Livreur */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative">
            <img
              src={mockDriver.photo}
              alt={mockDriver.name}
              className="w-13 h-13 rounded-2xl border-2 border-brand object-cover shadow-sm"
            />
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-navy ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-white/50 text-[10px] font-display font-bold uppercase tracking-wider block">
              Livreur Livrez-Nou
            </span>
            <h1 className="text-white font-display font-black text-base truncate leading-tight">
              {mockDriver.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="text-amber-400 font-bold">★ {mockDriver.rating}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/60 truncate">{mockDriver.vehicle}</span>
            </div>
          </div>

          {/* Switch Onliy / Ofline */}
          <button
            type="button"
            onClick={() => setIsOnline(v => !v)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-display font-bold text-xs transition-all active:scale-95 ${
              isOnline
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/30'
                : 'bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full bg-white ${isOnline ? 'animate-pulse' : 'opacity-40'}`} />
            {isOnline ? 'En ligne' : 'Ofline'}
          </button>
        </div>

        {/* Statisik Gwo Panno */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 relative z-10">
          {[
            { label: 'Jodi a', value: `${mockDriver.earningsToday.toLocaleString()} G` },
            { label: 'Livrezon', value: String(mockDriver.totalDeliveries) },
            { label: 'Nòt', value: `${mockDriver.rating} ★` },
          ].map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10">
              <p className="font-display font-black text-white text-sm sm:text-base">{s.value}</p>
              <p className="text-white/50 text-[10px] font-display uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigasyon Tab (Kòmand, Rèvni, Pwofil) */}
      <div className="flex mx-5 mt-4 bg-white rounded-2xl p-1 shadow-sm border border-slate-100 shrink-0">
        {(
          [
            ['orders', '🚦 Kòmand'],
            ['earnings', '💰 Rèvni'],
            ['profile', '👤 Pwofil'],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === tab
                ? 'bg-navy text-white shadow-md shadow-navy/20'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Kontni Tab Yo */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 pb-28 space-y-4">

        {/* ── 1. KÒMAND TAB ── */}
        {activeTab === 'orders' && (
          <>
            {/* Bannè Livrezon Konplè */}
            {showCompletedBanner && (
              <div className="bg-emerald-500 text-white rounded-3xl p-4 flex items-center gap-3 shadow-xl animate-fade-in">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="font-display font-black text-sm">Livrezon konplè!</p>
                  <p className="text-emerald-100 text-xs mt-0.5">
                    +{currentOrder?.fee ?? 420} HTG ajoute nan bous ou
                  </p>
                </div>
              </div>
            )}

            {/* Ofline State */}
            {!isOnline && (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto">
                  😴
                </div>
                <h3 className="font-display font-black text-navy text-lg">Ou sou mòd Ofline</h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                  Pase En ligne kounye a pou w ka kòmanse resevwa kòmand livrezon yo pres de ou.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOnline(true)}
                  className="px-6 py-3 rounded-2xl bg-brand text-white font-bold font-display text-xs shadow-lg shadow-brand/30 active:scale-95 transition-all"
                >
                  Pase En Ligne
                </button>
              </div>
            )}

            {/* Kòmand ki Aktiv Kounye a */}
            {isOnline && currentOrder && currentStepInfo && (
              <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-brand bg-white">
                <div className="bg-gradient-to-r from-brand to-orange-500 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span className="text-white font-display font-bold text-xs uppercase tracking-wider">
                      Kòmand an kou
                    </span>
                  </div>
                  <span className="text-white/90 text-xs font-mono font-bold bg-black/20 px-2.5 py-1 rounded-full">
                    ⏱ {fmt(elapsedSec)}
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">{currentOrder.id}</span>
                    <span className="font-display font-black text-brand text-xl">
                      {currentOrder.fee.toLocaleString()} HTG
                    </span>
                  </div>

                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <p className="text-xs font-bold text-navy truncate">{currentOrder.pickupAddress}</p>
                    </div>
                    <div className="w-0.5 h-3 bg-slate-200 ml-1" />
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand shrink-0" />
                      <p className="text-xs font-bold text-navy truncate">{currentOrder.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="grid grid-cols-4 gap-1 rounded-2xl p-1 bg-slate-100">
                    {DRIVER_STATUS_FLOW.map((step, i) => {
                      const isDone = i < (currentStatusIdx ?? 0);
                      const isCurr = i === currentStatusIdx;
                      return (
                        <div
                          key={step.status}
                          className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-700'
                              : isCurr
                              ? 'bg-white text-brand shadow-sm font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          <span className="text-base">{step.icon}</span>
                          <span className="text-[9px] font-display mt-0.5">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-2.5">
                    <span className="text-xl">{currentStepInfo.icon}</span>
                    <p className="text-xs font-bold text-brand">{currentStepInfo.desc}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAdvance}
                      className="flex-[2] py-3.5 rounded-2xl bg-brand text-white font-display font-bold text-sm shadow-lg shadow-brand/30 active:scale-95 transition-all"
                    >
                      {currentStepInfo.label} ➔
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-3.5 rounded-2xl bg-navy text-white font-display font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      🗺️ GPS
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lis Kòmand Ki Disponib Yo */}
            {isOnline && available.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-navy text-sm">
                    Kòmand disponib
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand text-white text-xs font-bold">
                    {available.length}
                  </span>
                </div>

                {available.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display font-bold text-navy text-sm">{order.id}</p>
                        <p className="text-xs text-slate-400">{order.clientName} • {order.serviceType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-brand text-xl">{order.fee.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">HTG • {order.distanceKm} km</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <p className="text-xs font-medium text-navy truncate">{order.pickupAddress}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
                        <p className="text-xs font-medium text-navy truncate">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                      <span>⏱️ Est.: <strong className="text-navy">~{Math.round(5 + order.distanceKm * 3)} min</strong></span>
                      <span>📍 Distans: <strong className="text-navy">{order.distanceKm} km</strong></span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDismissed(s => new Set([...s, order.id]))}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 font-display font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                      >
                        Refize
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(order.id)}
                        className="flex-[2] py-3 rounded-2xl bg-brand text-white font-display font-bold text-xs shadow-md shadow-brand/25 active:scale-95 transition-all"
                      >
                        ✓ Aksepte
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ap Tann Kòmand State */}
            {isOnline && available.length === 0 && !currentOrder && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-3xl animate-bounce">
                  🏍️
                </div>
                <h3 className="font-display font-bold text-navy text-base">Ap tann nouvo kòmand...</h3>
                <p className="text-slate-400 text-xs max-w-xs">
                  Rete anliy, sistèm nan ap voye kòmand ki pi prè w yo otomatikman.
                </p>
              </div>
            )}
          </>
        )}

        {/* ── 2. RÈVNI TAB ── */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            <div className="rounded-3xl p-5 bg-gradient-to-br from-navy via-slate-800 to-navy text-white relative overflow-hidden shadow-xl">
              <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full bg-brand/20 blur-xl pointer-events-none" />
              <p className="text-white/50 text-[10px] font-display font-bold uppercase tracking-wider mb-1">
                Rèvni Total Ou
              </p>
              <h2 className="font-display font-black text-white text-3xl sm:text-4xl">
                {mockDriver.earningsTotal.toLocaleString()} <span className="text-brand text-sm">HTG</span>
              </h2>
              <p className="text-white/60 text-xs mt-0.5 font-medium">{mockDriver.totalDeliveries} livrezon fèt</p>

              <div className="grid grid-cols-2 gap-2.5 mt-5">
                <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
                  <p className="font-display font-black text-white text-base">{mockDriver.earningsToday.toLocaleString()} G</p>
                  <p className="text-white/50 text-[10px] font-display uppercase tracking-wider">Jodi a</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
                  <p className="font-display font-black text-white text-base">11,590 G</p>
                  <p className="text-white/50 text-[10px] font-display uppercase tracking-wider">Semèn sa a</p>
                </div>
              </div>
            </div>

            {/* Graf Istorik Rèvni */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-display font-bold text-navy text-xs uppercase tracking-wider mb-4 text-slate-400">
                Rèvni 5 dènye jou yo
              </h3>
              <div className="flex items-end gap-3 h-28 pt-2">
                {driverEarningsHistory.map((day, i) => {
                  const pct = day.amount / maxEarn;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 font-mono">{day.amount.toLocaleString()}</span>
                      <div
                        className={`w-full rounded-t-xl transition-all ${
                          i === 0 ? 'bg-brand shadow-lg shadow-brand/30' : 'bg-navy/80'
                        }`}
                        style={{ height: `${pct * 90}px` }}
                      />
                      <span className="text-[9px] font-bold text-slate-400 font-display">{day.date.slice(0, 5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detay Jou Pa Jou */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-navy text-xs uppercase tracking-wider text-slate-400">
                Detay jou pa jou
              </h3>
              {driverEarningsHistory.map((day, i) => (
                <div key={i} className="bg-white rounded-2xl p-3.5 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shrink-0">
                      {i === 0 ? '📅' : '💰'}
                    </div>
                    <div>
                      <p className="font-display font-bold text-navy text-xs">{day.date}</p>
                      <p className="text-[10px] text-slate-400">{day.trips} livrezon</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-black text-navy text-sm">{day.amount.toLocaleString()} HTG</p>
                    <p className="text-[10px] text-slate-400">~{Math.round(day.amount / day.trips)} / trip</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. PWOFIL TAB ── */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-3">
              <img
                src={mockDriver.photo}
                alt={mockDriver.name}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-100 mx-auto"
              />
              <div>
                <h2 className="font-display font-black text-navy text-lg">{mockDriver.name}</h2>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold mt-0.5">
                  Livreur verifye ✓
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <p className="font-display font-black text-navy text-sm">{mockDriver.totalDeliveries}</p>
                  <p className="text-[10px] text-slate-400">Livrezon</p>
                </div>
                <div>
                  <p className="font-display font-black text-navy text-sm">{mockDriver.rating} ★</p>
                  <p className="text-[10px] text-slate-400">Nòt</p>
                </div>
                <div>
                  <p className="font-display font-black text-navy text-sm">
                    {(mockDriver.earningsTotal / 1000).toFixed(0)}K
                  </p>
                  <p className="text-[10px] text-slate-400">Rèvni</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { icon: '🚗', label: 'Machin mwen', sub: mockDriver.vehicle },
                { icon: '📞', label: 'Nimewo telefòn', sub: mockDriver.phone },
                { icon: '🏦', label: 'Enfòmasyon bank', sub: 'Sogebank — **3421' },
                { icon: '📄', label: 'Dokiman verifikasyon', sub: 'Lisans • Kat idantite • Asirans' },
                { icon: '📊', label: 'Statistik pèfòmans', sub: '98% pousantaj akseptasyon' },
                { icon: '🆘', label: 'Èd ak sipò', sub: 'Sèvis Kliyan 24/7' },
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  className="w-full bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100 active:bg-slate-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-display font-bold text-navy text-xs sm:text-sm">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                  <span className="text-slate-300">➔</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('auth')}
              className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-display font-bold text-xs hover:bg-red-50 active:scale-95 transition-all"
            >
              Dekonekte nan Kont Sa A
            </button>
          </div>
        )}

      </div>
    </div>
  );
}