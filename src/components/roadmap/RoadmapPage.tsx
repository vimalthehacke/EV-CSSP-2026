import React, { useState, useRef } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { playCpsHover, playCpsClick } from '../../lib/audioEngine';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Terminal, 
  Play, 
  ShieldAlert, 
  Clock, 
  BookOpen,
  Compass,
  LayoutGrid,
  StretchHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';
import { LabEngine } from './LabEngine';

export const RoadmapPage: React.FC = () => {
  const { labs, completedLabs } = useProgressStore();
  const [activeLabDetail, setActiveLabDetail] = useState<any>(null);
  
  // Force layout to 'horizontal' by default as requested.
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  const timelineRef = useRef<HTMLDivElement>(null);

  const toggleLayout = () => {
    const nextLayout = layout === 'horizontal' ? 'vertical' : 'horizontal';
    setLayout(nextLayout);
    playCpsClick(false);
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = 350; // scrolls the size of one node + link
      timelineRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      playCpsClick(false);
    }
  };

  // Helper mapping list matching categories to their generated cyberpunk visual indicators
  const getCategoryImgUrl = (category: string) => {
    switch (category) {
      case 'Reconnaissance': return '/src/assets/images/icon_recon_1779629177386.png';
      case 'Web Exploitation': return '/src/assets/images/icon_web_1779629196705.png';
      case 'Reverse Engineering': return '/src/assets/images/icon_reverse_1779629215553.png';
      case 'Cryptography': return '/src/assets/images/icon_crypto_1779629232434.png';
      case 'Privilege Escalation': return '/src/assets/images/icon_privesc_1779629251104.png';
      case 'Network Attack': return '/src/assets/images/icon_network_1779629272659.png';
      default: return '';
    }
  };


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
    <div className="flex-1 overflow-y-auto overflow-x-auto px-4 py-6 sm:px-6 lg:p-8 space-y-6 max-w-full w-full pb-24 md:pb-8">
      
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

        {/* Dynamic Layout Mode Toggle + Dashboard statistics pills */}
        <div className="flex flex-wrap items-center gap-4 bg-gray-950/70 p-3 rounded border border-gray-900 font-mono text-xs">
          <button 
            onClick={toggleLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/80 border border-gray-800 hover:border-[#00ff88]/50 hover:bg-[#00ff88]/15 text-gray-300 hover:text-[#00ff88] rounded cursor-pointer transition-all mr-2 font-bold"
            title="Toggle between Horizontal layout map and Vertical list representation"
          >
            {layout === 'horizontal' ? (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-[#00ff88]" />
                <span className="text-[10px]">VERTICAL Grid</span>
              </>
            ) : (
              <>
                <StretchHorizontal className="w-3.5 h-3.5 text-[#00c3ff]" />
                <span className="text-[10px]">HORIZONTAL Flow</span>
              </>
            )}
          </button>

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

      {/* 16 Labs Layout Switcher */}
      {layout === 'horizontal' ? (
        <div className="relative flex flex-col space-y-4">
          
          {/* Scroll Area dynamic control bar */}
          <div className="flex justify-between items-center bg-[#111827]/40 border border-gray-900 px-4 py-3 rounded-lg flex-wrap gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
              <span className="text-gray-400 uppercase text-[10px]">ROADMAP_TRACK_FLOW:</span>
              <span className="text-[#00ff88] font-bold uppercase text-[10px]">SEQUENTIAL LAB TIMELINE</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollTimeline('left')}
                className="px-3 py-1 bg-gray-950 hover:bg-[#00ff88]/10 text-gray-400 hover:text-[#00ff88] border border-gray-850 hover:border-[#00ff88]/30 rounded transition-all cursor-pointer font-bold select-none text-[10px]"
                title="Scroll Left"
              >
                ◀ SCROLL_LEFT
              </button>
              
              <button
                onClick={() => scrollTimeline('right')}
                className="px-3 py-1 bg-gray-950 hover:bg-[#00ff88]/10 text-gray-400 hover:text-[#00ff88] border border-gray-850 hover:border-[#00ff88]/30 rounded transition-all cursor-pointer font-bold select-none text-[10px]"
                title="Scroll Right"
              >
                SCROLL_RIGHT ▶
              </button>
            </div>
          </div>

          <div
            ref={timelineRef}
            className="flex flex-row flex-nowrap overflow-x-auto items-stretch gap-4 py-4 px-2 scroll-smooth select-none relative scrollbar-none rounded-lg"
            style={{ scrollbarWidth: 'none' }}
          >
            {labs.map((lab, index) => {
              const isLocked = !lab.unlocked;
              const isCompleted = lab.completed;

              // Determine card visual variant
              let cardVariant: 'green' | 'blue' | 'pink' | 'neutral' = 'neutral';
              if (isCompleted) {
                cardVariant = 'green';
              } else if (!isLocked) {
                cardVariant = 'blue';
              }

              // Connection line color transitions based on progress states
              let connectionPathClass = "bg-gray-800/60";
              if (isCompleted && index < labs.length - 1 && labs[index + 1].unlocked) {
                connectionPathClass = "bg-gradient-to-r from-[#00ff88] to-[#00c3ff]";
              } else if (!isLocked && index < labs.length - 1 && labs[index + 1].unlocked) {
                connectionPathClass = "bg-gradient-to-r from-[#00c3ff] to-gray-800";
              }

              return (
                <div key={lab.id} className="flex items-center shrink-0 select-text relative">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    whileHover={isLocked ? {} : { y: -4, scale: 1.01 }}
                    onMouseEnter={() => {
                      if (!isLocked) playCpsHover();
                    }}
                    className="w-[320px] flex flex-col h-[395px]"
                  >
                    <Card
                      id={`lab-card-${lab.id}`}
                      variant={cardVariant}
                      className="flex-1 flex flex-col justify-between p-4 h-full relative"
                      footerStatus={`lab_security_tier: 0x${lab.id.toString(16).toUpperCase()}`}
                    >
                      {/* Padlock background overlay marker for locked rooms */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-[#050816]/35 backdrop-blur-[1px] pointer-events-none rounded z-10 flex items-center justify-center opacity-100" />
                      )}

                      {/* Card Head */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-2 border-b border-gray-900 pb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Premium visual icon of lab category */}
                            <div className={`relative w-6 h-6 rounded border overflow-hidden flex items-center justify-center shrink-0 transition-all
                              ${isLocked ? 'border-gray-800 opacity-40 grayscale' : 'border-[#00ff88]/40 bg-[#00ff88]/5 shadow-sm shadow-[#00ff88]/5'}
                            `}>
                              <img 
                                src={getCategoryImgUrl(lab.category)} 
                                alt={lab.category}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover select-none"
                              />
                            </div>
                            <span className="font-mono text-xs font-black text-gray-500">
                              LAB_0{lab.id}
                            </span>
                          </div>
                          
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
                          text-xs leading-relaxed font-sans mt-2 line-clamp-4 overflow-y-auto max-h-[85px]
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
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`#sandbox=${lab.id}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => playCpsClick(false)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#00ff88]/5 text-[#00ff88]/80 border border-[#00ff88]/20 hover:bg-[#00ff88]/15 text-[9px] font-mono font-black"
                              title="Re-open solved lab workspace in separate tab"
                            >
                              REPLAY 🡕
                            </a>
                            <Badge variant="green" size="sm" className="opacity-80 py-1 font-mono font-bold">
                              COMPLETED
                            </Badge>
                          </div>
                        ) : isLocked ? (
                          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-gray-600 bg-gray-950 rounded border border-transparent select-none">
                            ENCRYPTED
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                playCpsClick(false);
                                setActiveLabDetail(lab);
                              }}
                              className="px-2 py-1 rounded border border-gray-800 hover:border-gray-700 bg-gray-900/50 hover:bg-gray-900 cursor-pointer text-gray-300 hover:text-white font-mono text-[9px] font-bold uppercase transition-all"
                              title="Run lab workflow inside modal"
                            >
                              LAUNCH
                            </button>
                            <a
                              href={`#sandbox=${lab.id}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => playCpsClick(false)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 hover:bg-[#00ff88]/25 rounded text-[10px] font-mono font-bold uppercase tracking-wide cursor-pointer transition-all shadow-sm shadow-[#00ff88]/10"
                              title="Open full interactive workspace sandbox in a separate browser tab"
                            >
                              <Play className="w-2 h-2 text-[#00ff88] fill-current" />
                              <span>OPEN 🡕</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>

                  {/* High tech linear progression connector bridge between adjacent items */}
                  {index < labs.length - 1 && (
                    <div className="w-12 h-8 flex items-center justify-center shrink-0 relative px-1 select-none">
                      <div className={`w-full h-[3px] rounded-full ${connectionPathClass}`} />
                      <div className={`absolute top-[4px] text-[8px] font-mono bg-[#050816] px-1 border border-gray-900 rounded select-none text-gray-500`}>
                        0x{(lab.id + 1).toString(16).toUpperCase()}➔
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
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
                onMouseEnter={() => {
                  if (!isLocked) playCpsHover();
                }}
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
                    <div className="flex justify-between items-center gap-2 border-b border-gray-900 pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Premium visual high-tech custom icon representation of lab category */}
                        <div className={`relative w-6 h-6 rounded border overflow-hidden flex items-center justify-center shrink-0 transition-all
                          ${isLocked ? 'border-gray-800 opacity-40 grayscale' : 'border-[#00ff88]/40 bg-[#00ff88]/5 shadow-sm shadow-[#00ff88]/5'}
                        `}>
                          <img 
                            src={getCategoryImgUrl(lab.category)} 
                            alt={lab.category}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover select-none"
                          />
                        </div>
                        <span className="font-mono text-xs font-black text-gray-500">
                          LAB_0{lab.id}
                        </span>
                      </div>
                      
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
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`#sandbox=${lab.id}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playCpsClick(false)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#00ff88]/5 text-[#00ff88]/80 border border-[#00ff88]/20 hover:bg-[#00ff88]/15 text-[10px] font-mono font-black"
                          title="Re-open solved lab workspace in separate tab"
                        >
                          REPLAY 🡕
                        </a>
                        <Badge variant="green" size="sm" className="opacity-80 py-1 font-mono font-bold">
                          COMPLETED
                        </Badge>
                      </div>
                    ) : isLocked ? (
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-gray-600 bg-gray-950 rounded border border-transparent select-none">
                        ENCRYPTED
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            playCpsClick(false);
                            setActiveLabDetail(lab);
                          }}
                          className="px-2.5 py-1 rounded border border-gray-800 hover:border-gray-700 bg-gray-900/50 hover:bg-gray-900 cursor-pointer text-gray-300 hover:text-white font-mono text-[10px] font-bold uppercase transition-all"
                          title="Run lab workflow inside modal"
                        >
                          LAUNCH MODAL
                        </button>
                        <a
                          href={`#sandbox=${lab.id}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playCpsClick(false)}
                          className="flex items-center gap-1 px-3 py-1 bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 hover:bg-[#00ff88]/25 rounded text-[11px] font-mono font-bold uppercase tracking-wide cursor-pointer transition-all shadow-sm shadow-[#00ff88]/10"
                          title="Open full interactive workspace sandbox in a separate browser tab"
                        >
                          <Play className="w-2.5 h-2.5 text-[#00ff88] fill-current" />
                          <span>OPEN TAB 🡕</span>
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Lab Simulation Modal */}
      <Modal
        isOpen={!!activeLabDetail}
        onClose={() => {
          playCpsClick(false);
          setActiveLabDetail(null);
        }}
        title={`SECURE TARGET LINK // LAB 0${activeLabDetail?.id}`}
        subtitle={`HOST: laboratory_console_${activeLabDetail?.id}@ev.cyber.range`}
        variant="blue"
        size="full"
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
