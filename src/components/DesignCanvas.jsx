import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Info,
  Ruler,
  Check,
  X,
  Sprout
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
  onTogglePanelPosition,
  spaceDimensions = { width: 10, length: 8 },
  isMeasuring = false,
  setIsMeasuring
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

  // Track canvas pixel dimensions for real-scale calculations
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const updateDimensions = () => {
      if (canvasRef.current) {
        setCanvasDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Real Pixels Per Meter ratio (1 real meter = pixelsPerMeterX pixels on canvas)
  const pixelsPerMeterX = canvasDimensions.width / (spaceDimensions.width || 10);
  const pixelsPerMeterY = canvasDimensions.height / (spaceDimensions.length || 8);

  // Interactive Drag-to-Resize Handle State (Mouse & Touch corner handle)
  const [resizingInstanceId, setResizingInstanceId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ startX: 0, startDiameter: 1.4 });

  const handleResizePointerDown = (e, instance) => {
    e.stopPropagation();
    e.preventDefault();
    const currentDiameter = instance.diameterMeters || (instance.baseDiameterMeters || parseFloat(instance.canopyDiameter) || 1.4);
    setResizingInstanceId(instance.instanceId);
    setResizeStart({
      startX: e.clientX,
      startDiameter: currentDiameter,
    });
  };

  useEffect(() => {
    if (!resizingInstanceId) return;

    const handleResizePointerMove = (e) => {
      const dxPixels = e.clientX - resizeStart.startX;
      const dxMeters = (dxPixels / (pixelsPerMeterX || 100));
      const nextDiameter = Math.max(0.3, Math.min(8.0, Number((resizeStart.startDiameter + dxMeters).toFixed(1))));

      setPlacedPlants((prev) =>
        prev.map((item) => {
          if (item.instanceId !== resizingInstanceId) return item;
          const base = item.baseDiameterMeters || parseFloat(item.canopyDiameter) || 1.4;
          return {
            ...item,
            diameterMeters: nextDiameter,
            scale: Number((nextDiameter / base).toFixed(2)),
            stage: nextDiameter < base * 0.65 ? 'joven' : nextDiameter < base * 0.9 ? 'mediana' : 'adulta',
          };
        })
      );
    };

    const handleResizePointerUp = () => {
      setResizingInstanceId(null);
    };

    window.addEventListener('pointermove', handleResizePointerMove);
    window.addEventListener('pointerup', handleResizePointerUp);
    return () => {
      window.removeEventListener('pointermove', handleResizePointerMove);
      window.removeEventListener('pointerup', handleResizePointerUp);
    };
  }, [resizingInstanceId, resizeStart, pixelsPerMeterX, setPlacedPlants]);

  // Measuring Tape (Cinta métrica) State
  const [measureA, setMeasureA] = useState(null); // { x: %, y: % }
  const [measureB, setMeasureB] = useState(null); // { x: %, y: % }
  const [isDrawingMeasure, setIsDrawingMeasure] = useState(false);

  const measuredDistance = useMemo(() => {
    if (!measureA || !measureB) return null;
    const dxMeters = ((measureB.x - measureA.x) / 100) * (spaceDimensions.width || 10);
    const dyMeters = ((measureB.y - measureA.y) / 100) * (spaceDimensions.length || 8);
    return Math.sqrt(dxMeters * dxMeters + dyMeters * dyMeters);
  }, [measureA, measureB, spaceDimensions]);

  const handleCanvasClick = (e) => {
    if (isMeasuring) {
      const rect = canvasRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      if (!measureA || (measureA && measureB && !isDrawingMeasure)) {
        // Start new measurement
        setMeasureA({ x: xPercent, y: yPercent });
        setMeasureB(null);
        setIsDrawingMeasure(true);
      } else if (isDrawingMeasure) {
        // Lock measurement
        setMeasureB({ x: xPercent, y: yPercent });
        setIsDrawingMeasure(false);
      }
      return;
    }
    setSelectedPlantId(null);
  };

  const handleCanvasMouseMove = (e) => {
    if (isMeasuring && isDrawingMeasure && measureA && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setMeasureB({ x: xPercent, y: yPercent });
    }
  };

  const handleClearMeasurement = () => {
    setMeasureA(null);
    setMeasureB(null);
    setIsDrawingMeasure(false);
  };

  // Plant Growth Stage Modifier: Joven (Pequeña), Mediana, Adulta (Grande)
  const handleSetStage = (e, instanceId, newStage) => {
    e.stopPropagation();
    setPlacedPlants((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const base = item.baseDiameterMeters || parseFloat(item.canopyDiameter) || 1.4;
        const multiplier = newStage === 'joven' ? 0.55 : newStage === 'mediana' ? 0.8 : 1.0;
        const newDiameter = Number((base * multiplier).toFixed(1));
        return {
          ...item,
          stage: newStage,
          diameterMeters: newDiameter,
          scale: Number(multiplier.toFixed(2)),
        };
      })
    );
  };

  // Fine Diameter Stepper (+ / - in meters)
  const handleAdjustDiameter = (e, instanceId, delta) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setPlacedPlants((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const current = item.diameterMeters || (item.baseDiameterMeters || parseFloat(item.canopyDiameter) || 1.4);
        const nextDiameter = Math.max(0.3, Math.min(8.0, Number((current + delta).toFixed(1))));
        const base = item.baseDiameterMeters || parseFloat(item.canopyDiameter) || 1.4;
        return {
          ...item,
          diameterMeters: nextDiameter,
          scale: Number((nextDiameter / base).toFixed(2)),
          stage: nextDiameter < base * 0.65 ? 'joven' : nextDiameter < base * 0.9 ? 'mediana' : 'adulta',
        };
      })
    );
  };

  // Direct Exact Meter Input Handler
  const handleSetExactDiameter = (instanceId, exactValue) => {
    const num = Math.max(0.3, Math.min(8.0, Number(exactValue) || 1.4));
    const rounded = Number(num.toFixed(1));
    setPlacedPlants((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const base = item.baseDiameterMeters || parseFloat(item.canopyDiameter) || 1.4;
        return {
          ...item,
          diameterMeters: rounded,
          scale: Number((rounded / base).toFixed(2)),
          stage: rounded < base * 0.65 ? 'joven' : rounded < base * 0.9 ? 'mediana' : 'adulta',
        };
      })
    );
  };

  const handleResize = (e, instanceId, delta) => {
    e.stopPropagation();
    handleAdjustDiameter(e, instanceId, delta > 0 ? 0.1 : -0.1);
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
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none isolate">
      {/* Top Floating Ribbon inside Canvas: Background selector pill + Space scale pill */}
      <div className={`absolute ${isAtTop ? 'bottom-3' : 'top-3'} left-3 right-3 z-20 flex items-center justify-between pointer-events-none transition-all duration-300`}>
        {/* Active Background Badge & Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg">
          <span className="text-[11px] font-semibold text-slate-300 px-2 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[110px] sm:max-w-[160px] truncate">{background.name}</span>
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors font-medium"
            title={viewMode === 'cenital' ? "Subir foto satelital de Google Maps o dron" : "Subir foto de fachada o patio"}
          >
            <Upload className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">{background.isCustom ? 'Cambiar Foto' : viewMode === 'cenital' ? 'Subir Satélite/Dron' : 'Subir Mi Foto'}</span>
            <span className="sm:hidden">{background.isCustom ? 'Foto' : 'Subir'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Space scale and selection info pill */}
        <div className="pointer-events-auto flex items-center gap-2 p-1 px-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono">
            {viewMode === 'cenital' ? (
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
            <span>
              {spaceDimensions.width}m × {spaceDimensions.length}m
              <span className="hidden sm:inline"> ({spaceDimensions.width * spaceDimensions.length}m²)</span>
            </span>
          </div>
          {selectedPlant && (
            <span className="hidden md:flex text-[11px] text-slate-300 border-l border-slate-700 pl-2 font-mono items-center gap-1">
              <span className="font-bold text-white truncate max-w-[90px]">{selectedPlant.name}</span>
              <span className="text-emerald-400 font-bold">
                (Ø {(selectedPlant.diameterMeters || parseFloat(selectedPlant.canopyDiameter) || 1.4).toFixed(1)}m)
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Universal Plant Dimension & Control Bar (Always visible when a plant is selected, NEVER cut off) */}
      {selectedPlant && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] max-w-2xl bg-slate-900/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl border border-emerald-500/50 shadow-2xl animate-fadeIn flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          {/* Left: Plant Name, Base adult size & Space footprint */}
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Sprout className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-heading font-extrabold text-white truncate max-w-[130px] sm:max-w-[160px]">
                    {selectedPlant.name}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-300 font-mono font-bold rounded border border-emerald-500/20">
                    Ø {(selectedPlant.diameterMeters || 1.4).toFixed(1)}m
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Suelo: {(Math.PI * Math.pow((selectedPlant.diameterMeters || 1.4) / 2, 2)).toFixed(1)} m² de espacio
                </p>
              </div>
            </div>

            {/* Mobile Actions (Visible on < sm) */}
            <div className="flex items-center gap-1 sm:hidden shrink-0">
              {viewMode === 'frontal' && (
                <button
                  onClick={(e) => handleFlip(e, selectedPlant.instanceId)}
                  className={`p-1.5 rounded-lg text-xs font-semibold ${selectedPlant.flipped ? 'bg-emerald-600/30 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}
                  title="Invertir orientación"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => handleDuplicate(e, selectedPlant)}
                className="p-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                title="Duplicar planta"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => handleDelete(e, selectedPlant.instanceId)}
                className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs font-semibold"
                title="Eliminar planta"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedPlantId(null)}
                className="p-1.5 bg-slate-800 text-slate-400 rounded-lg"
                title="Deseleccionar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center: Growth Stage Presets (🌱 Joven / 🌿 Mediana / 🌳 Adulta) */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-700/80 w-full sm:w-auto justify-around sm:justify-start">
            <button
              onClick={(e) => handleSetStage(e, selectedPlant.instanceId, 'joven')}
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                (selectedPlant.stage || 'adulta') === 'joven'
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Planta joven / maceta inicial de vivero (~55% de copa adulta)"
            >
              🌱 Joven
            </button>
            <button
              onClick={(e) => handleSetStage(e, selectedPlant.instanceId, 'mediana')}
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                (selectedPlant.stage || 'adulta') === 'mediana'
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Planta mediana (~80% de copa adulta, 1-2 años de crecimiento)"
            >
              🌿 Mediana
            </button>
            <button
              onClick={(e) => handleSetStage(e, selectedPlant.instanceId, 'adulta')}
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                (selectedPlant.stage || 'adulta') === 'adulta'
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Planta adulta / madura (100% de copa desarrollada)"
            >
              🌳 Adulta
            </button>
          </div>

          {/* Right: Exact Meter Stepper & Direct Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center bg-slate-950/90 px-2 py-1 rounded-xl border border-slate-700/80">
              <button
                onClick={(e) => handleAdjustDiameter(e, selectedPlant.instanceId, -0.1)}
                className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white font-black text-sm"
                title="Achicar 10 centímetros"
              >
                -
              </button>
              <div className="flex items-center px-1">
                <input
                  type="number"
                  min="0.3"
                  max="8.0"
                  step="0.1"
                  value={(selectedPlant.diameterMeters || 1.4).toFixed(1)}
                  onChange={(e) => handleSetExactDiameter(selectedPlant.instanceId, e.target.value)}
                  className="w-12 bg-transparent text-emerald-300 font-mono font-extrabold text-xs text-center focus:outline-none"
                  title="Escribe los metros reales de ancho"
                />
                <span className="text-[10px] text-emerald-400 font-mono font-bold mr-1">m</span>
              </div>
              <button
                onClick={(e) => handleAdjustDiameter(e, selectedPlant.instanceId, 0.1)}
                className="w-6 h-6 flex items-center justify-center text-emerald-400 hover:text-emerald-300 font-black text-sm"
                title="Agrandar 10 centímetros"
              >
                +
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-1">
              {viewMode === 'frontal' && (
                <button
                  onClick={(e) => handleFlip(e, selectedPlant.instanceId)}
                  className={`p-1.5 rounded-lg text-xs font-semibold ${selectedPlant.flipped ? 'bg-emerald-600/30 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
                  title="Invertir orientación"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => handleDuplicate(e, selectedPlant)}
                className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
                title="Duplicar planta (+1)"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => handleDelete(e, selectedPlant.instanceId)}
                className="p-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg text-xs font-semibold"
                title="Eliminar del plano"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedPlantId(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg"
                title="Cerrar calibrador"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Measuring Bar Callout if measuring is active */}
      {isMeasuring && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full shadow-2xl font-heading font-extrabold text-xs animate-bounce">
          <Ruler className="w-4 h-4 stroke-[2.5]" />
          <span>
            {measureA && isDrawingMeasure
              ? 'Haz clic en el segundo punto para fijar la distancia'
              : measureA && measureB
              ? `Distancia medida: ${measuredDistance ? measuredDistance.toFixed(2) : '0'} metros`
              : 'Haz clic en el lienzo para iniciar la medición'}
          </span>
          {measureA && (
            <button
              onClick={handleClearMeasurement}
              className="ml-1 p-0.5 hover:bg-slate-950/20 rounded text-slate-950"
              title="Borrar medición"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Interactive Canvas Area with Rulers */}
      <div className="relative flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden">
        {/* Top Metric Ruler (Horizontal) */}
        {showGrid && (
          <div className="h-5 w-full bg-slate-900/90 border-b border-emerald-500/20 flex items-center text-[9px] font-mono font-bold text-slate-400 select-none z-10 pl-6 shrink-0 overflow-hidden">
            {Array.from({ length: spaceDimensions.width + 1 }).map((_, i) => (
              <div
                key={`top-ruler-${i}`}
                style={{ width: `${100 / spaceDimensions.width}%` }}
                className="relative border-l border-emerald-500/30 h-full flex items-center pl-1"
              >
                <span className={i % 5 === 0 ? 'text-emerald-300 font-extrabold' : ''}>{i}m</span>
              </div>
            ))}
          </div>
        )}

        {/* Canvas Body with Left Metric Ruler */}
        <div className="relative flex-1 w-full h-full flex min-h-0 overflow-hidden">
          {/* Left Metric Ruler (Vertical) */}
          {showGrid && (
            <div className="w-6 h-full bg-slate-900/90 border-r border-emerald-500/20 flex flex-col text-[9px] font-mono font-bold text-slate-400 select-none z-10 shrink-0 overflow-hidden">
              {Array.from({ length: spaceDimensions.length + 1 }).map((_, i) => (
                <div
                  key={`left-ruler-${i}`}
                  style={{ height: `${100 / spaceDimensions.length}%` }}
                  className="relative border-t border-emerald-500/30 w-full flex items-start justify-center pt-0.5"
                >
                  <span className={i % 5 === 0 ? 'text-emerald-300 font-extrabold' : ''}>{i}m</span>
                </div>
              ))}
            </div>
          )}

          {/* Actual Droppable Canvas Area */}
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className={`relative flex-1 w-full h-full overflow-hidden touch-none bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-950 ${
              isMeasuring ? 'cursor-crosshair' : 'cursor-default'
            }`}
            style={{
              backgroundImage: `url(${background.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Dynamic Metric Grid: EXACT 1m x 1m Cells Matching Real Terrain */}
            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                    linear-gradient(to right, rgba(16, 185, 129, 0.5) 1.5px, transparent 1.5px),
                    linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 1.5px, transparent 1.5px)
                  `,
                  backgroundSize: `
                    ${100 / spaceDimensions.width}% ${100 / spaceDimensions.length}%,
                    ${100 / spaceDimensions.width}% ${100 / spaceDimensions.length}%,
                    ${(100 / spaceDimensions.width) * 5}% ${(100 / spaceDimensions.length) * 5}%,
                    ${(100 / spaceDimensions.width) * 5}% ${(100 / spaceDimensions.length) * 5}%
                  `,
                }}
              />
            )}

            {/* Interactive Laser Tape Measure (Cinta métrica) SVG Overlay */}
            {measureA && measureB && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                <defs>
                  <marker id="measure-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                  </marker>
                </defs>
                {/* Glow shadow line */}
                <line
                  x1={`${measureA.x}%`}
                  y1={`${measureA.y}%`}
                  x2={`${measureB.x}%`}
                  y2={`${measureB.y}%`}
                  stroke="#f59e0b"
                  strokeWidth="6"
                  opacity="0.3"
                />
                {/* Main laser line */}
                <line
                  x1={`${measureA.x}%`}
                  y1={`${measureA.y}%`}
                  x2={`${measureB.x}%`}
                  y2={`${measureB.y}%`}
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  markerStart="url(#measure-arrow)"
                  markerEnd="url(#measure-arrow)"
                />
                {/* Measurement Tag at Midpoint */}
                <g transform={`translate(${(measureA.x + measureB.x) / 2}%, ${(measureA.y + measureB.y) / 2}%)`}>
                  <rect
                    x="-40"
                    y="-14"
                    width="80"
                    height="24"
                    rx="12"
                    fill="#0f172a"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {measuredDistance ? `${measuredDistance.toFixed(2)}m` : ''}
                  </text>
                </g>
              </svg>
            )}

            {/* Empty State Callout */}
            {placedPlants.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6 z-20">
                <div className="max-w-md p-5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-2xl text-center pointer-events-auto animate-fadeIn">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white mb-1">
                    Espacio métrico listo ({spaceDimensions.width}m × {spaceDimensions.length}m)
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Arrastra plantas desde el catálogo. Cada cuadrícula mide exactamente 1 metro. Al colocar ejemplares puedes elegir tamaño <b>Joven (Pequeña)</b>, <b>Mediana</b> o <b>Adulta (Grande)</b>.
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

            {/* PLACED PLANTS: MATHEMATICALLY PROPORTIONAL SIZING TO REAL TERRAIN */}
            {placedPlants.map((instance) => {
              const isSelected = selectedPlantId === instance.instanceId;
              const isDragging = draggingInstanceId === instance.instanceId;

              // Plant Diameter in real meters
              const baseDiameter = instance.baseDiameterMeters || parseFloat(instance.canopyDiameter) || 1.4;
              const plantDiameterMeters = instance.diameterMeters || (baseDiameter * (instance.scale || 1.0));
              const currentStage = instance.stage || 'adulta';

              // REAL CAD SCALE: Rendered Width in pixels proportional to space width (1:1 Exact Metric)
              const renderedWidth = Math.max(30, Math.min(800, plantDiameterMeters * pixelsPerMeterX));

              // Natural Z-Index
              const baseDepthZ = viewMode === 'frontal'
                ? Math.round(instance.y * 10) + (instance.zOffset || 0)
                : 20 + (instance.zOffset || 0);

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
                    transform: viewMode === 'cenital' ? 'translate(-50%, -50%)' : 'translate(-50%, -85%)',
                    zIndex: finalZIndex,
                  }}
                >
                  {/* Plant Container - Natural scale without sudden jumping */}
                  <div
                    className={`relative ${
                      isSelected && viewMode === 'cenital'
                        ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950/80 rounded-full'
                        : ''
                    }`}
                    style={{ width: `${renderedWidth}px`, height: viewMode === 'cenital' ? `${renderedWidth}px` : 'auto' }}
                  >
                    {/* Interactive Selection Box with CAD Dimension Line & Corner Drag Handle */}
                    {isSelected && (
                      <>
                        {/* Dashed Bounding Box */}
                        <div className="absolute -inset-1 border-2 border-emerald-400 border-dashed rounded-xl pointer-events-none z-30" />

                        {/* Real Metric Dimension Line under plant (Cota Métrica Real) */}
                        <div className="absolute -bottom-7 inset-x-0 flex items-center justify-between text-[10px] font-mono font-black text-emerald-300 pointer-events-none select-none z-30">
                          <div className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                          <div className="flex-1 border-t-2 border-emerald-400 border-dashed mx-1 flex items-center justify-center">
                            <span className="bg-slate-950/95 px-2 py-0.5 rounded-full border border-emerald-500/50 text-emerald-300 shadow-md whitespace-nowrap text-[10px] font-bold">
                              ↔ {plantDiameterMeters.toFixed(1)} m reales
                            </span>
                          </div>
                          <div className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                        </div>

                        {/* Corner Drag-to-Resize Handle (Bottom-Right, touch & mouse friendly) */}
                        <div
                          onPointerDown={(e) => handleResizePointerDown(e, instance)}
                          className="absolute -bottom-3 -right-3 w-7 h-7 bg-emerald-500 hover:bg-emerald-400 active:scale-125 text-slate-950 rounded-full flex items-center justify-center shadow-xl cursor-nwse-resize z-40 transition-transform ring-2 ring-slate-950"
                          title="Arrastra esta esquina para agrandar o achicar en metros reales"
                        >
                          <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </>
                    )}

                    {/* GRAPHIC RENDERING: CENITAL VS FRONTAL */}
                    {viewMode === 'cenital' ? (
                      <PlantCanopyTopDown
                        plant={{ ...instance, diameterMeters: plantDiameterMeters, stage: currentStage }}
                        scale={instance.scale || 1.0}
                        isSelected={isSelected}
                        showRadius={showRadius}
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={instance.image}
                          alt={instance.name}
                          draggable={false}
                          className="w-full h-auto object-contain pointer-events-none select-none transition-transform duration-150"
                          style={{
                            transform: instance.flipped ? 'scaleX(-1)' : 'none',
                            filter: 'none',
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
                      {instance.name} • Ø {plantDiameterMeters.toFixed(1)}m ({currentStage})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
