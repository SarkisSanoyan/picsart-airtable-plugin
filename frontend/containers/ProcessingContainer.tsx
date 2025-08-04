import { JSX } from 'react';
import { RecordList } from '../components/record/RecordList';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useAppContext } from '../context/AppContext';
import { ProcessingContainerProps, AirtableRecord } from '../types/index';

export function ProcessingContainer({ 
    base,
    globalConfig,
    table, 
    imageField, 
    outputField, 
    records,
    picsartApiKey
}: ProcessingContainerProps): JSX.Element {
    const { processingStatus } = useAppContext();
    const { processImage } = useImageProcessing(base, globalConfig, table, imageField, outputField);

    const handleProcess = (record: AirtableRecord): void => {
        processImage(record, picsartApiKey);
    };

    // Show info messages when conditions aren't met
    if (!table) {
        return (
            <div className="picsart-info">
                👋 Please select a table to get started.
            </div>
        );
    }

    if (!imageField) {
        return (
            <div className="picsart-info">
                🖼️ Please select an image field.
            </div>
        );
    }

    if (!outputField) {
        return (
            <div className="picsart-info">
                💾 Please select an output field.
            </div>
        );
    }

    return (
        <>
            {/* Processing Status */}
            {processingStatus && (
                <div className="processing-status">
                    {processingStatus}
                </div>
            )}
            
            {/* Record List */}
            <RecordList
                table={table}
                imageField={imageField}
                outputField={outputField}
                records={records}
                onProcess={handleProcess}
                base={base}
                globalConfig={globalConfig}
            />
        </>
    );
} 