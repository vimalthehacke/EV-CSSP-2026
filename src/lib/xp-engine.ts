import { LevelName } from '../types';

export interface LevelThreshold {
  name: LevelName;
  minXP: number;
  nextThreshold: number;
  title: string;
  codename: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { name: 'Beginner', minXP: 0, nextThreshold: 100, title: 'Neophyte Hacking Recruit', codename: 'LEVEL_0_INIT' },
  { name: 'Explorer', minXP: 100, nextThreshold: 300, title: 'Network Probe Specialist', codename: 'LEVEL_1_SCAN' },
  { name: 'Operator', minXP: 300, nextThreshold: 600, title: 'Active exploit Intruder', codename: 'LEVEL_2_PWN' },
  { name: 'Hunter', minXP: 600, nextThreshold: 1000, title: 'Threat Intelligence Tracker', codename: 'LEVEL_3_HUNT' },
  { name: 'Analyst', minXP: 1000, nextThreshold: 1500, title: 'Digital Forensic investigator', codename: 'LEVEL_4_ROOT' },
  { name: 'Elite', minXP: 1500, nextThreshold: 2500, title: 'Advanced Persistent Operator', codename: 'LEVEL_5_GOD' },
  { name: 'EV Graduate', minXP: 2500, nextThreshold: 99999, title: 'Distinguished Cyber Overlord', codename: 'LEVEL_ALPHA' },
];

/**
 * Returns the current hacking level from the core XP value
 */
export function calculateLevel(xp: number): LevelName {
  let activeLevel: LevelName = 'Beginner';
  
  for (const entry of LEVEL_THRESHOLDS) {
    if (xp >= entry.minXP) {
      activeLevel = entry.name;
    } else {
      break;
    }
  }
  
  return activeLevel;
}

/**
 * Gets info about current level limits, next level, and progress percentage
 */
export function getLevelDetail(xp: number) {
  let activeIndex = 0;
  
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      activeIndex = i;
    } else {
      break;
    }
  }
  
  const currentThreshold = LEVEL_THRESHOLDS[activeIndex];
  const nextThreshold = LEVEL_THRESHOLDS[activeIndex + 1] || null;
  
  let percentage = 100;
  let xpNeeded = 0;
  
  if (nextThreshold) {
    const range = nextThreshold.minXP - currentThreshold.minXP;
    const progressIntoCurrent = xp - currentThreshold.minXP;
    percentage = Math.min(100, Math.max(0, Math.floor((progressIntoCurrent / range) * 100)));
    xpNeeded = nextThreshold.minXP - xp;
  }
  
  return {
    current: currentThreshold.name,
    next: nextThreshold ? nextThreshold.name : 'Max Level attained',
    percentage,
    xpNeeded,
    title: currentThreshold.title,
    codename: currentThreshold.codename,
    minXP: currentThreshold.minXP,
    nextThresholdXP: nextThreshold ? nextThreshold.minXP : 99999
  };
}
