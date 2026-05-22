import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footerStatus?: string;
  variant?: 'green' | 'blue' | 'pink' | 'neutral';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footerStatus,
  variant = 'green',
  className = '',
  onClick,
  id
}) => {
  const getColors = () => {
    switch (variant) {
      case 'green':
        return {
          border: 'border-[#00ff88]/20 hover:border-[#00ff88]/40',
          text: 'text-[#00ff88]',
          glow: 'shadow-neon-green',
          badge: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30',
          corner: 'border-[#00ff88]'
        };
      case 'blue':
        return {
          border: 'border-[#00c3ff]/20 hover:border-[#00c3ff]/40',
          text: 'text-[#00c3ff]',
          glow: 'shadow-neon-blue',
          badge: 'bg-[#00c3ff]/10 text-[#00c3ff] border-[#00c3ff]/30',
          corner: 'border-[#00c3ff]'
        };
      case 'pink':
        return {
          border: 'border-[#ff3b5f]/20 hover:border-[#ff3b5f]/40',
          text: 'text-[#ff3b5f]',
          glow: 'shadow-neon-pink',
          badge: 'bg-[#ff3b5f]/10 text-[#ff3b5f] border-[#ff3b5f]/30',
          corner: 'border-[#ff3b5f]'
        };
      case 'neutral':
        return {
          border: 'border-gray-800 hover:border-gray-700',
          text: 'text-gray-300',
          glow: '',
          badge: 'bg-gray-800 text-gray-400 border-gray-700',
          corner: 'border-gray-600'
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      id={id}
      whileHover={onClick ? { scale: 1.01, y: -2 } : {}}
      onClick={onClick}
      className={`
        relative bg-[#111827]/90 rounded-md border p-5 ${colors.border} ${colors.glow}
        transition-all duration-300 backdrop-blur-md
        ${onClick ? 'cursor-pointer hover:bg-[#111827]/100' : ''}
        ${className}
      `}
    >
      {/* Corner crosshairs to provide a beautiful high-tech blueprint feel */}
      <span className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${colors.corner} rounded-tl-sm opacity-60`}></span>
      <span className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${colors.corner} rounded-tr-sm opacity-60`}></span>
      <span className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${colors.corner} rounded-bl-sm opacity-60`}></span>
      <span className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${colors.corner} rounded-br-sm opacity-60`}></span>

      {/* Decorative top dot code and design element */}
      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mb-3 select-none">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${variant === 'neutral' ? 'bg-gray-600' : 'bg-current animate-pulse'} ${colors.text}`}></span>
          <span className="tracking-widest">SYS_HUD_NODE_V26</span>
        </div>
        <span className="opacity-40">LOC_0x77F</span>
      </div>

      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-start border-b border-gray-800/80 pb-3 mb-4 gap-4">
          <div>
            {title && (
              <h3 className="font-display font-bold text-lg text-white tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="text-gray-300 text-sm leading-relaxed mb-1">
        {children}
      </div>

      {/* Card footer telemetry bar */}
      {footerStatus && (
        <div className="mt-4 pt-3 border-t border-gray-900 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span className="truncate">{footerStatus}</span>
          <span className="text-[#00ff88]/75 select-none font-bold">SECURE_VERIFIED</span>
        </div>
      )}
    </motion.div>
  );
};
