import { 
    AirtableServiceInterface,
    AirtableBase,
    AirtableGlobalConfig,
    AirtableTable,
    AirtableRecord,
    AirtableField
} from '../types/index';

export class AirtableService implements AirtableServiceInterface {
    private base: AirtableBase;
    private globalConfig: AirtableGlobalConfig;

    constructor(base: AirtableBase, globalConfig: AirtableGlobalConfig) {
        this.base = base;
        this.globalConfig = globalConfig;
    }

    async updateRecord(
        table: AirtableTable, 
        recordId: string, 
        fields: Record<string, any>
    ): Promise<void> {
        return table.updateRecordAsync(recordId, fields);
    }

    getRecordsWithImages(records: AirtableRecord[], imageField: AirtableField): AirtableRecord[] {
        return records.filter(record => {
            const inputImages = record.getCellValue(imageField);
            return inputImages && inputImages.length > 0;
        });
    }

    getRecordsWithoutImages(records: AirtableRecord[], imageField: AirtableField): AirtableRecord[] {
        return records.filter(record => {
            const inputImages = record.getCellValue(imageField);
            return !inputImages || inputImages.length === 0;
        });
    }
} 