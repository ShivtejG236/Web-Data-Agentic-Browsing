import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AgentBuilder from './pages/AgentBuilder';
import ResultsExplorer from './pages/ResultsExplorer';
import Settings from './pages/Settings';

import { API_URL } from './config';

const queryClient = new QueryClient();

function App() {
  const { token, setToken, activeTab } = useStore();

  useEffect(() => {
    // Auto-login for hackathon demo
    if (!token) {
      fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'hackathon_judge' })
      })
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(console.error);
    }
  }, [token, setToken]);

  if (!token) {
    return <div className="h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">Authenticating...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-8 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'builder' && <AgentBuilder />}
            {activeTab === 'results' && <ResultsExplorer />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
