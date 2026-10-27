import React, { useRef } from 'react';
import { 
  Sprout, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  RotateCcw, 
  Settings, 
  Sparkles,
  PhoneCall,
  Info,
  Compass,
  Grid,
  Eye,
  Maximize,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { TEMPLATE_BACKGROUNDS } from '../data/plantData';

export default function Header({
  viewMode,
  setViewMode,
  currentBackground,
  onSelectBackground,
  onUploadCustomImage,
  placedCount,
  onClearCanvas,
  onOpenSettings,
  onOpenHelp,
  activeTab,
  setActiveTab,
  showGrid,
  setShowGrid,
  showRadius,
  setShowRadius,
  panelPosition = 'bottom',
  onTogglePanelPosition
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadCustomImage(event.target.result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter template backgrounds matching active viewMode (or show all)
  const currentModeBackgrounds = TEMPLATE_BACKGROUNDS.filter(
    (bg) => !bg.mode || bg.mode === viewMode
  );

  return (
    <header className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/30 px-3 md:px-5 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/30 shrink-0">
          <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-base md:text-lg text-white tracking-tight flex items-center gap-1">
              Paisajismo<span className="text-emerald-400">Express</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Pro
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden xl:block truncate">Diseña en perspectiva o plano cenital y cotiza por WhatsApp</p>
        </div>
      </div>

      {/* Center: DUAL VIEW MODE SWITCHER (Frontal vs Cenital) */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-emerald-500/30 shadow-inner">
        <button
          onClick={() => setViewMode('frontal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all duration-200 ${
            viewMode === 'frontal'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Vista frontal / elevación (fotos de fachadas, muros y balcones)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vista</span> Frente
        </button>

        <button
          onClick={() => setViewMode('cenital')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all duration-200 ${
            viewMode === 'cenital'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Vista desde arriba / plano técnico (ideal para terrenos grandes, quintas y fotos satelitales/dron)"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Plano</span> Desde Arriba
        </button>

        {/* If in Cenital mode: Quick switches for Grid & Coverage Radius */}
        {viewMode === 'cenital' && (
          <div className="hidden lg:flex items-center gap-1 pl-1 ml-1 border-l border-slate-700">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                showGrid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title={showGrid ? "Ocultar cuadrícula métrica 1m" : "Mostrar cuadrícula métrica 1m"}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowRadius(!showRadius)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                showRadius ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Mostrar u ocultar radio de diámetro adulto de cada planta"
            >
              Ø Copas
            </button>
          </div>
        )}
      </div>

      {/* Background Selector & Upload Photo */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner">
        <span className="text-xs font-medium text-slate-400 px-1 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">Fondo:</span>
        </span>

        {/* Preset background selector buttons for this mode */}
        <div className="flex items-center gap-1 max-w-[420px] overflow-x-auto no-scrollbar py-0.5">
          {currentModeBackgrounds.map((bg) => {
            const isSelected = currentBackground.id === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => onSelectBackground(bg)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-semibold ring-1 ring-emerald-400/50' 
                    : bg.isDarkBlueprint
                    ? 'text-emerald-400 bg-slate-900 hover:text-white hover:bg-slate-700/80 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={bg.subtitle}
              >
                {bg.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-slate-700 mx-1"></div>

        {/* Upload Custom Photo Input */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-200 border whitespace-nowrap ${
            currentBackground.isCustom
              ? 'bg-teal-600 text-white border-teal-400 shadow-md shadow-teal-950/40'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title={viewMode === 'cenital' ? "Sube foto satelital de Google Maps o dron de tu terreno" : "Sube foto de tu patio o fachada"}
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentBackground.isCustom ? 'Foto Subida' : viewMode === 'cenital' ? 'Subir Satélite/Dron' : 'Subir Mi Foto'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Toggle floating summary panel position directly from the top header */}
        {onTogglePanelPosition && (
          <button
            onClick={onTogglePanelPosition}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              panelPosition === 'top'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700/80'
            }`}
            title={panelPosition === 'top' ? "Panel fijado ARRIBA (despeja el suelo para organizar fácil). Clic para bajar." : "Mover panel ARRIBA para organizar fácil"}
          >
            {panelPosition === 'top' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden xl:inline">Panel</span> {panelPosition === 'top' ? 'Arriba' : 'Abajo'}
          </button>
        )}

        {/* Mobile View Switcher (Lienzo / Catálogo) */}
        <div className="flex lg:hidden bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'canvas' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Lienzo ({placedCount})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'catalog' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Plantas
          </button>
        </div>

        {/* Quick mobile photo upload icon */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          title="Subir foto propia"
        >
          <Upload className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Clear Canvas */}
        {placedCount > 0 && (
          <button
            onClick={onClearCanvas}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
            title="Limpiar todas las plantas del lienzo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
          title="Guía de uso: Frente vs Plano Cenital"
        >
          <Info className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
          title="Configurar teléfono de WhatsApp del vivero"
        >
          <Settings className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </header>
  );
}
