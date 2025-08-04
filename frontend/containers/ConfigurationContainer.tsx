import React, { JSX } from 'react';
import { TablePicker } from '@airtable/blocks/ui';
import { ImageFieldPicker, OutputFieldPicker } from '../components/forms/FieldPickers';
import { ActionSelector } from '../components/forms/ActionSelector';
import { CurrentSelection } from '../components/forms/CurrentSelection';
import { OutputModeSelector } from '../components/forms/OutputModeSelector';
import { useAppContext } from '../context/AppContext';
import { ConfigurationContainerProps } from '../types/index';

export function ConfigurationContainer({ 
    globalConfig, 
    table, 
    imageField, 
    outputField 
}: ConfigurationContainerProps): JSX.Element {
    const {
        selectedAction,
        appendMode,
        setSelectedTableId,
        setSelectedImageFieldId,
        setSelectedOutputFieldId,
        setSelectedAction,
        setAppendMode
    } = useAppContext();

    const handleTableChange = (newTable: any) => {
        const tableId = newTable ? newTable.id : null;
        globalConfig.setAsync("selectedTableId", tableId);
        setSelectedTableId(tableId);
    };

    const handleImageFieldChange = (newField: any) => {
        const fieldId = newField ? newField.id : null;
        globalConfig.setAsync("selectedImageFieldId", fieldId);
        setSelectedImageFieldId(fieldId);
    };

    const handleOutputFieldChange = (newField: any) => {
        const fieldId = newField ? newField.id : null;
        globalConfig.setAsync("selectedOutputFieldId", fieldId);
        setSelectedOutputFieldId(fieldId);
    };

    return (
        <>
            {/* Table Picker */}
            <div className="picsart-card">
                <div className="field-container">
                    <label className="field-label">📋 Select Table:</label>
                    <TablePicker
                        table={table as any}
                        onChange={handleTableChange}
                    />
                </div>
                
                {table && (
                    <>
                        {/* Image Field Picker */}
                        <ImageFieldPicker
                            table={table}
                            field={imageField}
                            onChange={handleImageFieldChange}
                        />
                        
                        {/* Output Field Picker */}
                        <OutputFieldPicker
                            table={table}
                            field={outputField}
                            onChange={handleOutputFieldChange}
                        />
                    </>
                )}
            </div>
            
            {table && imageField && outputField && (
                <div className="picsart-card">
                    <ActionSelector
                        value={selectedAction}
                        onChange={setSelectedAction}
                    />
                    
                    <CurrentSelection selectedAction={selectedAction} />
                    
                    {/* Output Mode */}
                    <OutputModeSelector
                        appendMode={appendMode}
                        onChange={setAppendMode}
                    />
                </div>
            )}
        </>
    );
} 