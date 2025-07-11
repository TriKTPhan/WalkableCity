import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import WebMapWithClick from './WebMapWithClick';

type Props = {
  onSelectPoint: (lat: number, lng: number) => void;
  mapRef: React.RefObject<any>;
  onMapReady: () => void;
};

export default function AssetExample({ onSelectPoint, mapRef, onMapReady }: Props) {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const handleSelect = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <WebMapWithClick
          onSelectPoint={(lat, lng) => {
            handleSelect(lat, lng);
            onSelectPoint(lat, lng);
          }}
          mapRef={mapRef}
          onMapReady={onMapReady} 
        />

      ) : (
        <Text>Map supported on web only for now.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
  },
  coords: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
