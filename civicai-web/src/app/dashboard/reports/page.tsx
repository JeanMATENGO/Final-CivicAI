"use client";
import React, { useState } from 'react';
import { apiMethods } from '@/lib/api';
import { AlertTriangle, AlertCircle, Trash2, Zap, Car, Flame, Droplets, UserX, ShieldQuestion, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

const incidentTypes = [
  { id: 'ACCIDENT', label: 'Accident', icon: Car, color: 'bg-orange-500' },
  { id: 'TRAFFIC', label: 'Embouteillage', icon: Zap, color: 'bg-yellow-500' },
  { id: 'FIRE', label: 'Incendie', icon: Flame, color: 'bg-red-600' },
  { id: 'FLOOD', label: 'Inondation', icon: Droplets, color: 'bg-blue-600' },
  { id: 'WASTE', label: 'Déchets / Ordures', icon: Trash2, color: 'bg-green-600' },
  { id: 'THEFT', label: 'Vol / Braquage', icon: UserX, color: 'bg-purple-600' },
  { id: 'VIOLENCE', label: 'Violence', icon: ShieldQuestion, color: 'bg-red-800' },
  { id: 'DANGER', label: 'Autre Danger', icon: AlertTriangle, color: 'bg-red-500' },
];

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    severity: 'MEDIUM',
    latitude: 0,
    longitude: 0,
    photoUrl: '', // Add this
  });
  const router = useRouter();

  const handleSOS = async () => {
    if (!confirm("ÊTES-VOUS SÛR ? Cela enverra une alerte SOS immédiate avec votre position aux autorités et utilisateurs proches.")) return;
    
    setLoading(true);
    try {
      // Get current position
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await apiMethods.reportIncident({
          type: 'DANGER',
          severity: 'CRITICAL',
          description: 'ALERTE SOS - BESOIN D\'AIDE IMMÉDIATE',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        alert("SOS envoyé ! Gardez votre calme, l'aide arrive.");
        setLoading(false);
      }, (err) => {
        alert("Erreur GPS : Impossible d'envoyer le SOS sans localisation.");
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) return alert("Sélectionnez un type d'incident");
    
    setLoading(true);
    try {
      // Logic for getting location if not set
      if (formData.latitude === 0) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          await apiMethods.reportIncident({
            ...formData,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setSuccess(true);
          setLoading(false);
        });
      } else {
        await apiMethods.reportIncident(formData);
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold">Signalement envoyé !</h2>
        <p className="text-gray-500">Merci pour votre vigilance citoyenne.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-6 py-2 bg-civic-info text-white rounded-xl"
        >
          Nouveau signalement
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-red-100 border-2 border-red-500 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
        <div>
          <h2 className="text-red-700 text-xl font-bold">MODE URGENCE (SOS)</h2>
          <p className="text-red-600 text-sm">Appuyez ici en cas de danger vital immédiat.</p>
        </div>
        <button 
          onClick={handleSOS}
          disabled={loading}
          className="w-full md:w-auto px-10 py-4 bg-red-600 text-white font-black text-xl rounded-2xl shadow-lg hover:bg-red-700 active:scale-95 transition-all animate-pulse"
        >
          BOUTON SOS
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">Signaler un incident</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Type d'incident</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {incidentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                    formData.type === type.id 
                    ? 'border-civic-info bg-blue-50' 
                    : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className={`p-3 rounded-full text-white mb-2 ${type.color}`}>
                    <type.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-center">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-civic-info outline-none min-h-[120px]"
              placeholder="Décrivez ce qui se passe..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Gravité</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
              >
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="CRITICAL">Critique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Photo (Optionnel)</label>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("URL de la photo de l'incident (Prototype) :");
                  if (url) setFormData({ ...formData, photoUrl: url });
                }}
                className={`w-full p-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 transition-all ${
                  formData.photoUrl ? 'border-civic-info text-civic-info bg-blue-50' : 'border-gray-200 text-gray-400 hover:border-blue-200'
                }`}
              >
                <Camera size={20} />
                <span>{formData.photoUrl ? 'Photo ajoutée ✓' : 'Joindre une photo'}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.type}
            className="w-full py-4 bg-civic-info text-white font-bold rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Traitement...' : 'Envoyer le Signalement'}
          </button>
        </form>
      </div>
    </div>
  );
}
