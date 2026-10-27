import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DesignCanvas from './components/DesignCanvas';
import PlantCatalog from './components/PlantCatalog';
import FloatingSummaryPanel from './components/FloatingSummaryPanel';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { TEMPLATE_BACKGROUNDS, PLANT_CATALOG } from './data/plantData';

export default function App() {
  // Background State
  const [currentBackground, setCurrentBackground] = useState(TEMPLATE_BACKGROUNDS[0]);

  // Placed plants on canvas
  const [placedPlants, setPlacedPlants] = useState(() => {
    // Initial starter demo plants so the canvas looks lively right away!
    return [
      {
        instanceId: 'starter-1',
        plantId: 'monstera-deliciosa',
        name: 'Monstera Deliciosa',
        image: '/plants/monstera-deliciosa.png',
        topImage: '/plants/top_monstera.png',
        canopyDiameter: '1.4 m',
        category: 'Sombra',
        price: 18500,
        x: 32,
        y: 72,
        scale: 1.15,
        flipped: false,
        zIndex: 10,
      },
      {
        instanceId: 'starter-2',
        plantId: 'palmera-areca',
        name: 'Palmera Areca',
        image: '/plants/palmera-areca.png',
        topImage: '/plants/top_palm.png',
        canopyDiameter: '2.0 m',
        category: 'Semisombra',
        price: 24000,
        x: 70,
        y: 65,
        scale: 1.35,
        flipped: true,
        zIndex: 8,
      },
      {
        instanceId: 'starter-3',
        plantId: 'lavanda-floral',
        name: 'Lavanda en Maceta',
        image: '/plants/lavanda-floral.png',
        topImage: '/plants/top_flower.png',
        canopyDiameter: '0.8 m',
        category: 'Sol',
        price: 7500,
        x: 52,
        y: 82,
        scale: 0.95,
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
  const handleAddPlantDirectly = (plant, customX = null, customY = null) => {
    // If no coordinates provided, place near center with slight natural offset
    const jitterX = (Math.random() - 0.5) * 16;
    const jitterY = (Math.random() - 0.5) * 14;

    const posX = customX !== null ? customX : Math.max(15, Math.min(85, 50 + jitterX));
    const posY = customY !== null ? customY : Math.max(25, Math.min(80, 65 + jitterY));

    const newInstance = {
      instanceId: `plant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      plantId: plant.id,
      name: plant.name,
      image: plant.image,
      topImage: plant.topImage || '/plants/top_monstera.png',
      canopyDiameter: plant.canopyDiameter || '1.2 m',
      category: plant.category,
      price: plant.price || 0,
      x: posX,
      y: posY,
      scale: 1.0,
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
    placedPlants.forEach((p) => {
      counts[p.plantId] = (counts[p.plantId] || 0) + 1;
    });

    const list = Object.keys(counts).map((plantId) => {
      const plantDef =
        PLANT_CATALOG.find((p) => p.id === plantId) ||
        placedPlants.find((p) => p.plantId === plantId);
      return {
        plant: plantDef,
        count: counts[plantId],
      };
    });

    const totalPrice = placedPlants.reduce((acc, curr) => acc + (curr.price || 0), 0);

    return {
      summaryList: list,
      placedPlantsCountBySpecies: counts,
      totalEstimatedPrice: totalPrice,
    };
  }, [placedPlants]);

  // Modifiers from the summary panel
  const handleIncrementSpecies = (plant) => {
    handleAddPlantDirectly(plant);
  };

  const handleDecrementSpecies = (plantId) => {
    setPlacedPlants((prev) => {
      // Find the last instance of this species and remove it
      const reversedIndex = [...prev].reverse().findIndex((p) => p.plantId === plantId);
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
      />

      {/* Modals */}
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
