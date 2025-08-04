import { CurrentSelectionProps } from '../../types/index';

export function CurrentSelection({ selectedAction }: CurrentSelectionProps): JSX.Element {
    const getSelectionText = () => {
        if (!selectedAction) {
            return "⚠️ No operation selected - please choose above";
        }
        
        switch (selectedAction) {
            case "remove_bg":
                return "🎭 Remove Background";
            case "upscale":
                return "🔍 Upscale Image";
            case "process_both":
                return "🎯 Process Both (BG Remove & Upscale)";
            default:
                return "⚠️ No operation selected - please choose above";
        }
    };

    return (
        <div className="field-container">
            <label className="field-label">
                ✅ Current Selection:
            </label>
            <input
                type="text"
                className="picsart-input picsart-input-readonly"
                value={getSelectionText()}
                readOnly
                placeholder="No operation selected"
            />
        </div>
    );
} 