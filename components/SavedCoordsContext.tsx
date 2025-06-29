// components/SavedCoordsContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Coord = { lat: number; lng: number };

type SavedCoordsContextType = {
    savedCoords: Coord[];
    saveCoord: (coord: Coord) => void;
    removeCoord: (index: number) => void;
};

const SavedCoordsContext = createContext<SavedCoordsContextType | undefined>(undefined);

export const SavedCoordsProvider = ({ children }: { children: React.ReactNode }) => {
    const [savedCoords, setSavedCoords] = useState<Coord[]>([]);

    const saveCoord = (coord: Coord) => {
        setSavedCoords(prev => {
            const newCoords = [...prev, coord];
            if (newCoords.length > 20) {
                newCoords.shift(); // remove the oldest entry
            }
            return newCoords;
        });
    };

    const removeCoord = (index: number) => {
        setSavedCoords(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <SavedCoordsContext.Provider value={{ savedCoords, saveCoord, removeCoord }}>
            {children}
        </SavedCoordsContext.Provider>
    );
};

export const useSavedCoords = () => {
    const context = useContext(SavedCoordsContext);
    if (!context) throw new Error('useSavedCoords must be used within SavedCoordsProvider');
    return context;
};
