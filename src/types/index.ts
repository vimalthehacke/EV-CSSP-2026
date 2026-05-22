export interface User {
  username: string;
  loggedIn: boolean;
  createdAt: string;
}

export type LabCategory = 'Reconnaissance' | 'Web Exploitation' | 'Reverse Engineering' | 'Cryptography' | 'Privilege Escalation' | 'Network Attack';

export interface Task {
  id: number;
  title: string;
  type: 'quiz' | 'terminal' | 'interactive';
  description: string;
  question?: string;
  options?: string[]; // for multiple choice Quiz type
  expectedAnswer?: string;
  completed: boolean;
  commandRequired?: string; // For terminal tasks
}

export interface Challenge {
  question: string;
  flag: string;
  rewardXP: number;
  terminalPrompt?: string;
  hints?: string[];
  filesystem?: Record<string, string>;
}

export interface Lab {
  id: number;
  title: string;
  description: string;
  category: LabCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Elite' | 'Boss';
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
  flag: string;
  tasks: Task[];
  challenge: Challenge;
  badgeName?: string;
}

export type LevelName = 
  | 'Beginner'
  | 'Explorer'
  | 'Operator'
  | 'Hunter'
  | 'Analyst'
  | 'Elite'
  | 'EV Graduate';

