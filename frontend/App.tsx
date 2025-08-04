import React from 'react';
import { useBase, useRecords, useGlobalConfig, Box } from '@airtable/blocks/ui';
import { AppProvider, useAppContext } from './context/AppContext';
import { ConfigurationContainer } from './containers/ConfigurationContainer';
import { ProcessingContainer } from './containers/ProcessingContainer';
import { useConfiguration } from './hooks/useConfiguration';
import { useAirtableData } from './hooks/useAirtableData';

import { AirtableBase, AirtableGlobalConfig, AirtableTable, AirtableField, AirtableRecord } from './types/index';
import './style.css';

function AppContent(): JSX.Element {
    const base = useBase() as any as AirtableBase;
    const globalConfig = useGlobalConfig() as any as AirtableGlobalConfig;
    const { picsartApiKey } = useConfiguration(globalConfig);
    
    const {
        selectedTableId,
        selectedImageFieldId,
        selectedOutputFieldId
    } = useAppContext();

    const table = selectedTableId ? (base.getTableByIdIfExists(selectedTableId) as any as AirtableTable) : null;
    const records = (useRecords(table as any) || []) as any as AirtableRecord[];

    const imageField = table && selectedImageFieldId ? (table.getFieldByIdIfExists(selectedImageFieldId) as any as AirtableField) : null;
    const outputField = table && selectedOutputFieldId ? (table.getFieldByIdIfExists(selectedOutputFieldId) as any as AirtableField) : null;

    // Initialize Airtable data hooks
    useAirtableData(globalConfig, table, imageField, records);

    // Show table selection if no table is selected
    if (!table) {
        return (
            <Box padding={3} as="div">
                <div className="picsart-main-header">🎨 Picsart BG Remove & Upscale</div>
                <ConfigurationContainer
                    globalConfig={globalConfig}
                    table={table}
                    imageField={imageField}
                    outputField={outputField}
                />
            </Box>
        );
    }

    return (
        <Box padding={3}>
            {/* Header */}
            <div className="picsart-main-header">🎨 Picsart BG Remove & Upscale</div>
            
            {/* Configuration Section */}
            <ConfigurationContainer
                globalConfig={globalConfig}
                table={table}
                imageField={imageField}
                outputField={outputField}
            />
            
            {/* Processing Section */}
            <ProcessingContainer
                base={base}
                globalConfig={globalConfig}
                table={table}
                imageField={imageField}
                outputField={outputField}
                records={records}
                picsartApiKey={picsartApiKey}
            />
        </Box>
    );
}

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App; 