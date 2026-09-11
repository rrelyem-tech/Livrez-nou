import React, { useState, useRef } from 'react';
import { Screen } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  navigate: (s: Screen) => void;
}

export default function DriverOnboarding({ navigate }: Props) {
  const currentUser = storageService.getUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [idCardPhoto, setIdCardPhoto] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('Motosiklèt');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [payoutPhone, setPayoutPhone] = useState<string>(currentUser.phone || '');
  const [isSaved, setIsSaved] = useState(false);
  const [driverId, setDriverId] = useState('');

  // Chaje foto ID (CIN / Lisans) sou aparèy la an Base64
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setIdCardPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idCardPhoto) {
      alert('Tanpri chaje yon foto ID (CIN oswa Lisans).');
      return;
    }

    const result = storageService.registerDriverVerification({
      idCardPhoto,
      vehicleType,
      licensePlate,
      payoutPhone,
    });

    setDriverId(result.uniqueDriverId);
    setIsSaved(true);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none p-5 overflow-y-auto">
      <div className="bg-navy p-6 rounded-3xl text-white text-center mb-5 shadow-md">
        <h1 className="font-display font-black text-xl">Enskripsyon Livreur</h1>
        <p className="text-white/60 text-xs mt-1">Mete dokiman ou yo pou w resevwa ID Inik ou</p>
      </div>

      {isSaved ? (
        <div className="bg-white p-6 rounded-3xl shadow-md text-center space-y-4 my-auto border border-slate-100">
          <span className="text-5xl">🎉</span>
          <h2 className="font-display font-bold text-navy text-lg">Kont Ou Valide!</h2>
          <p className="text-xs text-slate-500">Men ID Inik Livreur ou a. Konsève l byen:</p>
          <div className="p-4 bg-orange-50 border border-brand/30 rounded-2xl font-mono text-brand font-black text-2xl tracking-wider">
            {driverId}
          </div>
          <button
            type="button"
            onClick={() => navigate('driver-dashboard')}
            className="w-full h-12 rounded-2xl bg-brand text-white font-bold text-xs shadow-lg shadow-brand/20 active:scale-95 transition-all"
          >
            Ale nan Dashboard Livreur ➔
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Foto ID */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <label className="text-xs font-bold text-navy block">1. Foto Pyès Idantite (CIN / Lisans)</label>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleIdUpload} className="hidden" />
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                {idCardPhoto ? (
                  <img src={idCardPhoto} alt="ID" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-slate-300">🪪</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 px-4 rounded-2xl bg-navy text-white text-xs font-bold font-display active:scale-95 transition-all"
              >
                📁 Chaje Foto Pyès
              </button>
            </div>
          </div>

          {/* Vehikil */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <label className="text-xs font-bold text-navy block">2. Enfòmasyon Vehikil</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-navy bg-slate-50 focus:outline-none focus:border-brand"
            >
              <option value="Motosiklèt">Motosiklèt (Moto)</option>
              <option value="Bisiklèt">Bisiklèt</option>
              <option value="Machin">Machin</option>
            </select>

            <input
              type="text"
              placeholder="Nimewo Plak Vehikil la (ex: MC-2026)"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-navy bg-slate-50 focus:outline-none focus:border-brand"
            />
          </div>

          {/* MonCash/Natcash pou Retrait */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <label className="text-xs font-bold text-navy block">3. Nimewo MonCash / Natcash pou Peman</label>
            <input
              type="tel"
              value={payoutPhone}
              onChange={(e) => setPayoutPhone(e.target.value)}
              placeholder="+509 XXXX-XXXX"
              required
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-navy bg-slate-50 focus:outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-brand text-white font-display font-bold text-sm shadow-lg shadow-brand/20 active:scale-98 transition-all"
          >
            Soumèt ak Valide Kont Livreur
          </button>
        </form>
      )}
    </div>
  );
}