import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number; // 0 to 100
  title?: string;
  subtitle?: string;
  variant?: 'green' | 'blue' | 'pink';
  showLabel?: boolean;
  segmented?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  title,
  subtitle,
  variant = 'green',
  showLabel = true,
  segmented = false,
}) => {
  const roundedValue = Math.min(100, Math.max(0, Math.round(value)));

  const getColors = () => {
    switch (variant) {
      case 'green':
        return {
          bar: 'bg-gradient-to-r from-[#00ff88]/30 to-[#00ff88]',
          glow: 'shadow-[0_0_10px_#00ff88]',
          text: 'text-[#00ff88]',
          bg: 'bg-emerald-950/20 border-emerald-900/30'
        };
      case 'blue':
        return {
          bar: 'bg-gradient-to-r from-[#00c3ff]/30 to-[#00c3ff]',
          glow: 'shadow-[0_0_10px_#00c3ff]',
          text: 'text-[#00c3ff]',
          bg: 'bg-cyan-950/20 border-cyan-900/30'
        };
      case 'pink':
        return {
          bar: 'bg-gradient-to-r from-[#ff3b5f]/30 to-[#ff3b5f]',
          glow: 'shadow-[0_0_10px_#ff3b5f]',
          text: 'text-[#ff3b5f]',
          bg: 'bg-[#ff3b5f]/5 border-[#ff3b5f]/10'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="w-full">
      {/* Labels */}
      {(title || subtitle || showLabel) && (
        <div className="flex justify-between items-end text-xs font-mono mb-2">
          <div>
            {title && <span className="font-bold text-white uppercase tracking-wider">{title}</span>}
            {subtitle && <span className="text-gray-400 block text-[10px] lowercase">{subtitle}</span>}
          </div>
          {showLabel && (
            <span className={`font-mono text-xs font-semibold ${colors.text} tracking-tighter`}>
              {roundedValue}%
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div className={`relative h-3 w-full rounded border ${colors.bg} overflow-hidden p-[2px]`}>
        {segmented ? (
          /* Segmented Cyberpunk Grid cells */
          <div className="absolute inset-0 flex divide-x divide-gray-950 z-10 pointers-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-1 h-full" />
            ))}
          </div>
        ) : null}

        {/* Animated Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${roundedValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-sm ${colors.bar} ${colors.glow}`}
        />
      </div>

      {/* Real-time Subtech Indicator */}
      <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 mt-1 uppercase tracking-widest">
        <span>sys_progress_stream: {roundedValue}/100</span>
        <span>buffer: stable</span>
      </div>
    </div>
  );
};
