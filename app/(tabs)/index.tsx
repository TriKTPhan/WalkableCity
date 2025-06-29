import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Card, Provider as PaperProvider } from 'react-native-paper';

import LocationPanel from '@/components/LocationPanel';
import TopBar from '@/components/TopBar';

/* const handleSelectPoint = useCallback(async (lat: number, lng: number) => {
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
}, []); */


export default function HomeScreen() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Card>
          <TopBar />
          <LocationPanel />
        </Card>
      </SafeAreaView>
    </PaperProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 8,
  },
  paragraph: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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

