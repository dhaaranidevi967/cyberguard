import React from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  ShieldAlert, 
  Globe, 
  Phone, 
  ArrowRight,
  TrendingUp,
  Users,
  LifeBuoy
} from 'lucide-react';
import { ModuleType, ScamIncident } from '../types';

interface DashboardProps {
  setActiveModule: (module: ModuleType) => void;
  incidents: ScamIncident[];
}

export default function Dashboard({ setActiveModule, incidents }: DashboardProps) {
  const stats = [
    { label: 'Detections Today', value: incidents.length, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Threats', value: '12', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Protected Users', value: '1.2k', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Risk Level', value: 'Low', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, Guardian</h1>
        <p className="text-slate-500">Your integrated cyber safety command center is active and monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-2.5 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveModule('website')}
              className="group bg-white p-6 rounded-2xl border border-slate-200 text-left hover:border-indigo-300 transition-all"
            >
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Globe className="w-6 h-6 text-indigo-600 group-hover:text-white" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Scan Website</h4>
              <p className="text-sm text-slate-500 mb-4">Check URLs for phishing, malware, and suspicious behavior.</p>
              <div className="flex items-center text-indigo-600 text-sm font-semibold gap-1">
                Launch Scanner <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => setActiveModule('audio')}
              className="group bg-white p-6 rounded-2xl border border-slate-200 text-left hover:border-rose-300 transition-all"
            >
              <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Phone className="w-6 h-6 text-rose-600 group-hover:text-white" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Analyze Call</h4>
              <p className="text-sm text-slate-500 mb-4">Upload or record audio to detect fraud and manipulation.</p>
              <div className="flex items-center text-rose-600 text-sm font-semibold gap-1">
                Start Analysis <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-md">
              <h3 className="text-2xl font-bold mb-2">Need Immediate Help?</h3>
              <p className="text-indigo-100 mb-6">Our support chatbot and recovery system are here to guide you through any cyber incident.</p>
              <button 
                onClick={() => setActiveModule('recovery')}
                className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
              >
                Get Support Now
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <LifeBuoy className="w-64 h-64" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {incidents.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm text-slate-500">No recent incidents detected. Your environment is safe.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {incidents.slice(0, 5).map((incident) => (
                  <div key={incident.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${incident.type === 'website' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                        {incident.type === 'website' ? <Globe className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{incident.target}</p>
                        <p className="text-xs text-slate-500">{new Date(incident.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-full ${incident.riskScore > 70 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {incident.riskScore}% Risk
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {incidents.length > 0 && (
              <button 
                onClick={() => setActiveModule('intelligence')}
                className="w-full p-4 text-center text-sm font-semibold text-indigo-600 hover:bg-slate-50 border-t border-slate-100 transition-colors"
              >
                View All Intelligence
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
