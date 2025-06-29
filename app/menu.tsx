// app/menu.tsx
import { useSavedCoords } from '@/components/SavedCoordsContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MenuScreen() {
    const router = useRouter();
    const { savedCoords, removeCoord, goToLocation } = useSavedCoords();


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Saved Coordinates</Text>
            {savedCoords.length === 0 ? (
                <Text style={styles.empty}>No locations saved.</Text>
            ) : (
                savedCoords.map((coord, index) => (
                    <View key={index} style={styles.coordBox}>
                        <View style={styles.coordRow}>
                            <Text>Lat: {coord.lat.toFixed(5)}</Text>
                            <Text>Lng: {coord.lng.toFixed(5)}</Text>
                        </View>
                        <Text style={styles.addressText}>{coord.address}</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => {
                                    goToLocation({ lat: coord.lat, lng: coord.lng });
                                    router.replace('/');
                                }}
                                style={styles.gotoButton}
                            >
                                <Text style={styles.gotoText}>Go to</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => removeCoord(index)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    empty: { fontSize: 16, fontStyle: 'italic' },
    coordBox: {
        padding: 10,
        marginVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
    },
    coordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    deleteButton: {
        backgroundColor: 'tomato',
        padding: 6,
        borderRadius: 4,
        flex: 1,
    },
    deleteText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    addressText: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 4,
        marginBottom: 6,
        color: '#555',
    },
    gotoButton: {
        backgroundColor: 'dodgerblue',
        padding: 6,
        borderRadius: 4,
        flex: 1,
        marginRight: 8,
    },
    gotoText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});
