"use client";
import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Shield, Camera, Save, MapPin } from 'lucide-react';
import { apiMethods } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    isLocationShared: true,
    profilePhotoUrl: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await apiMethods.getProfile();
      setUser(res.data);
      setFormData({
        name: res.data.name,
        phone: res.data.phone || '',
        isLocationShared: res.data.isLocationShared,
        profilePhotoUrl: res.data.profilePhotoUrl || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    const mockUrl = prompt("Entrez l'URL de votre nouvelle photo de profil (Simulé) :", "https://i.pravatar.cc/300");
    if (mockUrl) {
      setFormData((prev: any) => ({ ...prev, profilePhotoUrl: mockUrl }));
      setUser((prev: any) => ({ ...prev, profilePhotoUrl: mockUrl }));
      alert("Photo mise à jour dynamiquement. Cliquez sur Enregistrer pour confirmer.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiMethods.updateProfile(formData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) return alert("Le GPS n'est pas supporté par votre navigateur.");
    
    setSaving(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        // Envoi des coordonnées au backend
        // Le backend pourrait faire le reverse geocoding ici
        await apiMethods.saveLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: 'Bukavu', // Mock pour le prototype si reverse geo non dispo
          region: 'Sud-Kivu'
        });
        loadProfile();
        alert("Localisation mise à jour.");
      } catch (err) {
        alert("Erreur lors de la mise à jour GPS.");
      } finally {
        setSaving(false);
      }
    }, (err) => {
      alert("Accès GPS refusé.");
      setSaving(false);
    });
  };

  if (loading || !user) return <div className="text-center py-20 font-bold text-gray-400">Chargement du profil...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8"></div>
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 relative">
          <div className="relative group">
            <div className="w-32 h-32 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-[2rem] flex items-center justify-center text-civic-info border-4 border-white shadow-xl overflow-hidden">
               {user.profilePhotoUrl ? <img src={user.profilePhotoUrl} className="w-full h-full object-cover" /> : <User size={48} />}
            </div>
            <div 
              onClick={handlePhotoUpload}
              className="absolute -bottom-2 -right-2 bg-civic-info text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
            >
              <Camera size={16} />
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-gray-800">{user.name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
               <span className="px-3 py-1 bg-blue-100 text-civic-info text-[10px] font-black rounded-full uppercase tracking-widest">{user.role}</span>
               <span className="text-gray-400 text-xs font-semibold">Membre CivicAI</span>
            </div>
            <p className="text-gray-400 text-xs mt-3 flex items-center justify-center md:justify-start gap-1">
              <Shield size={12} /> Données protégées par cryptage AES-256
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="font-black text-gray-800 flex items-center space-x-3 text-lg">
            <div className="p-2 bg-blue-50 text-civic-info rounded-xl"><User size={20} /></div>
            <span>Mon Compte</span>
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Email National</label>
              <div className="flex items-center space-x-3 mt-1.5 p-4 bg-gray-50 rounded-2xl border border-gray-50">
                <Mail size={18} className="text-gray-400" />
                <span className="text-gray-700 font-medium">{user.email}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Numéro de téléphone</label>
              <div className="flex items-center space-x-3 mt-1.5 p-4 bg-white rounded-2xl border border-gray-100 focus-within:border-civic-info transition-colors">
                <Phone size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-transparent flex-1 outline-none text-gray-800 font-bold" 
                  placeholder="+243..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="font-black text-gray-800 flex items-center space-x-3 text-lg">
            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><Shield size={20} /></div>
            <span>Sécurité & Vie Privée</span>
          </h3>
          
          <div className="space-y-4">
            <div 
              onClick={() => setFormData({...formData, isLocationShared: !formData.isLocationShared})}
              className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm"><MapPin size={18} className="text-gray-400 group-hover:text-civic-info transition-colors" /></div>
                <div>
                  <p className="font-bold text-gray-700 text-sm">Partage de position</p>
                  <p className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">Visible par les autres citoyens</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors ${formData.isLocationShared ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.isLocationShared ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
            
            <button 
              onClick={handleUpdateLocation}
              className="w-full flex items-center justify-center space-x-2 p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-civic-info hover:text-civic-info transition-all font-bold text-sm"
            >
              <MapPin size={18} />
              <span>Actualiser ma position (GPS)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-civic-info text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <Save size={24} />}
          <span className="text-sm uppercase tracking-widest">Enregistrer CivicID</span>
        </button>
      </div>
    </div>
  );
}
