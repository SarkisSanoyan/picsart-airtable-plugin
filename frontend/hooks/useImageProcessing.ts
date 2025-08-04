import { useCallback, useMemo } from 'react';
import { PicsartAPIService } from '../services/picsartAPI';
import { AirtableService } from '../services/airtableService';
import { urlToBlob } from '../services/imageService';
import { calculateSafeUpscaleFactors, getUIUpscaleFactors, getRecordDisplayName } from '../utils/imageUtils';
import { useAppContext } from '../context/AppContext';
import { 
    UseImageProcessingReturn, 
    AirtableBase, 
    AirtableGlobalConfig, 
    AirtableTable, 
    AirtableField, 
    AirtableRecord 
} from '../types/index.js';
import { useConfiguration } from './useConfiguration';

export function useImageProcessing(
    base: AirtableBase, 
    globalConfig: AirtableGlobalConfig, 
    table: AirtableTable | null, 
    imageField: AirtableField | null, 
    outputField: AirtableField | null
): UseImageProcessingReturn {
    const {
        selectedAction,
        appendMode,
        getSelectedImageIndexForRecord,
        getUpscaleFactorForRecord,
        setProcessingRecordId,
        setProcessingStatus
    } = useAppContext();
    const { picsartApiKey } = useConfiguration(globalConfig);

    const picsartService = useMemo(() => new PicsartAPIService(picsartApiKey), [picsartApiKey]);
    const airtableService = useMemo(() => new AirtableService(base, globalConfig), [base, globalConfig]);

    const processImage = useCallback(async (record: AirtableRecord): Promise<void> => {
        if (!selectedAction) {
            alert("Please select an action first.");
            return;
        }
        
        if (!imageField || !outputField || !table) {
            alert("Please select both image and output fields first.");
            return;
        }
        
        const attachments = record.getCellValue(imageField);
        if (!attachments || attachments.length === 0) {
            alert("No image found in the selected field.");
            return;
        }

        const selectedImageIndex = getSelectedImageIndexForRecord(record.id);
        if (selectedImageIndex === null) {
            alert("Please select an image to process.");
            return;
        }
        console.log("Selected image index:", selectedImageIndex);

        setProcessingRecordId(record.id);
        setProcessingStatus("🚀 Starting image processing...");

        try {
            const recordDisplayName = getRecordDisplayName(record, attachments, selectedImageIndex, table);

            console.log(`🎨 [PICSART] Starting ${selectedAction} for record:`, recordDisplayName);
            console.log(`🎨 [PICSART] Processing ${selectedImageIndex + 1} selected image`);

            const existingAttachments = appendMode ? (record.getCellValue(outputField) || []) : [];
            const newAttachments = [...existingAttachments];

            // Process the selected image
            const imageIndex = selectedImageIndex;
            const currentImage = attachments[imageIndex];
            const imageUrl = currentImage.url;
            const width = currentImage.width;
            const height = currentImage.height;
            
            console.log(`🎨 [PICSART] Processing image ${imageIndex + 1}:`, imageUrl);
            const imageName = currentImage.filename;
            if (imageName) {
                console.log(`🎨 [PICSART] Image filename: ${imageName}`);
            }
            console.log('Image dimensions:', width, 'x', height);
            
            const safeFactors = calculateSafeUpscaleFactors(width, height);
            console.log('===== UPSCALE FACTOR =====');
            console.log('Safe upscale factors:', safeFactors);
            
            const uiFactors = getUIUpscaleFactors(safeFactors);
            const selectedUpscaleFactor = getUpscaleFactorForRecord(record.id, uiFactors);
            console.log('🔍 Selected upscale factor:', selectedUpscaleFactor);
            setProcessingStatus(`📥 Processing "${recordDisplayName}" - Image ${imageIndex + 1} - Downloading...`);

            // Download the image from the URL
            const imageBlob = await urlToBlob(imageUrl, setProcessingStatus);

            // Process both operations IN PARALLEL
            if (selectedAction === "process_both") {
                const [removeBgUrl, upscaleUrl] = await Promise.all([
                    picsartService.callPicsartAPI(imageBlob, "remove_bg", selectedUpscaleFactor || 2, setProcessingStatus),
                    uiFactors.length > 0
                        ? picsartService.callPicsartAPI(imageBlob, "upscale", selectedUpscaleFactor || 2, setProcessingStatus)
                        : null
                ]);
            
                const urls: string[] = [];
                if (removeBgUrl) urls.push(removeBgUrl);
                if (upscaleUrl) urls.push(upscaleUrl);
            
                const downloadedUrls = await Promise.all(
                    // Download the processed images from the URLs
                    urls.map((url) => picsartService.downloadProcessedImage(url, setProcessingStatus))
                );
            
                downloadedUrls.forEach((url) => {
                    newAttachments.push({ url });
                });
            }   else {
                setProcessingStatus(`🎨 Processing "${recordDisplayName}" - Image ${imageIndex + 1} - ${selectedAction === "remove_bg" ? "Removing background" : "Upscaling"}...`);
                const processedImageUrl = await picsartService.callPicsartAPI(imageBlob, selectedAction, selectedAction === "upscale" ? (selectedUpscaleFactor || 2) : 2, setProcessingStatus);
                await picsartService.downloadProcessedImage(processedImageUrl, setProcessingStatus);
                newAttachments.push({url: processedImageUrl});
                console.log(`✅ [PICSART] ${selectedAction} completed for image ${imageIndex + 1}`);
            }

            setProcessingStatus(`💾 Processing "${recordDisplayName}" - Saving to Airtable...`);
            console.log('💾 [PICSART] Updating Airtable record with processed images');
            console.log('📎 [PICSART] Total attachments to save:', newAttachments.length);
            
            await airtableService.updateRecord(table, record.id, {
                [outputField.id]: newAttachments
            });

            setProcessingStatus(`✅ "${recordDisplayName}" completed successfully! Processed ${selectedImageIndex + 1} image.`);
            console.log('✅ [PICSART] Processing completed successfully');
            
            setTimeout(() => setProcessingStatus(""), 2000);

        } catch (error: unknown) {
            const errorInstance = error instanceof Error ? error : new Error(String(error));
            console.error("❌ [PICSART] Processing failed:", errorInstance);
            setProcessingStatus("❌ Failed - check console");
            
            if (errorInstance.message.includes("Rate limit")) {
                alert("Rate limit exceeded. Please wait a few minutes before trying again.");
            } else if (errorInstance.message.includes("quota")) {
                alert("API quota exceeded. Please check your Picsart account.");
            } else if (errorInstance.message.includes("Invalid API key")) {
                alert("Invalid API key. Please check the configuration.");
            } else if (errorInstance.message.includes("network") || errorInstance.message.includes("timeout")) {
                alert("Network error. Please check your connection and try again.");
            } else {
                alert(`Error processing image: ${errorInstance.message}`);
            }
            
            setTimeout(() => setProcessingStatus(""), 5000);
        } finally {
            setProcessingRecordId(null);
        }
    }, [selectedAction, appendMode, imageField, outputField, table, base, globalConfig, getSelectedImageIndexForRecord, getUpscaleFactorForRecord, setProcessingRecordId, setProcessingStatus]);

    return {
        processImage
    };
} 