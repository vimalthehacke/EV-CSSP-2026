import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { LoginPage } from './components/login/LoginPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { RoadmapPage } from './components/roadmap/RoadmapPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_LABS } from './store/progressStore';
import { LabContainer } from './components/roadmap/engine/LabContainer';

export default function App() {
  const { user } = useAuthStore();
  const [currentRoute, setCurrentRouteState] = useState<string>('login');

  // Unified route modifier syncing route with browser hashes
  const setRoute = (route: string) => {
    // If not logged in, force 'login'
    if (!user) {
      setCurrentRouteState('login');
      window.location.hash = 'login';
      return;
    }
    setCurrentRouteState(route);
    window.location.hash = route;
  };

  // Sync routes with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (!user) {
        setCurrentRouteState('login');
        return;
      }

      if (['dashboard', 'roadmap'].includes(hash) || hash.startsWith('sandbox=')) {
        setCurrentRouteState(hash);
      } else {
        // Fallback for logged-in user
        setCurrentRouteState('dashboard');
        window.location.hash = 'dashboard';
      }
    };

    // Run on startup
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Handle auto-redirect rules when auth state changes
  useEffect(() => {
    if (!user) {
      setCurrentRouteState('login');
      window.location.hash = 'login';
    } else if (currentRoute === 'login') {
      setCurrentRouteState('dashboard');
      window.location.hash = 'dashboard';
    }
  }, [user]);

  // Page switching renderer with micro slide animations
  const renderPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage setRoute={setRoute} />;
      case 'roadmap':
        return <RoadmapPage />;
      default:
        return <DashboardPage setRoute={setRoute} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050816] text-gray-100 flex flex-col overflow-x-hidden scanlines">
      {/* Absolute background matrix noise grids */}
      <div className="absolute inset-0 matrix-grid opacity-30 pointer-events-none" />

      {/* Global Toast Console */}
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            color: '#00ff88',
            fontFamily: 'var(--font-mono)',
          }
        }}
      />

      {/* Conditional Layout shell */}
      {!user ? (
        <LoginPage />
      ) : currentRoute.startsWith('sandbox=') ? (
        <div className="w-full h-screen bg-[#050816] p-3 md:p-5 overflow-hidden flex flex-col relative">
          <div className="flex justify-between items-center mb-3 border-b border-gray-900 pb-2.5 h-10 select-none shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[#00ff88] font-mono text-xs md:text-sm font-black tracking-widest uppercase">EV ACADEMY WORKSPACE</span>
              <span className="text-gray-700 font-mono text-xs">|</span>
              {(() => {
                const labId = parseInt(currentRoute.split('=')[1], 10) || 1;
                const lab = INITIAL_LABS.find(l => l.id === labId);
                return (
                  <span className="text-gray-300 font-sans text-xs md:text-sm font-bold uppercase truncate max-w-[200px] md:max-w-md">
                    Lab {lab?.id}: {lab?.title}
                  </span>
                );
              })()}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#00ff88]/90 font-mono bg-[#00ff88]/5 border border-[#00ff88]/20 px-2 py-0.5 rounded uppercase hidden sm:inline-block">
                SECURE_CONSOLE_ACTIVE
              </span>
              <a 
                href="/public/solution-labs.txt" 
                target="_blank" 
                className="text-[10px] text-yellow-500 font-mono bg-yellow-950/20 border border-yellow-800/30 px-2 py-0.5 rounded uppercase hover:bg-yellow-950/40 transition-colors decoration-none"
                title="View the solutions documentation file in a separate tab"
              >
                SOLUTIONS 🡕
              </a>
              <button
                onClick={() => {
                  window.location.hash = 'roadmap';
                  window.location.reload();
                }}
                className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88]/20 rounded transition-all cursor-pointer"
              >
                RETURN_TO_ACADEMY
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden w-full h-full flex flex-col">
            {(() => {
              const labId = parseInt(currentRoute.split('=')[1], 10) || 1;
              const cleanLab = INITIAL_LABS.find(l => l.id === labId) || INITIAL_LABS[0];
              const mappedLab: any = {
                ...cleanLab,
                unlocked: true,
                completed: false,
              };
              return (
                <LabContainer
                  lab={mappedLab}
                  onClose={() => {
                    window.location.hash = 'roadmap';
                    window.location.reload();
                  }}
                />
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Top Navbar */}
          <Navbar currentRoute={currentRoute} setRoute={setRoute} />

          {/* Central Body workspace */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar on desktop sizes */}
            <Sidebar currentRoute={currentRoute} setRoute={setRoute} />

            {/* Main scrollable content view */}
            <main className="flex-1 overflow-y-auto overflow-x-auto bg-[#050816]/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoute}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex flex-col"
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          {/* Sticky Mobile bottom navigation */}
          <MobileNav currentRoute={currentRoute} setRoute={setRoute} />
        </div>
      )}
    </div>
  );
}
