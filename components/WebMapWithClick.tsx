import React, { useEffect, useRef } from 'react';

type WebMapWithClickProps = {
  onSelectPoint: (lat: number, lng: number) => void;
};

export default function WebMapWithClick({ onSelectPoint }: WebMapWithClickProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<any>(null); // Leaflet popup reference

  useEffect(() => {
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.006], 13); // New York as default center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Right-click to select a point
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

      // Call parent callback
      onSelectPoint(latlng.lat, latlng.lng);
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
