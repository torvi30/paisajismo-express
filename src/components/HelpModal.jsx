import React from 'react';
import { X, Sparkles, Upload, MousePointer, Move, MessageCircle, Compass, Grid, Eye } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const features = [
    {
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      title: "1. Alterna entre Frente y Plano Cenital",
      desc: "Usa el selector superior: 'Vista Frente' para ver cómo lucirá el jardín a la altura de los ojos, o 'Plano Desde Arriba' para organizar parcelas grandes, canteros y quintas a escala."
    },
    {
      icon: <Upload className="w-5 h-5 text-emerald-400" />,
      title: "2. Sube tu Propio Espacio o Foto Satelital",
      desc: "En vista frente sube fotos de tu fachada o balcón. En vista cenital puedes subir capturas satelitales de Google Maps o fotos de dron de tu terreno."
    },
    {
      icon: <Grid className="w-5 h-5 text-emerald-400" />,
      title: "3. Cuadrícula Métrica y Diámetro de Copa",
      desc: "En el plano cenital verás los halos punteados con el diámetro de copa adulta (ej: Ø 1.8m) para calcular distancias exactas y evitar sobrepoblación vegetal."
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      title: "4. Cotización Instantánea por WhatsApp",
      desc: "Todas las plantas se van contabilizando automáticamente. Con un clic en 'Cotizar por WhatsApp' envías la lista completa y detallada al vivero."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Guía de Paisajismo Express Pro</h3>
              <p className="text-xs text-slate-400">Diseño en Perspectiva y Plano Cenital</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {features.map((st, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 shrink-0">
                {st.icon}
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white mb-0.5">{st.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-heading font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
          >
            ¡Entendido, comenzar a diseñar!
          </button>
        </div>
      </div>
    </div>
  );
}
