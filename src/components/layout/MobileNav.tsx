import React from 'react';
import { LayoutDashboard, Compass } from 'lucide-react';

interface MobileNavProps {
  currentRoute: string;
  setRoute: (route: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentRoute, setRoute }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'DASHBOARD HUD',
      icon: LayoutDashboard,
    },
    {
      id: 'roadmap',
      label: 'ROADMAP',
      icon: Compass,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0f19]/95 border-t border-gray-900 z-40 backdrop-blur-md flex items-center justify-around select-none px-2 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setRoute(item.id)}
            className={`
              flex flex-col items-center justify-center flex-1 h-full font-mono text-center gap-1 transition-colors
              ${isActive ? 'text-[#00ff88]' : 'text-gray-500 hover:text-gray-300'}
            `}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#00ff88] rounded-full" />
              )}
            </div>
            <span className="text-[9px] font-black tracking-widest uppercase truncate max-w-full">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
