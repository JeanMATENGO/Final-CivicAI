"use client";
import React, { useEffect, useState } from 'react';
import { apiMethods } from '@/lib/api';
import { MapPin, ShieldCheck, AlertTriangle, Info, Clock, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));

      const [profileRes, incidentsRes] = await Promise.all([
        apiMethods.getProfile(),
        apiMethods.getIncidents()
      ]);
      
      setUser(profileRes.data);
      setIncidents(incidentsRes.data.slice(0, 5)); // Just recent ones
    } catch (err) {
      console.error("Error loading dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    
    setAiLoading(true);
    setAiResponse('');
    try {
      const res = await apiMethods.askAI(aiMessage);
      setAiResponse(res.data.reply);
      setAiMessage('');
    } catch (err) {
      console.error("AI error", err);
      setAiResponse("Désolé, je rencontre une difficulté technique. Réessayez plus tard.");
    } finally {
      setAiLoading(false);
    }
  };

  if (!user || loading) return <div className="animate-pulse flex items-center justify-center h-full text-gray-400 font-bold">Chargement de CivicAI...</div>;
  // ... rest of the code ...

  const location = user.locations?.[0] || {};
  const locationText = location.city ? `${location.city}, ${location.region || 'RDC'}` : "Localisation non définie";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Bonjour, {user.name} 👋</h2>
          <p className="text-gray-500 mt-1">Voici ce qui se passe dans votre zone en ce moment.</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-2xl text-civic-info font-bold text-sm">
          <MapPin size={18} />
          <span>{locationText}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-civic-info to-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100 group hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4 group-hover:rotate-12 transition-transform">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-lg opacity-90">Ma Zone</h3>
          <p className="text-2xl font-black mt-1 uppercase tracking-tight">{location.city || 'RDC'}</p>
          <div className="mt-4 flex items-center text-xs bg-white/10 w-fit px-3 py-1 rounded-full">
            <span>{location.territory || 'Région générale'}</span>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-green-200 transition-all">
          <div className="bg-green-100 text-green-600 w-fit p-3 rounded-2xl mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-gray-400 text-sm">Niveau de sécurité</h3>
          <p className="text-2xl font-black mt-1 text-gray-800 uppercase">Calme</p>
          <div className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
            Aucun incident majeur
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-yellow-200 transition-all">
          <div className="bg-yellow-100 text-yellow-600 w-fit p-3 rounded-2xl mb-4">
            <AlertTriangle size={24} />
          </div>
          <h3 className="font-bold text-gray-400 text-sm">Alertes de zone</h3>
          <p className="text-2xl font-black mt-1 text-gray-800 uppercase">{incidents.length} Signalés</p>
          <p className="text-xs text-gray-500 mt-2">Dernières 24 heures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-800">Mises à jour citoyennes</h3>
            <a href="/dashboard/history" className="text-sm font-bold text-civic-info hover:underline flex items-center gap-1">
              Voir tout <Clock size={14} />
            </a>
          </div>
          
          <div className="space-y-4">
            {incidents.length === 0 ? (
              <div className="text-center py-10 text-gray-400 italic">Aucun signalement récent dans votre périmètre.</div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      incident.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-civic-info'
                    }`}>
                      {incident.type === 'TRAFFIC' ? '🚗' : incident.type === 'DANGER' ? '⚠️' : '📢'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-civic-info transition-colors">{incident.description}</p>
                      <p className="text-xs text-gray-500 font-medium">
                        Signalé par {incident.reporter?.name} • {new Date(incident.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                       incident.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
                     }`}>
                       {incident.type}
                     </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden flex flex-col h-[500px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg">Agent CivicAI</h3>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">En ligne • Assistant de Zone</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
              <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5 italic text-sm">
                "Bonjour {user.name}, je suis votre assistant CivicAI. Comment puis-je vous aider aujourd'hui ? (Trafic, sécurité, services...)"
              </div>
              
              {aiResponse && (
                <div className="bg-blue-600 p-4 rounded-2xl rounded-tl-none border border-blue-400/30 text-sm font-medium animate-in slide-in-from-left-2 shadow-lg">
                  {aiResponse}
                </div>
              )}

              {aiLoading && (
                <div className="flex space-x-2 p-4 bg-white/5 rounded-2xl w-fit">
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>

            <form onSubmit={handleAskAI} className="relative">
              <input 
                type="text" 
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Posez une question..."
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
              />
              <button 
                type="submit"
                disabled={aiLoading || !aiMessage.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
