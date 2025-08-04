import React from 'react';
import { Select } from '@airtable/blocks/ui';
import { UpscaleFactorSelectorProps } from '../../types/index';

export function UpscaleFactorSelector({ 
    selectedAction,
    uiFactors, 
    currentFactor, 
    onFactorChange, 
    recordId,
    width,
    height,
    processingRecordId 
}: UpscaleFactorSelectorProps): JSX.Element | null {
    if (selectedAction !== "upscale" && selectedAction !== "process_both") {
        return null;
    }

    return (
        <div className="upscale-factor-container">
            <label className="upscale-factor-label">
                🔍 Upscale Factor:
            </label>
            {uiFactors.length > 0 ? (
                <div className="picsart-select-wrapper">
                    <Select
                        className="picsart-select upscale-factor-select"
                        options={uiFactors.map(factor => ({
                            value: factor,
                            label: `${factor}x${factor === 2 ? ' (Recommended)' : factor === 4 ? ' (High Quality)' : ' (Maximum)'}`
                        }))}
                        value={currentFactor}
                        onChange={(newFactor: any) => onFactorChange(recordId, newFactor as number)}
                        disabled={processingRecordId !== null}
                    />
                </div>
            ) : (
                <div className="upscale-factor-unavailable">
                    ⚠️ No safe upscale factors available
                    <div className="upscale-factor-reason">
                        Image dimensions ({width}×{height}px) are too high for safe upscaling.
                        <br />
                        {selectedAction === "upscale" && (
                            <span><strong>Upscale button will be disabled.</strong></span>
                        )}
                        {selectedAction === "process_both" && (
                            <span><strong>Only background removal will be performed.</strong></span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 