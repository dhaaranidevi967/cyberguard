import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, ShieldCheck, Info, MessageSquare } from 'lucide-react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function SupportChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello. I'm CyberGuard Support. I'm here to help you navigate any cyber safety concerns or support you if you've been a victim of a scam. How are you feeling right now, and how can I assist you?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(input, messages.map(m => ({ role: m.role, content: m.content })));
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I'm having trouble connecting right now. Please try again or contact our helpline.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="bg-white rounded-t-3xl border-x border-t border-slate-200 p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">CyberGuard Support</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-500">Empathetic AI Assistant</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-100">
          <Info className="w-3 h-3" />
          Guidance Only
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50 border-x border-slate-200 p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  message.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div className={`text-[10px] mt-2 font-medium ${message.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-3 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-xs font-medium text-slate-500">CyberGuard is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-b-3xl border border-slate-200 p-4 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what happened or ask for advice..."
            className="flex-1 py-4 pl-6 pr-16 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Your conversation is private and encrypted.
        </p>
      </div>
    </div>
  );
}
