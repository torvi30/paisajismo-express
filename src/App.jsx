import React, { useState, useMemo, useEffect } from 'react';
import { Eye, Sprout, Ruler, MessageCircle } from 'lucide-react';
import Header from './components/Header';
import DesignCanvas from './components/DesignCanvas';
import PlantCatalog from './components/PlantCatalog';
import FloatingSummaryPanel from './components/FloatingSummaryPanel';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import SpaceDimensionsModal from './components/SpaceDimensionsModal';
import { TEMPLATE_BACKGROUNDS, PLANT_CATALOG, POT_OPTIONS } from './data/plantData';

export default function App() {
  // Background State
  const [currentBackground, setCurrentBackground] = useState(TEMPLATE_BACKGROUNDS[0]);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Placed plants on canvas
  const [placedPlants, setPlacedPlants] = useState(() => {
    // Initial starter demo plants calibrated to scale
    return [
      {
        instanceId: 'starter-1',
        plantId: 'monstera-deliciosa',
        name: 'Monstera Deliciosa',
        image: '/plants/monstera-deliciosa.png',
        groundImage: '/plants/ground_monstera-deliciosa.png',
        topImage: '/plants/top_monstera.png',
        canopyDiameter: '1.4 m',
        baseDiameterMeters: 1.4,
        diameterMeters: 1.4,
        stage: 'adulta',
        potType: 'matera',
        potPrice: 0,
        category: 'Sombra',
        price: 18500,
        x: 32,
        y: 72,
        scale: 1.0,
        flipped: false,
        zIndex: 10,
      },
      {
        instanceId: 'starter-2',
        plantId: 'palmera-areca',
        name: 'Palmera Areca',
        image: '/plants/palmera-areca.png',
        groundImage: '/plants/ground_palmera-areca.png',
        topImage: '/plants/top_palm.png',
        canopyDiameter: '2.0 m',
        baseDiameterMeters: 2.0,
        diameterMeters: 2.0,
        stage: 'adulta',
        potType: 'matera',
        potPrice: 0,
        category: 'Semisombra',
        price: 24000,
        x: 70,
        y: 65,
        scale: 1.0,
        flipped: true,
        zIndex: 8,
      },
      {
        instanceId: 'starter-3',
        plantId: 'crotos',
        name: 'Crotos',
        image: '/plants/crotos.png',
        groundImage: '/plants/ground_crotos.png',
        topImage: '/plants/top_tree.png',
        canopyDiameter: '1.0 m',
        baseDiameterMeters: 1.0,
        diameterMeters: 1.0,
        stage: 'adulta',
        potType: 'matera',
        potPrice: 0,
        category: 'Sol',
        price: 16000,
        x: 52,
        y: 82,
        scale: 1.0,
        flipped: false,
        zIndex: 12,
      }
    ];
  });

  const [selectedPlantId, setSelectedPlantId] = useState(null);

  // Settings State with LocalStorage
  const [nurseryPhone, setNurseryPhone] = useState(() => {
    return localStorage.getItem('pe_nursery_phone') || '+5491134567890';
  });
  const [nurseryName, setNurseryName] = useState(() => {
    return localStorage.getItem('pe_nursery_name') || 'Vivero Paisajismo Express';
  });

  useEffect(() => {
    localStorage.setItem('pe_nursery_phone', nurseryPhone);
  }, [nurseryPhone]);

  useEffect(() => {
    localStorage.setItem('pe_nursery_name', nurseryName);
  }, [nurseryName]);

  // Mobile active tab ('canvas' | 'catalog')
  const [activeTab, setActiveTab] = useState('canvas');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // View Mode: 'frontal' (perspective / elevation) vs 'cenital' (2D top-down master plan)
  const [viewMode, setViewModeState] = useState('frontal');
  const [showGrid, setShowGrid] = useState(true);
  const [showRadius, setShowRadius] = useState(true);

  // Real Terrain / Space Dimensions in Meters (Width x Length)
  const [spaceDimensions, setSpaceDimensions] = useState(() => {
    const saved = localStorage.getItem('pe_space_dimensions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { width: 10, length: 8 };
  });

  useEffect(() => {
    localStorage.setItem('pe_space_dimensions', JSON.stringify(spaceDimensions));
  }, [spaceDimensions]);

  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Floating summary panel dock position ('bottom' | 'top')
  const [panelPosition, setPanelPosition] = useState(() => {
    return localStorage.getItem('pe_panel_position') || 'bottom';
  });

  const handleTogglePanelPosition = () => {
    setPanelPosition((prev) => (prev === 'bottom' ? 'top' : 'bottom'));
  };

  useEffect(() => {
    localStorage.setItem('pe_panel_position', panelPosition);
  }, [panelPosition]);

  const setViewMode = (newMode) => {
    setViewModeState(newMode);
    // If using a preset background (not custom), suggest the default background of the new mode
    if (!currentBackground.isCustom) {
      const matchingBg = TEMPLATE_BACKGROUNDS.find((bg) => bg.mode === newMode);
      if (matchingBg) {
        setCurrentBackground(matchingBg);
      }
    }
  };

  // Background selection handlers
  const handleSelectBackground = (bg) => {
    setCurrentBackground(bg);
  };

  const handleUploadCustomImage = (dataUri, fileName) => {
    setCurrentBackground({
      id: `custom-${Date.now()}`,
      name: fileName ? `Mi Foto (${fileName.slice(0, 16)})` : (viewMode === 'cenital' ? 'Foto Satélite / Dron' : 'Mi Espacio Propio'),
      subtitle: 'Foto personalizada subida',
      url: dataUri,
      isCustom: true,
      mode: viewMode,
    });
  };

  // Add plant to canvas directly (from sidebar click or drop)
  const handleAddPlantDirectly = (plant, customX = null, customY = null, customPotType = null) => {
    // If no coordinates provided, place near center with slight natural offset
    const jitterX = (Math.random() - 0.5) * 16;
    const jitterY = (Math.random() - 0.5) * 14;

    const posX = customX !== null ? customX : Math.max(15, Math.min(85, 50 + jitterX));
    const posY = customY !== null ? customY : Math.max(25, Math.min(80, 65 + jitterY));

    const baseDiameter = parseFloat(plant.canopyDiameter) || 1.4;
    const stage = plant.defaultStage || 'adulta';
    const multiplier = stage === 'joven' ? 0.55 : stage === 'mediana' ? 0.8 : 1.0;
    const startDiameter = Number((baseDiameter * multiplier).toFixed(1));
    const potType = customPotType || plant.defaultPotType || 'matera';
    const potOption = POT_OPTIONS.find((p) => p.id === potType) || POT_OPTIONS[0];

    const newInstance = {
      instanceId: `plant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      plantId: plant.id,
      name: plant.name,
      image: plant.image,
      groundImage: plant.groundImage || (plant.image?.startsWith('/plants/') ? plant.image.replace('/plants/', '/plants/ground_') : plant.image),
      topImage: plant.topImage || '/plants/top_monstera.png',
      canopyDiameter: plant.canopyDiameter || `${baseDiameter} m`,
      baseDiameterMeters: baseDiameter,
      diameterMeters: startDiameter,
      stage: stage,
      potType: potType,
      potPrice: potOption.price || 0,
      category: plant.category,
      price: plant.price || 0,
      x: posX,
      y: posY,
      scale: Number(multiplier.toFixed(2)),
      flipped: false,
      zIndex: placedPlants.length + 10,
    };

    setPlacedPlants((prev) => [...prev, newInstance]);
    setSelectedPlantId(newInstance.instanceId);

    // If on mobile and in catalog tab, notify or switch view
    if (activeTab === 'catalog') {
      setActiveTab('canvas');
    }
  };

  // Clear all plants
  const handleClearCanvas = () => {
    if (window.confirm('¿Deseas vaciar todas las plantas del lienzo para empezar de cero?')) {
      setPlacedPlants([]);
      setSelectedPlantId(null);
    }
  };

  // Summary counts and prices
  const { summaryList, placedPlantsCountBySpecies, totalEstimatedPrice } = useMemo(() => {
    const counts = {};
    const groupMap = {};

    placedPlants.forEach((p) => {
      counts[p.plantId] = (counts[p.plantId] || 0) + 1;
      const potType = p.potType || 'matera';
      const key = `${p.plantId}__${potType}`;

      if (!groupMap[key]) {
        const plantDef =
          PLANT_CATALOG.find((cat) => cat.id === p.plantId) ||
          placedPlants.find((item) => item.plantId === p.plantId);
        const potOption = POT_OPTIONS.find((pot) => pot.id === potType) || POT_OPTIONS[0];

        groupMap[key] = {
          key,
          plantId: p.plantId,
          plant: { ...plantDef, diameterMeters: p.diameterMeters, stage: p.stage },
          potType,
          potOption,
          count: 0,
          totalPrice: 0,
        };
      }
      const unitPrice = (p.price || 0) + (p.potPrice || 0);
      groupMap[key].count += 1;
      groupMap[key].totalPrice += unitPrice;
    });

    const list = Object.values(groupMap);
    const totalPrice = placedPlants.reduce((acc, curr) => acc + (curr.price || 0) + (curr.potPrice || 0), 0);

    return {
      summaryList: list,
      placedPlantsCountBySpecies: counts,
      totalEstimatedPrice: totalPrice,
    };
  }, [placedPlants]);

  // Modifiers from the summary panel
  const handleIncrementSpecies = (plant, potType = 'matera') => {
    handleAddPlantDirectly({ ...plant, defaultPotType: potType });
  };

  const handleDecrementSpecies = (plantId, potType = null) => {
    setPlacedPlants((prev) => {
      // Find the last instance matching plantId and optional potType
      const reversedIndex = [...prev].reverse().findIndex((p) => {
        if (p.plantId !== plantId) return false;
        if (potType && (p.potType || 'matera') !== potType) return false;
        return true;
      });
      if (reversedIndex === -1) return prev;
      const actualIndex = prev.length - 1 - reversedIndex;
      return prev.filter((_, idx) => idx !== actualIndex);
    });
  };

  const handleRemoveSpecies = (plantId) => {
    setPlacedPlants((prev) => prev.filter((p) => p.plantId !== plantId));
    if (selectedPlantId && placedPlants.find((p) => p.instanceId === selectedPlantId)?.plantId === plantId) {
      setSelectedPlantId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Application Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentBackground={currentBackground}
        onSelectBackground={handleSelectBackground}
        onUploadCustomImage={handleUploadCustomImage}
        placedCount={placedPlants.length}
        onClearCanvas={handleClearCanvas}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showRadius={showRadius}
        setShowRadius={setShowRadius}
        panelPosition={panelPosition}
        onTogglePanelPosition={handleTogglePanelPosition}
        spaceDimensions={spaceDimensions}
        onOpenSpaceModal={() => setIsSpaceModalOpen(true)}
        isMeasuring={isMeasuring}
        setIsMeasuring={setIsMeasuring}
      />

      {/* Main Split Screen Area */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        {/* Left Side: Interactive Canvas */}
        <section
          className={`flex-1 h-full min-h-0 relative ${
            activeTab === 'catalog' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <DesignCanvas
            viewMode={viewMode}
            showGrid={showGrid}
            showRadius={showRadius}
            background={currentBackground}
            onSelectBackground={handleSelectBackground}
            onUploadCustomImage={handleUploadCustomImage}
            placedPlants={placedPlants}
            setPlacedPlants={setPlacedPlants}
            selectedPlantId={selectedPlantId}
            setSelectedPlantId={setSelectedPlantId}
            onAddPlantDirectly={handleAddPlantDirectly}
            panelPosition={panelPosition}
            onTogglePanelPosition={handleTogglePanelPosition}
            spaceDimensions={spaceDimensions}
            isMeasuring={isMeasuring}
            setIsMeasuring={setIsMeasuring}
          />
        </section>

        {/* Right Side: Plant Catalogue Sidebar */}
        <section
          className={`h-full min-h-0 ${
            activeTab === 'canvas' ? 'hidden lg:flex' : 'flex w-full'
          }`}
        >
          <PlantCatalog
            onAddPlant={handleAddPlantDirectly}
            placedPlantsCountBySpecies={placedPlantsCountBySpecies}
          />
        </section>
      </main>

      {/* Floating Bottom/Top Quotation & WhatsApp Summary Panel */}
      <FloatingSummaryPanel
        summaryList={summaryList}
        totalPlantsCount={placedPlants.length}
        totalEstimatedPrice={totalEstimatedPrice}
        currentBackground={currentBackground}
        nurseryPhone={nurseryPhone}
        onClearAll={handleClearCanvas}
        onIncrementSpecies={handleIncrementSpecies}
        onDecrementSpecies={handleDecrementSpecies}
        onRemoveSpecies={handleRemoveSpecies}
        panelPosition={panelPosition}
        onTogglePanelPosition={handleTogglePanelPosition}
        spaceDimensions={spaceDimensions}
        isExpanded={isSummaryExpanded}
        setIsExpanded={setIsSummaryExpanded}
        activeTab={activeTab}
      />

      {/* Mobile Bottom Navigation Bar (Phone & Tablet < lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-emerald-900/30 z-50 px-2 flex items-center justify-around select-none">
        {/* Tab: Lienzo */}
        <button
          onClick={() => {
            setActiveTab('canvas');
            setIsSummaryExpanded(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'canvas' && !isSummaryExpanded ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Lienzo</span>
        </button>

        {/* Tab: Catálogo de Plantas */}
        <button
          onClick={() => {
            setActiveTab('catalog');
            setIsSummaryExpanded(false);
          }}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'catalog' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Plantas</span>
          {placedPlants.length > 0 && (
            <span className="absolute top-0.5 right-[22%] w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] font-black flex items-center justify-center shadow-sm">
              {placedPlants.length}
            </span>
          )}
        </button>

        {/* Action: Medidas del Espacio */}
        <button
          onClick={() => setIsSpaceModalOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Ruler className="w-5 h-5 mb-0.5 text-emerald-400" />
          <span className="text-[10px] font-mono tracking-tight">{spaceDimensions.width}×{spaceDimensions.length}m</span>
        </button>

        {/* Action: Cotizar / WhatsApp */}
        <button
          onClick={() => {
            setActiveTab('canvas');
            setIsSummaryExpanded((prev) => !prev);
          }}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isSummaryExpanded ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-0.5 text-emerald-400" />
          <span className="text-[10px] tracking-tight">Cotizar</span>
          {placedPlants.length > 0 && (
            <span className="absolute top-1 right-[22%] w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>
      </nav>

      {/* Modals */}
      <SpaceDimensionsModal
        isOpen={isSpaceModalOpen}
        onClose={() => setIsSpaceModalOpen(false)}
        spaceDimensions={spaceDimensions}
        onSaveDimensions={setSpaceDimensions}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        nurseryPhone={nurseryPhone}
        setNurseryPhone={setNurseryPhone}
        nurseryName={nurseryName}
        setNurseryName={setNurseryName}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
