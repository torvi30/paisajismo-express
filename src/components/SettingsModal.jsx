import React, { useState } from 'react';
import { X, Phone, Check, Settings, ShieldCheck, Building2 } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, nurseryPhone, setNurseryPhone, nurseryName, setNurseryName }) {
  const [tempPhone, setTempPhone] = useState(nurseryPhone);
  const [tempName, setTempName] = useState(nurseryName);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setNurseryPhone(tempPhone);
    setNurseryName(tempName);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Configuración del Vivero</h3>
              <p className="text-xs text-slate-400">Datos para la recepción de cotizaciones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Nombre del Vivero / Estudio
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Ej: Vivero Bella Flor"
              className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Teléfono de WhatsApp (con código de país)
            </label>
            <input
              type="text"
              value={tempPhone}
              onChange={(e) => setTempPhone(e.target.value)}
              placeholder="Ej: +5491123456789 o +52155..."
              className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Este es el número al que se enviará la cotización generada por los clientes.
            </p>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-300">
              Todos los datos quedan guardados en tu navegador localmente para tus próximas sesiones.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-heading font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-950/50 transition-all"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? '¡Guardado!' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
