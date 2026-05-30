import { LayoutDashboard, Bot, Database, Shield, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const Sidebar = () => {
  const { activeTab, setActiveTab } = useStore();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Agent Builder', icon: Bot },
    { id: 'results', label: 'Results Explorer', icon: Database },
    { id: 'settings', label: 'Security & Settings', icon: Shield },
  ];

  return (
    <div className="w-64 h-full neu-card rounded-none border-r border-transparent p-4 flex flex-col gap-6">
      <div className="flex items-center gap-3 px-4 py-2 mt-4">
        <div className="w-10 h-10 rounded-xl neu-card flex items-center justify-center text-indigo-400">
          <Bot size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          NemoForge
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2 mt-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
              ${activeTab === item.id ? 'text-indigo-400 neu-pressed' : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:neu-card'}
            `}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
              />
            )}
            <item.icon size={20} className={activeTab === item.id ? "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 neu-pressed rounded-2xl border border-transparent">
        <div className="text-xs text-[var(--muted)] mb-1">Bright Data Credits</div>
        <div className="text-lg font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">$ 1,420.50</div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
          <div className="bg-emerald-500 w-3/4 h-full shadow-[0_0_8px_#10b981]" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
