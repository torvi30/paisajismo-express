import React from 'react';

/**
 * Photorealistic Top-Down Botanical Canopy Component
 * Renders high-resolution transparent foliage cutouts seen from above
 * with realistic ground shadows and metric adult growth diameter rings.
 */
export default function PlantCanopyTopDown({ plant, scale = 1, isSelected, showRadius = true }) {
  const diameter = plant.canopyDiameter || '1.2 m';
  const topImage = plant.topImage || '/plants/top_monstera.png';

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
            width: '125%',
            height: '125%',
          }}
        >
          {/* Metric Adult Diameter Tag */}
          {isSelected && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900/90 text-emerald-300 border border-emerald-500/40 shadow-sm whitespace-nowrap">
              Ø Adulta: {diameter}
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
              ? 'drop-shadow(0 20px 16px rgba(0,0,0,0.65)) drop-shadow(0 0 10px rgba(16,185,129,0.5))'
              : 'drop-shadow(0 15px 12px rgba(0,0,0,0.55)) drop-shadow(0 3px 6px rgba(0,0,0,0.35))',
          }}
        />

        {/* Discreet Center Trunk Marker */}
        <div className="absolute w-2 h-2 rounded-full bg-slate-900/80 border border-emerald-400/60 shadow-sm pointer-events-none" />
      </div>
    </div>
  );
}
