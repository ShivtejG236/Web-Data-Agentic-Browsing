import { useState } from 'react';
import { Bot, Link, Shield, Send, Terminal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { API_URL } from '../config';

const AgentBuilder = () => {
  const { setActiveSessionId, setActiveTab, token } = useStore(state => state);
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    targetDomain: '',
    stealthLevel: 'standard'
  });
  const [isLaunching, setIsLaunching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    
    try {
      const res = await fetch(`${API_URL}/api/agents/launch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setActiveSessionId(data.sessionId);
      
      // Reset form
      setFormData({ name: '', prompt: '', targetDomain: '', stealthLevel: 'standard' });
      
      // Auto-navigate to results to catch the live WebSocket stream!
      setActiveTab('results');
    } catch (err) {
      console.error(err);
      alert('Failed to launch agent');
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
          <Bot className="text-indigo-400" size={32} />
          Agent Builder
        </h1>
        <p className="text-[var(--muted)] mt-2">Configure and deploy NemoClaw agents backed by Bright Data Scraping Browsers.</p>
      </header>

      <form onSubmit={handleSubmit} className="neu-card p-8 space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[var(--foreground)]">Agent Name</label>
          <input 
            required
            className="w-full neu-pressed bg-transparent p-4 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            placeholder="e.g., iPhone Pricing Tracker"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
            <Terminal size={16} className="text-indigo-400"/>
            NemoClaw Prompt (Natural Language)
          </label>
          <textarea 
            required
            className="w-full neu-pressed bg-transparent p-4 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-h-[120px] resize-none"
            placeholder="Extract all product titles, prices, and review counts from the first 3 pages..."
            value={formData.prompt}
            onChange={(e) => setFormData({...formData, prompt: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
              <Link size={16} className="text-emerald-400"/>
              Target Domain
            </label>
            <input 
              type="text"
              required
              className="w-full neu-pressed bg-transparent p-4 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              placeholder="e.g., amazon.com"
              value={formData.targetDomain}
              onChange={(e) => setFormData({...formData, targetDomain: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
              <Shield size={16} className="text-cyan-400"/>
              Stealth Level
            </label>
            <select 
              className="w-full neu-pressed bg-transparent p-4 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-cyan-500/50 appearance-none"
              value={formData.stealthLevel}
              onChange={(e) => setFormData({...formData, stealthLevel: e.target.value})}
            >
              <option value="standard">Standard (Local Chromium)</option>
              <option value="advanced">Advanced (Local Stealth Plugin)</option>
              <option value="brightdata">Bright Data (Remote Proxy Browser)</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLaunching}
          className="w-full neu-button py-4 mt-8 font-bold text-lg text-[var(--foreground)] flex justify-center items-center gap-3 relative overflow-hidden group disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isLaunching ? 'Deploying Agent...' : 'Launch Secure Agent'}
          <Send size={20} className={isLaunching ? 'animate-bounce' : 'group-hover:translate-x-1 transition-transform'} />
        </button>
      </form>
    </div>
  );
};

export default AgentBuilder;
