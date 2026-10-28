import React from 'react';

/**
 * PlantPotBase: High-fidelity visual planter or direct ground planting base.
 * Renders either:
 * - 'tierra': An organic fertile soil & mulch mound that integrates the plant directly into the ground.
 * - 'blanca' | 'negra' | 'barro' | 'cemento' | 'fibra': Custom architectural designer planter pots.
 */
export default function PlantPotBase({ potType = 'tierra', isSelected }) {
  if (potType === 'tierra') {
    return (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[62%] h-[27%] pointer-events-none select-none z-10 flex items-end justify-center"
        title="Sembrado directamente en tierra / cantero"
      >
        <svg 
          viewBox="0 0 200 85" 
          className="w-full h-full overflow-visible drop-shadow-md"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Rich dark fertile earth gradient */}
            <radialGradient id="soilMoundGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#3d2314" />
              <stop offset="60%" stopColor="#25150b" />
              <stop offset="100%" stopColor="#140a05" />
            </radialGradient>
            {/* Mulch & bark texture overlay */}
            <linearGradient id="barkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#54301a" />
              <stop offset="100%" stopColor="#2e170a" />
            </linearGradient>
          </defs>

          {/* Base ambient shadow under soil mound */}
          <ellipse cx="100" cy="74" rx="92" ry="10" fill="rgba(0,0,0,0.5)" filter="blur(2px)" />

          {/* Organic fertile soil mound */}
          <path 
            d="M 12 74 C 20 52, 45 28, 100 24 C 155 28, 180 52, 188 74 C 170 82, 30 82, 12 74 Z" 
            fill="url(#soilMoundGrad)"
          />

          {/* Organic mulch & bark chips scattered over soil */}
          <ellipse cx="65" cy="54" rx="14" ry="4" fill="url(#barkGrad)" opacity="0.9" transform="rotate(-6 65 54)" />
          <ellipse cx="125" cy="50" rx="16" ry="4.5" fill="url(#barkGrad)" opacity="0.9" transform="rotate(8 125 50)" />
          <ellipse cx="98" cy="42" rx="18" ry="5" fill="url(#barkGrad)" opacity="0.95" />
          <ellipse cx="40" cy="65" rx="11" ry="3.5" fill="#1f0f07" opacity="0.8" />
          <ellipse cx="155" cy="63" rx="12" ry="4" fill="#1f0f07" opacity="0.8" />

          {/* Fine soil granule specks */}
          <circle cx="82" cy="48" r="1.8" fill="#5c3820" />
          <circle cx="110" cy="56" r="1.5" fill="#4a2c17" />
          <circle cx="55" cy="58" r="1.3" fill="#663e23" />
          <circle cx="140" cy="54" r="1.4" fill="#52311a" />
          <circle cx="95" cy="62" r="1.6" fill="#381d0d" />

          {/* Gentle fresh grass blades / groundcover tufts peaking out */}
          <path d="M 28 70 Q 22 56 16 52 Q 24 58 31 71 Z" fill="#10b981" opacity="0.9" />
          <path d="M 33 72 Q 30 58 26 55 Q 32 61 35 73 Z" fill="#34d399" opacity="0.8" />
          <path d="M 168 70 Q 174 56 182 52 Q 175 58 166 71 Z" fill="#10b981" opacity="0.9" />
          <path d="M 162 72 Q 166 58 171 55 Q 165 61 160 73 Z" fill="#34d399" opacity="0.8" />
        </svg>

        {/* Small subtle badge */}
        <span className="absolute -bottom-2 px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-500/30 shadow-sm whitespace-nowrap">
          🌱 En Tierra
        </span>
      </div>
    );
  }

  // CERÁMICA BLANCA
  if (potType === 'blanca') {
    return (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[54%] h-[27%] pointer-events-none select-none z-10 flex items-end justify-center"
        title="Matera Cerámica Blanca Esmaltada"
      >
        <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible drop-shadow-lg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="whitePotGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="25%" stopColor="#f3f4f6" />
              <stop offset="65%" stopColor="#ffffff" />
              <stop offset="90%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
            <linearGradient id="whiteRimGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="94" rx="55" ry="6" fill="rgba(0,0,0,0.35)" filter="blur(2px)" />
          {/* Pot body: subtle Nordic tapered cylinder */}
          <path d="M 18 16 L 28 88 C 28 94, 132 94, 132 88 L 142 16 Z" fill="url(#whitePotGrad)" />
          {/* Ceramic sheen highlight */}
          <path d="M 45 18 L 50 88 C 55 90, 68 90, 65 88 L 60 18 Z" fill="#ffffff" opacity="0.65" />
          {/* Top ceramic rim */}
          <ellipse cx="80" cy="16" rx="63" ry="9" fill="url(#whiteRimGrad)" />
          <ellipse cx="80" cy="16" rx="57" ry="6.5" fill="#26160c" />
        </svg>
      </div>
    );
  }

  // NEGRA GRAFITO
  if (potType === 'negra') {
    return (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[54%] h-[27%] pointer-events-none select-none z-10 flex items-end justify-center"
        title="Matera Cilíndrica Negra Grafito"
      >
        <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible drop-shadow-lg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="blackPotGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="35%" stopColor="#1e293b" />
              <stop offset="65%" stopColor="#334155" />
              <stop offset="85%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
            <linearGradient id="blackRimGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="94" rx="55" ry="6" fill="rgba(0,0,0,0.5)" filter="blur(2px)" />
          <path d="M 18 16 L 28 88 C 28 94, 132 94, 132 88 L 142 16 Z" fill="url(#blackPotGrad)" />
          <ellipse cx="80" cy="16" rx="63" ry="9" fill="url(#blackRimGrad)" />
          <ellipse cx="80" cy="16" rx="57" ry="6.5" fill="#140a05" />
        </svg>
      </div>
    );
  }

  // TERRACOTA / BARRO
  if (potType === 'barro') {
    return (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[28%] pointer-events-none select-none z-10 flex items-end justify-center"
        title="Matera Barro / Terracota Artesanal"
      >
        <svg viewBox="0 0 160 105" className="w-full h-full overflow-visible drop-shadow-lg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="clayPotGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#831843" />
              <stop offset="15%" stopColor="#9a3412" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="85%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
            <linearGradient id="clayRimGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="98" rx="52" ry="6" fill="rgba(0,0,0,0.4)" filter="blur(2px)" />
          {/* Pot body with classic terracotta taper */}
          <path d="M 22 24 L 32 92 C 32 97, 128 97, 128 92 L 138 24 Z" fill="url(#clayPotGrad)" />
          {/* Prominent classic flared clay collar/rim */}
          <rect x="14" y="14" width="132" height="15" rx="5" fill="url(#clayRimGrad)" />
          <ellipse cx="80" cy="14" rx="66" ry="9" fill="url(#clayRimGrad)" />
          <ellipse cx="80" cy="14" rx="60" ry="6.5" fill="#27150a" />
        </svg>
      </div>
    );
  }

  // CEMENTO / CONCRETO
  if (potType === 'cemento') {
    return (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[54%] h-[27%] pointer-events-none select-none z-10 flex items-end justify-center"
        title="Matera Cemento Arquitectónico"
      >
        <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible drop-shadow-lg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cementGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="35%" stopColor="#64748b" />
              <stop offset="65%" stopColor="#94a3b8" />
              <stop offset="85%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="cementRimGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="94" rx="55" ry="6" fill="rgba(0,0,0,0.4)" filter="blur(2px)" />
          <path d="M 18 16 L 25 88 C 25 94, 135 94, 135 88 L 142 16 Z" fill="url(#cementGrad)" />
          {/* Concrete subtle texture specks */}
          <circle cx="50" cy="40" r="1.5" fill="#334155" opacity="0.5" />
          <circle cx="110" cy="65" r="1.8" fill="#334155" opacity="0.4" />
          <circle cx="85" cy="50" r="1.2" fill="#e2e8f0" opacity="0.3" />
          <ellipse cx="80" cy="16" rx="63" ry="9" fill="url(#cementRimGrad)" />
          <ellipse cx="80" cy="16" rx="57" ry="6.5" fill="#1e1108" />
        </svg>
      </div>
    );
  }

  // CANASTA FIBRA / YUTE
  if (potType === 'fibra') {
    return (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[28%] pointer-events-none select-none z-10 flex items-end justify-center"
        title="Canasta Fibra Natural / Yute"
      >
        <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible drop-shadow-lg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fiberGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="30%" stopColor="#b45309" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="94" rx="56" ry="6" fill="rgba(0,0,0,0.4)" filter="blur(2px)" />
          <path d="M 16 16 L 26 88 C 26 94, 134 94, 134 88 L 144 16 Z" fill="url(#fiberGrad)" />
          {/* Horizontal weave bands */}
          <path d="M 19 32 Q 80 40 141 32" stroke="#78350f" strokeWidth="2.5" fill="none" opacity="0.75" />
          <path d="M 22 50 Q 80 58 138 50" stroke="#78350f" strokeWidth="2.5" fill="none" opacity="0.75" />
          <path d="M 24 68 Q 80 76 136 68" stroke="#78350f" strokeWidth="2.5" fill="none" opacity="0.75" />
          {/* Braided top rim */}
          <ellipse cx="80" cy="16" rx="64" ry="9" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          <ellipse cx="80" cy="16" rx="58" ry="6.5" fill="#201007" />
        </svg>
      </div>
    );
  }

  return null;
}
