"use client";
import React, { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { apiMethods } from '@/lib/api';
import { MapPin, AlertCircle } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiamVhbm1hdGVuZ28iLCJhIjoiY204MTB5ZHZtMDBuazJqcHh6NDNmcXNuaCJ9.Xv3_N_152E_3Wq1j2X0u8u_6vQ'; // Use env var if available

export default function MapPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [viewState, setViewState] = useState({
    longitude: 28.85, // Bukavu
    latitude: -2.50,
    zoom: 12
  });

  useEffect(() => {
    fetchIncidents();
    // Auto-locate user
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewState(prev => ({
        ...prev,
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
      }));
    });
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await apiMethods.getIncidents();
      setIncidents(res.data);
    } catch (err) {
      console.error("Error fetching incidents", err);
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'DANGER': return 'text-red-600';
      case 'ACCIDENT': return 'text-orange-500';
      case 'TRAFFIC': return 'text-yellow-500';
      case 'FIRE': return 'text-red-700';
      default: return 'text-civic-info';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex-1 bg-gray-100 rounded-3xl relative overflow-hidden shadow-inner border-4 border-white">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          
          {/* User Marker */}
          <Marker longitude={viewState.longitude} latitude={viewState.latitude}>
            <div className="p-2 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </Marker>

          {/* Incident Markers */}
          {incidents.map((incident) => (
            <Marker 
              key={incident.id} 
              longitude={incident.longitude} 
              latitude={incident.latitude}
            >
              <div className={`cursor-pointer transition-transform hover:scale-125 ${getMarkerColor(incident.type)}`}>
                <AlertCircle size={32} fill="white" />
              </div>
            </Marker>
          ))}
        </Map>
        
        {/* Overlay Legende */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl space-y-3 border border-white">
          <h4 className="font-bold text-sm">Légende</h4>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-xs font-medium">Ma position</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span className="text-xs font-medium">Danger / Incident</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-xs font-medium">Trafic intense</span>
          </div>
        </div>
      </div>
    </div>
  );
}
