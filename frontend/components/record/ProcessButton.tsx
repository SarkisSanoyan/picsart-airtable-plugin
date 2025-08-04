import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ProcessButtonProps } from '../../types/index';

export function ProcessButton({ 
    selectedAction,
    uiFactors,
    selectedImageIndex,
    processingRecordId,
    recordId,
    onProcess,
    record
}: ProcessButtonProps): JSX.Element {
    const isProcessing = processingRecordId === recordId;
    const isWaiting = processingRecordId && processingRecordId !== recordId;
    const noImageSelected = selectedImageIndex === null;
    const upscaleUnavailable = selectedAction === "upscale" && uiFactors.length === 0;
    const isDisabled = !selectedAction || processingRecordId !== null || upscaleUnavailable || noImageSelected;

    const getButtonText = () => {
        if (isProcessing) {
            return (
                <>
                    <LoadingSpinner style={{marginRight: '8px'}} />
                    Processing...
                </>
            );
        }
        
        if (isWaiting) {
            return <>⏳ Waiting...</>;
        }
        
        if (noImageSelected) {
            return <>📋 Select Image First</>;
        }
        
        if (upscaleUnavailable) {
            return <>⚠️ Upscale Unavailable</>;
        }
        
        if (!selectedAction) {
            return <>Select Action</>;
        }
        
        const operationText = selectedAction === "remove_bg" ? "Remove BG" : 
                             selectedAction === "upscale" ? "Upscale" : 
                             selectedAction === "process_both" && uiFactors.length === 0 ? "Remove BG Only" :
                             "Both Operations";
        
        return (
            <>
                Process Image #{selectedImageIndex + 1}{' '}
                <span>({operationText})</span>
            </>
        );
    };

    const getButtonClass = () => {
        let className = `picsart-button ${selectedAction ? selectedAction.replace('_', '-') : 'no-action'}`;
        
        if (isWaiting) className += ' waiting';
        if (upscaleUnavailable) className += ' disabled-unsafe';
        if (noImageSelected) className += ' disabled-no-selection';
        
        return className;
    };

    return (
        <button
            className={getButtonClass()}
            onClick={() => onProcess(record)}   // Flow: flows back to ProcessingContainer.handleProcess → processImage from useImageProcessing hook
            disabled={isDisabled}
        >
            {getButtonText()}
        </button>
    );
} 