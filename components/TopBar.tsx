import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton}>
          {/* Placeholder for menu icon */}
          <Text style={styles.iconText}>≡</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Distance Finder</Text>

        <TouchableOpacity style={styles.iconButton}>
          {/* Placeholder for account icon */}
          <Text style={styles.iconText}>👤</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  iconButton: {
    backgroundColor: 'orange',
    padding: 8,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
