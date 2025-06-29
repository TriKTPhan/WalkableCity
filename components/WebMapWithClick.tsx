import React, { useEffect, useRef } from 'react';

type WebMapWithClickProps = {
  onSelectPoint: (lat: number, lng: number) => void;
  mapRef: React.RefObject<any>; // This is the prop for exposing Leaflet map
  onMapReady: () => void;
};

export default function WebMapWithClick({ onSelectPoint, mapRef, onMapReady }: WebMapWithClickProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // This is for the actual DOM element
  const popupRef = useRef<any>(null); // Leaflet popup reference

  useEffect(() => {
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([40.7128, -74.006], 13); // Default to NYC

    // Expose the Leaflet map to the parent
    mapRef.current = map;
    onMapReady();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Right-click (contextmenu) to select a point
    map.on('contextmenu', (e: any) => {
      const latlng = e.latlng;

      const popupContent = `Selected location:<br>${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

      if (popupRef.current) {
        popupRef.current.setLatLng(latlng).setContent(popupContent).openOn(map);
      } else {
        popupRef.current = L.popup({ closeOnClick: false, autoClose: false })
          .setLatLng(latlng)
          .setContent(popupContent)
          .openOn(map);
      }

      onSelectPoint(latlng.lat, latlng.lng);
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}
