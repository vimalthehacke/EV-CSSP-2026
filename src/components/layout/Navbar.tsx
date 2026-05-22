import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useXPStore } from '../../store/xpStore';
import { getLevelDetail } from '../../lib/xp-engine';
import { LogOut, Terminal, Award, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentRoute: string;
  setRoute: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, setRoute }) => {
  const { user, logout } = useAuthStore();
  const { xp } = useXPStore();
  const levelDetail = getLevelDetail(xp);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050816]/90 border-b border-gray-900 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Title logo and emblem */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded bg-[#00ff88]/10 border border-[#00ff88]/30">
            <Terminal className="text-[#00ff88] w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping"></span>
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-widest text-white uppercase block select-none">
              EV CYBER ACADEMY <span className="text-[#00ff88] font-mono font-bold text-xs">LABS</span>
            </span>
            <span className="text-[9px] text-gray-500 font-mono block tracking-wider uppercase select-none">
              FOUNDER: VIMAL &bull; PHASE_1_SECURE
            </span>
          </div>
        </div>

        {/* User stats indicator HUD */}
        {user && (
          <div className="flex items-center gap-4">
            {/* XP Status HUD Panel - Hidden on extra-small mobile */}
            <div className="hidden sm:flex items-center gap-3 border-r border-gray-800 pr-5">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">RANK:</span>
                  <span className="text-xs font-mono font-black text-[#00c3ff] uppercase tracking-wider">
                    {levelDetail.current}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-gray-400">
                  <span className="text-[#00ff88] font-bold">{xp}</span>
                  <span className="text-gray-600"> / {levelDetail.nextThresholdXP} XP</span>
                </div>
              </div>

              {/* Minimal Circle level indicator */}
              <div className="w-10 h-10 rounded-full border border-gray-800 flex flex-col items-center justify-center relative bg-gray-950">
                <Award className="w-3.5 h-3.5 text-[#00c3ff]" />
                <span className="text-[10px] font-black text-white leading-none mt-0.5 select-none">
                  Lvl
                </span>
              </div>
            </div>

            {/* Logged in Username info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-gray-800 bg-gray-950 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-mono font-bold text-white max-w-[100px] truncate">
                  {user.username}
                </div>
                <div className="text-[8px] font-mono text-emerald-400">ACTIVE_OPERATOR</div>
              </div>
            </div>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="px-2.5 py-1.5 border-gray-800 hover:border-red-900/30 hover:bg-red-950/20 text-gray-400 hover:text-red-400"
              title="Terminate Secure Session"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
