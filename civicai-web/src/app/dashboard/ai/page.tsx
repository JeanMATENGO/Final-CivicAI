"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiMethods } from '@/lib/api';

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis l'agent CivicAI. Je connais très bien la RDC et particulièrement Bukavu. Comment puis-je vous aider aujourd'hui ? (Trafic, sécurité, conseils locaux...)" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await apiMethods.askAI(input);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, je rencontre une erreur de connexion au réseau national." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-4">
      <div className="bg-gradient-to-r from-civic-info to-blue-700 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot /> Agent CivicAI
          </h2>
          <p className="opacity-80 text-sm">Votre assistant intelligent pour la ville</p>
        </div>
        <div className="animate-pulse bg-white/20 p-2 rounded-full">
          <Sparkles />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl flex items-start gap-3 ${
                  msg.role === 'user' 
                  ? 'bg-civic-info text-white rounded-tr-none' 
                  : 'bg-white shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  <div className={`p-2 rounded-full hidden md:block ${msg.role === 'user' ? 'bg-blue-400' : 'bg-gray-100 text-civic-info'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-2">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question à l'IA..."
            className="flex-1 p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-civic-info transition-all"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="p-4 bg-civic-info text-white rounded-2xl hover:bg-blue-600 transition-all shadow-md active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
