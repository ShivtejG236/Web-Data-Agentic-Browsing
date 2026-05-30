import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useQuery } from '@tanstack/react-query';
import { Activity, Code, Camera, Download, Loader2 } from 'lucide-react';
import { API_URL, WS_URL } from '../config';

const ResultsExplorer = () => {
  const { activeSessionId, token } = useStore(state => state);
  const [logs, setLogs] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [resultData, setResultData] = useState<any>(null);

  const handleExportMD = () => {
    if (!resultData) return;
    const content = resultData.data ? resultData.data : JSON.stringify(resultData, null, 2);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nemoforge-result-${activeSessionId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { data: sessionInfo } = useQuery({
    queryKey: ['session', activeSessionId],
    queryFn: async () => {
      if (!activeSessionId) return null;
      const res = await fetch(`${API_URL}/api/sessions/${activeSessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.json();
    },
    enabled: !!activeSessionId,
  });

  useEffect(() => {
    if (!activeSessionId) return;

    // Connect to WebSocket
    const ws = new WebSocket(`${WS_URL}/ws?sessionId=${activeSessionId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        setLogs(prev => [...prev, data]);
      } else if (data.type === 'screenshot') {
        setScreenshots(prev => [...prev, data.image]);
      } else if (data.type === 'finish') {
        setResultData(JSON.parse(data.data));
      }
    };

    return () => ws.close();
  }, [activeSessionId]);

  if (!activeSessionId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-24 h-24 neu-card rounded-full flex items-center justify-center text-[var(--muted)] mb-6">
          <Activity size={48} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">No Active Session</h2>
        <p className="text-[var(--muted)] mt-2">Launch an agent from the Agent Builder to see live results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
             Results Explorer
             {sessionInfo?.status === 'running' && <Loader2 className="animate-spin text-indigo-600" size={24} />}
          </h1>
          <p className="text-[var(--muted)] mt-2">Session ID: <span className="font-mono text-xs">{activeSessionId}</span></p>
        </div>
        {resultData && (
          <button 
            onClick={handleExportMD}
            className="neu-button px-6 py-2 flex items-center gap-2 text-sm font-bold text-emerald-700"
          >
            <Download size={16} /> Export Markdown
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Logs */}
        <div className="neu-card p-6 h-[500px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-indigo-600" size={20} /> Execution Logs
          </h3>
          <div className="flex-1 neu-pressed rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-3">
            {logs.map((log, idx) => (
              <div key={idx} className={`
                ${log.level === 'error' ? 'text-red-600' : ''}
                ${log.level === 'success' ? 'text-emerald-700' : ''}
                ${log.level === 'step' ? 'text-blue-600' : ''}
                ${log.level === 'info' ? 'text-[var(--muted)]' : ''}
              `}>
                <span className="opacity-50 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                {log.message}
              </div>
            ))}
            {logs.length === 0 && <div className="text-[var(--muted)] italic">Waiting for agent to start...</div>}
          </div>
        </div>

        {/* Live Viewport & Data */}
        <div className="flex flex-col gap-8 h-[500px]">
          <div className="neu-card p-6 flex-1 flex flex-col min-h-0">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="text-pink-600" size={20} /> Agent Viewport
            </h3>
            <div className="flex-1 neu-pressed rounded-xl overflow-hidden relative flex items-center justify-center bg-transparent">
              {screenshots.length > 0 ? (
                <img 
                  src={`data:image/jpeg;base64,${screenshots[screenshots.length - 1]}`} 
                  className="w-full h-full object-contain"
                  alt="Agent Viewport"
                />
              ) : (
                <span className="text-[var(--muted)] font-medium">Awaiting visual feed...</span>
              )}
            </div>
          </div>

          <div className="neu-card p-6 flex-1 flex flex-col min-h-0">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code className="text-emerald-700" size={20} /> Extracted Data
            </h3>
            <div className="flex-1 neu-pressed rounded-xl p-4 overflow-y-auto">
              {resultData ? (
                <pre className="text-xs text-emerald-800 font-mono whitespace-pre-wrap">
                  {resultData.data || JSON.stringify(resultData, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--muted)] font-medium">
                  Waiting for completion...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsExplorer;
