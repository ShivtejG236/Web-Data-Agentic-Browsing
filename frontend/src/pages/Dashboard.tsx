import { motion } from 'framer-motion';
import { Activity, Server, ShieldCheck, Globe, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../config';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="neu-card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-transform duration-300"
  >
    <div className={`p-4 rounded-xl neu-pressed text-${color}-400`}>
      <Icon size={24} className={`drop-shadow-[0_0_10px_currentColor]`} />
    </div>
    <div>
      <div className="text-sm text-[var(--muted)] font-medium">{title}</div>
      <div className={`text-2xl font-bold mt-1 text-[var(--foreground)]`}>{value}</div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch(`${API_URL}/api/stats`).then(res => res.json()),
    refetchInterval: 5000
  });

  return (
    <div className="w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] drop-shadow-md">Command Center</h1>
        <p className="text-[var(--muted)] mt-2">Monitor your active AI web agents and Bright Data nodes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Active Sessions" value={stats?.sessions || 0} icon={Activity} color="indigo" />
        <StatCard title="Total Agents" value={stats?.agents || 0} icon={Server} color="emerald" />
        <StatCard title="Security Level" value="Stealth Max" icon={ShieldCheck} color="cyan" />
        <StatCard title="Proxies Active" value="12 Nodes" icon={Globe} color="purple" />
      </div>

      <div className="neu-card p-8 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Live Execution Feed</h2>
          <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="neu-pressed p-4 rounded-xl flex items-center justify-between text-sm">
             <div className="flex items-center gap-4">
               <Clock size={16} className="text-indigo-400" />
               <span className="text-[var(--foreground)]">NemoClaw instance initialized for target: amazon.com</span>
             </div>
             <span className="text-xs text-[var(--muted)]">Just now</span>
          </div>
          <div className="neu-pressed p-4 rounded-xl flex items-center justify-between text-sm">
             <div className="flex items-center gap-4">
               <Globe size={16} className="text-emerald-400" />
               <span className="text-[var(--foreground)]">Bright Data Scraping Browser proxy connected securely.</span>
             </div>
             <span className="text-xs text-[var(--muted)]">2 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
