import { create } from 'zustand';
import type { VisualPayload } from './responseComposer';

type Scene = 'lobby' | 'topics' | 'chat' | 'vision2026';
type Mode = 'admin' | 'show';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  intentId?: string;
  visualPayload?: VisualPayload;
}

interface DebugInfo {
  lastIntentId: string | null;
  confidence: number | null;
}

interface AppState {
  // Scene Management
  currentScene: Scene;
  setScene: (scene: Scene) => void;
  
  // Mode
  mode: Mode;
  setMode: (mode: Mode) => void;
  
  // Chat Messages
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  
  // Typing State
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  
  // Visual Panel
  currentVisual: VisualPayload | null;
  setCurrentVisual: (visual: VisualPayload | null) => void;
  
  // Debug Info
  debugInfo: DebugInfo;
  setDebugInfo: (intentId: string | null, confidence: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Scene Management
  currentScene: 'lobby',
  setScene: (scene) => set({ currentScene: scene }),
  
  // Mode
  mode: 'show',
  setMode: (mode) => set({ mode }),
  
  // Chat Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date()
        }
      ]
    })),
  clearMessages: () => set({ messages: [] }),
  
  // Typing State
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),
  
  // Visual Panel
  currentVisual: null,
  setCurrentVisual: (visual) => set({ currentVisual: visual }),
  
  // Debug Info
  debugInfo: { lastIntentId: null, confidence: null },
  setDebugInfo: (intentId, confidence) =>
    set({ debugInfo: { lastIntentId: intentId, confidence } })
}));
