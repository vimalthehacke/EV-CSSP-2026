import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'green' | 'blue' | 'pink';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  variant = 'green',
}) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return {
          border: 'border-[#00ff88]/40 shadow-[#00ff88]/10',
          text: 'text-[#00ff88]',
          glow: 'shadow-neon-green',
          accent: '#00ff88',
        };
      case 'blue':
        return {
          border: 'border-[#00c3ff]/40 shadow-[#00c3ff]/10',
          text: 'text-[#00c3ff]',
          glow: 'shadow-neon-blue',
          accent: '#00c3ff',
        };
      case 'pink':
        return {
          border: 'border-[#ff3b5f]/40 shadow-[#ff3b5f]/10',
          text: 'text-[#ff3b5f]',
          glow: 'shadow-neon-pink',
          accent: '#ff3b5f',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050816]/85 backdrop-blur-md"
          />

          {/* Modal Content Drawer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`
              relative w-full ${getSizeClass()} bg-[#0b0f19] rounded-lg border p-6 md:p-8
              ${styles.border} ${styles.glow} z-10 overflow-hidden
            `}
          >
            {/* Corner Decorative Tech Elements */}
            <span className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2`} style={{ borderColor: styles.accent }} />
            <span className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2`} style={{ borderColor: styles.accent }} />
            <span className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2`} style={{ borderColor: styles.accent }} />
            <span className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2`} style={{ borderColor: styles.accent }} />

            {/* Matrix Scan Design Line representing terminal status */}
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500 mb-4 select-none border-b border-gray-900 pb-2">
              <ShieldAlert className="w-3.5 h-3.5" style={{ color: styles.accent }} />
              <span className="tracking-widest uppercase text-white font-semibold">EV_ACADEMY_CONSOLE_ELEVATION</span>
              <span className="ml-auto opacity-60">ID: 0xFD42</span>
            </div>

            {/* Modern Header Row */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display font-black text-xl md:text-2xl text-white tracking-wide uppercase">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-850 rounded-md ring-1 ring-gray-900 hover:ring-gray-700 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Content Area */}
            <div className="text-gray-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
