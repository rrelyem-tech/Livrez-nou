import { useState, useEffect, useRef } from 'react';
import { Screen, OrderStatus, STATUS_LABELS } from '../types';
import { mockDriver } from '../mockData';
import MapView from '../components/MapView';
import type { ActiveOrder } from '../App';

interface Props {
  navigate: (s: Screen) => void;
  activeOrder: ActiveOrder | null;
  onStatusUpdate: (status: OrderStatus) => void;
}

const STATUS_FLOW: OrderStatus[] = ['pending', 'accepted', 'picked_up', 'on_the_way', 'delivered'];

const STATUS_ICONS: Record<OrderStatus, string> = {
  pending: '📤',
  accepted: '🏍️',
  picked_up: '📦',
  on_the_way: '🚀',
  delivered: '✅',
  cancelled: '❌',
};

const STATUS_DESC: Partial<Record<OrderStatus, string>> = {
  pending: 'N ap chèche yon livreur disponib...',
  accepted: 'Livreur la aksepte, l ap deplase ale nan pwen depa a',
  picked_up: 'Livreur a gen pakè a nan men l deja',
  on_the_way: 'Pakè a sou wout pou l rive kote w ye a',
  delivered: 'Pakè a livreye avèk siksè! 🎉',
};

export default function DeliveryTracking({ navigate, activeOrder, onStatusUpdate }: Props) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
    activeOrder?.status ?? 'accepted'
  );
  const [driverProgress, setDriverProgress] = useState(0.05);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statusIdx = STATUS_FLOW.indexOf(currentStatus);

  // Deplasman simule pou chofè a
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDriverProgress(p => Math.min(p + 0.008, 0.98));
      setElapsedSec(s => s + 1);
    }, 300);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Chanjman estati kòmand an fonksyon pwogrè chofè a
  useEffect(() => {
    if (driverProgress > 0.2 && currentStatus === 'accepted') {
      setCurrentStatus('picked_up');
      onStatusUpdate('picked_up');
    } else if (driverProgress > 0.55 && currentStatus === 'picked_up') {
      setCurrentStatus('on_the_way');
      onStatusUpdate('on_the_way');
    } else if (driverProgress >= 0.97 && currentStatus === 'on_the_way') {
      setCurrentStatus('delivered');
      onStatusUpdate('delivered');
      setDelivered(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [driverProgress, currentStatus, onStatusUpdate]);

  const estimatedMin = Math.max(1, (activeOrder?.estimatedMin ?? 18) - Math.floor(elapsedSec / 6));

  // ── Ekran Lè Livrezon Fini (Delivered Overlay) ──
  if (delivered) {
    return (
      <div className="h-full flex flex-col items-center justify-between bg-slate-50 px-6 py-10 text-center select-none overflow-y-auto">
        <div className="my-auto w-full max-w-sm flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl mb-4 shadow-inner animate-bounce">
            🎉
          </div>
          <h2 className="font-display font-black text-navy text-3xl mb-1">Livrezon Fini!</h2>
          <p className="text-slate-500 text-sm mb-2">
            Pakè ou an rive kote <span className="font-bold text-navy">{activeOrder?.deliveryAddress.split(',')[0] ?? 'destinasyon'}</span>.
          </p>
          <p className="text-slate-400 text-xs font-mono mb-6">
            Kòmand ID: <span className="font-bold text-slate-600">{activeOrder?.orderId ?? 'LN-2024-0943'}</span>
          </p>

          {/* Bwat Nòt ak Etwal */}
          <div className="bg-white rounded-3xl p-5 w-full shadow-sm border border-slate-100 mb-6 text-left">
            <p className="font-display font-bold text-navy text-sm text-center mb-3">Kòman sèvis livreur a te ye?</p>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform active:scale-125 focus:outline-none"
                  style={{ color: star <= rating ? '#F59E0B' : '#E2E8F0' }}
                >
                  ★
                </button>
              ))}
            </div>

            {rating > 0 && !ratingSubmitted && (
              <div className="space-y-3 animate-fade-in">
                <textarea
                  rows={2}
                  placeholder="Ekri yon ti kòmantè pou livreur a (opsyonèl)..."
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-navy focus:outline-none focus:border-brand resize-none"
                />
                <button
                  type="button"
                  onClick={() => setRatingSubmitted(true)}
                  className="w-full py-3 rounded-2xl bg-brand text-white font-display font-bold text-xs shadow-lg shadow-brand/25 active:scale-95 transition-all"
                >
                  Voye nòt la
                </button>
              </div>
            )}

            {ratingSubmitted && (
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-center text-xs font-bold font-display">
                ✓ Mèsi pou feedback ou!
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('client-home')}
            className="w-full h-14 rounded-2xl bg-navy text-white font-display font-bold text-sm shadow-xl shadow-navy/20 active:scale-95 transition-all"
          >
            Retounen nan Akèy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      
      {/* ── Top Header ── */}
      <div className="bg-navy px-5 pt-12 pb-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('client-home')}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center border border-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1 className="font-display font-black text-white text-base sm:text-lg leading-tight">Swiv Livrezon</h1>
            <p className="text-white/50 text-xs font-mono">{activeOrder?.orderId ?? 'LN-2024-0943'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-brand/20 border border-brand/30 px-3 py-1.5 rounded-2xl">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-bold text-brand font-display uppercase tracking-wider">
            {STATUS_LABELS[currentStatus]}
          </span>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-28 space-y-4 pt-4">

        {/* Kat la (Map Box) */}
        <div className="mx-5 h-56 rounded-3xl overflow-hidden shadow-md border border-slate-200/80 relative">
          <MapView driverProgress={driverProgress} />
        </div>

        {/* Banm ETA ak Distans */}
        <div className="mx-5 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Tan ki rete</p>
              <p className="font-display font-black text-navy text-2xl tracking-tight">
                {estimatedMin} <span className="text-xs font-bold text-slate-400">minit</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Distans ki rete</p>
              <p className="font-display font-black text-navy text-xl">
                {((1 - driverProgress) * 5.4).toFixed(1)} <span className="text-xs font-bold text-slate-400">km</span>
              </p>
            </div>
          </div>

          {/* Progress Bar dous */}
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-brand to-orange-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${driverProgress * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">{STATUS_DESC[currentStatus]}</p>
        </div>

        {/* Kat Livreur A */}
        <div className="mx-5 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={mockDriver.photo}
                alt={mockDriver.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-navy text-sm truncate">{mockDriver.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                <span className="text-amber-500 font-bold">★ {mockDriver.rating}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{mockDriver.totalDeliveries} livrezon</span>
              </div>
              <p className="text-slate-400 text-xs truncate mt-0.5">{mockDriver.vehicle}</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowContact(v => !v)}
                className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                aria-label="Rele livreur"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => navigate('messages')}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Mesaj livreur"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </div>

          {showContact && (
            <div className="border-t border-slate-100 p-3.5 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telefòn livreur</p>
                <p className="font-bold text-navy text-xs">{mockDriver.phone}</p>
              </div>
              <a
                href={`tel:${mockDriver.phone}`}
                className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold font-display shadow-md shadow-brand/20"
              >
                Rele Kounye a
              </a>
            </div>
          )}
        </div>

        {/* Timeline Etap Yo */}
        <div className="mx-5 bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-display font-bold text-navy text-sm mb-4">Etap Livrezon an</h3>
          <div className="space-y-0">
            {STATUS_FLOW.map((status, idx) => {
              const isDone = idx < statusIdx;
              const isCurrent = idx === statusIdx;

              return (
                <div key={status} className="flex items-stretch gap-3.5">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-600'
                          : isCurrent
                          ? 'bg-brand text-white shadow-lg shadow-brand/30 ring-4 ring-orange-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : STATUS_ICONS[status]}
                    </div>
                    {idx < STATUS_FLOW.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 my-1 min-h-[22px] transition-all duration-300 ${
                          isDone ? 'bg-emerald-500' : 'bg-slate-100'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-4 flex items-start justify-between">
                    <div>
                      <p
                        className={`font-display font-bold text-xs sm:text-sm pt-1.5 ${
                          isCurrent ? 'text-brand' : isDone ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {STATUS_LABELS[status]}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{STATUS_DESC[status]}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detay Kòmand */}
        <div className="mx-5 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 space-y-3">
          <p className="font-display font-bold text-navy text-xs uppercase tracking-wider text-slate-400">Detay Itinerè</p>
          <div className="space-y-2.5">
            <InfoRow icon="🟢" label="Kote pran" value={activeOrder?.pickupAddress ?? 'Pétion-Ville, Rue Grégoire 45'} />
            <InfoRow icon="🔴" label="Kote livreye" value={activeOrder?.deliveryAddress ?? 'Delmas 32, Impasse Fleur 12'} />
            <InfoRow icon="💰" label="Total" value={`${(activeOrder?.total ?? 909).toLocaleString()} HTG`} />
          </div>
        </div>

        {/* Bouton Anile */}
        {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
          <div className="mx-5">
            <button
              type="button"
              onClick={() => navigate('client-home')}
              className="w-full py-3 rounded-2xl border border-red-200 text-red-500 font-display font-bold text-xs hover:bg-red-50 active:scale-95 transition-all"
            >
              Anile Kòmand Sa A
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-sm mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-wider">{label}</p>
        <p className="text-xs font-bold text-navy truncate">{value}</p>
      </div>
    </div>
  );
}