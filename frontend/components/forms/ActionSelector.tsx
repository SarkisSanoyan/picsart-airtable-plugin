import { SelectButtons } from '@airtable/blocks/ui';
import { PROCESSING_ACTIONS } from '../../utils/constants';
import { ActionSelectorProps } from '../../types/index';

export function ActionSelector({ value, onChange }: ActionSelectorProps): JSX.Element {
    return (
        <div className="field-container">
            <label className="field-label">
                Choose Processing Option:
            </label>
            <div className="picsart-select-wrapper">
                <SelectButtons
                    className="picsart-select"
                    options={PROCESSING_ACTIONS}
                    value={value}
                    onChange={onChange as any}
                />
            </div>
        </div>
    );
} 