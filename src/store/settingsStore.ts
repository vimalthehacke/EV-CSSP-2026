import { create } from 'zustand';
import { getData, setData } from '../lib/storage';

interface SettingsState {
  soundEffectsEnabled: boolean;
  volume: number;
  toggleSoundEffects: () => void;
  setVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => {
  const cachedSettings = getData<{ soundEffectsEnabled: boolean; volume: number }>('ev_settings');
  
  const initialSoundEffects = cachedSettings ? cachedSettings.soundEffectsEnabled : true;
  const initialVolume = cachedSettings ? cachedSettings.volume : 0.3;

  return {
    soundEffectsEnabled: initialSoundEffects,
    volume: initialVolume,
    toggleSoundEffects: () => set((state) => {
      const nextVal = !state.soundEffectsEnabled;
      setData('ev_settings', { soundEffectsEnabled: nextVal, volume: state.volume });
      return { soundEffectsEnabled: nextVal };
    }),
    setVolume: (vol) => set((state) => {
      const clampedVol = Math.max(0, Math.min(1, vol));
      setData('ev_settings', { soundEffectsEnabled: state.soundEffectsEnabled, volume: clampedVol });
      return { volume: clampedVol };
    }),
  };
});
