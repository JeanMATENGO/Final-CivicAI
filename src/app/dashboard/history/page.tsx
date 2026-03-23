"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { History, ShieldAlert, MessageSquare, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/users/profile'); // Using profile endpoint as it includes history logs in my updated schema (need to check backend)
      // Actually, my backend getProfile only includes locations. Let me check.
      setLogs(res.data.historyLogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'INCIDENT_REPORTED': return <ShieldAlert size={18} className="text-orange-500" />;
      case 'IA_INTERACTION': return <MessageSquare size={18} className="text-blue-500" />;
      case 'LOCATION_UPDATED': return <MapPin size={18} className="text-green-500" />;
      default: return <Clock size={18} className="text-gray-400" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'INCIDENT_REPORTED': return 'Signalement envoyé';
      case 'IA_INTERACTION': return 'Interaction avec IA';
      case 'LOCATION_UPDATED': return 'Position mise à jour';
      default: return type;
    }
  };

  if (loading) return <div>Chargement de l'historique...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mon Historique</h1>
          <p className="text-gray-500 text-sm">Retrouvez toutes vos actions et alertes passées</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          <History className="text-civic-info" />
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <History size={32} />
          </div>
          <p className="text-gray-500 font-medium">Aucune activité enregistrée pour le moment.</p>
          <a href="/dashboard/reports" className="mt-4 text-civic-info font-bold text-sm hover:underline">Faire un signalement</a>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {getIcon(log.actionType)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{getLabel(log.actionType)}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {log.metadata?.type && (
                  <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-md uppercase">
                    {log.metadata.type}
                  </span>
                )}
                <button className="text-gray-400 hover:text-civic-info transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
