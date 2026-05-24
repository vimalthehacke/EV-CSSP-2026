import React, { useState } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { useXPStore } from '../../store/xpStore';
import { useAuthStore } from '../../store/authStore';
import { LabCategory, Lab } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  ShieldAlert, 
  Trash2, 
  Terminal, 
  HelpCircle, 
  Lock, 
  CheckCircle,
  TrendingUp,
  Cpu,
  Globe,
  Key,
  Shield,
  Zap,
  RotateCcw,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { playCpsHover, playCpsClick } from '../../lib/audioEngine';

export const CompletionSummary: React.FC = () => {
  const { labs, completedLabs, resetProgress } = useProgressStore();
  const { logout } = useAuthStore();
  const [hoveredCategory, setHoveredCategory] = useState<LabCategory | null>(null);

  // Define categories with styling metadata and custom generated vector assets
  const categories: { label: string; key: LabCategory; color: string; shortLabel: string; icon: any; imgUrl: string }[] = [
    { label: 'Reconnaissance', key: 'Reconnaissance', color: '#00ff88', shortLabel: 'RECON', icon: Terminal, imgUrl: '/src/assets/images/icon_recon_1779629177386.png' },
    { label: 'Web Exploitation', key: 'Web Exploitation', color: '#00c3ff', shortLabel: 'WEB_EXP', icon: Globe, imgUrl: '/src/assets/images/icon_web_1779629196705.png' },
    { label: 'Reverse Engineering', key: 'Reverse Engineering', color: '#ff3b5f', shortLabel: 'REV_ENG', icon: Cpu, imgUrl: '/src/assets/images/icon_reverse_1779629215553.png' },
    { label: 'Cryptography', key: 'Cryptography', color: '#ffb300', shortLabel: 'CRYPTO', icon: Key, imgUrl: '/src/assets/images/icon_crypto_1779629232434.png' },
    { label: 'Privilege Escalation', key: 'Privilege Escalation', color: '#a855f7', shortLabel: 'PRIV_ESC', icon: Shield, imgUrl: '/src/assets/images/icon_privesc_1779629251104.png' },
    { label: 'Network Attack', key: 'Network Attack', color: '#3b82f6', shortLabel: 'NET_ATK', icon: Zap, imgUrl: '/src/assets/images/icon_network_1779629272659.png' },
  ];

  // Calculate live stats for each category
  const categoryData = categories.map((cat) => {
    const categoryLabs = labs.filter(l => l.category === cat.key);
    const totalCount = categoryLabs.length;
    const completedCount = categoryLabs.filter(l => l.completed).length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return {
      ...cat,
      totalCount,
      completedCount,
      percentage,
      labsList: categoryLabs
    };
  });

  // Radar chart geometric parameters
  const width = 300;
  const height = 280;
  const cx = width / 2;
  const cy = height / 2;
  const R = 85; // maximum radius
  const N = categories.length;

  // Helper to compute coordinates of dynamic points
  const getCoordinates = (index: number, radiusRatio: number) => {
    const angle = (index * 2 * Math.PI) / N - Math.PI / 2; // Subtract pi/2 to point the first node upwards
    const r = R * radiusRatio;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // Generate outer polygon grids (e.g. 20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: N }).map((_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  // Generate coordinates for axis lines
  const axes = Array.from({ length: N }).map((_, i) => {
    const start = { x: cx, y: cy };
    const end = getCoordinates(i, 1.0);
    return { start, end, ...categories[i] };
  });

  // Generate coordinates for progress data polygon
  const progressPoints = categoryData.map((data, i) => {
    // Treat as scaled between 0 and 1. Avoid NaN or division anomalies. Ensure minimal representation (e.g. 5%) if solved so it's a visible point
    const scale = Math.max(0.01, data.percentage / 100);
    const { x, y } = getCoordinates(i, scale);
    return { x, y, ...data };
  });

  const progressPolygonString = progressPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Safe reset of only lab parameters
  const handlePurgeLabs = () => {
    playCpsClick(false);
    if (confirm("🚨 PURGE ALL LABS:\nAre you sure you want to lock all laboratories, clear solved tasks logs, and reset XP to 0?\nNote: Your active username is preserved.")) {
      resetProgress();
      toast.success("LAB_DESTRUCTION_SUCCESS: All cybersecurity sandbox systems have been wiped and re-locked.", {
        className: 'sonner-toast-override',
        duration: 4000,
      });
    }
  };

  // Purge entire application state (Factory reset)
  const handlePurgeWebsite = () => {
    playCpsClick(false);
    if (confirm("💀 TOTAL DESTRUCTION (FACTORY RESET):\nThis will completely purge all browser local storage including your username, password credentials, level histories, and metrics.\n\nYou will be logged out and the page will reload to factory conditions. Proceed?")) {
      try {
        localStorage.clear();
        toast.error("FACTORY_RESET: Wiping files containers... reloading system.", {
          className: 'sonner-toast-override',
          duration: 3000,
        });
        setTimeout(() => {
          window.location.hash = 'login';
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error("Purge failure: ", err);
      }
    }
  };

  // Purge user, progress, XP, credentials, and reload to start fresh
  const handlePurgeUser = () => {
    playCpsClick(false);
    if (confirm("🚨 PURGE USER & FULL DATABASE RESET:\nThis will completely purge your active user profile, solved labs history, XP milestones, and browser memory.\n\nYou will be logged out and start the academy from scratch as if visiting for the very first time. Continue?")) {
      try {
        localStorage.clear();
        logout();
        resetProgress();
        useXPStore.getState().resetXP();
        toast.error("USER_PURGED: All active credentials and training progress destroyed. Reloading...", {
          className: 'sonner-toast-override',
          duration: 3000,
        });
        setTimeout(() => {
          window.location.hash = 'login';
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error("Purge user failure: ", err);
      }
    }
  };

  return (
    <Card
      variant="neutral"
      title="COMPLETION SUMMARY // SECURITY RADAR"
      subtitle="Operational yield across the 6 different cyber lab categories"
      footerStatus="telemetry_radar: functional_online"
      className="p-5 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Dynamic Interactive Radar Chart */}
        <div id="radar-chart-container" className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="absolute top-1 left-1 border-tl-glow text-[9px] font-mono text-gray-500 tracking-wider">
            RADAR_MODULE_V4.x
          </div>

          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${width} ${height}`} 
            className="max-w-[320px] max-h-[300px] drop-shadow-[0_0_20px_rgba(0,255,136,0.06)]"
          >
            {/* Defs block for beautiful gradients */}
            <defs>
              <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.12" />
                <stop offset="70%" stopColor="#050816" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#050816" stopOpacity="1" />
              </radialGradient>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Circular radar sweeper glow */}
            <circle cx={cx} cy={cy} r={R} fill="url(#radar-glow)" />

            {/* Concentric Grid lines polygons */}
            {gridPolygons.map((points, idx) => (
              <polygon
                key={idx}
                points={points}
                fill="none"
                stroke="rgba(0, 255, 136, 0.15)"
                strokeWidth="1.2"
                strokeDasharray={idx === gridPolygons.length - 1 ? "none" : "3,3"}
              />
            ))}

            {/* Scale indicator values */}
            {gridLevels.map((level, idx) => {
              const coords = getCoordinates(0, level);
              return (
                <text
                  key={idx}
                  x={coords.x + 3}
                  y={coords.y + 4}
                  fill="rgba(0, 255, 136, 0.4)"
                  fontSize="8"
                  className="font-mono"
                  textAnchor="start"
                >
                  {`${Math.round(level * 100)}%`}
                </text>
              );
            })}

            {/* Sector Axis lines */}
            {axes.map((axis, idx) => {
              const isHovered = hoveredCategory === axis.key;
              return (
                <g key={idx} className="transition-all duration-200">
                  <line
                    x1={axis.start.x}
                    y1={axis.start.y}
                    x2={axis.end.x}
                    y2={axis.end.y}
                    stroke={isHovered ? "rgba(0, 255, 136, 0.5)" : "rgba(0, 255, 136, 0.18)"}
                    strokeWidth={isHovered ? "1.8" : "1"}
                  />
                </g>
              );
            })}

            {/* User progress polygon area */}
            <polygon
              points={progressPolygonString}
              fill="rgba(0, 195, 255, 0.18)"
              stroke="#00c3ff"
              strokeWidth="2.2"
              className="transition-all duration-500 ease-out"
              style={{ filter: 'url(#neon-glow)' }}
            />

            {/* Highlighted hover polygon layer */}
            {hoveredCategory && (() => {
              const catIndex = categories.findIndex(c => c.key === hoveredCategory);
              if (catIndex !== -1) {
                const targetPoints = progressPoints.map((p, i) => {
                  const scale = i === catIndex ? Math.max(0.01, p.percentage / 100) : 0;
                  const { x, y } = getCoordinates(i, scale);
                  return `${x},${y}`;
                });
                return (
                  <polygon
                    points={progressPolygonString}
                    fill="url(#radar-glow)"
                    stroke="#00ff88"
                    strokeWidth="2.8"
                    opacity="0.35"
                  />
                );
              }
              return null;
            })()}

            {/* Vertex Point circles with real-time hovering actions */}
            {progressPoints.map((point, idx) => {
              const isCatHovered = hoveredCategory === point.key;
              const hasSolvedLabs = point.completedCount > 0;

              return (
                <g 
                  key={idx}
                  onMouseEnter={() => {
                    setHoveredCategory(point.key);
                    playCpsHover();
                  }}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCatHovered ? "7" : "4.5"}
                    fill={isCatHovered ? "#00ff88" : hasSolvedLabs ? "#00c3ff" : "#111827"}
                    stroke={isCatHovered ? "#ffffff" : "#00ff88"}
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  {isCatHovered && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="12"
                      fill="none"
                      stroke="#00ff88"
                      strokeWidth="1.2"
                      className="animate-ping"
                      opacity="0.4"
                    />
                  )}
                </g>
              );
            })}

            {/* Category vertex outer text labels */}
            {categories.map((cat, idx) => {
              const { x, y } = getCoordinates(idx, 1.16);
              const isHovered = hoveredCategory === cat.key;
              
              // Smart coordinate align to prevent text boundaries clip
              const angle = (idx * 2 * Math.PI) / N - Math.PI / 2;
              const cosValue = Math.cos(angle);
              let textAnchor = 'middle';
              
              if (cosValue > 0.15) {
                textAnchor = 'start';
              } else if (cosValue < -0.15) {
                textAnchor = 'end';
              }

              return (
                <text
                  key={idx}
                  x={x}
                  y={y + 4}
                  fill={isHovered ? "#00ff88" : "rgba(229, 231, 235, 0.85)"}
                  fontWeight={isHovered ? "bold" : "normal"}
                  fontSize="8.5"
                  className="font-mono tracking-wide"
                  style={{ textShadow: isHovered ? '0 0 8px rgba(0,255,136,0.3)' : 'none' }}
                  textAnchor={textAnchor}
                  onMouseEnter={() => {
                    setHoveredCategory(cat.key);
                    playCpsHover();
                  }}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {cat.shortLabel}
                </text>
              );
            })}
          </svg>

          {/* Quick HUD legend of radar scales */}
          <div className="flex gap-4 mt-2 justify-center text-[10px] font-mono text-gray-400 border border-gray-900 rounded bg-gray-950/50 py-1 px-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111827] border border-[#00ff88]" />
              0% Solved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c3ff] border border-[#00ff88]" />
              Active Progress
            </span>
          </div>
        </div>

        {/* Categories Breakdown statistics & Interactive Lists */}
        <div className="md:col-span-6 space-y-3.5">
          <div className="text-xs font-mono text-gray-400 border-b border-gray-900 pb-1.5 flex justify-between items-center">
            <span>TRACKING_MATRIX (6 NODES)</span>
            {hoveredCategory && (
              <span className="text-[#00ff88] font-bold uppercase animate-pulse">
                SCANNED: {hoveredCategory}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {categoryData.map((data) => {
              const isHovered = hoveredCategory === data.key;
              const totalLabsCount = data.totalCount;
              const completedLabsCount = data.completedCount;

              return (
                <div
                  key={data.key}
                  onMouseEnter={() => {
                    setHoveredCategory(data.key);
                    playCpsHover();
                  }}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`
                    p-2 border rounded transition-all duration-200 cursor-pointer flex items-center justify-between
                    ${isHovered 
                      ? 'bg-gray-950/80 border-[#00ff88]/50 text-white shadow-neon-green/5 shadow-sm scale-[1.01]' 
                      : completedLabsCount === totalLabsCount && totalLabsCount > 0
                        ? 'bg-emerald-950/5 border-emerald-900/20 text-gray-200'
                        : 'bg-gray-950/30 border-gray-900 text-gray-300 hover:border-gray-800'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Beautiful custom vector icon visual indicator */}
                    <div className={`relative w-8 h-8 rounded border overflow-hidden flex items-center justify-center shrink-0 transition-colors
                      ${isHovered 
                        ? 'border-[#00ff88]/65 bg-[#00ff88]/5 shadow-neon-green/10' 
                        : completedLabsCount === totalLabsCount && totalLabsCount > 0
                          ? 'border-[#00ff88]/30 bg-[#00ff88]/5'
                          : 'border-gray-805 bg-gray-900/60'
                      }
                    `}>
                      <img 
                        src={data.imgUrl} 
                        alt={data.label} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
                        <span className="truncate pr-1">{data.label}</span>
                        <span className="text-gray-400 flex-shrink-0">
                          {completedLabsCount}/{totalLabsCount} solved
                        </span>
                      </div>
                      
                      {/* Simple Micro Progress Bar */}
                      <div className="w-full bg-gray-900 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${data.percentage}%`,
                            backgroundColor: isHovered ? '#00ff88' : data.color
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-2 text-right flex-shrink-0 min-w-10 font-mono text-xs">
                    <span className={completedLabsCount === totalLabsCount && totalLabsCount > 0 ? "text-[#00ff88]" : isHovered ? "text-[#00ff88] font-bold" : "text-gray-400"}>
                      {Math.round(data.percentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secure Destruction / Factory System actions */}
          <div className="border-t border-gray-900 pt-3.5 flex flex-wrap gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePurgeLabs}
              className="text-xs border border-transparent hover:border-rose-950 hover:bg-rose-950/20 text-gray-400 hover:text-[#ff3b5f]"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            >
              PURGE_ALL_LABS
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePurgeUser}
              className="text-xs border-dashed border-rose-900/50 hover:border-rose-600 bg-rose-950/5 hover:bg-rose-950/30 text-rose-300 font-mono"
              leftIcon={<UserX className="w-3.5 h-3.5 text-rose-400" />}
            >
              Purge User
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePurgeWebsite}
              className="text-xs border-dashed border-rose-900/50 hover:border-rose-600 bg-rose-950/5 hover:bg-rose-950/30 text-rose-400"
              leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
            >
              PURGE_WEBSITE()
            </Button>
          </div>

        </div>

      </div>
    </Card>
  );
};
