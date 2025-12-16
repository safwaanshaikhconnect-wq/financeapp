import React, { useState, useRef, useEffect } from 'react';
import { Transaction, Goal } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface AIAdvisorProps {
  transactions: Transaction[];
  goals: Goal[];
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, goals }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm your financial wingman. 🤖 Ask me anything about your spending, savings, or how to save for that Goa trip!" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const advice = await getFinancialAdvice(transactions, goals, userMsg);

    setMessages(prev => [...prev, { role: 'ai', text: advice }]);
    setLoading(false);
  };

  const suggestedQuestions = [
    "How much did I spend on food?",
    "Can I afford a ₹50k bike?",
    "Give me a saving tip.",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[600px] pb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-tr from-cyan-400 to-teal-500 p-0.5 rounded-full">
            <div className="bg-dark p-2 rounded-full">
                 <Sparkles size={20} className="text-white" />
            </div>
        </div>
        <div>
             <h2 className="text-xl font-bold text-white tracking-wide">FinZ AI</h2>
             <p className="text-xs text-gray-400 font-medium">Powered by Gemini 2.5</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-card/50 border border-white/5 rounded-3xl p-4 overflow-y-auto no-scrollbar mb-4 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'ai' ? 'bg-primary text-dark' : 'bg-secondary text-white'}`}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed shadow-sm ${msg.role === 'ai' ? 'bg-dark text-gray-200 border border-white/10 rounded-tl-none' : 'bg-primary text-dark font-medium rounded-tr-none'}`}>
              {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot size={16} className="text-dark" />
             </div>
             <div className="bg-dark p-3 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-xs text-gray-400">Analyzing your finances...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        {/* Suggestions */}
        {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {suggestedQuestions.map((q, i) => (
                    <button 
                        key={i} 
                        onClick={() => { setQuery(q); handleSend(); }} 
                        className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-cyan-200 transition font-medium"
                    >
                        {q}
                    </button>
                ))}
            </div>
        )}

        <form onSubmit={handleSend} className="relative">
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            disabled={loading}
            className="w-full bg-card border border-white/10 rounded-full py-3.5 pl-5 pr-12 text-white focus:border-primary focus:outline-none placeholder-gray-500 transition shadow-inner"
            />
            <button 
                type="submit" 
                disabled={!query.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-cyan-400 text-dark rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-cyan-500/20"
            >
            <Send size={18} />
            </button>
        </form>
      </div>
    </div>
  );
};

export default AIAdvisor;