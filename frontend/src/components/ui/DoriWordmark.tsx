import React from 'react';

interface DoriWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  variant?: 'gold' | 'teal' | 'crimson' | 'white';
}

/**
 * Official DORI Wordmark
 * Represents "Dori" (the protective thread of care continuity across rural health boundaries)
 */
export const DoriWordmark: React.FC<DoriWordmarkProps> = ({
  size = 'md',
  showTagline = true,
  variant = 'gold',
}) => {
  const getScale = () => {
    switch (size) {
      case 'sm':
        return 0.7;
      case 'lg':
        return 1.3;
      case 'hero':
        return 1.8;
      default:
        return 1;
    }
  };

  const getMainColor = () => {
    switch (variant) {
      case 'teal':
        return 'var(--color-teal)';
      case 'crimson':
        return 'var(--color-crimson)';
      case 'white':
        return '#ffffff';
      default:
        return 'var(--color-gold)';
    }
  };

  const scale = getScale();

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Thread continuity icon */}
        <svg
          width={36 * scale}
          height={36 * scale}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle with thread knot */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke={getMainColor()}
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          {/* Infinity / Continuum Thread Motif */}
          <path
            d="M 14 24 C 14 19, 20 19, 24 24 C 28 29, 34 29, 34 24 C 34 19, 28 19, 24 24 C 20 29, 14 29, 14 24 Z"
            stroke={getMainColor()}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center protection node */}
          <circle cx="24" cy="24" r="3" fill="var(--color-crimson)" />
        </svg>

        {/* Brand Text */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: `${2.2 * scale}rem`,
              fontWeight: 'bold',
              letterSpacing: '0.12em',
              color: getMainColor(),
              textShadow:
                variant === 'gold' ? '0 2px 8px rgba(0,0,0,0.35)' : 'none',
              lineHeight: 1,
            }}
          >
            DORI
          </span>
          <span
            style={{
              fontSize: `${0.85 * scale}rem`,
              color: variant === 'white' ? '#e8e4e0' : 'var(--color-warm-gray)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
            }}
          >
            डोर
          </span>
        </div>
      </div>

      {showTagline && (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: `${0.75 * scale}rem`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: variant === 'gold' || variant === 'white' ? '#f5f0e0' : 'var(--color-warm-gray)',
            marginTop: '2px',
            fontWeight: 600,
          }}
        >
          Predictive Continuity of Care
        </span>
      )}
    </div>
  );
};
