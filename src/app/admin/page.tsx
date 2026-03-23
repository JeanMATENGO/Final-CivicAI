"use client";
import React, { useEffect, useState } from 'react';
import { apiMethods } from '@/lib/api';
import { Users, AlertTriangle, ShieldCheck, Power, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, configRes] = await Promise.all([
        apiMethods.getAdminStats(),
        apiMethods.getAppConfig()
      ]);
      setStats(statsRes.data);
      setAppConfig(configRes.data);
    } catch (err) {
      console.error("Error loading admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApp = async () => {
    setToggling(true);
    try {
      const newStatus = !appConfig.isAppActive;
      const res = await apiMethods.updateAppConfig({ isAppActive: newStatus });
      setAppConfig(res.data);
    } catch (err) {
      alert("Erreur lors de la modification du statut.");
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Chargement...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Console d'Administration</h1>
          <p className="text-gray-500">Gérez le système CivicAI national</p>
        </div>
        
        <div className={`p-4 rounded-3xl flex items-center space-x-4 border-2 transition-all ${
          appConfig?.isAppActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div>
            <p className="text-sm font-bold">Statut de l'application</p>
            <p className={`text-xs ${appConfig?.isAppActive ? 'text-green-600' : 'text-red-600'}`}>
              {appConfig?.isAppActive ? 'ACTUELLEMT ACTIVE' : 'DÉSACTIVÉE GLOBALEMENT'}
            </p>
          </div>
          <button 
            disabled={toggling}
            onClick={handleToggleApp}
            className={`p-3 rounded-2xl transition-all ${
              appConfig?.isAppActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Power size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-100 text-blue-600 w-fit rounded-2xl mb-4">
            <Users size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Citoyens inscrits</p>
          <p className="text-3xl font-bold">{stats?.users || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="p-3 bg-red-100 text-red-600 w-fit rounded-2xl mb-4">
            <AlertTriangle size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Incidents actifs</p>
          <p className="text-3xl font-bold">{stats?.incidents || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="p-3 bg-green-100 text-green-600 w-fit rounded-2xl mb-4">
            <ShieldCheck size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Alertes vérifiées</p>
          <p className="text-3xl font-bold">94%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="p-3 bg-orange-100 text-orange-600 w-fit rounded-2xl mb-4">
            <Sparkles size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Requêtes IA/jour</p>
          <p className="text-3xl font-bold">1.2k</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg">Signalements récents</h3>
          <button className="text-civic-info text-sm font-bold hover:underline">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Signalé par</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Description</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentIncidents?.map((incident: any) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      incident.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {incident.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{incident.reporter?.name}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{incident.description}</td>
                  <td className="p-4">
                    <span className="flex items-center text-xs text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Actif
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-civic-info hover:text-blue-800 font-bold text-xs">Modérer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
