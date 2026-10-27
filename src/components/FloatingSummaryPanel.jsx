import React, { useState, useMemo } from 'react';
import { 
  MessageCircle, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus, 
  Minus, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Copy,
  Send,
  ShoppingBag,
  Share2,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal
} from 'lucide-react';

export default function FloatingSummaryPanel({
  summaryList,
  totalPlantsCount,
  totalEstimatedPrice,
  currentBackground,
  nurseryPhone,
  onClearAll,
  onIncrementSpecies,
  onDecrementSpecies,
  onRemoveSpecies,
  panelPosition = 'bottom',
  onTogglePanelPosition
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clientName, setClientName] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'count' | 'price' | 'name'

  // Sorted summary list based on user preference
  const sortedSummaryList = useMemo(() => {
    if (sortBy === 'count') {
      return [...summaryList].sort((a, b) => b.count - a.count);
    }
    if (sortBy === 'price') {
      return [...summaryList].sort((a, b) => (b.plant.price * b.count) - (a.plant.price * a.count));
    }
    if (sortBy === 'name') {
      return [...summaryList].sort((a, b) => a.plant.name.localeCompare(b.plant.name));
    }
    return summaryList;
  }, [summaryList, sortBy]);

  // Generate WhatsApp formatted message
  const generateWhatsAppMessage = () => {
    const spaceName = currentBackground.isCustom
      ? 'Mi propia foto de espacio (adjuntaré captura)'
      : currentBackground.name;

    const modeName = currentBackground.viewMode === 'cenital' || currentBackground.mode === 'cenital'
      ? '📐 Plano Cenital (Desde arriba / Distribución)'
      : '👁️ Vista Frontal (Elevación)';

    let text = `🌿 *¡HOLA VIVERO! SOLICITUD DE COTIZACIÓN DE JARDÍN* 🌿\n\n`;
    if (clientName.trim()) {
      text += `👤 *Cliente:* ${clientName.trim()}\n`;
    }
    text += `🏡 *Espacio a intervenir:* ${spaceName}\n`;
    text += `📐 *Tipo de diseño:* ${modeName}\n`;
    text += `📊 *Total de ejemplares:* ${totalPlantsCount} plantas\n\n`;
    text += `🌱 *DETALLE DEL DISEÑO PAISAJÍSTICO:*\n`;

    sortedSummaryList.forEach((item) => {
      text += `• *${item.count}x* ${item.plant.name} _(${item.plant.category})_`;
      if (item.plant.price) {
        text += ` - Est. $${(item.plant.price * item.count).toLocaleString('es-AR')}`;
      }
      text += `\n`;
    });

    if (totalEstimatedPrice > 0) {
      text += `\n💰 *Presupuesto Estimado:* $${totalEstimatedPrice.toLocaleString('es-AR')}\n`;
    }

    if (customNote.trim()) {
      text += `\n📝 *Nota del cliente:* ${customNote.trim()}\n`;
    }

    text += `\n✨ _Generado desde la app interactiva Paisajismo Express. ¿Tienen disponibilidad y asesoramiento de plantación?_`;

    return text;
  };

  const handleSendWhatsApp = () => {
    if (totalPlantsCount === 0) return;
    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const cleanPhone = nurseryPhone.replace(/[^\d]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopyMessage = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAtTop = panelPosition === 'top';

  if (totalPlantsCount === 0) {
    return (
      <div className={`fixed ${isAtTop ? 'top-[72px]' : 'bottom-4'} left-4 right-4 lg:left-6 lg:right-[400px] z-30 pointer-events-none transition-all duration-300`}>
        <div className="max-w-md mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-xl flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Tu diseño está vacío</p>
              <p className="text-[11px] text-slate-400">Añade plantas para armar tu cotización</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onTogglePanelPosition && (
              <button
                onClick={onTogglePanelPosition}
                className="text-[11px] text-slate-400 hover:text-emerald-300 font-medium px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                title={isAtTop ? "Mover panel abajo" : "Mover panel arriba"}
              >
                {isAtTop ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                <span>{isAtTop ? 'Abajo' : 'Arriba'}</span>
              </button>
            )}
            <span className="text-[11px] text-slate-400 font-medium px-2 py-1 bg-slate-800 rounded-lg">
              0 plantas
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop when expanded on mobile */}
      {isExpanded && (
        <div 
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Floating Bar / Sheet (Dockable Top or Bottom) */}
      <div className={`fixed ${isAtTop ? 'top-[72px]' : 'bottom-3'} left-3 right-3 lg:left-6 lg:right-[400px] z-40 transition-all duration-300`}>
        <div className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
          
          {/* Header Bar (always visible) */}
          <div className="p-3 md:p-3.5 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900">
            {/* Quick summary preview & toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-3 text-left group min-w-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/50">
                <ShoppingBag className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs md:text-sm font-heading font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Mi Diseño ({totalPlantsCount} {totalPlantsCount === 1 ? 'planta' : 'plantas'})
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ${totalEstimatedPrice.toLocaleString('es-AR')}
                  </span>
                </div>

                {/* Thumbnails of added species */}
                <div className="flex items-center gap-1 mt-1 overflow-hidden">
                  {sortedSummaryList.slice(0, 5).map(({ plant, count }) => (
                    <div
                      key={plant.id}
                      className="relative w-6 h-6 rounded-md overflow-hidden bg-slate-800/80 border border-slate-700 shrink-0 p-0.5 flex items-center justify-center"
                      title={`${count}x ${plant.name}`}
                    >
                      <img src={plant.image} alt={plant.name} className="max-w-full max-h-full object-contain" />
                      {count > 1 && (
                        <span className="absolute inset-0 bg-slate-950/75 text-[8px] font-bold text-white flex items-center justify-center rounded">
                          {count}
                        </span>
                      )}
                    </div>
                  ))}
                  {sortedSummaryList.length > 5 && (
                    <span className="text-[10px] text-slate-400 font-semibold px-1">
                      +{sortedSummaryList.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* Actions: Position Switch, Expand toggle & WhatsApp Button */}
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              {/* Position Switcher: Arriba / Abajo */}
              {onTogglePanelPosition && (
                <button
                  onClick={onTogglePanelPosition}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    isAtTop
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border-slate-700'
                  }`}
                  title={isAtTop ? "Mover panel ABAJO" : "Mover panel ARRIBA (despeja el suelo para organizar fácil)"}
                >
                  {isAtTop ? (
                    <>
                      <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline font-medium">Bajar</span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline font-medium">Fijar Arriba</span>
                    </>
                  )}
                </button>
              )}

              {/* Expand/Collapse Drawer Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                title={isExpanded ? "Ocultar lista" : "Ver y organizar especies"}
              >
                <span className="hidden sm:inline">{isExpanded ? 'Ocultar' : 'Organizar'}</span>
                {isExpanded ? (
                  isAtTop ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                ) : (
                  isAtTop ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                )}
              </button>

              {/* Main WhatsApp CTA Button */}
              <button
                onClick={handleSendWhatsApp}
                className="relative group overflow-hidden flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-heading font-extrabold text-xs md:text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 fill-slate-950 stroke-none" />
                <span className="tracking-tight hidden xs:inline sm:inline">Cotizar WhatsApp</span>
                <span className="tracking-tight xs:hidden sm:hidden">Cotizar</span>
              </button>
            </div>
          </div>

          {/* Expanded Drawer / Detail & Organization View */}
          {isExpanded && (
            <div className="p-4 border-t border-slate-800 max-h-[55vh] overflow-y-auto space-y-4">
              {/* Header with Title, Sorting Options, and Clear All */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                    Especies en diseño ({summaryList.length})
                  </h4>

                  {/* Quick Organization / Sorting Controls */}
                  <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                    <span className="text-slate-400 px-1 font-medium flex items-center gap-1">
                      <SlidersHorizontal className="w-2.5 h-2.5 text-emerald-400" /> Ordenar:
                    </span>
                    <button
                      onClick={() => setSortBy('default')}
                      className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                        sortBy === 'default' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Orden original de inserción"
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setSortBy('count')}
                      className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                        sortBy === 'count' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Ordenar por mayor cantidad de ejemplares"
                    >
                      Cantidad
                    </button>
                    <button
                      onClick={() => setSortBy('price')}
                      className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                        sortBy === 'price' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Ordenar por valor total"
                    >
                      Precio
                    </button>
                    <button
                      onClick={() => setSortBy('name')}
                      className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                        sortBy === 'name' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Ordenar alfabéticamente A-Z"
                    >
                      A-Z
                    </button>
                  </div>
                </div>

                <button
                  onClick={onClearAll}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vaciar todo
                </button>
              </div>

              {/* Species itemized list */}
              <div className="space-y-2">
                {sortedSummaryList.map(({ plant, count }) => (
                  <div
                    key={plant.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 shrink-0 p-1 flex items-center justify-center">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{plant.name}</p>
                        <p className="text-[10px] text-emerald-400 font-medium">
                          ${plant.price.toLocaleString('es-AR')} c/u • {plant.category}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Modifier Buttons (+, -, trash) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onDecrementSpecies(plant.id)}
                        className="w-7 h-7 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                        title="Quitar una unidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-extrabold text-white">
                        {count}
                      </span>
                      <button
                        onClick={() => onIncrementSpecies(plant)}
                        className="w-7 h-7 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white flex items-center justify-center transition-colors"
                        title="Añadir otra unidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveSpecies(plant.id)}
                        className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors ml-1"
                        title="Eliminar esta especie"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Optional Customization: Name and Note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tu Nombre (Opcional)
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Laura Gómez"
                    className="w-full text-xs bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Mensaje Adicional / Consulta
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Ej: ¿Incluyen tierra y colocación?"
                    className="w-full text-xs bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Preview & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handleCopyMessage}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar texto para WhatsApp'}</span>
                </button>

                <button
                  onClick={handleSendWhatsApp}
                  className="w-full sm:w-auto flex-[1.5] flex items-center justify-center gap-2 text-xs md:text-sm font-heading font-extrabold py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-lg shadow-emerald-950/60 transition-transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                  <span>Enviar Presupuesto por WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
