import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Sun, 
  CloudSun, 
  Moon, 
  Sparkles, 
  Check, 
  X,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { PLANT_CATALOG } from '../data/plantData';

export default function PlantCatalog({ onAddPlant, placedPlantsCountBySpecies }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [justAddedId, setJustAddedId] = useState(null);

  const categories = ['Todas', 'Sol', 'Sombra', 'Semisombra'];

  const filteredPlants = useMemo(() => {
    return PLANT_CATALOG.filter((plant) => {
      const matchesSearch =
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Todas' || plant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddWithFeedback = (plant) => {
    onAddPlant(plant);
    setJustAddedId(plant.id);
    setTimeout(() => {
      setJustAddedId((curr) => (curr === plant.id ? null : curr));
    }, 600);
  };

  const handleDragStart = (e, plant) => {
    e.dataTransfer.setData('application/json', JSON.stringify(plant));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Sol':
        return <Sun className="w-3 h-3 text-amber-400" />;
      case 'Semisombra':
        return <CloudSun className="w-3 h-3 text-teal-400" />;
      case 'Sombra':
      default:
        return <Moon className="w-3 h-3 text-indigo-400" />;
    }
  };

  return (
    <aside className="w-full lg:w-96 h-full flex flex-col bg-slate-900 border-l border-slate-800 shrink-0 select-none">
      {/* Sidebar Top Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                Catálogo de Plantas
              </h2>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Plantas PNG sin fondo listas
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredPlants.length} especies
          </span>
        </div>

        {/* Real-time Search Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre (ej: Monstera, Areca, Olivo...)"
            className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plants Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredPlants.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-semibold text-slate-400 mb-1">
              No encontramos plantas con ese criterio
            </p>
            <p className="text-xs text-slate-500 mb-3">
              Prueba buscando por otra especie o quita los filtros.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
              }}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          filteredPlants.map((plant) => {
            const placedCount = placedPlantsCountBySpecies[plant.id] || 0;
            const isJustAdded = justAddedId === plant.id;

            return (
              <div
                key={plant.id}
                draggable
                onDragStart={(e) => handleDragStart(e, plant)}
                className="group relative bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/70 hover:border-emerald-500/50 p-2.5 flex items-center gap-3 transition-all duration-200 shadow-md hover:shadow-emerald-950/20 cursor-grab active:cursor-grabbing"
              >
                {/* Transparent Plant Cutout Preview on Radial Glow Backdrop */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/60 flex items-center justify-center p-1">
                  {/* Subtle pedestal glow */}
                  <div className="absolute inset-x-2 bottom-1 h-3 bg-emerald-500/10 rounded-full blur-xs" />
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-115 transition-transform duration-300 filter drop-shadow-md"
                    loading="lazy"
                  />
                  {/* Category icon badge */}
                  <span className="absolute bottom-1 right-1 bg-slate-950/80 backdrop-blur-xs p-1 rounded-md border border-slate-700/70 flex items-center justify-center">
                    {getCategoryIcon(plant.category)}
                  </span>
                </div>

                {/* Plant Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <h3 className="font-heading font-bold text-sm text-white truncate group-hover:text-emerald-300 transition-colors">
                      {plant.name}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-400 italic truncate mb-1">
                    {plant.scientificName}
                  </p>

                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {plant.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Diámetro de copa adulta en metros">
                      Ø {plant.canopyDiameter || '1.2 m'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {plant.height}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      ${plant.price.toLocaleString('es-AR')}
                    </span>

                    {/* Placed badge if already on canvas */}
                    {placedCount > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-800">
                        {placedCount} en jardín
                      </span>
                    )}
                  </div>

                  {/* Direct Size Selection Buttons */}
                  <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-slate-700/60">
                    <span className="text-[9px] text-slate-400 font-bold mr-0.5">Tamaño:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddWithFeedback({ ...plant, defaultStage: 'joven' });
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900/90 hover:bg-emerald-600 text-slate-300 hover:text-white font-semibold border border-slate-700/80 transition-colors"
                      title="Añadir como planta joven / maceta pequeña de vivero"
                    >
                      🌱 Joven
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddWithFeedback({ ...plant, defaultStage: 'mediana' });
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900/90 hover:bg-emerald-600 text-slate-300 hover:text-white font-semibold border border-slate-700/80 transition-colors"
                      title="Añadir en tamaño mediano de crecimiento"
                    >
                      🌿 Med
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddWithFeedback({ ...plant, defaultStage: 'adulta' });
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900/90 hover:bg-emerald-600 text-slate-300 hover:text-white font-semibold border border-slate-700/80 transition-colors"
                      title="Añadir como planta adulta madura a escala real"
                    >
                      🌳 Adulta
                    </button>
                  </div>
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => handleAddWithFeedback(plant)}
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isJustAdded
                      ? 'bg-emerald-500 text-slate-950 scale-105'
                      : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-500 shadow-sm'
                  }`}
                  title="Añadir planta al jardín"
                >
                  {isJustAdded ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Helper Note (clears mobile bottom bar) */}
      <div className="p-3 mb-16 lg:mb-0 bg-slate-950/60 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-400">
          🌿 Todas las plantas vienen <strong className="text-emerald-400">recortadas sin fondo</strong> para ubicarlas libremente
        </p>
      </div>
    </aside>
  );
}
