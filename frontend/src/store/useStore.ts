import { create } from 'zustand';

interface AgentState {
  token: string | null;
  activeTab: string;
  agents: any[];
  sessions: any[];
  activeSessionId: string | null;
  setToken: (token: string | null) => void;
  setActiveTab: (tab: string) => void;
  setAgents: (agents: any[]) => void;
  setSessions: (sessions: any[]) => void;
  setActiveSessionId: (id: string | null) => void;
}

export const useStore = create<AgentState>((set) => ({
  token: null,
  activeTab: 'dashboard',
  agents: [],
  sessions: [],
  activeSessionId: null,
  setToken: (token) => set({ token }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setAgents: (agents) => set({ agents }),
  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
}));
