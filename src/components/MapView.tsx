import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Fallback Token pou tès devlopman si VITE_MAPBOX_TOKEN pa konfigire
const MAPBOX_TOKEN = 
  import.meta.env.VITE_MAPBOX_TOKEN || 
  'pk.eyJ1IjoibGl2cmV6LW5vdSIsImEiOiJjbHN4ZXptM3EwM3U1MmpudnVpa3pibmt4In0.sample';

interface MapViewProps {
  pickupCoords?: [number, number];   // [lng, lat]
  deliveryCoords?: [number, number]; // [lng, lat]
  driverCoords?: [number, number];   // [lng, lat]
  interactive?: boolean;
}

export default function MapView({
  pickupCoords = [-72.2852, 18.5392], // Pétion-Ville pa defo
  deliveryCoords = [-72.3012, 18.5482],
  driverCoords,
  interactive = true,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: pickupCoords,
        zoom: 13,
        interactive: interactive,
      });

      mapRef.current = map;

      map.on('error', (e) => {
        console.warn('Mapbox eprèv entèn:', e);
      });

      map.on('load', () => {
        // Marker Depa (Vèt)
        const pickupEl = document.createElement('div');
        pickupEl.className = 'w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold';
        pickupEl.innerText = 'A';
        new mapboxgl.Marker(pickupEl).setLngLat(pickupCoords).addTo(map);

        // Marker Arrive (Oranj)
        const deliveryEl = document.createElement('div');
        deliveryEl.className = 'w-6 h-6 rounded-full bg-brand border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold';
        deliveryEl.innerText = 'B';
        new mapboxgl.Marker(deliveryEl).setLngLat(deliveryCoords).addTo(map);

        // Liy Trajè
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [pickupCoords, deliveryCoords],
            },
          },
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#FF6B00',
            'line-width': 4,
            'line-dasharray': [2, 1],
          },
        });
      });

      return () => {
        map.remove();
      };
    } catch (err) {
      console.error('Erè inisyalizasyon Kat la:', err);
      setMapError(true);
    }
  }, [pickupCoords, deliveryCoords, interactive]);

  // Mete ajou pozisyon Driver
  useEffect(() => {
    if (!mapRef.current || !driverCoords) return;

    if (!driverMarkerRef.current) {
      const driverEl = document.createElement('div');
      driverEl.className = 'w-9 h-9 rounded-2xl bg-navy border-2 border-brand shadow-xl flex items-center justify-center text-lg animate-pulse';
      driverEl.innerText = '🏍️';

      driverMarkerRef.current = new mapboxgl.Marker(driverEl)
        .setLngLat(driverCoords)
        .addTo(mapRef.current);
    } else {
      driverMarkerRef.current.setLngLat(driverCoords);
    }
  }, [driverCoords]);

  if (mapError) {
    return (
      <div className="w-full h-full bg-slate-100 rounded-3xl flex flex-col items-center justify-center p-4 text-center border border-slate-200">
        <span className="text-3xl mb-2">🗺️</span>
        <p className="text-xs font-bold text-navy font-display">Kat la pa ka chaje kounye a</p>
        <p className="text-[10px] text-slate-400 mt-1">Verifye koneksyon w oswa API key la</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}