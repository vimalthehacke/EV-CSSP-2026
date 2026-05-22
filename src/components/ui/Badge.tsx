import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'pink' | 'purple' | 'amber' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = ''
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'green':
        return 'bg-emerald-950/40 text-[#00ff88] border border-[#00ff88]/30 shadow-sm shadow-[#00ff88]/10';
      case 'blue':
        return 'bg-[#00c3ff]/10 text-[#00c3ff] border border-[#00c3ff]/30 shadow-sm shadow-[#00c3ff]/10';
      case 'pink':
        return 'bg-rose-950/40 text-[#ff3b5f] border border-[#ff3b5f]/30 shadow-sm shadow-[#ff3b5f]/10';
      case 'purple':
        return 'bg-purple-950/40 text-purple-400 border border-purple-500/30';
      case 'amber':
        return 'bg-amber-950/40 text-amber-400 border border-amber-500/30';
      case 'slate':
        return 'bg-gray-800 text-gray-400 border border-gray-700';
      default:
        return '';
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-mono font-bold tracking-wide rounded uppercase select-none
        ${getStyles()}
        ${sizeClass}
        ${className}
      `}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-75"></span>
      {children}
    </span>
  );
};
