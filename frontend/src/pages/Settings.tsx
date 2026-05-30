import { Shield, Key, Network } from 'lucide-react';
import { useStore } from '../store/useStore';

const Settings = () => {
  const { token } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
          <Shield className="text-indigo-500" size={32} />
          Settings & Security
        </h1>
        <p className="text-[var(--muted)] mt-2">Manage your API keys, tokens, and proxy configurations.</p>
      </header>

      <div className="neu-card p-8 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[var(--foreground)]">
          <Key className="text-emerald-500" size={20} /> Authentication
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Active JWT Token</label>
            <div className="flex items-center gap-4">
              <input 
                readOnly
                value={token || 'Not authenticated'}
                className="w-full neu-pressed bg-transparent p-3 rounded-xl text-xs font-mono text-[var(--muted)] outline-none"
              />
              <button className="neu-button px-4 py-3 text-sm font-medium text-indigo-500">Refresh</button>
            </div>
            <p className="text-xs text-[var(--muted)] mt-2">This token is automatically generated for the hackathon demo.</p>
          </div>
        </div>
      </div>

      <div className="neu-card p-8 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[var(--foreground)]">
          <Network className="text-cyan-500" size={20} /> Bright Data Configuration
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Scraping Browser WebSocket Endpoint</label>
            <input 
              readOnly
              value="wss://brd.superproxy.com:9222"
              className="w-full neu-pressed bg-transparent p-3 rounded-xl text-sm font-mono text-[var(--muted)] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Web Unlocker Proxy URL</label>
            <input 
              readOnly
              value="http://brd.superproxy.com:22225"
              className="w-full neu-pressed bg-transparent p-3 rounded-xl text-sm font-mono text-[var(--muted)] outline-none"
            />
          </div>
          <div className="p-4 neu-pressed rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-sm text-emerald-600 font-medium">✅ Proxy connected and ready</p>
            <p className="text-xs text-[var(--muted)] mt-1">NemoClaw agents will route traffic through these endpoints when 'Bright Data' stealth level is selected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
