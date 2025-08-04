import { useEffect } from 'react';
import { calculateSafeUpscaleFactors, getUIUpscaleFactors } from '../utils/imageUtils';
import { useAppContext } from '../context/AppContext';
import { 
    UseAirtableDataReturn, 
    AirtableGlobalConfig, 
    AirtableTable, 
    AirtableField, 
    AirtableRecord 
} from '../types/index.js';

export function useAirtableData(
    globalConfig: AirtableGlobalConfig, 
    table: AirtableTable | null, 
    imageField: AirtableField | null, 
    records: AirtableRecord[]
): UseAirtableDataReturn {
    const {
        selectedAction,
        selectedUpscaleFactors,
        selectedImages,
        setSelectedImageFieldId,
        setSelectedOutputFieldId,
        setUpscaleFactorForRecord,
        selectImageForRecord
    } = useAppContext();

    // Initialize field IDs from global config
    useEffect(() => {
        setSelectedImageFieldId(globalConfig.get("selectedImageFieldId"));
        setSelectedOutputFieldId(globalConfig.get("selectedOutputFieldId"));
    }, [globalConfig, setSelectedImageFieldId, setSelectedOutputFieldId]);

    // Auto-initialize upscale factors and selected images when action or data changes
    useEffect(() => {
        if (selectedAction && table && imageField && records) {
            const recordsWithImages = records.filter(record => {
                const inputImages = record.getCellValue(imageField);
                return inputImages && inputImages.length > 0;
            });

            recordsWithImages.forEach(record => {
                const inputImages = record.getCellValue(imageField);
                if (inputImages && inputImages.length > 0) {
                    if (!selectedImages[record.id] || selectedImages[record.id].length === 0) {
                        selectImageForRecord(record.id, 0);
                    }
                    
                    if ((selectedAction === "upscale" || selectedAction === "process_both") && !selectedUpscaleFactors[record.id]) {
                        const currentSelectedIndex = selectedImages[record.id] && selectedImages[record.id].length > 0 
                            ? selectedImages[record.id][0] 
                            : 0;
                        const selectedImage = inputImages[currentSelectedIndex];
                        
                        const width = selectedImage.width || 0;
                        const height = selectedImage.height || 0;

                        const safeFactors = calculateSafeUpscaleFactors(width, height);
                        const uiFactors = getUIUpscaleFactors(safeFactors);

                        // Set the default upscale factor to the highest UI factor or 2 if no UI factors are available
                        const defaultFactor = uiFactors.length > 0 ? Math.max(...uiFactors) : 2;
                        setUpscaleFactorForRecord(record.id, defaultFactor);
                    }
                }
            });
        }
    }, [selectedAction, table, imageField, records, selectedUpscaleFactors, selectedImages, setUpscaleFactorForRecord, selectImageForRecord]);

    return {
        // All state and functions are accessible through useAppContext
    };
} 