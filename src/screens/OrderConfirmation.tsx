import { ReactNode } from 'react';
import { Screen, DeliveryForm, SERVICE_ICONS, ServiceType } from '../types';

interface Props {
  navigate: (s: Screen) => void;
  form: DeliveryForm;
}

export default function OrderConfirmation({ navigate, form }: Props) {
  const orderNum = 'LN-2024-0943';
  const total = 909;

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      
      {/* ── Top Header Modèn ── */}
      <div className="bg-navy px-5 pt-12 pb-5 shrink-0 shadow-md">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate('price-estimation')}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center border border-white/10"
            aria-label="Retounen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1 className="font-display font-black text-white text-base sm:text-lg leading-tight">
              Konfime Livrezon
            </h1>
            <p className="text-white/60 text-xs">Revize detay yo anvan ou voye</p>
          </div>
        </div>
      </div>

      {/* ── Kontni sispann/scrollable ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-4">
        
        {/* Kat Nimewo Kòmand ak Badges */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center text-2xl shrink-0 shadow-inner">
            {form.serviceType ? SERVICE_ICONS[form.serviceType as ServiceType] : '📦'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-wider">
              Kòd Kòmand
            </p>
            <p className="font-display font-black text-navy text-base sm:text-lg truncate">
              {orderNum}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200/60 text-[10px] font-black font-display uppercase tracking-wider shrink-0">
            An atant
          </span>
        </div>

        {/* Kat Trajè (Itinerè) */}
        <SectionCard title="Itinerè Trajè">
          <ConfirmRow 
            icon="🟢" 
            label="Kote pran (Depa)" 
            value={form.pickupAddress || 'Pétion-Ville, Rue Grégoire 45'} 
          />
          
          <div className="flex items-center gap-3 py-0.5 pl-7 my-1">
            <div className="w-0.5 h-6 bg-slate-200 rounded-full" />
            <span className="text-[11px] font-semibold text-slate-400 font-mono">
              ~5.4 km • ~26 minit
            </span>
          </div>

          <ConfirmRow 
            icon="🔴" 
            label="Kote livreye (Arrive)" 
            value={form.deliveryAddress || 'Delmas 32, Impasse Fleur 12'} 
          />
        </SectionCard>

        {/* Kat Moun k ap Resevwa */}
        <SectionCard title="Moun k ap Resevwa">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ConfirmRow 
              icon="👤" 
              label="Non ak Siyati" 
              value={form.recipientName || 'Marie Lucie Joseph'} 
            />
            <ConfirmRow 
              icon="📞" 
              label="Nimewo Telefòn" 
              value={form.recipientPhone || '+509 3678-9012'} 
            />
          </div>
          {form.instructions && (
            <div className="pt-2 border-t border-slate-100">
              <ConfirmRow icon="📝" label="Enstriksyon pou livreur" value={form.instructions} />
            </div>
          )}
        </SectionCard>

        {/* Kat Detay Sèvis ak Pakè */}
        <SectionCard title="Detay Sèvis & Pakè">
          <ConfirmRow
            icon={form.serviceType ? SERVICE_ICONS[form.serviceType as ServiceType] : '📦'}
            label="Kalite Sèvis"
            value={form.serviceType || 'Pakè'}
          />
          <ConfirmRow 
            icon="📦" 
            label="Deskripsyon Pakè" 
            value={form.description || 'Bwat pou biwo — frajil'} 
          />
          <ConfirmRow 
            icon="⚡" 
            label="Programasyon" 
            value={form.isScheduled ? `Pwograme pou: ${form.scheduledTime}` : 'Imedya (Livrezon kounye a)'} 
          />
        </SectionCard>

        {/* Kat Peman & Pri Total */}
        <SectionCard title="Mòd Peman">
          <ConfirmRow icon="💳" label="Metòd Peman" value="Bours Dijital Livrez-Nou" />
          
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
            <div>
              <p className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Total pou peye</p>
              <p className="text-[10px] text-slate-400">Taks ak sèvis enkli</p>
            </div>
            <p className="font-display font-black text-navy text-2xl tracking-tight">
              {total.toLocaleString()} <span className="text-xs font-bold text-brand">HTG</span>
            </p>
          </div>
        </SectionCard>

        {/* Remak sou kondisyon sèvis yo */}
        <p className="text-[11px] text-slate-400 text-center leading-relaxed px-4">
          Lè ou klike sou &quot;Konfime &amp; Voye&quot;, ou aksepte kondisyon sèvis Livrez-Nou. Frè yo pa ranbousab apre livreur a aksepte e li pran pakè a.
        </p>
      </div>

      {/* ── Action Bottom Bar ── */}
      <div className="p-5 border-t border-slate-100 bg-white shrink-0 space-y-2.5">
        <button
          type="button"
          onClick={() => navigate('delivery-tracking')}
          className="w-full h-14 rounded-2xl bg-brand text-white font-display font-bold text-base shadow-lg shadow-brand/30 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Konfime &amp; Voye Kòmand Sa A</span>
          <span className="text-xl">➔</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('new-delivery')}
          className="w-full h-11 rounded-2xl border border-slate-200 text-navy font-display font-bold text-xs hover:bg-slate-50 active:scale-98 transition-all"
        >
          Modifye Enfòmasyon Yo
        </button>
      </div>

    </div>
  );
}

// Sub-konpozan pou Bwat Sèksyon
function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
        <p className="font-display font-bold text-slate-400 text-[10px] uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

// Sub-konpozan pou chak liy detay
function ConfirmRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-wider">{label}</p>
        <p className="text-xs sm:text-sm font-bold text-navy truncate">{value}</p>
      </div>
    </div>
  );
}