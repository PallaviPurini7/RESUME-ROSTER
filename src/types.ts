export type RoastIntensity = 'gentle' | 'medium' | 'savage' | 'nuclear';

export interface FunnyStats {
  buzzwordDensity: string;
  survivalChance: string;
  recruiterSkimTime: string;
}

export interface RoastResult {
  id?: string;
  timestamp?: number;
  filename?: string;
  score: number;
  verdict: string;
  pros: string[];
  cons: string[];
  roast: string;
  actionableTips: string[];
  funnyStats: FunnyStats;
  isAiGenerated?: boolean;
}

export interface SampleResume {
  id: string;
  name: string;
  badge: string;
  role: string;
  text: string;
}
