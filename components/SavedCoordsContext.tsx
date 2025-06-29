import React, { createContext, useContext, useState } from 'react';

// Type definition for a saved coordinate with address
type Coord = {
    lat: number;
    lng: number;
    address: string;
};

// Context shape
type SavedCoordsContextType = {
    savedCoords: Coord[];
    saveCoord: (coord: Coord) => void;
    removeCoord: (index: number) => void;
    goToLocation: (coord: { lat: number; lng: number }) => void;
    pendingViewCoord: { lat: number; lng: number } | null;
};

// Create the context
const SavedCoordsContext = createContext<SavedCoordsContextType | undefined>(undefined);

// Provider component
export const SavedCoordsProvider = ({ children }: { children: React.ReactNode }) => {
    const [savedCoords, setSavedCoords] = useState<Coord[]>([]);
    const [pendingViewCoord, setPendingViewCoord] = useState<{ lat: number; lng: number } | null>(null);

    // Save a new coordinate (limit to 20)
    const saveCoord = (coord: Coord) => {
        setSavedCoords(prev => {
            const newCoords = [...prev, coord];
            if (newCoords.length > 20) {
                newCoords.shift(); // remove oldest
            }
            return newCoords;
        });
    };

    // Remove a coordinate by index
    const removeCoord = (index: number) => {
        setSavedCoords(prev => prev.filter((_, i) => i !== index));
    };

    // Set coordinate for map to jump to
    const goToLocation = (coord: { lat: number; lng: number }) => {
        setPendingViewCoord(coord);
    };

    return (
        <SavedCoordsContext.Provider
            value={{ savedCoords, saveCoord, removeCoord, goToLocation, pendingViewCoord }}
        >
            {children}
        </SavedCoordsContext.Provider>
    );
};

// Hook to use context
export const useSavedCoords = () => {
    const context = useContext(SavedCoordsContext);
    if (!context) {
        throw new Error('useSavedCoords must be used within a SavedCoordsProvider');
    }
    return context;
};
