import React, { useState, useEffect, useRef } from 'react';
import { Mic, ShieldAlert, ShieldCheck, AlertTriangle, Loader2, Square, Volume2, Activity, Zap } from 'lucide-react';
import { analyzeAudioContent, AudioAnalysis } from '../services/geminiService';
import { ScamIncident } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AudioDetectionProps {
  addIncident: (incident: Omit<ScamIncident, 'id' | 'timestamp'>) => void;
}

// Add type for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AudioDetection({ addIncident }: AudioDetectionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AudioAnalysis | null>(null);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleAnalyze = async () => {
    const fullText = transcript + interimTranscript;
    if (!fullText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysis = await analyzeAudioContent(fullText);
      setResult(analysis);
      
      if (analysis.isScam) {
        addIncident({
          type: 'audio',
          target: 'Live Call Analysis',
          riskScore: analysis.scamProbability,
          patterns: analysis.alerts
        });

        // Log to honeypot
        await fetch('/api/honeypot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: Math.random().toString(36).substr(2, 9),
            scam_type: 'Audio Fraud',
            intel_extracted: JSON.stringify({
              alerts: analysis.alerts,
              explanation: analysis.explanation,
              transcript: fullText.substring(0, 200)
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

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setInterimTranscript('');
      setResult(null);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100 mb-2">
          <Activity className="w-3 h-3 animate-pulse" />
          Live Monitoring Active
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Real-Time Call Guard</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Our AI listens as you speak, detecting manipulation, urgency, and fraud patterns in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recording Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
            {/* Visualizer Background */}
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center gap-1 opacity-10 pointer-events-none"
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [20, 60, 20] }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.1 }}
                      className="w-2 bg-rose-500 rounded-full"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <motion.div 
                animate={isRecording ? { scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`absolute inset-0 rounded-full ${isRecording ? 'bg-rose-500' : 'bg-transparent'}`}
              />
              <button 
                onClick={toggleRecording}
                className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isRecording 
                    ? 'bg-rose-600 text-white shadow-2xl shadow-rose-200 scale-110' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xl shadow-indigo-200'
                }`}
              >
                {isRecording ? <Square className="w-12 h-12 fill-current" /> : <Mic className="w-12 h-12" />}
              </button>
            </div>

            <div className="text-center z-10">
              <h3 className="text-xl font-black text-slate-900">{isRecording ? 'Listening...' : 'Ready to Monitor'}</h3>
              <p className="text-slate-500 mt-2 font-medium">
                {isRecording ? 'AI is analyzing speech patterns' : 'Click to start live call protection'}
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 z-10">
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</span>
                <span className={`text-xs font-bold ${isRecording ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isRecording ? 'RECORDING' : 'IDLE'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Latency</span>
                <span className="text-xs font-bold text-slate-700">~240ms</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-900/20">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              How it works
            </h4>
            <ul className="space-y-4">
              {[
                'Real-time speech-to-text conversion',
                'Semantic analysis of urgency & pressure',
                'Pattern matching against known scam scripts',
                'Instant risk scoring and alerting'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-indigo-100">
                  <div className="w-5 h-5 rounded-full bg-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Transcript & Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-indigo-600" />
                Live Transcript
              </h3>
              {isRecording && (
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  LIVE
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-50 rounded-3xl p-6 overflow-y-auto font-mono text-sm text-slate-700 leading-relaxed border border-slate-100">
              {transcript || interimTranscript ? (
                <>
                  <p>{transcript}</p>
                  <p className="text-slate-400 italic">{interimTranscript}</p>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <Activity className="w-12 h-12 opacity-20" />
                  <p className="text-center max-w-xs">Transcript will appear here in real-time as you speak.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!transcript && !interimTranscript)}
                className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3"
              >
                {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    Analyze Call Security
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={`rounded-[3rem] border-4 p-10 ${
              !result.isScam 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-3xl shadow-lg ${
                    !result.isScam ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {!result.isScam ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900">
                      {result.isScam ? 'SCAM DETECTED' : 'SECURE CALL'}
                    </h3>
                    <p className="text-slate-600 text-lg font-medium mt-1">
                      Confidence Level: {result.scamProbability}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-black text-slate-800">Detected Risk Indicators:</h4>
                  <div className="flex flex-wrap gap-3">
                    {result.alerts.map((alert, i) => (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className={`px-5 py-2.5 rounded-2xl text-sm font-black tracking-tight ${
                          result.isScam ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                        }`}
                      >
                        {alert}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-white/90 backdrop-blur rounded-[2rem] border border-white/50 text-slate-700 leading-relaxed shadow-sm">
                  <p className="font-black text-lg mb-3 text-slate-900">Security Analysis:</p>
                  <p className="text-lg">{result.explanation}</p>
                </div>
              </div>

              <div className="lg:w-80 shrink-0">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl text-center">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Threat Level</h4>
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="84"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="transparent"
                        className="text-slate-100"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="84"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="transparent"
                        strokeDasharray={527.8}
                        initial={{ strokeDashoffset: 527.8 }}
                        animate={{ strokeDashoffset: 527.8 - (527.8 * result.scamProbability) / 100 }}
                        className={result.scamProbability > 70 ? 'text-rose-500' : 'text-indigo-500'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-slate-900">{result.scamProbability}%</span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Risk</span>
                    </div>
                  </div>
                  <div className={`py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest ${
                    result.isScam ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {result.isScam ? 'DANGER' : 'SAFE'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
