"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Map as MapIcon, 
  Bell, 
  User, 
  ShieldAlert, 
  History, 
  MessageSquare,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { apiMethods } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAppActive, setIsAppActive] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOutsideRDC, setIsOutsideRDC] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      const u = JSON.parse(storedUser);
      setUser(u);
      checkStatus(u);
      verifyGeofence(u);
    }
  }, [router]);

  const checkStatus = async (u: any) => {
    try {
      const res = await apiMethods.getAppConfig();
      setIsAppActive(res.data.isAppActive);
    } catch (err) {
      console.error("Status check failed");
    }
  };

  const verifyGeofence = async (u: any) => {
    if (u.email === 'jeanmatengo5@gmail.com') {
      setIsOutsideRDC(false);
      setIsCheckingLocation(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await apiMethods.saveLocation({ latitude, longitude });
            setIsOutsideRDC(false);
          } catch (err: any) {
            if (err.response?.data?.code === 'OUTSIDE_RDC') {
              setIsOutsideRDC(true);
            }
          } finally {
            setIsCheckingLocation(false);
          }
        },
        (error) => {
          console.error("Location access denied");
          setIsCheckingLocation(false);
          // In production, we might want to block if GPS is denied, 
          // but for the prototype we allow it if they set it manually before.
        }
      );
    } else {
      setIsCheckingLocation(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Tableau de bord', icon: BarChart3, href: '/dashboard' },
    { name: 'Carte Temps Réel', icon: MapIcon, href: '/dashboard/map' },
    { name: 'SOS & Signalement', icon: ShieldAlert, href: '/dashboard/reports' },
    { name: 'Agent CivicAI', icon: MessageSquare, href: '/dashboard/ai' },
    { name: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
    { name: 'Mon Historique', icon: History, href: '/dashboard/history' },
    { name: 'Profil & Paramètres', icon: User, href: '/dashboard/profile' },
  ];

  if (!user) return null;

  const isJeanAdmin = user.email === 'jeanmatengo5@gmail.com';

  if (isCheckingLocation) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-civic-info border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">Vérification de la zone de couverture...</p>
      </div>
    );
  }

  if (isOutsideRDC && !isJeanAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-red-900/50">
          <MapIcon size={48} />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">Zone Non Couverte</h1>
        <p className="text-gray-400 max-w-md text-lg">
          Désolé, CivicAI est exclusivement réservé au territoire de la **République Démocratique du Congo**.
        </p>
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl text-sm italic text-gray-400">
          Votre position actuelle est en dehors des limites de service.
        </div>
        <button onClick={handleLogout} className="mt-12 bg-white text-gray-900 px-8 py-3 rounded-2xl font-black hover:bg-gray-200 transition-all">
          Déconnexion
        </button>
      </div>
    );
  }

  if (!isAppActive && !isJeanAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Temporairement Indisponible</h1>
        <p className="text-gray-500 max-w-md">L'application CivicAI est actuellement en maintenance ou désactivée par l'administration nationale.</p>
        <button onClick={handleLogout} className="mt-8 text-civic-info font-bold hover:underline">Déconnexion</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop/Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-civic-info rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">CivicAI</h1>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-4 rounded-2xl transition-all ${
                    isActive 
                    ? 'bg-blue-50 text-civic-info font-bold scale-105 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-civic-info' : ''} />
                  <span>{item.name}</span>
                </a>
              );
            })}
            
            {isJeanAdmin && (
              <div className="mt-6 pt-6 border-t border-gray-50">
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-2">Administration Nationale</p>
                <a
                  href="/dashboard/admin"
                  className={`flex items-center space-x-3 p-4 rounded-2xl transition-all ${
                    pathname === '/dashboard/admin' 
                    ? 'bg-red-50 text-red-600 font-black' 
                    : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <ShieldAlert size={20} />
                  <span>Console Admin</span>
                </a>
              </div>
            )}

            <div className="mt-6">
                <button 
                  onClick={() => router.push('/dashboard/reports')}
                  className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95 animate-pulse"
                >
                  <ShieldAlert size={20} />
                  <span>URGENCE SOS</span>
                </button>
            </div>
          </nav>
          
          <div className="p-6 border-t border-gray-50">
            <div className="bg-gray-50 p-4 rounded-2xl mb-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 capitalize">
                {user.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 w-full text-gray-400 hover:text-red-500 transition-colors font-semibold"
            >
              <LogOut size={20} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-0 overflow-hidden">
        {/* Header Mobile */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 p-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">CivicAI</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50/50 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
