import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { Card } from '../ui/Card';
import { Terminal, Lock, User, ShieldAlert, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  
  const { login, error, clearError } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    // Simulate cyber decrypter verification delay
    setTimeout(() => {
      const trimmedUser = username.trim();
      const success = login(trimmedUser, password);
      setLoading(false);

      if (success) {
        toast.success(`DECRYPTER_ONLINE: Secure session granted for operator ${trimmedUser}!`, {
          className: 'sonner-toast-override',
          duration: 3500,
        });
      } else {
        toast.error('ACCESS_REFUSED: Check console credentials.', {
          className: 'sonner-toast-override',
          duration: 3000,
        });
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050816] flex items-center justify-center p-4 overflow-hidden matrix-grid">
      {/* Decorative Cyber Grid Background & Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00c3ff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Header branding lock */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-[#00ff88]/30 rounded text-[#00ff88] text-[10px] font-mono uppercase tracking-widest mb-3 select-none">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>EV Security Shield Active</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#00ff88] tracking-widest uppercase mb-1">
              EV CYBER ACADEMY
            </h1>
            <h2 className="text-sm font-mono text-white font-semibold tracking-wider uppercase">
              LABS GATEWAY &bull; DEVELOPED BY VIMALTHEHACKER
            </h2>
          </div>

          {/* Secure console LoginForm */}
          <Card
            variant="green"
            title="AUTHENTICATE_OPERATOR"
            subtitle="Core Decryption Protocol v26.5"
            className="shadow-neon-green/10"
            footerStatus="system_integrity: verify_mode"
          >
            {/* Vimal mentor guidelines box */}
            <div className="bg-gray-950/80 rounded border border-[#00ff88]/10 p-3 mb-5 font-mono text-[11px] leading-relaxed relative">
              <span className="absolute top-1.5 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
              </span>
              <div className="text-[#00ff88] font-bold mb-1">MENTOR CORE: Vimal Directive #01</div>
              <p className="text-gray-400">
                &ldquo;Welcome recruit to Phase 1. Complete validation to enter the Cyber Range. Passphrase instructions are listed in your onboarding envelope.&rdquo;
              </p>
              <div className="text-gray-500 text-[9px] mt-1 text-right">passcode: ev2026</div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username Input */}
              <InputField
                id="username-field"
                label="Hacker Alias"
                placeholder="input nickname / alias..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
                disabled={loading}
              />

              {/* Password Input */}
              <InputField
                id="password-field"
                label="Private Mentor Secret"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
                disabled={loading}
                error={error || undefined}
              />

              {/* Login Button with loading state */}
              <Button
                id="sumbit-btn"
                variant="cyber"
                type="submit"
                fullWidth
                isLoading={loading}
                className="mt-2 py-3"
                rightIcon={<Terminal className="w-4 h-4" />}
              >
                {loading ? 'CONNECTING_KERNEL...' : 'INITIALIZE_DESKTOP()'}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-900/40 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (!confirmReset) {
                    setConfirmReset(true);
                    setTimeout(() => setConfirmReset(false), 5000);
                  } else {
                    const resetProgress = useProgressStore.getState().resetProgress;
                    resetProgress();
                    setConfirmReset(false);
                    toast.success("SYSTEM_PURGE: State purged successfully. All achievements cleared.", {
                      className: 'sonner-toast-override',
                      duration: 3500,
                    });
                  }
                }}
                className={`py-1.5 px-3.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-300 border
                  ${confirmReset 
                    ? 'bg-red-950/20 border-red-500/50 text-red-400 hover:bg-red-900/20 animate-pulse' 
                    : 'bg-black/40 border-gray-900 text-gray-500 hover:border-red-950/40 hover:text-red-400/80 hover:bg-red-950/10'
                  }`}
              >
                {confirmReset ? '⚠ CONFIRM SYSTEM PURGE? (CLICK)' : '⚙ Reset Simulation State'}
              </button>
            </div>
          </Card>

          {/* Diagnostic terminal status feedback */}
          <div className="mt-6 flex flex-col items-center gap-1.5 font-mono text-[9px] text-gray-500">
            <div className="flex justify-between w-full px-2">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 animate-spin [animation-duration:10s]" />
                SYS_VER: 1.25
              </span>
              <span>DEV: vimalthehacker</span>
              <span>CONN: SECURE_NET</span>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
