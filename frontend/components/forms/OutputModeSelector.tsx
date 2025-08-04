import { Switch } from '@airtable/blocks/ui';
import { OutputModeSelectorProps } from '../../types/index';

export function OutputModeSelector({ appendMode, onChange }: OutputModeSelectorProps): JSX.Element {
    return (
        <div className="field-container">
            <label className="field-label">
                Output Mode:
            </label>
            <label className={`picsart-checkbox ${appendMode ? 'checked' : 'unchecked'}`}>
                <Switch
                    value={appendMode}
                    onChange={onChange}
                    label="Append Mode is enabled"
                    width="100%"
                />
                <span className={`checkbox-note ${appendMode ? 'note-success' : 'note-warning'}`}>
                    {appendMode ? "✅ Will ADD to existing" : "⚠️ Will REPLACE all existing"}
                </span>
            </label>
        </div>
    );
} 