import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  variant?: 'green' | 'blue' | 'pink';
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  leftIcon,
  rightAction,
  variant = 'green',
  className = '',
  id,
  ...props
}) => {
  const getColors = () => {
    switch (variant) {
      case 'green':
        return {
          border: 'border-emerald-950 hover:border-[#00ff88]/40 focus:border-[#00ff88]',
          focusGlow: 'focus:ring-1 focus:ring-[#00ff88]/30',
          labelText: 'text-[#00ff88]',
          glow: 'focus:shadow-[0_0_10px_rgba(0,255,136,0.15)]',
        };
      case 'blue':
        return {
          border: 'border-cyan-950 hover:border-[#00c3ff]/40 focus:border-[#00c3ff]',
          focusGlow: 'focus:ring-1 focus:ring-[#00c3ff]/30',
          labelText: 'text-[#00c3ff]',
          glow: 'focus:shadow-[0_0_10px_rgba(0,195,255,0.15)]',
        };
      case 'pink':
        return {
          border: 'border-rose-950 hover:border-[#ff3b5f]/40 focus:border-[#ff3b5f]',
          focusGlow: 'focus:ring-1 focus:ring-[#ff3b5f]/30',
          labelText: 'text-[#ff3b5f]',
          glow: 'focus:shadow-[0_0_10px_rgba(255,59,95,0.15)]',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`w-full font-mono ${className}`}>
      {label && (
        <label className={`block text-[11px] font-bold ${colors.labelText} tracking-wider uppercase mb-1.5`}>
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        
        <input
          id={id}
          className={`
            w-full bg-[#050816]/70 text-white rounded-md border py-2.5 px-3.5
            text-sm placeholder-gray-600 transition-all outline-none duration-150
            ${leftIcon ? 'pl-10' : ''}
            ${rightAction ? 'pr-20' : ''}
            ${error ? 'border-[#ff3b5f] focus:border-[#ff3b5f] focus:ring-1 focus:ring-[#ff3b5f]/20' : colors.border}
            ${error ? '' : colors.focusGlow}
            ${error ? '' : colors.glow}
          `}
          {...props}
        />

        {rightAction && (
          <div className="absolute right-2.5">
            {rightAction}
          </div>
        )}
      </div>

      {error && (
        <span className="block text-[10px] text-[#ff3b5f] uppercase font-bold tracking-tight mt-1 select-none">
          ⚠️ CODE_INTEGRITY_CHECK_FAILURE: {error}
        </span>
      )}
    </div>
  );
};
