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

      if (['dashboard', 'roadmap'].includes(hash)) {
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
      ) : (
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Top Navbar */}
          <Navbar currentRoute={currentRoute} setRoute={setRoute} />

          {/* Central Body workspace */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar on desktop sizes */}
            <Sidebar currentRoute={currentRoute} setRoute={setRoute} />

            {/* Main scrollable content view */}
            <main className="flex-1 overflow-y-auto bg-[#050816]/50">
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
