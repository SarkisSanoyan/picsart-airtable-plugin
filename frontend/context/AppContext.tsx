import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppContextType, ProcessingAction } from '../types/index';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [selectedImageFieldId, setSelectedImageFieldId] = useState<string | null>(null);
    const [selectedOutputFieldId, setSelectedOutputFieldId] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<ProcessingAction | null>(null);
    const [selectedUpscaleFactors, setSelectedUpscaleFactors] = useState<Record<string, number>>({});
    const [selectedImages, setSelectedImages] = useState<Record<string, number[]>>({});
    const [processingRecordId, setProcessingRecordId] = useState<string | null>(null);
    const [processingStatus, setProcessingStatus] = useState<string>("");
    const [appendMode, setAppendMode] = useState<boolean>(true);

    const getUpscaleFactorForRecord = useCallback((recordId: string, availableFactors: number[]): number | null => {
        if (availableFactors.length === 0) return null;
        return selectedUpscaleFactors[recordId] || Math.max(...availableFactors);
    }, [selectedUpscaleFactors]);

    const setUpscaleFactorForRecord = useCallback((recordId: string, factor: number): void => {
        setSelectedUpscaleFactors(prev => ({
            ...prev,
            [recordId]: factor
        }));
    }, []);

    const getSelectedImagesForRecord = useCallback((recordId: string): number[] => {
        return selectedImages[recordId] || [];
    }, [selectedImages]);

    const selectImageForRecord = useCallback((recordId: string, imageIndex: number): void => {
        setSelectedImages(prev => ({
            ...prev,
            [recordId]: [imageIndex] 
        }));
    }, []);

    const getSelectedImageIndexForRecord = useCallback((recordId: string): number | null => {
        const selected = selectedImages[recordId] || [];
        return selected.length > 0 ? selected[0] : null;
    }, [selectedImages]);

    const value: AppContextType = {
        // State
        selectedTableId,
        selectedImageFieldId,
        selectedOutputFieldId,
        selectedAction,
        selectedUpscaleFactors,
        selectedImages,
        processingRecordId,
        processingStatus,
        appendMode,
        
        // Setters
        setSelectedTableId,
        setSelectedImageFieldId,
        setSelectedOutputFieldId,
        setSelectedAction,
        setSelectedUpscaleFactors,
        setSelectedImages,
        setProcessingRecordId,
        setProcessingStatus,
        setAppendMode,
        
        // Helper functions
        getUpscaleFactorForRecord,
        setUpscaleFactorForRecord,
        getSelectedImagesForRecord,
        selectImageForRecord,
        getSelectedImageIndexForRecord
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
}; 