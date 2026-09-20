import React from 'react';
import './CornerMotif.css';

interface CornerMotifProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
  secondaryColor?: string;
}

/**
 * Traditional Indian Folk-Art Corner Motif (Madhubani / Kalamkari inspired geometric floral filigree)
 */
export const CornerMotif: React.FC<CornerMotifProps> = ({
  position,
  size = 64,
  color = '#c9a84c', // Gold
  secondaryColor = '#8b1a2b', // Crimson
}) => {
  return (
    <div
      className={`dori-corner-motif motif-${position}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Corner Angle */}
        <path
          d="M 5 95 L 5 5 L 95 5"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 12 85 L 12 12 L 85 12"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />

        {/* Traditional Lotus / Paisley Blossom Motif */}
        <circle cx="28" cy="28" r="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
        <circle cx="28" cy="28" r="3" fill={secondaryColor} />
        
        {/* Radiating Petals */}
        <path
          d="M 28 14 C 25 18, 25 22, 28 22 C 31 22, 31 18, 28 14 Z"
          fill={color}
        />
        <path
          d="M 14 28 C 18 25, 22 25, 22 28 C 22 31, 18 31, 14 28 Z"
          fill={color}
        />
        <path
          d="M 38 28 C 34 25, 34 31, 38 28 Z"
          fill={color}
        />
        <path
          d="M 28 38 C 25 34, 31 34, 28 38 Z"
          fill={color}
        />

        {/* Folk Art Geometric Rays */}
        <path
          d="M 45 8 Q 50 20 65 15"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 8 45 Q 20 50 15 65"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="68" cy="15" r="2.5" fill={color} />
        <circle cx="15" cy="68" r="2.5" fill={color} />

        {/* Diagonal Continuity Thread Accent */}
        <path
          d="M 5 5 L 45 45"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
};
