import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-emerald-950/40 text-[#00ff88] border border-[#00ff88]/50 hover:bg-[#00ff88]/20 focus:ring-2 focus:ring-[#00ff88]/50 shadow-neon-green hover:shadow-[#00ff88]/30 duration-200';
      case 'secondary':
        return 'bg-cyan-950/40 text-[#00c3ff] border border-[#00c3ff]/50 hover:bg-[#00c3ff]/20 focus:ring-2 focus:ring-[#00c3ff]/50 shadow-neon-blue hover:shadow-[#00c3ff]/30 duration-200';
      case 'danger':
        return 'bg-rose-950/40 text-[#ff3b5f] border border-[#ff3b5f]/50 hover:bg-[#ff3b5f]/20 focus:ring-2 focus:ring-[#ff3b5f]/50 shadow-neon-pink hover:shadow-[#ff3b5f]/30 duration-200';
      case 'cyber':
        return 'bg-[#00ff88] text-[#050816] font-display font-black tracking-wide border-0 hover:bg-[#00e077] focus:ring-2 focus:ring-[#00ff88]/50 shadow-neon-green duration-200';
      case 'ghost':
        return 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent duration-200';
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-mono';
      case 'md':
        return 'px-5 py-2.5 text-sm font-medium';
      case 'lg':
        return 'px-7 py-3.5 text-base font-semibold';
      default:
        return '';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-md transition-all font-mono
        focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Visual cyber cut corners */}
      {variant !== 'ghost' && (
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-40"></span>
      )}
      {variant !== 'ghost' && (
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-40"></span>
      )}

      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}

      {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </motion.button>
  );
};
