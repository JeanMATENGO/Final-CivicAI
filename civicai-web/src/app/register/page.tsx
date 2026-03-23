"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ShieldCheck, User, Mail, Lock, Phone, ArrowRight, Github } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
      setStep(1); // Go back to show error on main fields
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] -ml-48 -mb-48"></div>

      <div className="w-full max-w-xl bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-blue-100/50 relative border border-white">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-12 h-12 bg-civic-info rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">CivicAI</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-4xl font-black text-gray-900 leading-tight">Créez votre Citizen ID</h2>
          <p className="text-gray-500 mt-2 font-medium">Rejoignez la plateforme numérique nationale de la RDC.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-shake">
              {error}
            </div>
          )}
          
          <div className="transition-all duration-500">
            {step === 1 ? (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom Complet</label>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-civic-info transition-colors">
                    <User size={20} className="text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Jean Mukendi"
                      className="bg-transparent flex-1 outline-none text-gray-800 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse Email</label>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-civic-info transition-colors">
                    <Mail size={20} className="text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="citizen@gov.cd"
                      className="bg-transparent flex-1 outline-none text-gray-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                 <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone RDC</label>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-civic-info transition-colors">
                    <Phone size={20} className="text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+243..."
                      className="bg-transparent flex-1 outline-none text-gray-800 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe sécurisé</label>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-civic-info transition-colors">
                    <Lock size={20} className="text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-transparent flex-1 outline-none text-gray-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-civic-info text-white font-black rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              {loading ? (
                 <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="uppercase tracking-widest">{step === 1 ? 'Suivant' : 'Terminer Inscription'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
              >
                Retour
              </button>
            )}
          </div>
        </form>

        <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col items-center gap-6">
          <p className="text-sm font-bold text-gray-400">Ou s'inscrire avec</p>
          <div className="flex gap-4">
            <button className="flex items-center space-x-2 px-6 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-gray-600">
               <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
               <span>Google</span>
            </button>
          </div>
          
          <p className="text-sm font-bold text-gray-500">
            Déjà citoyen ?{' '}
            <Link href="/login" className="text-civic-info hover:underline">
              Accéder à mon ID
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
