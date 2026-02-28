import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Globe, 
  Phone, 
  Activity, 
  LifeBuoy, 
  MessageSquare, 
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleType, ScamIncident } from './types';

// Modules
import Dashboard from './modules/Dashboard';
import WebsiteDetection from './modules/WebsiteDetection';
import AudioDetection from './modules/AudioDetection';
import ThreatIntelligence from './modules/ThreatIntelligence';
import RecoverySystem from './modules/RecoverySystem';
import SupportChatbot from './modules/SupportChatbot';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [incidents, setIncidents] = useState<ScamIncident[]>([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents');
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    }
  };

  const addIncident = async (incident: Omit<ScamIncident, 'id' | 'timestamp'>) => {
    const newIncident: ScamIncident = {
      ...incident,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncident),
      });
      fetchIncidents();
    } catch (error) {
      console.error('Failed to save incident:', error);
      setIncidents(prev => [newIncident, ...prev]);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'website', label: 'Website Detection', icon: Globe },
    { id: 'audio', label: 'Audio Detection', icon: Phone },
    { id: 'intelligence', label: 'Threat Intelligence', icon: Activity },
    { id: 'recovery', label: 'Support & Recovery', icon: LifeBuoy },
    { id: 'chatbot', label: 'Support Chatbot', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl tracking-tight whitespace-nowrap">CyberGuard</span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ModuleType)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                activeModule === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeModule === item.id ? 'text-indigo-600' : 'group-hover:text-slate-900'}`} />
              {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              {activeModule === item.id && isSidebarOpen && (
                <motion.div layoutId="active-pill" className="ml-auto">
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-50 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              JD
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">User Safety</span>
                <span className="text-xs text-slate-500 truncate">Protected</span>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-bottom border-slate-200 bg-white/80 backdrop-blur-md flex items-center px-8 justify-between shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">
            {navItems.find(i => i.id === activeModule)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto h-full"
            >
              {activeModule === 'dashboard' && <Dashboard setActiveModule={setActiveModule} incidents={incidents} />}
              {activeModule === 'website' && <WebsiteDetection addIncident={addIncident} />}
              {activeModule === 'audio' && <AudioDetection addIncident={addIncident} />}
              {activeModule === 'intelligence' && <ThreatIntelligence incidents={incidents} />}
              {activeModule === 'recovery' && <RecoverySystem />}
              {activeModule === 'chatbot' && <SupportChatbot />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
