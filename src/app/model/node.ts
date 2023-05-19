
export interface Node {
  id: string,
  name: string,
  parentIds: string[]
}

export interface NodeDetails {
  id: string;
  name: string;
  category: string;
  risks: Risk[];
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  concern: string[];
  consequenceLevel: Level;
  likelihoodLevel: Level;
  riskFactor: number;
  mitigationStrategy: string;
}

export enum Level {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

