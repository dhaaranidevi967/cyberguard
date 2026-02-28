import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, ShieldAlert, Zap, Target, TrendingUp, AlertTriangle, Database, Terminal, Search } from 'lucide-react';
import { ScamIncident } from '../types';
import { motion } from 'motion/react';

interface ThreatIntelligenceProps {
  incidents: ScamIncident[];
}

interface HoneypotEvent {
  id: string;
  scam_type: string;
  intel_extracted: string;
  timestamp: string;
}

export default function ThreatIntelligence({ incidents }: ThreatIntelligenceProps) {
  const [honeypotEvents, setHoneypotEvents] = useState<HoneypotEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHoneypotData();
  }, []);

  const fetchHoneypotData = async () => {
    try {
      const response = await fetch('/api/honeypot');
      const data = await response.json();
      setHoneypotEvents(data);
    } catch (error) {
      console.error('Failed to fetch honeypot data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process data for charts
  const trendData = [
    { name: 'Mon', attempts: 45 },
    { name: 'Tue', attempts: 52 },
    { name: 'Wed', attempts: 38 },
    { name: 'Thu', attempts: 65 },
    { name: 'Fri', attempts: 48 },
    { name: 'Sat', attempts: 30 },
    { name: 'Sun', attempts: 25 },
  ];

  const typeData = [
    { name: 'Phishing', value: incidents.filter(i => i.type === 'website').length || 40 },
    { name: 'Audio Fraud', value: incidents.filter(i => i.type === 'audio').length || 30 },
    { name: 'Malware', value: 20 },
    { name: 'Identity Theft', value: 10 },
  ];

  const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
            <Database className="w-4 h-4" />
            Central Intelligence
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Threat Intel & Honeypot</h1>
          <p className="text-slate-500 text-lg">Real-time analysis of scam patterns learned from our agentic AI decoys.</p>
        </div>
        <button 
          onClick={fetchHoneypotData}
          className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Activity className="w-4 h-4 text-indigo-600" />
          Refresh Feed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Charts */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Attack Vector Trends
              </h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">Live Feed</span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  />
                  <Area type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAttempts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Terminal className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-indigo-400" />
                  Honeypot Live Logs
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-black tracking-widest text-indigo-300 border border-indigo-500/30">
                  DECOYS ACTIVE
                </div>
              </div>
              
              <div className="space-y-3 font-mono text-xs max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {honeypotEvents.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 italic">
                    Waiting for attacker interaction...
                  </div>
                ) : (
                  honeypotEvents.map((event) => {
                    const intel = JSON.parse(event.intel_extracted);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={event.id} 
                        className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-indigo-400 font-bold">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                          <span className="text-rose-400 font-bold uppercase">{event.scam_type}</span>
                        </div>
                        <p className="text-slate-300 truncate">INTEL: {intel.explanation || intel.alerts?.join(', ')}</p>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Patterns */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-rose-600" />
              Threat Distro
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">{incidents.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {typeData.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{item.name}</span>
                    <span className="text-sm font-bold text-slate-700">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black">Agentic Decoys</h3>
                <p className="text-indigo-100 text-xs font-medium">Learning from the source</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Active Decoys', value: '12', icon: Activity },
                { label: 'Patterns Extracted', value: '142', icon: Zap },
                { label: 'Attacker IPs Blocked', value: '89', icon: ShieldAlert },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-4 h-4 text-indigo-200" />
                    <span className="text-sm font-bold">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
