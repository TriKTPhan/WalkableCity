import Constants from 'expo-constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AssetExample from './AssetExample';
import { useSavedCoords } from './SavedCoordsContext';

type TransitStop = {
  stop_name?: string;
  onestop_id: string;
  stop_type?: string;
  location_type?: number;
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
};

export default function LocationPanel() {
  const [address, setAddress] = useState('______________');
  const [showStationTable, setShowStationTable] = useState(false);
  const [stations, setStations] = useState<TransitStop[]>([]);
  const [currentCoord, setCurrentCoord] = useState<[number, number] | null>(null);
  const { saveCoord, pendingViewCoord } = useSavedCoords();
  const mapRef = useRef<any>(null); // To center the map externally

  const toggleStationTable = () => {
    setShowStationTable(prev => !prev);
  };

  const apiKey = Constants.expoConfig?.extra?.transitlandApiKey;

  const handleSelectPoint = useCallback(async (lat: number, lng: number) => {
    setAddress('Loading...');
    setCurrentCoord([lat, lng]);
    setStations([]);

    try {
      // Reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&countrycodes=us`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('No nearby address found');
      }

      // TransitLand API call
      const radius = 500; // meters
      const transitRes = await fetch(
        `https://transit.land/api/v2/rest/stops?lat=${lat}&lon=${lng}&radius=${radius}`,
        { headers: { 'apikey': apiKey } }
      );
      const transitData = await transitRes.json();
      const allStops: TransitStop[] = transitData.stops || [];

      if (currentCoord) {
        const [lat1, lon1] = [lat, lng];
        const stopsWithDistance = allStops.map((stop) => {
          const [lon2, lat2] = stop.geometry.coordinates;
          const distance = parseFloat(computeDistance(lat1, lon1, lat2, lon2));
          return { ...stop, distance };
        });

        const sorted = allStops
          .map(stop => ({
            stop,
            dist: parseFloat(
              computeDistance(lat1, lon1, stop.geometry.coordinates[1], stop.geometry.coordinates[0])
            ),
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 5)
          .map(entry => entry.stop);

        setStations(sorted);

        const top5 = sorted.slice(0, 5);
        setStations(top5);
      } else {
        setStations(allStops.slice(0, 5)); // fallback
      }

    } catch (error) {
      console.error(error);
      setAddress('Error fetching address or stations');
    }
  }, []);

  const computeDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c * 0.621371).toFixed(2); // miles
  };

  const formatLocationType = (type?: number): string => {
    switch (type) {
      case 0:
      case undefined: return 'Stop/Platform';
      case 1: return 'Station';
      case 2: return 'Entrance/Exit';
      case 3: return 'Node';
      case 4: return 'Boarding Area';
      default: return 'Unknown';
    }
  };

  // 👇 Automatically center map if instructed from saved card
  useEffect(() => {
    if (pendingViewCoord && mapRef.current) {
      mapRef.current.setView([pendingViewCoord.lat, pendingViewCoord.lng], 13);
    }
  }, [pendingViewCoord]);

  return (
    <ScrollView>
      <AssetExample onSelectPoint={handleSelectPoint} mapRef={mapRef} />

      <Text style={styles.paragraph}>Address: {address}</Text>

      {showStationTable && (
        <ScrollView style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Nearest Stations</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Station</Text>
            <Text style={styles.tableCell}>Distance</Text>
            <Text style={styles.tableCell}>Type</Text>
          </View>
          {stations.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 10 }}>No stations found.</Text>
          ) : (
            stations.map((stop) => (
              <View key={stop.onestop_id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{stop.stop_name || 'Unnamed Station'}</Text>
                <Text style={styles.tableCell}>
                  {currentCoord
                    ? computeDistance(
                      currentCoord[0],
                      currentCoord[1],
                      stop.geometry.coordinates[1],
                      stop.geometry.coordinates[0]
                    ) + ' mi'
                    : '?'}
                </Text>
                <Text style={styles.tableCell}>{formatLocationType(stop.location_type)}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <View style={styles.bottomColumn}>
        <TouchableOpacity style={styles.funcButton} onPress={toggleStationTable}>
          <Text style={styles.funcText}>Nearest Stations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.funcButton}
          onPress={() => {
            if (currentCoord) {
              const [lat, lng] = currentCoord;
              saveCoord({ lat, lng, address });
            }
          }}
        >
          <Text style={styles.funcText}>Save Location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'grey',
  },
  bottomColumn: {
    justifyContent: 'space-between',
  },
  funcButton: {
    width: '100%',
    height: 30,
    marginVertical: 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: 'orange',
  },
  funcText: {
    color: 'black',
    fontSize: 20,
    margin: 5,
  },
  tableContainer: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    maxHeight: 300,
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
});
