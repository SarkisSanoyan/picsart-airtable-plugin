import { UrlToBlob } from '../types/index';

export const urlToBlob: UrlToBlob = async (
    imageUrl: string, 
    setProcessingStatus: (status: string) => void
): Promise<Blob> => {
    setProcessingStatus("📥 Downloading image...");
    console.log('📥 [PICSART] Downloading image from Airtable:', imageUrl);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const blob = await response.blob();
    console.log('📥 [PICSART] Image downloaded, size:', blob.size, 'bytes');
    return blob;
}; 