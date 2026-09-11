import React, { useState, useEffect } from 'react';
import { Screen, User, Order } from '../types';
import { storageService, DriverVerification } from '../services/storageService';

interface Props {
  navigate: (s: Screen) => void;
}

export default function AdminDashboard({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<'drivers' | 'orders'>('drivers');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDriverDoc, setSelectedDriverDoc] = useState<DriverVerification | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  useEffect(() => {
    setUsers(storageService.getAllUsers());
    setOrders(storageService.getOrders());
  }, []);

  const drivers = users.filter(u => u.role === 'driver');
  const totalCommission = orders.reduce((acc, o) => acc + (o.serviceFee || 0), 0);

  const handleInspectDriver = (driverId: string) => {
    const doc = storageService.getDriverVerification(driverId);
    if (doc) {
      setSelectedDriverDoc(doc);
      setShowDocModal(true);
    } else {
      alert("Livreur sa a potko chaje dokiman idantite l.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      
      {/* Top Header Admin */}
      <div className="bg-navy px-5 pt-12 pb-6 text-white shrink-0 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-brand/20 border border-brand/40 text-brand text-[10px] font-black uppercase font-display">
              Panèl Kontwòl
            </span>
            <h1 className="font-display font-black text-xl leading-tight mt-1">
              Admin Livrez-Nou
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('profile')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-display active:scale-95 transition-all"
          >
            Sòti Admin
          </button>
        </div>

        {/* Statisik Rapò yo */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
            <p className="text-[10px] text-white/60 font-bold uppercase">Total Kòmand</p>
            <p className="font-display font-black text-lg text-white mt-0.5">{orders.length}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
            <p className="text-[10px] text-white/60 font-bold uppercase">Livreur Inskri</p>
            <p className="font-display font-black text-lg text-white mt-0.5">{drivers.length}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-brand/40 bg-brand/10">
            <p className="text-[10px] text-brand font-bold uppercase">Komisyon</p>
            <p className="font-display font-black text-lg text-brand mt-0.5">{totalCommission} G</p>
          </div>
        </div>
      </div>

      {/* Tabs Meni */}
      <div className="flex bg-white border-b border-slate-200 px-5 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('drivers')}
          className={`flex-1 py-3.5 font-display font-bold text-xs text-center border-b-2 transition-all ${
            activeTab === 'drivers' ? 'border-brand text-brand' : 'border-transparent text-slate-400'
          }`}
        >
          🏎️ Livreur ({drivers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3.5 font-display font-bold text-xs text-center border-b-2 transition-all ${
            activeTab === 'orders' ? 'border-brand text-brand' : 'border-transparent text-slate-400'
          }`}
        >
          📦 Kòmand ({orders.length})
        </button>
      </div>

      {/* Kontni */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {activeTab === 'drivers' && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
              Lis Livreur ki Enskri yo
            </p>

            {drivers.map(driver => (
              <div key={driver.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={driver.photo} alt={driver.name} className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-display font-bold text-navy text-sm">{driver.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{driver.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInspectDriver(driver.id)}
                  className="px-3 py-2 rounded-xl bg-orange-50 text-brand font-bold text-xs active:scale-95 transition-all"
                >
                  Tcheke Pyès 🪪
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
              Tout Kòmand Aplikasyon an
            </p>

            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono text-xs font-bold text-navy">{order.id}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase font-display">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600"><span className="font-bold text-navy">Depa:</span> {order.pickupAddress}</p>
                <p className="text-xs text-slate-600"><span className="font-bold text-navy">Arrive:</span> {order.deliveryAddress}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-display">
                  <span className="text-xs text-slate-400">Total:</span>
                  <span className="font-black text-brand text-sm">{order.total} HTG</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Inspecte Dokiman */}
      {showDocModal && selectedDriverDoc && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-navy text-base">Dokiman Livreur</h3>
                <p className="text-[10px] font-mono text-brand font-bold">{selectedDriverDoc.uniqueDriverId}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-navy">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Pyès Idantite (CIN / Lisans)</p>
                <img
                  src={selectedDriverDoc.idCardPhoto}
                  alt="CIN / Lisans"
                  className="w-full h-40 object-cover rounded-2xl border border-slate-200 mt-1 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Vehikil:</p>
                  <p className="font-bold">{selectedDriverDoc.vehicleType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Plak Moto:</p>
                  <p className="font-bold">{selectedDriverDoc.licensePlate}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold">Telefòn Peman (MonCash/Natcash):</p>
                <p className="font-bold font-mono text-sm">{selectedDriverDoc.payoutPhone}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(`Kont Livreur ${selectedDriverDoc.uniqueDriverId} la valide ak siksè!`);
                setShowDocModal(false);
              }}
              className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-display font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
            >
              ✓ Valide & Aksepte Livreur
            </button>
          </div>
        </div>
      )}

    </div>
  );
}