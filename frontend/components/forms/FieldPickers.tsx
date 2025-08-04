import { FieldPicker } from '@airtable/blocks/ui';
import { ImageFieldPickerProps, OutputFieldPickerProps } from '../../types/index';

export function ImageFieldPicker({ table, field, onChange }: ImageFieldPickerProps): JSX.Element {
    return (
        <div className="field-container">
            <label className="field-label">🖼️ Image Field:</label>
            <FieldPicker
                table={table as any}
                field={field as any}
                onChange={onChange as any}
                allowedTypes={['multipleAttachments'] as any}
            />
        </div>
    );
}

export function OutputFieldPicker({ table, field, onChange }: OutputFieldPickerProps): JSX.Element {
    return (
        <div className="field-container">
            <label className="field-label">💾 Output Field:</label>
            <FieldPicker
                table={table as any}
                field={field as any}
                onChange={onChange as any}
                allowedTypes={['multipleAttachments'] as any}
            />
        </div>
    );
} 