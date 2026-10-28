import React from 'react';
import { POT_OPTIONS } from '../data/plantData';

/**
 * Photorealistic Top-Down Botanical Canopy Component
 * Renders high-resolution transparent foliage cutouts seen from above
 * with realistic ground shadows, metric adult growth diameter rings,
 * and planter pot / direct ground indicators.
 */
export default function PlantCanopyTopDown({ plant, scale = 1, isSelected, showRadius = true }) {
  const currentDiameter = plant.diameterMeters 
    ? `${plant.diameterMeters.toFixed(1)} m` 
    : plant.canopyDiameter || '1.2 m';
  const stageLabel = plant.stage === 'joven' ? '🌱 Joven' : plant.stage === 'mediana' ? '🌿 Mediana' : '🌳 Adulta';
  const topImage = plant.topImage || '/plants/top_monstera.png';

  const potOption = POT_OPTIONS.find((p) => p.id === (plant.potType || 'matera')) || POT_OPTIONS[0];
  const isGround = (plant.potType || 'matera') === 'tierra';

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Adult Canopy Growth Perimeter Halo (Dashed Circle) */}
      {showRadius && (
        <div
          className={`absolute rounded-full border-2 border-dashed transition-all duration-200 pointer-events-none ${
            isSelected
              ? 'border-emerald-400 bg-emerald-500/10 scale-105'
              : 'border-emerald-500/35 group-hover:border-emerald-400/60'
          }`}
          style={{
            width: '120%',
            height: '120%',
          }}
        >
          {/* Metric Adult Diameter & Pot Tag */}
          {isSelected && (
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-900/95 text-emerald-300 border border-emerald-500/40 shadow-md whitespace-nowrap flex items-center gap-1.5">
              <span>{stageLabel}</span>
              <span className="text-white">Ø {currentDiameter}</span>
              <span className="text-amber-300 border-l border-slate-700 pl-1.5">{potOption.shortName}</span>
            </span>
          )}
        </div>
      )}

      {/* Photorealistic Top-Down Plant Cutout Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={topImage}
          alt={plant.name}
          draggable={false}
          className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
          style={{
            filter: isSelected
              ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.25)) drop-shadow(0 0 6px rgba(16,185,129,0.35))'
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        />

        {/* Center Planter Pot or Direct Soil Root Ring */}
        {isGround ? (
          /* Direct ground: subtle natural dark soil ring */
          <div 
            className="absolute w-3.5 h-3.5 rounded-full border border-dashed border-amber-600/70 bg-[#25150b]/80 shadow-sm pointer-events-none flex items-center justify-center"
            title="Sembrado en tierra directa"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        ) : (
          /* Planter pot: clear geometric pot perimeter with pot color */
          <div 
            className="absolute w-4 h-4 rounded-full border-2 shadow-md pointer-events-none flex items-center justify-center"
            style={{ 
              backgroundColor: potOption.color,
              borderColor: potOption.borderColor || '#cbd5e1'
            }}
            title={potOption.name}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900/90" />
          </div>
        )}
      </div>
    </div>
  );
}
