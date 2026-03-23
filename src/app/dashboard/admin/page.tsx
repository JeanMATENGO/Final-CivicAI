"use client";
import React, { useEffect, useState } from 'react';
import { apiMethods } from '@/lib/api';
import { Users, AlertCircle, MessageSquare, Power, Settings, RefreshCw, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes, configRes] = await Promise.all([
        apiMethods.getAdminStats(),
        apiMethods.getUsers(),
        apiMethods.getAppConfig()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAppConfig(configRes.data);
    } catch (err) {
      console.error("Admin error", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAppStatus = async () => {
    if (!appConfig) return;
    try {
       const newStatus = !appConfig.isAppActive;
       const res = await apiMethods.updateAppConfig({ isAppActive: newStatus });
       setAppConfig(res.data);
    } catch (err) {
       alert("Erreur lors du changement de statut");
    }
  };

  if (loading) return <div className="p-10 text-center font-black animate-pulse text-gray-400">Initialisation du Centre de Commandement...</div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Console Admin</h1>
          <p className="text-gray-500 font-medium">Gestion globale de la plateforme CivicAI RDC.</p>
        </div>
        
        <div className={`p-1 rounded-[2rem] flex items-center gap-4 px-6 py-4 border-2 transition-all ${
          appConfig?.isAppActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
           <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Etat Global</span>
             <span className={`font-black uppercase text-sm ${appConfig?.isAppActive ? 'text-green-600' : 'text-red-600'}`}>
               {appConfig?.isAppActive ? 'Opérationnel' : 'Désactivé'}
             </span>
           </div>
           <button 
             onClick={toggleAppStatus}
             className={`p-3 rounded-2xl shadow-lg transition-transform active:scale-90 ${
               appConfig?.isAppActive ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'
             }`}
           >
             <Power size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><Users size={28} /></div>
          <div><p className="text-sm font-bold text-gray-400">Citoyens</p><p className="text-2xl font-black text-gray-900">{stats?.users || 0}</p></div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl"><AlertCircle size={28} /></div>
          <div><p className="text-sm font-bold text-gray-400">Total Incidents</p><p className="text-2xl font-black text-gray-900">{stats?.incidents || 0}</p></div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl"><MessageSquare size={28} /></div>
          <div><p className="text-sm font-bold text-gray-400">IA Requêtes</p><p className="text-2xl font-black text-gray-900">1.2k</p></div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6 opacity-50">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl"><RefreshCw size={28} /></div>
          <div><p className="text-sm font-bold text-gray-400">Appels SOS</p><p className="text-2xl font-black text-gray-900">0</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white rounded-[3rem] shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900">Répertoire Citoyen</h3>
            <button className="text-sm font-black text-civic-info uppercase tracking-widest underline decoration-2 underline-offset-8">Exporter CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-10 py-6">ID / Nom</th>
                  <th className="px-10 py-6">Contact</th>
                  <th className="px-10 py-6">Rôle</th>
                  <th className="px-10 py-6">Inscription</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gray-200 font-bold flex items-center justify-center text-gray-500 uppercase">{u.name.substring(0,2)}</div>
                         <div className="flex flex-col">
                           <span className="font-black text-gray-800">{u.name}</span>
                           <span className="text-[10px] text-gray-400 font-bold italic">{u.id}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-500">{u.email}<br/><span className="text-[11px] opacity-70">{u.phone || 'Pas de numéro'}</span></td>
                    <td className="px-10 py-6">
                       <span className={`text-[10px] font-black px-3 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                         {u.role}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-400">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-3 rounded-xl bg-gray-100 text-gray-400 group-hover:bg-civic-info group-hover:text-white transition-all">
                         <ChevronRight size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3rem] text-white shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                 <Settings className="text-blue-500" strokeWidth={3} />
                 <h3 className="text-xl font-black italic tracking-tight">Configuration Rapide</h3>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl">
                    <span className="font-bold text-sm">Mode Maintenance</span>
                    <div className="w-12 h-6 bg-gray-700 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-gray-500 rounded-full"></div></div>
                 </div>
                 <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl">
                    <span className="font-bold text-sm">Enregistrements Publics</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                 </div>
                 <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl">
                    <span className="font-bold text-sm">Logging Détaillé IA</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                 </div>
              </div>
              <button className="w-full mt-10 py-5 bg-blue-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-500 transition-colors shadow-xl shadow-blue-900/50">
                Appliquer Changements
              </button>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-gray-100">
             <h3 className="text-xl font-black text-gray-800 mb-6">Activité Récente</h3>
             <div className="space-y-6">
                {stats?.recentIncidents?.slice(0, 4).map((inc: any) => (
                  <div key={inc.id} className="flex gap-4">
                     <div className="w-1 h-10 bg-red-400 rounded-full"></div>
                     <div className="flex-1">
                        <p className="text-sm font-black text-gray-800 leading-tight truncate">{inc.description}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{inc.reporter.name} • {new Date(inc.createdAt).getHours()}h{new Date(inc.createdAt).getMinutes()}</p>
                     </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
