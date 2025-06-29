import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function App() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/menu')}>
          {/* Placeholder for menu icon */}
          <Text style={styles.iconText}>≡</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Distance Finder</Text>

        <View style={styles.placeholder} />

      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    padding: 12,
  },
  iconButton: {
    backgroundColor: 'orange',
    padding: 2,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {

  }
});
