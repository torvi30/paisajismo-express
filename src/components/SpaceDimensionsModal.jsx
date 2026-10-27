import React, { useState } from 'react';
import { 
  X, 
  Ruler, 
  Check, 
  Maximize2, 
  LayoutGrid, 
  Trees, 
  Home, 
  Building2, 
  Sparkles,
  Info
} from 'lucide-react';

export const SPACE_PRESETS = [
  {
    id: 'balcon',
    name: 'Balcón / Terraza',
    subtitle: 'Espacio urbano compacto',
    width: 3,
    length: 2,
    icon: Building2,
  },
  {
    id: 'patio-medio',
    name: 'Patio & Canteros',
    subtitle: 'Vivienda tradicional',
    width: 6,
    length: 4,
    icon: Home,
  },
  {
    id: 'jardin-familiar',
    name: 'Jardín Familiar',
    subtitle: 'Césped y cerco vivo',
    width: 10,
    length: 8,
    icon: Trees,
  },
  {
    id: 'quinta-grande',
    name: 'Lote Grande / Quinta',
    subtitle: 'Predio campestre o country',
    width: 20,
    length: 30,
    icon: Maximize2,
  },
];

export default function SpaceDimensionsModal({
  isOpen,
  onClose,
  spaceDimensions,
  onSaveDimensions,
}) {
  const [width, setWidth] = useState(spaceDimensions.width || 10);
  const [length, setLength] = useState(spaceDimensions.length || 8);

  if (!isOpen) return null;

  const area = Math.round(width * length);
  const perimeter = Math.round((Number(width) + Number(length)) * 2);

  const handleApplyPreset = (preset) => {
    setWidth(preset.width);
    setLength(preset.length);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsedWidth = Math.max(1, Math.min(150, Number(width) || 10));
    const parsedLength = Math.max(1, Math.min(150, Number(length) || 8));
    onSaveDimensions({
      width: parsedWidth,
      length: parsedLength,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                Medidas Reales del Espacio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Escala Métrica 1:1
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ajusta los metros para que las plantas y la cuadrícula reflejen el tamaño real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-5">
          {/* Presets Quick Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Plantillas de medidas rápidas:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SPACE_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isCurrent = Number(width) === preset.width && Number(length) === preset.length;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isCurrent ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/60 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{preset.name}</p>
                      <p className="text-[10px] text-emerald-400 font-mono font-semibold">
                        {preset.width}m × {preset.length}m ({preset.width * preset.length} m²)
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Dimension Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Ancho (Frente)</span>
                <span className="text-[10px] text-slate-400 font-mono">Metros (m)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="150"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-slate-800 text-white font-mono font-bold text-sm rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  m
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Largo (Fondo)</span>
                <span className="text-[10px] text-slate-400 font-mono">Metros (m)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="150"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full bg-slate-800 text-white font-mono font-bold text-sm rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  m
                </span>
              </div>
            </div>
          </div>

          {/* Calculation Badge: Surface area & Perimeter */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-slate-400 text-[11px]">Superficie total a intervenir</p>
                <p className="font-heading font-extrabold text-sm text-white">
                  {area} m² <span className="text-xs text-slate-400 font-normal">({width}m × {length}m)</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[11px]">Perímetro</p>
              <p className="font-mono font-bold text-emerald-400 text-sm">
                {perimeter} metros
              </p>
            </div>
          </div>

          {/* Helpful Tip */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <p>
              Las plantas en el diseño se calibrarán automáticamente a esta escala. Una palmera de copa de 2m ocupará exactamente 2 metros en este terreno.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-heading font-extrabold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 rounded-xl shadow-lg shadow-emerald-950/60 transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Aplicar Medidas al Lienzo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
