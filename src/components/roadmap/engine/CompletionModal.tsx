import React, { useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Award, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  baseXP: number;
  tasksCount: number;
  challengeXP: number;
  badgeName?: string;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  baseXP,
  tasksCount,
  challengeXP,
  badgeName
}) => {

  const totalEarnedXP = baseXP + (tasksCount * 20) + challengeXP;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop filter blur with fade transition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Content wrapper panel */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#030611] border-2 border-[#00ff88]/30 rounded-xl p-6 md:p-8 font-mono text-xs overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.15)]"
        >
          {/* Subtle decoration vector lines background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/5 rounded-bl-full pointer-events-none border-l border-b border-[#00ff88]/10" />

          <div className="space-y-6 text-center">
            
            {/* Massive futuristic glowing award key wrapper */}
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950/40 border border-[#00ff88]/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.25)] animate-bounce">
              <Award className="w-8 h-8 text-[#00ff88]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#00ff88] font-bold tracking-[0.25em] block uppercase">
                // SYSTEM_LINK_RESOLVED //
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase font-sans tracking-tight">
                {title} Mastered!
              </h2>
              <span className="inline-block bg-emerald-950/20 px-3 py-1 rounded border border-[#00ff88]/20 text-[10px] text-[#00ff88] font-bold">
                {category.toUpperCase()}
              </span>
            </div>

            {/* XP ledger list layout */}
            <div className="bg-black/80 border border-gray-900 rounded-lg p-4 text-left space-y-2.5">
              <span className="text-[9px] text-gray-500 uppercase font-black tracking-wider block">
                EARNED SYSTEM XP DISBURSEMENT LEDGER:
              </span>
              
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-sans flex items-center gap-1.5 p-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Terminal Tasks Checked ({tasksCount}/{tasksCount})
                </span>
                <span className="text-emerald-400 font-bold">+{tasksCount * 20} XP</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span className="font-sans flex items-center gap-1.5 p-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Main Challenge Decrypted
                </span>
                <span className="text-emerald-400 font-bold">+{challengeXP} XP</span>
              </div>

              <div className="flex justify-between items-center text-gray-300 border-b border-gray-950 pb-2">
                <span className="font-sans flex items-center gap-1.5 p-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Laboratory Mastery Level
                </span>
                <span className="text-emerald-400 font-bold">+{baseXP} XP</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="font-sans font-black text-white uppercase text-xs">
                  TOTAL SECURED PROTOCOL XP
                </span>
                <span className="text-[#00ff88] text-sm font-black animate-pulse flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#00ff88]" />
                  +{totalEarnedXP} XP
                </span>
              </div>
            </div>

            {badgeName && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-teal-500/30 rounded-lg p-3 flex items-center justify-center gap-3 shadow-[inset_0_1px_12px_rgba(20,184,166,0.08)]"
              >
                <div className="p-2.5 bg-teal-950/40 border border-teal-400/30 rounded-md text-teal-400 animate-pulse">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-left font-mono">
                  <span className="text-[9px] text-[#00ff88] uppercase block tracking-widest font-extrabold animate-pulse">
                    🏆 MILITARY BADGE UNLOCKED!
                  </span>
                  <span className="text-xs font-black text-white font-sans uppercase">
                    {badgeName} Tier
                  </span>
                </div>
              </motion.div>
            )}

            <p className="text-gray-400 font-sans leading-relaxed text-xs">
              Excellent cyber skills. You have successfully unlocked and opened up next target secure nodes in the Academy simulation network links maps!
            </p>

            <div className="pt-2 flex justify-center">
              <Button
                onClick={onClose}
                variant="cyber"
                className="w-full sm:w-auto font-mono text-xs px-6 py-3 flex gap-2 items-center"
              >
                PROCEED_TO_NEXT_NODE()
                <ChevronRight className="w-4 h-4 text-emerald-950 font-black" />
              </Button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
