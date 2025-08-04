import React from 'react';
import { ImageGridProps } from '../../types/index';

export function ImageGrid({ 
    recordId, 
    images, 
    selectedImages, 
    onSelectImage, 
    processingRecordId 
}: ImageGridProps): JSX.Element {
    return (
        <div className="image-selection-container">
            <div className="image-selection-header">
                🖼️ Select Image to Process ({images.length} available):
            </div>
            
            <div className="image-selection-grid">
                {images.map((image, index) => {
                    const isSelected = selectedImages.includes(index);
                    return (
                        <div 
                            key={index} 
                            className={`image-selection-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => processingRecordId === null && onSelectImage(recordId, index)}
                        >
                            <div className="image-checkbox">
                                <input 
                                    type="radio" 
                                    name={`image-selection-${recordId}`}
                                    checked={isSelected}
                                    onChange={() => onSelectImage(recordId, index)}
                                    disabled={processingRecordId !== null}
                                />
                            </div>
                            <img 
                                src={image.url} 
                                alt={`Image ${index + 1}`}
                                className="selection-image-preview"
                                loading="lazy"
                                onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    target.src = image.url;
                                }}
                            />
                            <div className="image-info">
                                <div className="image-number">#{index + 1}</div>
                                {image.width && image.height && (
                                    <div className="image-dimensions">{image.width}×{image.height}px</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 