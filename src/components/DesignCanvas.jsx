import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Maximize2, 
  Minimize2, 
  FlipHorizontal, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  ImageIcon, 
  Sparkles,
  Move,
  Compass,
  Grid,
  Info
} from 'lucide-react';
import PlantCanopyTopDown from './PlantCanopyTopDown';

export default function DesignCanvas({
  viewMode = 'frontal',
  showGrid = true,
  showRadius = true,
  background,
  onSelectBackground,
  onUploadCustomImage,
  placedPlants,
  setPlacedPlants,
  selectedPlantId,
  setSelectedPlantId,
  onAddPlantDirectly,
  panelPosition = 'bottom',
  onTogglePanelPosition
}) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [draggingInstanceId, setDraggingInstanceId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ offsetX: 0, offsetY: 0 });

  // Handle Drag Over & Drop from sidebar catalogue
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const plantDataStr = e.dataTransfer.getData('application/json');
    if (!plantDataStr) return;

    try {
      const plant = JSON.parse(plantDataStr);
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      const dropX = ((e.clientX - canvasRect.left) / canvasRect.width) * 100;
      const dropY = ((e.clientY - canvasRect.top) / canvasRect.height) * 100;

      onAddPlantDirectly(plant, Math.max(5, Math.min(92, dropX)), Math.max(5, Math.min(92, dropY)));
    } catch (err) {
      console.error('Error handling plant drop:', err);
    }
  };

  // Pointer Dragging for placed plants (Mouse & Touch compatible)
  const handlePointerDown = (e, instance) => {
    e.stopPropagation();
    setSelectedPlantId(instance.instanceId);
    setDraggingInstanceId(instance.instanceId);

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const plantXInPixels = (instance.x / 100) * canvasRect.width;
    const plantYInPixels = (instance.y / 100) * canvasRect.height;

    setDragOffset({
      offsetX: e.clientX - canvasRect.left - plantXInPixels,
      offsetY: e.clientY - canvasRect.top - plantYInPixels,
    });
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggingInstanceId || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const currentXPixels = e.clientX - canvasRect.left - dragOffset.offsetX;
      const currentYPixels = e.clientY - canvasRect.top - dragOffset.offsetY;

      // Constrain within 2% to 95%
      const newXPercent = Math.max(2, Math.min(95, (currentXPixels / canvasRect.width) * 100));
      const newYPercent = Math.max(4, Math.min(94, (currentYPixels / canvasRect.height) * 100));

      setPlacedPlants((prev) =>
        prev.map((item) =>
          item.instanceId === draggingInstanceId
            ? { ...item, x: newXPercent, y: newYPercent }
            : item
        )
      );
    };

    const handlePointerUp = () => {
      if (draggingInstanceId) {
        setDraggingInstanceId(null);
      }
    };

    if (draggingInstanceId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingInstanceId, dragOffset, setPlacedPlants]);

  // Actions for selected plant
  const handleDelete = (e, instanceId) => {
    e.stopPropagation();
    setPlacedPlants((prev) => prev.filter((p) => p.instanceId !== instanceId));
    if (selectedPlantId === instanceId) setSelectedPlantId(null);
  };

  const handleDuplicate = (e, instance) => {
    e.stopPropagation();
    const newInstance = {
      ...instance,
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x: Math.min(90, instance.x + 6),
      y: Math.min(88, instance.y + 4),
      zOffset: (instance.zOffset || 0) + 1,
    };
    setPlacedPlants((prev) => [...prev, newInstance]);
    setSelectedPlantId(newInstance.instanceId);
  };

  const handleResize = (e, instanceId, delta) => {
    e.stopPropagation();
    setPlacedPlants((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const newScale = Math.max(0.35, Math.min(3.2, (item.scale || 1) + delta));
        return { ...item, scale: Number(newScale.toFixed(2)) };
      })
    );
  };

  const handleFlip = (e, instanceId) => {
    e.stopPropagation();
    setPlacedPlants((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        return { ...item, flipped: !item.flipped };
      })
    );
  };

  // Layer order manual offset
  const handleLayerOrder = (e, instanceId, direction) => {
    e.stopPropagation();
    setPlacedPlants((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const currentOffset = item.zOffset || 0;
        return { ...item, zOffset: direction === 'up' ? currentOffset + 25 : currentOffset - 25 };
      })
    );
  };

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

  const selectedPlant = placedPlants.find((p) => p.instanceId === selectedPlantId);

  const isAtTop = panelPosition === 'top';

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Floating Ribbon inside Canvas: Background selector pill + Mode indicator (moves to bottom if panel is at top) */}
      <div className={`absolute ${isAtTop ? 'bottom-3' : 'top-3'} left-3 right-3 z-20 flex items-center justify-between pointer-events-none transition-all duration-300`}>
        {/* Active Background Badge & Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg">
          <span className="text-[11px] font-semibold text-slate-300 px-2 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[140px] truncate">{background.name}</span>
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors font-medium"
            title={viewMode === 'cenital' ? "Subir foto satelital de Google Maps o dron" : "Subir foto de fachada o patio"}
          >
            <Upload className="w-3 h-3 text-emerald-400" />
            <span>{background.isCustom ? 'Cambiar Foto' : viewMode === 'cenital' ? 'Subir Satélite/Dron' : 'Subir Mi Foto'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* View Mode & Selection Info Pill */}
        <div className="pointer-events-auto flex items-center gap-2 p-1 px-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            {viewMode === 'cenital' ? (
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
            <span>
              {viewMode === 'cenital' ? 'Plano Cenital 2D' : 'Vista Frontal'} • {placedPlants.length} plantas
            </span>
          </div>
          {selectedPlant && (
            <span className="text-[11px] text-slate-300 border-l border-slate-700 pl-2 font-mono">
              {selectedPlant.name} {viewMode === 'cenital' && `(Ø ${selectedPlant.canopyDiameter || '1.2m'})`}
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => setSelectedPlantId(null)}
        className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair touch-none bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-950"
        style={{
          backgroundImage: `url(${background.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Metric Grid Overlay when in Cenital Mode and showGrid is true */}
        {viewMode === 'cenital' && showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none z-10 opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
                linear-gradient(to right, rgba(16, 185, 129, 0.4) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16, 185, 129, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px, 30px 30px, 150px 150px, 150px 150px',
            }}
          />
        )}

        {/* Cenital Metric Scale Indicator */}
        {viewMode === 'cenital' && (
          <div className={`absolute ${isAtTop ? 'bottom-16' : 'bottom-20'} left-4 z-20 pointer-events-none flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-[10px] font-mono text-emerald-300 transition-all duration-300`}>
            <Grid className="w-3.5 h-3.5 text-emerald-400" />
            <span>Escala de referencia: 1 cuadrícula = 1 metro</span>
          </div>
        )}

        {/* Empty State Callout */}
        {placedPlants.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6 z-20">
            <div className="max-w-md p-5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-2xl text-center pointer-events-auto animate-fadeIn">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-1">
                {viewMode === 'cenital' ? 'Plano Cenital listo para diseñar' : 'Jardín sin plantas aún'}
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {viewMode === 'cenital'
                  ? 'Arrastra plantas para organizar tu terreno desde arriba. Cada especie incluye su radio de copa adulta para calcular distancias exactas.'
                  : 'Selecciona una planta del catálogo a la derecha para ubicarla recortada sin fondo y moverla libremente.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
                >
                  <Upload className="w-3.5 h-3.5" /> 
                  <span>{viewMode === 'cenital' ? 'Subir foto satélite / dron' : 'Subir foto de mi jardín'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PLACED PLANTS: NATURAL PERSPECTIVE Z-INDEX SORTING (Y-Depth Layering) */}
        {placedPlants.map((instance) => {
          const isSelected = selectedPlantId === instance.instanceId;
          const isDragging = draggingInstanceId === instance.instanceId;
          const scale = instance.scale || 1.0;

          // Dimensions: In Cenital view, standard canopy diameter ~120px * scale; in Frontal view ~170px * scale
          const renderedWidth = viewMode === 'cenital' ? 120 * scale : 170 * scale;

          // NATURAL Z-INDEX CALCULATION:
          // In Frontal view: Plants with larger Y (closer to bottom of screen / foreground)
          // MUST naturally be in front of plants with smaller Y (higher up / background).
          // Multiplied by 10 to give fine-grained depth resolution between plants.
          const baseDepthZ = viewMode === 'frontal'
            ? Math.round(instance.y * 10) + (instance.zOffset || 0)
            : 20 + (instance.zOffset || 0);

          // When actively dragging or selected, bring to the absolute front (1000+) so controls are easy to click
          const finalZIndex = isSelected || isDragging ? 1000 + baseDepthZ : baseDepthZ;

          return (
            <div
              key={instance.instanceId}
              onPointerDown={(e) => handlePointerDown(e, instance)}
              className={`absolute select-none cursor-grab active:cursor-grabbing group transition-opacity duration-150 ${
                isDragging ? 'opacity-95' : ''
              }`}
              style={{
                left: `${instance.x}%`,
                top: `${instance.y}%`,
                // Cenital centers at (50%, 50%), Frontal anchors at (50%, 85%) for ground alignment
                transform: viewMode === 'cenital' ? 'translate(-50%, -50%)' : 'translate(-50%, -85%)',
                zIndex: finalZIndex,
              }}
            >
              {/* Plant Container: Delicate selection indicator that never obscures neighboring plants */}
              <div
                className={`relative transition-transform duration-150 ${
                  isSelected
                    ? viewMode === 'cenital'
                      ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950/80 rounded-full'
                      : 'scale-[1.03]'
                    : 'hover:brightness-105'
                }`}
                style={{ width: `${renderedWidth}px`, height: viewMode === 'cenital' ? `${renderedWidth}px` : 'auto' }}
              >
                {/* Floating controls toolbar on selection */}
                {isSelected && (
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-emerald-400/60 shadow-2xl z-50 animate-fadeIn"
                  >
                    {/* Scale up (Agrandar) */}
                    <button
                      onClick={(e) => handleResize(e, instance.instanceId, 0.15)}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-emerald-600/30 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                      title="Agrandar tamaño de copa"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>+</span>
                    </button>
                    {/* Scale down (Achicar) */}
                    <button
                      onClick={(e) => handleResize(e, instance.instanceId, -0.15)}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                      title="Reducir tamaño"
                    >
                      <Minimize2 className="w-3.5 h-3.5 text-slate-300" />
                      <span>-</span>
                    </button>
                    {/* Flip horizontal */}
                    {viewMode === 'frontal' && (
                      <button
                        onClick={(e) => handleFlip(e, instance.instanceId)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          instance.flipped ? 'bg-emerald-600/30 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        title="Invertir orientación"
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Layer Up */}
                    <button
                      onClick={(e) => handleLayerOrder(e, instance.instanceId, 'up')}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Traer al frente manualmente"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    {/* Layer Down */}
                    <button
                      onClick={(e) => handleLayerOrder(e, instance.instanceId, 'down')}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Enviar atrás manualmente"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {/* Duplicate */}
                    <button
                      onClick={(e) => handleDuplicate(e, instance)}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Duplicar planta (+1)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={(e) => handleDelete(e, instance.instanceId)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors"
                      title="Eliminar del plano"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* GRAPHIC RENDERING: CENITAL VS FRONTAL */}
                {viewMode === 'cenital' ? (
                  /* Top-down Architectural Canopy Symbol */
                  <PlantCanopyTopDown
                    plant={instance}
                    scale={scale}
                    isSelected={isSelected}
                    showRadius={showRadius}
                  />
                ) : (
                  /* Frontal View: Pure Transparent PNG Cutout with Ground Shadow */
                  <div className="relative">
                    <img
                      src={instance.image}
                      alt={instance.name}
                      draggable={false}
                      className="w-full h-auto object-contain pointer-events-none select-none transition-transform duration-150"
                      style={{
                        transform: instance.flipped ? 'scaleX(-1)' : 'none',
                        filter: isSelected
                          ? 'drop-shadow(0 20px 16px rgba(0,0,0,0.65)) drop-shadow(0 0 8px rgba(16,185,129,0.5))'
                          : 'drop-shadow(0 15px 12px rgba(0,0,0,0.5)) drop-shadow(0 3px 5px rgba(0,0,0,0.3))',
                      }}
                    />
                  </div>
                )}

                {/* Discreet Species Label on Hover/Selection */}
                <div
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-lg pointer-events-none transition-opacity duration-200 z-30 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {instance.name} {viewMode === 'cenital' && `• Ø ${instance.canopyDiameter || '1.2m'}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
