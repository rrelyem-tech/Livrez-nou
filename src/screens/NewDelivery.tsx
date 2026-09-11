import React, { useState } from 'react';
import { Screen, DeliveryForm } from '../types';

interface NewDeliveryProps {
  navigate: (screen: Screen) => void;
  onSubmit: (form: DeliveryForm) => void;
}

export default function NewDelivery({ navigate, onSubmit }: NewDeliveryProps) {
  const [form, setForm] = useState<DeliveryForm>({
    pickupAddress: '',
    deliveryAddress: '',
    serviceType: 'Pakè',
    description: '',
    recipientName: '',
    recipientPhone: '',
    instructions: '',
    isScheduled: false,
    scheduledTime: '',
    paymentMethod: 'wallet',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pickupAddress || !form.deliveryAddress || !form.recipientName || !form.recipientPhone) {
      alert('Tanpri ranpli tout chan ki obligatwa yo.');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      <div className="bg-navy px-5 pt-12 pb-6 text-white shrink-0">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate('client-home')} className="text-xl">←</button>
          <h1 className="font-display font-black text-lg">Nouvèl Livrezon</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        <div>
          <label className="block text-xs font-bold text-navy mb-1">Adrès Depa (Pickup)</label>
          <input 
            type="text"
            required
            value={form.pickupAddress}
            onChange={e => setForm({...form, pickupAddress: e.target.value})}
            placeholder="Kote pou chofè a pran pakè a"
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-xs text-navy focus:outline-none focus:border-brand bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy mb-1">Adrès Arrive (Delivery)</label>
          <input 
            type="text"
            required
            value={form.deliveryAddress}
            onChange={e => setForm({...form, deliveryAddress: e.target.value})}
            placeholder="Kote pou livrezon an fèt"
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-xs text-navy focus:outline-none focus:border-brand bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Non Moun k ap Resevwa</label>
            <input 
              type="text"
              required
              value={form.recipientName}
              onChange={e => setForm({...form, recipientName: e.target.value})}
              placeholder="Non konplè"
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-xs text-navy focus:outline-none focus:border-brand bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Telefòn Resevè</label>
            <input 
              type="tel"
              required
              value={form.recipientPhone}
              onChange={e => setForm({...form, recipientPhone: e.target.value})}
              placeholder="+509..."
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-xs text-navy focus:outline-none focus:border-brand bg-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy mb-1">Deskripsyon Pakè a</label>
          <textarea 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Kisa k anndan pakè a?"
            className="w-full h-20 p-4 rounded-2xl border border-slate-200 text-xs text-navy focus:outline-none focus:border-brand bg-white resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full h-14 rounded-2xl bg-brand hover:bg-brand-hover text-white font-display font-bold text-sm shadow-lg shadow-brand/20 active:scale-98 transition-all"
        >
          Kalkile Pri Livrezon ➔
        </button>
      </form>
    </div>
  );
}