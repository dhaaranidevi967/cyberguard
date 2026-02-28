export type ModuleType = 'dashboard' | 'website' | 'audio' | 'intelligence' | 'recovery' | 'chatbot';

export interface ScamIncident {
  id: string;
  type: 'website' | 'audio';
  target: string;
  timestamp: string;
  riskScore: number;
  patterns: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
