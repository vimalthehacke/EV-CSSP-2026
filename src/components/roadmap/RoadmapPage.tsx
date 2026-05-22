import React, { useState } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Terminal, 
  Play, 
  ShieldAlert, 
  Clock, 
  BookOpen,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';
import { LabEngine } from './LabEngine';

export const RoadmapPage: React.FC = () => {
  const { labs, completedLabs } = useProgressStore();
  const [activeLabDetail, setActiveLabDetail] = useState<any>(null);

  // Statistics calculation for the header indicators
  const totalLabsCount = labs.length;
  const completedCount = completedLabs.length;
  const activeUnsolvedCount = labs.filter(l => l.unlocked && !l.completed).length;

  // Helper to determine difficulty badge color variant
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'slate';
      case 'Intermediate': return 'blue';
      case 'Elite': return 'purple';
      case 'Boss': return 'pink';
      default: return 'slate';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reconnaissance': return 'text-sky-400';
      case 'Web Exploitation': return 'text-[#00c3ff]';
      case 'Reverse Engineering': return 'text-[#ff3b5f]';
      case 'Cryptography': return 'text-yellow-400';
      case 'Privilege Escalation': return 'text-purple-400';
      case 'Network Attack': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  // Framer Motion entry grid stagger animations
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 md:pb-8">
      
      {/* Page header and curriculum metrics board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gray-950/40 border border-gray-900 rounded-lg p-5">
        <div className="space-y-1">
          <h2 className="font-display font-black text-xl md:text-2xl text-white tracking-wide uppercase flex items-center gap-2">
            <Compass className="text-[#00ff88] w-6 h-6 animate-pulse" />
            EV SECURITY TRAINING SYLLABUS
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Chronological academic training map comprising 16 defense and exploitation laboratories.
          </p>
        </div>

        {/* Dashboard statistics pills */}
        <div className="flex flex-wrap items-center gap-4 bg-gray-950/70 p-3 rounded border border-gray-900 font-mono text-xs">
          <div className="border-r border-gray-950 pr-4">
            <span className="text-gray-500 block text-[9px] uppercase">syllabus total:</span>
            <span className="text-white font-bold">{totalLabsCount} LABS</span>
          </div>
          <div className="border-r border-gray-950 pr-4 px-2">
            <span className="text-gray-500 block text-[9px] uppercase">completed flags:</span>
            <span className="text-[#00ff88] font-bold">{completedCount} SOLVED</span>
          </div>
          <div className="px-2">
            <span className="text-gray-500 block text-[9px] uppercase">active_queue:</span>
            <span className="text-[#00c3ff] font-bold">{activeUnsolvedCount} ACCESSIBLE</span>
          </div>
        </div>
      </div>

      {/* Cyber Instruction Panel */}
      <div className="bg-gray-950/60 border border-gray-900/80 rounded-md p-4 font-mono text-[11px] leading-relaxed relative overflow-hidden flex items-start gap-3">
        <div className="absolute top-0 right-0 p-1 text-[9px] text-[#00ff88]/20 tracking-tighter select-none pointer-events-none font-bold uppercase">
          SECURE_ENV_INIT
        </div>
        <BookOpen className="text-[#00ff88] w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-white font-bold uppercase block">ROADMAP SYSTEM REGULATIONS:</span>
          <p className="text-gray-400">
            Laboratories must be conquered sequentially. Solving a lab successfully decrypts the security tokens, awards the specified EXP reward, updates your tactical Level Rank, and unlocks access metadata parameters for the immediate following laboratory core. 
          </p>
        </div>
      </div>

      {/* 16 Labs grid */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {labs.map((lab) => {
          const isLocked = !lab.unlocked;
          const isCompleted = lab.completed;

          // Determine card visual variant
          let cardVariant: 'green' | 'blue' | 'pink' | 'neutral' = 'neutral';
          if (isCompleted) {
            cardVariant = 'green';
          } else if (!isLocked) {
            cardVariant = 'blue';
          }

          return (
            <motion.div
              key={lab.id}
              variants={cardVariants}
              whileHover={isLocked ? {} : { y: -3 }}
              className="h-full flex flex-col"
            >
              <Card
                id={`lab-card-${lab.id}`}
                variant={cardVariant}
                className="flex-1 flex flex-col justify-between p-4 h-full relative"
                footerStatus={`lab_security_tier: 0x${lab.id.toString(16).toUpperCase()}`}
              >
                {/* Padlock background overlay marker for locked rooms */}
                {isLocked && (
                  <div className="absolute inset-0 bg-[#050816]/30 backdrop-blur-[1px] pointer-events-none rounded z-10 flex items-center justify-center opacity-100" />
                )}

                {/* Card Head */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-xs font-black text-gray-500">
                      LAB_0{lab.id}
                    </span>
                    
                    {/* Visual indicators */}
                    <div className="flex gap-1">
                      {isCompleted ? (
                        <Badge variant="green" size="sm">
                          SOLVED
                        </Badge>
                      ) : isLocked ? (
                        <Badge variant="slate" size="sm" className="opacity-90">
                          <Lock className="w-2.5 h-2.5 inline mr-1 -mt-0.5" /> LOCKED
                        </Badge>
                      ) : (
                        <Badge variant="blue" size="sm" className="animate-pulse">
                          <Unlock className="w-2.5 h-2.5 inline mr-1 -mt-0.5 text-[#00c3ff]" /> ACTIVE
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className={`
                    font-display font-bold text-sm tracking-wide line-clamp-1
                    ${isCompleted ? 'text-[#00ff88]' : isLocked ? 'text-gray-500' : 'text-white'}
                  `}>
                    {lab.title}
                  </h3>

                  {/* Level difficulty + Category metadata */}
                  <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                    <span className={getCategoryColor(lab.category)}>
                      {lab.category}
                    </span>
                    <span className="text-gray-600">&bull;</span>
                    <span className="text-gray-400 capitalize">
                      {lab.difficulty}
                    </span>
                  </div>

                  <p className={`
                    text-xs leading-relaxed font-sans mt-2 line-clamp-3
                    ${isLocked ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {lab.description}
                  </p>
                </div>

                {/* Card Foot controls */}
                <div className="mt-4 pt-3 border-t border-gray-900 flex justify-between items-center z-20">
                  <span className="font-mono text-xs">
                    <span className="text-gray-500 block text-[8px] uppercase font-bold tracking-tight">reap:</span>
                    <span className={`${isLocked ? 'text-gray-600' : 'text-[#00ff88]'} font-bold`}>
                      +{lab.xpReward} XP
                    </span>
                  </span>

                  {isCompleted ? (
                    <Badge variant="green" size="sm" className="opacity-80 py-1">
                      COMPLETED
                    </Badge>
                  ) : isLocked ? (
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-gray-600 bg-gray-950 rounded border border-transparent select-none">
                      ENCRYPTED
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="px-3 py-1.5"
                      leftIcon={<Play className="w-3.5 h-3.5 text-[#00ff88]" />}
                      onClick={() => setActiveLabDetail(lab)}
                    >
                      LAUNCH
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lab Simulation Modal */}
      <Modal
        isOpen={!!activeLabDetail}
        onClose={() => setActiveLabDetail(null)}
        title={`SECURE TARGET LINK // LAB 0${activeLabDetail?.id}`}
        subtitle={`HOST: laboratory_console_${activeLabDetail?.id}@ev.cyber.range`}
        variant="blue"
        size="xl"
      >
        {activeLabDetail && (
          <LabEngine 
            lab={activeLabDetail} 
            onClose={() => setActiveLabDetail(null)} 
          />
        )}
      </Modal>

    </div>
  );
};
