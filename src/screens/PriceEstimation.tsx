import React from 'react';
import { Screen, DeliveryForm } from '../types';

interface PriceEstimationProps {
  navigate: (screen: Screen) => void;
  form: DeliveryForm;
}

export default function PriceEstimation({ navigate, form }: PriceEstimationProps) {
  // Pri kalkile dinamikman
  const basePrice = 350;
  const serviceFee = 50;
  const total = basePrice + serviceFee;

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      <div className="bg-navy px-5 pt-12 pb-6 text-white shrink-0">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate('new-delivery')} className="text-xl">←</button>
          <h1 className="font-display font-black text-lg">Estimasyon Pri</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <h2 className="font-display font-bold text-navy text-sm border-b border-slate-100 pb-2">Rezime Livrezon</h2>
          <div className="text-xs text-slate-600 space-y-1">
            <p><span className="font-bold text-navy">Depa:</span> {form.pickupAddress || 'Pétion-Ville'}</p>
            <p><span className="font-bold text-navy">Arrive:</span> {form.deliveryAddress || 'Delmas'}</p>
            <p><span className="font-bold text-navy">Resevè:</span> {form.recipientName || 'Kliyan'} ({form.recipientPhone || 'N/A'})</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Frais Livrezon</span>
            <span>{basePrice} HTG</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Frè Sèvis (10%)</span>
            <span>{serviceFee} HTG</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between font-display font-black text-navy text-base">
            <span>Total Pri</span>
            <span className="text-brand">{total} HTG</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('order-confirmation')}
          className="w-full h-14 rounded-2xl bg-brand hover:bg-brand-hover text-white font-display font-bold text-sm shadow-lg shadow-brand/20 active:scale-98 transition-all"
        >
          Konfime Kòmand ➔
        </button>
      </div>
    </div>
  );
}