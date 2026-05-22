import { create } from 'zustand';
import { LevelName } from '../types';
import { calculateLevel } from '../lib/xp-engine';
import { getData, setData } from '../lib/storage';

interface XPState {
  xp: number;
  level: LevelName;
  addXP: (amount: number) => void;
  resetXP: () => void;
}

export const useXPStore = create<XPState>((set) => {
  // Load initial XP
  const cachedXP = getData<number>('ev_xp') ?? 0;
  const initialLevel = calculateLevel(cachedXP);

  return {
    xp: cachedXP,
    level: initialLevel,
    addXP: (amount: number) => {
      set((state) => {
        const nextXP = Math.max(0, state.xp + amount);
        const nextLevel = calculateLevel(nextXP);
        setData('ev_xp', nextXP);
        return {
          xp: nextXP,
          level: nextLevel,
        };
      });
    },
    resetXP: () => {
      setData('ev_xp', 0);
      set({ xp: 0, level: 'Beginner' });
    }
  };
});
