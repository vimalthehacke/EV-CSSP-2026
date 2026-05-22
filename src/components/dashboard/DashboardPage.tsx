import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useXPStore } from '../../store/xpStore';
import { useProgressStore } from '../../store/progressStore';
import { getLevelDetail } from '../../lib/xp-engine';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';
import { 
  Award, 
  Activity, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ChevronRight, 
  Flame, 
  Skull, 
  Terminal, 
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { LabEngine } from '../roadmap/LabEngine';

interface DashboardPageProps {
  setRoute: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setRoute }) => {
  const { user } = useAuthStore();
  const { xp } = useXPStore();
  const { labs, completedLabs, resetProgress } = useProgressStore();

  const [activeLabDetail, setActiveLabDetail] = useState<any>(null);

  const levelDetail = getLevelDetail(xp);

  // Completion calculation
  const totalLabs = labs.length;
  const completedLabsCount = completedLabs.length;
  const completionPercentage = totalLabs > 0 ? Math.round((completedLabsCount / totalLabs) * 100) : 0;

  // First 3 labs for the Preview Deck
  const roadmapPreviewLabs = labs.slice(0, 3);

  // Dynamic achievement calculations to populate the UI placeholder
  const achievements = [
    {
      id: 'initial_breach',
      title: 'Initial Breach',
      desc: 'Crack your first laboratory access terminal and achieve terminal command.',
      icon: Terminal,
      unlocked: completedLabsCount >= 1,
      tier: 'Bronze',
    },
    {
      id: 'level_explorer',
      title: 'Active Scan Probe',
      desc: 'Earn 100 XP to upgrade your credential and reach level explorer.',
      icon: Zap,
      unlocked: xp >= 100,
      tier: 'Bronze',
    },
    {
      id: 'vimal_apprentice',
      title: 'Vimal Favor',
      desc: 'Complete at least 5 target laboratories to prove security prowess.',
      icon: Award,
      unlocked: completedLabsCount >= 5,
      tier: 'Silver',
    },
    {
      id: 'hack_champion',
      title: 'Cyber Operator',
      desc: 'Complete 10 laboratories and secure intermediate certification.',
      icon: Flame,
      unlocked: completedLabsCount >= 10,
      tier: 'Gold',
    },
    {
      id: 'immortal_overlord',
      title: 'Graduation Overlord',
      desc: 'Max out core telemetry limits to attain Vimal\'s ultimate EV Graduate status.',
      icon: Skull,
      unlocked: xp >= 2500,
      tier: 'Legendary',
    }
  ];

  // Safe Progress Reset trigger with sonner info
  const handleReset = () => {
    if (confirm("CRITICAL WARNING: Are you sure you want to wipe all session XP, levels, and completed lab history?")) {
      resetProgress();
      toast.error("TELEMETRY_WIPE_COMPLETED: Clean-slate init sequences loaded.", {
        className: 'sonner-toast-override',
        duration: 3500,
      });
    }
  };

  // Staggered Container Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 md:pb-8">
      {/* HUD Greeting & Diagnostics row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-950/40 border border-gray-900 rounded-lg p-5">
        <div>
          <h2 className="font-display font-black text-xl md:text-2xl text-white tracking-wide uppercase">
            OPERATOR_CONSOLE // <span className="text-[#00ff88]">{user?.username || 'GUEST'}</span>
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Secure session initialized on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
        
        {/* Reset / Demo simulation actions in console */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 mr-2 hidden lg:inline">DEMO_CONTROLS:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="border-gray-800 hover:border-rose-950 hover:bg-rose-950/20 text-gray-400 hover:text-[#ff3b5f]"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            RESET_SIM()
          </Button>
        </div>
      </div>

      {/* Grid containing XP details and general progress info */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Card 1: Live XP Engine Status */}
        <motion.div variants={itemVariants}>
          <Card
            variant="blue"
            title="XP LEVELING TELEMETRY"
            subtitle="Rank thresholds and digital tracking"
            footerStatus={`level_code: ${levelDetail.codename}`}
            className="h-full"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-950/70 rounded p-3 border border-cyan-950/30">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">RANK STATUS:</span>
                  <span className="text-base font-mono font-black text-[#00c3ff] uppercase tracking-wide">
                    {levelDetail.current}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">XP ACCUMULATED:</span>
                  <span className="text-base font-mono font-bold text-white tracking-tight">
                    {xp} EXP
                  </span>
                </div>
              </div>

              {/* Progress towards progress tier */}
              <div className="pt-2">
                <ProgressBar 
                  value={levelDetail.percentage}
                  title="Rank Qualification Progress"
                  subtitle={levelDetail.next ? `next rank: ${levelDetail.next}` : "maximum tier certified"}
                  variant="blue"
                  segmented
                />
              </div>

              {levelDetail.xpNeeded > 0 ? (
                <div className="text-[11px] font-mono text-gray-400 bg-cyan-950/10 p-2 rounded border border-cyan-900/15 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#00c3ff]" />
                    Required for next rank:
                  </span>
                  <span className="text-[#00c3ff] font-bold">{levelDetail.xpNeeded} XP</span>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-[#00ff88] bg-emerald-950/10 p-2 rounded border border-emerald-900/15 text-center font-bold">
                  🌟 CONGRATULATIONS: ABSOLUTE LEVEL MAX ATTAINED
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Card 2: Modules Syllabus tracker */}
        <motion.div variants={itemVariants}>
          <Card
            variant="green"
            title="SYLLABUS RESOLUTION"
            subtitle="Hacking laboratory curriculum status"
            footerStatus={`completed: ${completedLabsCount}/${totalLabs}`}
            className="h-full"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-950/70 rounded p-3 border border-emerald-950/30">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">LAB TACTICAL YIELD:</span>
                  <span className="text-base font-mono font-black text-[#00ff88] uppercase tracking-wide">
                    {completedLabsCount} of {totalLabs} SOLVED
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">ROADMAP COMPLETE:</span>
                  <span className="text-base font-mono font-bold text-white tracking-tight">
                    {completionPercentage}%
                  </span>
                </div>
              </div>

              {/* Custom Segmented Grid Progression tracker */}
              <div className="pt-2">
                <ProgressBar
                  value={completionPercentage}
                  title="Laboratory Complete Percentage"
                  subtitle="academic resolution percentage index"
                  variant="green"
                  segmented
                />
              </div>

              {/* Static notice warning */}
              <div className="text-[11px] font-mono text-gray-400 bg-gray-950 p-2 border border-gray-900 rounded">
                🎯 <span className="text-gray-300 font-semibold">Active Directive:</span> Complete Labs consecutively in the Roadmap pane. Each solved laboratory grants direct cyber expertise.
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Card 3: Lab Complete count display banner */}
        <motion.div variants={itemVariants}>
          <Card
            variant="neutral"
            title="CONSOLE DIAGNOSTICS"
            subtitle="Virtual cyber environment parameters"
            footerStatus="diagnostics_ping: active"
            className="h-full flex flex-col justify-between"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-gray-900 pb-2">
                <span className="text-gray-500">ROOT SECURE LINK ID:</span>
                <span className="text-gray-300 font-bold select-all">EV_PHASE1_STABLE</span>
              </div>
              <div className="flex justify-between border-b border-gray-900 pb-2">
                <span className="text-gray-500">MENTOR ONLINE SIGN:</span>
                <span className="text-[#00ff88] font-bold">VIMAL_ACAD_PRO</span>
              </div>
              <div className="flex justify-between border-b border-gray-900 pb-2">
                <span className="text-gray-500">IFRAME ATTACHMENT:</span>
                <span className="text-[#00c3ff] font-bold">SANDBOXED_OK</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-500">DATABASE:</span>
                <span className="text-gray-400">browser_localstorage</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              className="mt-4"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => setRoute('roadmap')}
            >
              LAUNCH ROADMAP
            </Button>
          </Card>
        </motion.div>
      </motion.div>

      {/* Grid Row 2: Roadmap Syllabus Preview (3 Labs) & Achievements section (with custom interactive unlock elements) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Lab Curricula Roadmap Preview */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1 font-mono text-xs text-gray-500 tracking-wide uppercase">
            <span>Roadmap Preview // First 3 Labs</span>
            <button 
              onClick={() => setRoute('roadmap')} 
              className="text-[#00ff88] hover:underline flex items-center gap-1 font-bold text-xs capitalize"
            >
              Explore Full Syllabus <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {roadmapPreviewLabs.map((lab) => {
              const isLocked = !lab.unlocked;
              const isCompleted = lab.completed;

              return (
                <div 
                  key={lab.id} 
                  className={`
                    flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border transition-all duration-200
                    ${isCompleted 
                      ? 'bg-emerald-950/10 border-emerald-900/30 text-white' 
                      : isLocked 
                        ? 'bg-gray-950/40 border-gray-900/50 text-gray-500 opacity-60' 
                        : 'bg-[#111827]/75 border-gray-800/80 text-white hover:border-gray-700'
                    }
                  `}
                >
                  <div className="flex gap-3 items-start flex-1 min-w-0 pr-4">
                    {/* Lab Status symbol */}
                    <div className={`
                      w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border mt-0.5
                      ${isCompleted 
                        ? 'bg-emerald-950 border-[#00ff88]/40 text-[#00ff88]' 
                        : isLocked 
                          ? 'bg-gray-950 border-gray-900 text-gray-600' 
                          : 'bg-cyan-950 border-[#00c3ff]/40 text-[#00c3ff]'
                      }
                    `}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] font-bold text-gray-500">
                          LAB_0{lab.id}
                        </span>
                        <Badge 
                          variant={lab.difficulty === 'Beginner' ? 'slate' : 'blue'} 
                          size="sm"
                        >
                          {lab.difficulty}
                        </Badge>
                        <span className="font-mono text-[10px] text-gray-400">
                          ({lab.category})
                        </span>
                      </div>
                      <h4 className={`
                        font-display font-bold text-sm tracking-wide truncate
                        ${isCompleted ? 'text-gray-300' : isLocked ? 'text-gray-500' : 'text-white'}
                      `}>
                        {lab.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 font-sans">
                        {lab.description}
                      </p>
                    </div>
                  </div>

                  {/* Operational buttons */}
                  <div className="mt-4 sm:mt-0 flex items-center gap-3">
                    <span className="font-mono text-xs text-right hidden sm:block">
                      <span className="text-[#00ff88] font-bold">+{lab.xpReward}</span>
                      <span className="text-gray-500 block text-[9px] lowercase">award_xp</span>
                    </span>

                    {isCompleted ? (
                      <span className="px-3 py-1.5 bg-emerald-950/20 border border-emerald-900/40 text-[#00ff88] text-[10px] font-mono uppercase font-bold rounded">
                        SOLVED_OK
                      </span>
                    ) : isLocked ? (
                      <span className="px-3 py-1.5 bg-gray-950 border border-transparent text-gray-600 text-[10px] font-mono uppercase font-bold rounded flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> ENCRYPTED
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Play className="w-3 h-3 text-[#00ff88]" />}
                        onClick={() => setActiveLabDetail(lab)}
                      >
                        LAUNCH
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Achievement placeholder section */}
        <div className="space-y-4">
          <div className="px-1 font-mono text-xs text-gray-500 tracking-wide uppercase">
            OPERATIONAL_ACHIEVEMENTS // HUD_LOG
          </div>

          <Card
            variant="neutral"
            title="MILITARY BADGE RACKS"
            subtitle="Decoded milestones from lab exploits"
            className="p-4"
          >
            <div className="flex flex-col gap-3">
              {achievements.map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id}
                    className={`
                      flex items-center gap-3.5 p-3 rounded border transition-all duration-200
                      ${item.unlocked 
                        ? 'bg-emerald-950/10 border-[#00ff88]/20 text-white' 
                        : 'bg-gray-950/50 border-gray-900 text-gray-400 opacity-40'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded flex items-center justify-center border
                      ${item.unlocked 
                        ? 'bg-emerald-950 border-[#00ff88]/40 text-[#00ff88] shadow-neon-green/10 shadow-sm' 
                        : 'bg-gray-950 border-gray-900 text-gray-600'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-display font-bold text-xs tracking-wide">
                          {item.title}
                        </span>
                        <Badge 
                          variant={item.unlocked ? (item.tier === 'Legendary' ? 'pink' : item.tier === 'Gold' ? 'amber' : 'green') : 'slate'} 
                          size="sm"
                          className="scale-90"
                        >
                          {item.tier}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

      {/* Lab Simulation Modal to showcase Phase 2 interactive verification */}
      <Modal
        isOpen={!!activeLabDetail}
        onClose={() => setActiveLabDetail(null)}
        title={`SECURE CONNECTION // LAB 0${activeLabDetail?.id}`}
        subtitle={`TARGET_SYSTEM: ${activeLabDetail?.title}`}
        variant="green"
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
