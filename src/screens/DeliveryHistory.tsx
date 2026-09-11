import { useState, useMemo } from 'react';
import { Screen, OrderStatus, SERVICE_ICONS, Order } from '../types';
import { mockOrders } from '../mockData';
import { StatusBadge } from '../components/Badge';
import BottomNav from '../components/BottomNav';

interface Props {
  navigate: (s: Screen) => void;
}

const FILTER_LABELS: [string, string][] = [
  ['all', 'Tout'],
  ['delivered', 'Livrez ✅'],
  ['on_the_way', 'An route 🚀'],
  ['pending', 'An atant ⏳'],
  ['cancelled', 'Anile ❌'],
];

// Sistèm Nòt ak Etwal Modèn
function StarRating({ orderId }: { orderId: string }) {
  const [hovered, setHovered] = useState(0);
  const [rated, setRated] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 mt-3 animate-fade-in">
        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
        <p className="text-xs font-bold font-display">
          Mèsi anpil pou nòt ou! {rated === 5 ? '🌟' : '⭐'}
        </p>
      </div>
    );
  }

  return (
    <div className="pt-3 mt-3 border-t border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-extrabold text-slate-400 font-display uppercase tracking-wider">Note livreur a</p>
        {rated > 0 && (
          <span className="text-xs font-bold text-amber-600 font-display">
            {['', 'Mal 😕', 'Pa bon 😐', 'Bon 🙂', 'Trè bon 😊', 'Ekselan 🌟'][rated]}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRated(star)}
            className="text-2xl transition-transform active:scale-125 focus:outline-none"
            style={{ color: star <= (hovered || rated) ? '#F59E0B' : '#CBD5E1' }}
          >
            ★
          </button>
        ))}
      </div>

      {rated > 0 && (
        <div className="space-y-2 animate-fade-in">
          <textarea
            rows={2}
            placeholder="Ekri yon ti kòmantè sou sèvis la (opsyonèl)..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-navy focus:outline-none focus:border-brand focus:bg-white transition-all resize-none"
          />
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="w-full py-2.5 rounded-xl bg-brand text-white font-display font-bold text-xs shadow-md shadow-brand/20 active:scale-95 transition-transform"
          >
            Voye nòt sa a
          </button>
        </div>
      )}
    </div>
  );
}

// Kat Kòmand Prensipal
function OrderCard({ order, navigate }: { order: Order; navigate: (s: Screen) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left p-4 focus:outline-none"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-2xl shadow-inner">
            {SERVICE_ICONS[order.serviceType]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-400">{order.id}</span>
              <StatusBadge status={order.status} size="sm" />
            </div>

            <p className="font-display font-bold text-navy text-sm truncate leading-snug">
              {order.deliveryAddress}
            </p>

            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <span className="font-black text-navy font-display">{order.total.toLocaleString()} HTG</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 font-medium">
                {new Date(order.createdAt).toLocaleDateString('fr', { day: 'numeric', month: 'short' })}
              </span>
              {order.rating && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-500 font-bold">{'★'.repeat(order.rating)}</span>
                </>
              )}
            </div>
          </div>

          <div className={`w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180 bg-slate-100 text-navy' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </button>

      {/* Detay lè kat la louvri */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/70 space-y-3.5">
          <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xl/5">
            <Detail label="Kote pran" value={order.pickupAddress} />
            <Detail label="Moun k ap resevwa" value={order.recipientName} />
            <Detail label="Distans" value={`${order.distanceKm} km`} />
            <Detail label="Tan estimé" value={`${order.estimatedMinutes} min`} />
            <Detail label="Frè livrezon" value={`${order.deliveryFee.toLocaleString()} HTG`} />
            <Detail label="Frè sèvis" value={`${order.serviceFee.toLocaleString()} HTG`} />
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Total peye</span>
            <span className="font-display font-black text-navy text-base">{order.total.toLocaleString()} HTG</span>
          </div>

          {/* Aksyon sou kòmand la */}
          <div className="flex gap-2 pt-1">
            {order.status === 'on_the_way' && (
              <button
                type="button"
                onClick={() => navigate('delivery-tracking')}
                className="flex-1 py-2.5 rounded-xl bg-navy text-white text-xs font-bold font-display shadow-md shadow-navy/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>🗺️</span> Swiv sou kat
              </button>
            )}
            <button 
              type="button" 
              className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-navy text-xs font-bold font-display border border-slate-200 active:scale-95 transition-all"
            >
              🔄 Refè kòmand
            </button>
            <button 
              type="button" 
              className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-navy text-xs font-bold font-display border border-slate-200 active:scale-95 transition-all"
            >
              📋 Resi
            </button>
          </div>

          {/* Ba Nòt */}
          {order.status === 'delivered' && !order.rating && (
            <StarRating orderId={order.id} />
          )}
        </div>
      )}
    </div>
  );
}

export default function DeliveryHistory({ navigate }: Props) {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockOrders.filter(o => {
      const matchFilter = filter === 'all' || o.status === filter;
      const matchSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.deliveryAddress.toLowerCase().includes(search.toLowerCase()) ||
        o.serviceType.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  const totalSpent = useMemo(() => {
    return mockOrders
      .filter(o => o.status === 'delivered')
      .reduce((s, o) => s + o.total, 0);
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      
      {/* Top Header Modèn */}
      <div className="bg-navy px-5 pt-12 pb-5 shrink-0 shadow-md relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-brand/10 blur-xl pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-4 relative z-10">
          <button
            type="button"
            onClick={() => navigate('client-home')}
            aria-label="Retounen nan akèy"
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center border border-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-display font-black text-white text-xl leading-tight">Istwa Livrezon</h1>
            <p className="text-white/60 text-xs mt-0.5 font-medium">
              {mockOrders.length} kòmand total • <span className="text-brand font-bold">{totalSpent.toLocaleString()} HTG</span> depanse
            </p>
          </div>
        </div>

        {/* Chan Rechèch Modèn */}
        <div className="relative mb-3.5 z-10">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Chèche pa kòd, adrès oswa sèvis..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-9 rounded-2xl bg-white/10 border border-white/15 text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-brand/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Filtè Yo */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 z-10 relative">
          {FILTER_LABELS.map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k as typeof filter)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                filter === k 
                  ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-105' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lis Kòmand Yo */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-28 px-5 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
              📭
            </div>
            <h3 className="font-display font-bold text-navy text-base">Pa gen rezilta</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-[220px]">
              Nou pa jwenn okenn kòmand ki koresponn ak rechèch ou an.
            </p>
            <button
              type="button"
              onClick={() => { setFilter('all'); setSearch(''); }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-navy text-white font-bold font-display text-xs shadow-md active:scale-95 transition-all"
            >
              Efase filtè yo
            </button>
          </div>
        ) : (
          filtered.map(order => (
            <OrderCard key={order.id} order={order} navigate={navigate} />
          ))
        )}
      </div>

      {/* Ba Navigasyon anba an */}
      <BottomNav active="deliveries" navigate={navigate} />
    </div>
  );
}

// Konpozan pou afiche yon lin detay
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-wider">{label}</p>
      <p className="text-xs font-bold text-navy leading-tight mt-0.5 truncate">{value}</p>
    </div>
  );
}