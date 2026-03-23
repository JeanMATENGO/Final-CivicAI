import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, ShieldCheck, MailOpen, Trash2, Clock, Filter } from 'lucide-react';
import { apiMethods } from '@/lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiMethods.getIncidents();
      const mapped = res.data.map((inc: any) => ({
        id: inc.id,
        type: inc.severity === 'CRITICAL' ? 'ALERT' : 'INFO',
        title: `${inc.type}: ${inc.description.substring(0, 30)}...`,
        message: inc.description,
        time: new Date(inc.createdAt).toLocaleString('fr-FR'),
        isRead: false,
      }));
      setNotifications(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ALERT': return <AlertTriangle size={20} className="text-red-500" />;
      case 'INFO': return <Info size={20} className="text-blue-500" />;
      case 'SECURITY': return <ShieldCheck size={20} className="text-green-500" />;
      default: return <Bell size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Cité Connectée</h1>
          <p className="text-gray-500 font-medium">Restez au courant de tout ce qui se passe autour de vous.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-civic-info transition-colors shadow-sm">
            <Filter size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-colors shadow-sm">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            onClick={() => markAsRead(notif.id)}
            className={`group relative p-6 rounded-[2rem] border transition-all cursor-pointer ${
              notif.isRead 
              ? 'bg-white border-gray-100 opacity-70 grayscale-[0.3]' 
              : 'bg-white border-blue-100 shadow-md shadow-blue-50/50 scale-[1.01]'
            }`}
          >
            {!notif.isRead && (
              <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
            )}
            
            <div className="flex items-start space-x-5">
              <div className={`p-4 rounded-2xl ${
                notif.type === 'ALERT' ? 'bg-red-50' : notif.type === 'SECURITY' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                {getTypeIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-black tracking-tight ${notif.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {notif.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {notif.message}
                </p>
                
                {!notif.isRead && (
                   <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-civic-info flex items-center gap-1 hover:underline">
                     Marquer comme lu <MailOpen size={12} />
                   </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
             <Bell size={32} />
           </div>
           <p className="text-gray-400 font-bold italic">Aucune nouvelle notification pour le moment.</p>
        </div>
      )}
    </div>
  );
}
