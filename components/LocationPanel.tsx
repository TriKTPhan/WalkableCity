import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AssetExample from './AssetExample';

export default function LocationPanel() {
  const [address, setAddress] = useState('______________');
  const [showStationTable, setShowStationTable] = useState(false);

  const toggleStationTable = () => {
    setShowStationTable(prev => !prev);
  };

  const handleSelectPoint = useCallback(async (lat: number, lng: number) => {
    setAddress('Loading...');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&countrycodes=us`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('No nearby address found');
      }
    } catch (error) {
      setAddress('Error fetching address');
    }
  }, []);

  return (
    <View>
      <AssetExample onSelectPoint={handleSelectPoint} />

      <Text style={styles.paragraph}>
        Address: {address}
      </Text>

      {showStationTable && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Nearest Stations</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Station</Text>
            <Text style={styles.tableCell}>Distance</Text>
            <Text style={styles.tableCell}>Type</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sample Station</Text>
            <Text style={styles.tableCell}>0.3 mi</Text>
            <Text style={styles.tableCell}>Subway</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomColumn}>
        <TouchableOpacity style={styles.funcButton} onPress={toggleStationTable}>
          <Text style={styles.funcText}>Nearest Stations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.funcButton}>
          <Text style={styles.funcText}>Nearby Businesses [Under Construction]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.funcButton}>
          <Text style={styles.funcText}>Nearest Real Estate [Under Construction]</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 25,
    margin: 5,
  },
  tableContainer: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
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
    fontSize: 16,
    textAlign: 'center',
  },
});
