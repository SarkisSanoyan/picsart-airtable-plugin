import React, { useMemo } from 'react';
import { ImageGrid } from '../image/ImageGrid';
import { UpscaleFactorSelector } from '../image/UpscaleFactorSelector';
import { ProcessButton } from './ProcessButton';
import { calculateSafeUpscaleFactors, getUIUpscaleFactors, getRecordDisplayName } from '../../utils/imageUtils';
import { useAppContext } from '../../context/AppContext';
import { RecordItemProps } from '../../types/index';

export function RecordItem({ 
    record, 
    table,
    imageField,
    outputField,
    onProcess 
}: RecordItemProps): JSX.Element {
    const {
        selectedAction,
        appendMode,
        processingRecordId,
        getSelectedImagesForRecord,
        selectImageForRecord,
        getSelectedImageIndexForRecord,
        getUpscaleFactorForRecord,
        setUpscaleFactorForRecord
    } = useAppContext();

    const inputImages = record.getCellValue(imageField) || [];
    const existingOutputImages = record.getCellValue(outputField) || [];
    const hasOutputImages = existingOutputImages.length > 0;
    
    const selectedImageIndex = getSelectedImageIndexForRecord(record.id);
    
    // Calculate available upscale factors for the currently selected image
    const selectedImage = selectedImageIndex !== null && inputImages[selectedImageIndex] ? 
        inputImages[selectedImageIndex] : inputImages[0];

    const { width, height } = useMemo(() => ({
        width: selectedImage?.width || 0,
        height: selectedImage?.height || 0,
    }), [selectedImage]);

    const { uiFactors } = useMemo(() => {
        const available = calculateSafeUpscaleFactors(width, height);
        const ui = getUIUpscaleFactors(available);
        
        return { uiFactors: ui };
    }, [width, height]);

    const currentUpscaleFactor = getUpscaleFactorForRecord(record.id, uiFactors);
    
    // Get the record's display name based on selected image
    const recordDisplayName = getRecordDisplayName(record, inputImages, selectedImageIndex, table);
    const isUsingImageName = selectedImageIndex !== null && 
        inputImages[selectedImageIndex] && 
        (inputImages[selectedImageIndex].filename || inputImages[selectedImageIndex].name);

    return (
        <div key={record.id} className="record-preview">
            <div className="record-name">
                {isUsingImageName && <span className="image-name-indicator">📸 </span>}
                {recordDisplayName}
            </div>
            
            {/* Image Selection Grid */}
            <ImageGrid
                recordId={record.id}
                images={inputImages}
                selectedImages={getSelectedImagesForRecord(record.id)}
                onSelectImage={selectImageForRecord}
                processingRecordId={processingRecordId}
            />

            <div className="record-meta">
                📎 Total Images: {inputImages.length}
                {hasOutputImages && (
                    <span>
                        {' • '}📎 Output: {existingOutputImages.length} image{existingOutputImages.length !== 1 ? 's' : ''} 
                        {appendMode ? ' (will add more)' : ' (will replace)'}
                    </span>
                )}
            </div>
            
            {/* Upscale Factor Selector */}
            <UpscaleFactorSelector
                selectedAction={selectedAction}
                uiFactors={uiFactors}
                currentFactor={currentUpscaleFactor}
                onFactorChange={setUpscaleFactorForRecord}
                recordId={record.id}
                width={width}
                height={height}
                processingRecordId={processingRecordId}
            />
            
            {/* Process Button */}
            <ProcessButton
                selectedAction={selectedAction}
                uiFactors={uiFactors}
                selectedImageIndex={selectedImageIndex}
                processingRecordId={processingRecordId}
                recordId={record.id}
                onProcess={onProcess}
                record={record}
            />
        </div>
    );
} 