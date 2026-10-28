import React from 'react';

/**
 * PlantPotBase: Clean, subtle ground planting base.
 * Renders ONLY when explicitly selected as 'tierra' (Sin Matera).
 * For all other pot options, returns null to keep the original plant photo 100% clean and pristine.
 */
export default function PlantPotBase({ potType = 'matera' }) {
  // Only render if explicitly set to 'tierra' (Sin matera)
  if (potType !== 'tierra') {
    return null;
  }

  return (
    <div 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[54%] h-[24%] pointer-events-none select-none z-10 flex items-end justify-center"
      title="Sembrado en tierra directa (Sin matera)"
    >
      <svg 
        viewBox="0 0 160 55" 
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="naturalSoilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a2e1b" />
            <stop offset="50%" stopColor="#2e1a0f" />
            <stop offset="100%" stopColor="#1a0e08" />
          </linearGradient>
        </defs>

        {/* Soft, natural soil & mulch mound without harsh black shadows */}
        <path 
          d="M 6 48 C 18 30, 45 16, 80 14 C 115 16, 142 30, 154 48 C 140 52, 20 52, 6 48 Z" 
          fill="url(#naturalSoilGrad)"
        />

        {/* Subtle mulch chips */}
        <ellipse cx="50" cy="36" rx="12" ry="3.5" fill="#3a2012" opacity="0.9" transform="rotate(-4 50 36)" />
        <ellipse cx="105" cy="34" rx="13" ry="3.5" fill="#3a2012" opacity="0.9" transform="rotate(5 105 34)" />
        <ellipse cx="80" cy="28" rx="14" ry="4" fill="#331b0e" opacity="0.95" />

        {/* Small natural grass blades at edges */}
        <path d="M 18 45 Q 12 34 8 30 Q 15 36 21 47 Z" fill="#10b981" opacity="0.85" />
        <path d="M 23 47 Q 20 37 17 33 Q 22 39 25 48 Z" fill="#34d399" opacity="0.75" />
        <path d="M 139 45 Q 145 34 149 30 Q 143 36 137 47 Z" fill="#10b981" opacity="0.85" />
        <path d="M 134 47 Q 138 37 141 33 Q 136 39 133 48 Z" fill="#34d399" opacity="0.75" />
      </svg>
    </div>
  );
}
