import React from 'react';
import { useProgressStore } from '../../store/progressStore';
import { useXPStore } from '../../store/xpStore';
import { LayoutDashboard, Compass, ShieldAlert, Cpu } from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  setRoute: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, setRoute }) => {
  const { labs, completedLabs } = useProgressStore();
  const { xp } = useXPStore();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'DASHBOARD HUD',
      icon: LayoutDashboard,
      desc: 'Central diagnostics console',
    },
    {
      id: 'roadmap',
      label: 'SYLLABUS ROADMAP',
      icon: Compass,
      desc: '16 Practical hacking labs',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0a0f19] border-r border-gray-900 h-[calc(100vh-4rem)] p-5 justify-between flex-shrink-0 select-none">
      {/* Primary menu items */}
      <div className="flex flex-col gap-6">
        <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase border-b border-gray-900 pb-1.5">
          TACTICAL_OPTIONS
        </div>

        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={`
                  w-full text-left rounded-md p-3 font-mono transition-all duration-150 relative overflow-hidden group
                  ${isActive 
                    ? 'bg-[#00ff88]/5 border border-[#00ff88]/30 shadow-neon-green/10 text-white' 
                    : 'text-gray-400 hover:text-white border border-transparent hover:bg-gray-900/45 hover:border-gray-800'
                  }
                `}
              >
                {/* Micro corner accent for active button */}
                {isActive && (
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#00ff88]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#00ff88]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <div>
                    <span className="text-xs font-bold block leading-none">{item.label}</span>
                    <span className="text-[9px] text-gray-400 font-normal lowercase block mt-1">{item.desc}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Auxiliary Status telemetries at the bottom of sidebar */}
      <div className="flex flex-col gap-4 border-t border-gray-900 pt-5">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Cpu className="text-[#00c3ff] w-4 h-4 animate-spin [animation-duration:8s]" />
          <span>SYS_ENGINE_ONLINE</span>
        </div>

        {/* Small stats HUD */}
        <div className="bg-[#111827]/60 rounded border border-gray-900 p-3 font-mono text-[10px]">
          <div className="flex justify-between py-1 border-b border-gray-900">
            <span className="text-gray-500">LABS COMPLETED:</span>
            <span className="text-[#00ff88] font-bold">{completedLabs.length} / {labs.length}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-900">
            <span className="text-gray-500">ACQUIRED XP:</span>
            <span className="text-[#00c3ff] font-bold">{xp} EXP</span>
          </div>
          <div className="flex justify-between py-1 mt-1 font-bold">
            <span className="text-gray-500">CORE STATUS:</span>
            <span className="text-[#00ff88] animate-pulse">OPTIMIZED</span>
          </div>
        </div>

        {/* Brand note */}
        <div className="text-[9px] font-mono text-gray-600 block leading-tight text-center">
          &bull; EV Cyber Academy &bull; <br />
          Core Kernel build v26.5
        </div>
      </div>
    </aside>
  );
};
