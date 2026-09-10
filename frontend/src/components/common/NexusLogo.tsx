import React from 'react';

interface NexusLogoProps {
  className?: string;
  size?: number | string;
  color?: string;
  variant?: 'mark' | 'badge' | 'badge-solid' | 'badge-tint';
  id?: string;
}

/**
 * NEXUS CRM Brand Identity Logo Mark
 * Faithfully vectorizes the industrial "NX" monogram with mathematical 45°/90° precision,
 * uniform diagonal channels, and rounded outer spine corners.
 */
export const NexusLogo: React.FC<NexusLogoProps> = ({
  className = '',
  size = 32,
  color = '#FF4400',
  variant = 'mark',
  id = 'nexus-logo',
}) => {
  // Pure vector SVG mark
  const svgMark = (
    <svg
      id={id}
      viewBox="0 0 168 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={variant === 'mark' ? className : 'w-full h-full'}
      style={variant === 'mark' && typeof size === 'number' ? { width: `${size * 1.68}px`, height: `${size}px` } : undefined}
      aria-label="NEXUS Logo"
    >
      {/* Piece 1: Left stem 'N' with triangular bottom notch & lower-left arm */}
      <path
        d="M 4 0 L 24 0 L 124 100 L 70 100 L 44 74 L 18 100 L 4 100 A 4 4 0 0 1 0 96 L 0 4 A 4 4 0 0 1 4 0 Z"
        fill={color}
      />
      {/* Piece 2: Main central diagonal bar of 'X' and 'N' */}
      <path
        d="M 35 0 L 67 0 L 167 100 L 135 100 Z"
        fill={color}
      />
      {/* Piece 3: Upper-right wing of 'X' */}
      <path
        d="M 78 0 L 132 0 L 158 26 L 131 53 Z"
        fill={color}
      />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-md bg-[#FFF1EB] dark:bg-[#FF4400]/15 border border-[#FF4400]/30 p-1.5 transition-transform group-hover:scale-105 shadow-sm ${className}`}
        style={typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined}
      >
        {svgMark}
      </div>
    );
  }

  if (variant === 'badge-solid') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-md bg-[#FF4400] p-1.5 transition-transform group-hover:scale-105 shadow-sm ${className}`}
        style={typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined}
      >
        {/* Render white mark inside solid vermilion badge */}
        <svg
          id={`${id}-solid`}
          viewBox="0 0 168 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="NEXUS Logo"
        >
          <path
            d="M 4 0 L 24 0 L 124 100 L 70 100 L 44 74 L 18 100 L 4 100 A 4 4 0 0 1 0 96 L 0 4 A 4 4 0 0 1 4 0 Z"
            fill="#FFFFFF"
          />
          <path
            d="M 35 0 L 67 0 L 167 100 L 135 100 Z"
            fill="#FFFFFF"
          />
          <path
            d="M 78 0 L 132 0 L 158 26 L 131 53 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  return svgMark;
};

export default NexusLogo;
