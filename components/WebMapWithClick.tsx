import React, { useEffect, useRef } from 'react';

type WebMapWithClickProps = {
  onSelectPoint: (lat: number, lng: number) => void;
};

export default function WebMapWithClick({ onSelectPoint }: WebMapWithClickProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<any>(null); // Leaflet popup reference

  useEffect(() => {
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.006], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const onMouseDown = (e: any) => {
      pressTimerRef.current = setTimeout(() => {
        const latlng = e.latlng;

        // Create or move popup
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
      }, 500); // 500ms long press
    };

    const clearTimer = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    };

    map.on('mousedown', onMouseDown);
    map.on('mouseup', clearTimer);
    map.on('mouseout', clearTimer);

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
