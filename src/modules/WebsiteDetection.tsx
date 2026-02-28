import React, { useState } from 'react';
import { Search, Globe, ShieldAlert, ShieldCheck, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { analyzeWebsite, WebsiteAnalysis } from '../services/geminiService';
import { ScamIncident } from '../types';
import { motion } from 'motion/react';

interface WebsiteDetectionProps {
  addIncident: (incident: Omit<ScamIncident, 'id' | 'timestamp'>) => void;
}

export default function WebsiteDetection({ addIncident }: WebsiteDetectionProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WebsiteAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysis = await analyzeWebsite(url);
      setResult(analysis);
      
      if (analysis.status !== 'Safe') {
        addIncident({
          type: 'website',
          target: url,
          riskScore: analysis.riskScore,
          patterns: analysis.reasons
        });

        // Log to honeypot
        await fetch('/api/honeypot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: Math.random().toString(36).substr(2, 9),
            scam_type: 'Phishing',
            intel_extracted: JSON.stringify({
              url: url,
              reasons: analysis.reasons,
              details: analysis.details
            }),
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fake Website Detection</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Paste a suspicious URL to analyze its structure, domain age, and security patterns using our advanced AI detection engine.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example-bank-login.com"
            className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !url}
            className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl border p-8 ${
            result.status === 'Safe' 
              ? 'bg-emerald-50 border-emerald-100' 
              : result.status === 'Suspicious'
              ? 'bg-amber-50 border-amber-100'
              : 'bg-rose-50 border-rose-100'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  result.status === 'Safe' ? 'bg-emerald-100 text-emerald-700' :
                  result.status === 'Suspicious' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {result.status === 'Safe' ? <ShieldCheck className="w-8 h-8" /> :
                   result.status === 'Suspicious' ? <AlertTriangle className="w-8 h-8" /> :
                   <ShieldAlert className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Result: {result.status}</h3>
                  <p className="text-slate-600 font-medium">Risk Score: {result.riskScore}/100</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800">Key Findings:</h4>
                <ul className="space-y-2">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white/50 rounded-2xl border border-white/50 text-sm text-slate-600 leading-relaxed">
                {result.details}
              </div>
            </div>

            <div className="md:w-64 shrink-0 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Safety Meter</h4>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.riskScore}%` }}
                    className={`h-full ${
                      result.riskScore < 30 ? 'bg-emerald-500' :
                      result.riskScore < 70 ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}
                  />
                </div>
                <p className="text-xs text-center text-slate-500">
                  {result.riskScore > 70 ? 'High Risk Detected' : result.riskScore > 30 ? 'Moderate Risk' : 'Low Risk'}
                </p>
              </div>
              
              <button className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Detailed Report
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Phishing Detection', desc: 'Identifies fake login pages designed to steal credentials.', icon: ShieldAlert },
          { title: 'Malware Analysis', desc: 'Scans for suspicious scripts and hidden download triggers.', icon: AlertTriangle },
          { title: 'Domain Verification', desc: 'Checks domain age and SSL certificate authenticity.', icon: Globe },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <item.icon className="w-6 h-6 text-indigo-600 mb-4" />
            <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
