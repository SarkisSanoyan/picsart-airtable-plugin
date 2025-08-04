import { RecordItem } from './RecordItem';
import { AirtableService } from '../../services/airtableService';
import { RecordListProps } from '../../types/index';

export function RecordList({ 
    table, 
    imageField, 
    outputField, 
    records, 
    onProcess,
    base,
    globalConfig
}: RecordListProps): JSX.Element | null {
    if (!table || !imageField || !outputField) {
        return null;
    }

    const airtableService = new AirtableService(base, globalConfig);
    
    const recordsWithImages = airtableService.getRecordsWithImages(records, imageField);
    const recordsWithoutImages = airtableService.getRecordsWithoutImages(records, imageField);

    if (records.length === 0) {
        return (
            <div className="picsart-info">
                📋 No records found in this table.
            </div>
        );
    }

    return (
        <>
            <br />
            {recordsWithImages.length === 0 && records.length > 0 && (
                <div className="picsart-info">
                    🖼️ No records with images found in the selected image field.
                    <br />
                    <small>Total records: {records.length}, Records with images: 0</small>
                </div>
            )}
            
            {recordsWithImages.length > 0 && (
                <div className="picsart-section-header">
                    🖼️ Records with Images ({recordsWithImages.length}{records.length > recordsWithImages.length ? ` of ${records.length}` : ''})
                </div>
            )}
            
            {recordsWithImages.map(record => (
                <RecordItem
                    key={record.id}
                    record={record}
                    table={table}
                    imageField={imageField}
                    outputField={outputField}
                    onProcess={onProcess}
                />
            ))}
        </>
    );
} 