import { UPSCALE_FACTOR_LIMITS, MAX_OUTPUT_DIMENSIONS, UI_UPSCALE_FACTORS } from './constants';
import { 
    CalculateSafeUpscaleFactors, 
    GetUIUpscaleFactors, 
    GetRecordDisplayName,
    AirtableRecord,
    AirtableAttachment,
    AirtableTable
} from '../types/index';

export const calculateSafeUpscaleFactors: CalculateSafeUpscaleFactors = (
    width: number, 
    height: number
): number[] => {
    console.log('📊 Upscale factor calculation:', {
        dimensions: width + '×' + height
    });
    
    if (width === 0 || height === 0) {
        console.log('❌ No image dimensions available - cannot calculate upscale factors');
        return [];
    }
    
    const safeFactors: number[] = [];
    
    for (const limit of UPSCALE_FACTOR_LIMITS) {
        const inputWithinLimits = width <= limit.maxWidth && height <= limit.maxHeight;
        
        const outputWidth = width * limit.factor;
        const outputHeight = height * limit.factor;
        const outputWithinLimits = outputWidth <= MAX_OUTPUT_DIMENSIONS.WIDTH && outputHeight <= MAX_OUTPUT_DIMENSIONS.HEIGHT;
        
        if (inputWithinLimits && outputWithinLimits) {
            safeFactors.push(limit.factor);
            console.log(`✅ Factor ${limit.factor}x available - input ${width}×${height} ≤ ${limit.maxWidth}×${limit.maxHeight}, output ${outputWidth}×${outputHeight} ≤ ${MAX_OUTPUT_DIMENSIONS.WIDTH}×${MAX_OUTPUT_DIMENSIONS.HEIGHT}`);
        } 
    }
    
    if (safeFactors.length === 0) {
        console.log('🚫 No safe upscale factors available for image ' + width + '×' + height);
    } else {
        console.log('✅ Available upscale factors: ' + safeFactors.join('x, ') + 'x');
    }
    
    return safeFactors;
};

export const getUIUpscaleFactors: GetUIUpscaleFactors = (safeFactors: number[]): number[] => {
    return safeFactors.filter(factor => UI_UPSCALE_FACTORS.includes(factor));
};

export const getRecordDisplayName: GetRecordDisplayName = (
    record: AirtableRecord,
    inputImages: AirtableAttachment[],
    selectedImageIndex: number | null,
    table: AirtableTable
): string => {
    if (selectedImageIndex !== null && inputImages && inputImages[selectedImageIndex]) {
        const selectedImage = inputImages[selectedImageIndex];
        const imageName = selectedImage.filename;
        if (imageName) {
            const nameWithoutExt = imageName.replace(/\.[^/.]+$/, "");
            return nameWithoutExt;
        }
    }
    
    const primaryField = table.primaryField;
    if (primaryField) {
        const primaryValue = record.getCellValueAsString(primaryField);
        if (primaryValue && primaryValue.trim()) {
            return primaryValue.trim();
        }
    }
    
    return `Record ${record.id.slice(-6)}`;
}; 