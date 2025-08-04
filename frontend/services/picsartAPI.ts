import { API_CONFIG } from '../utils/constants';
import { getProgressiveTimeout, getRateLimitWaitTime, fetchWithTimeout } from '../utils/timeoutUtils';
import { 
    PicsartAPIServiceInterface, 
    ProcessingAction,
    PicsartAPIResponse 
} from '../types/index';

export class PicsartAPIService implements PicsartAPIServiceInterface {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async callPicsartAPI(
        imageBlob: Blob, 
        action: ProcessingAction, 
        upscaleFactor: number = 2, 
        setProcessingStatus: (status: string) => void
    ): Promise<string> {
        const maxRetries = API_CONFIG.MAX_RETRIES;
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                setProcessingStatus(`🔄 ${action === "remove_bg" ? "Removing background" : "Upscaling image"} (attempt ${attempt}/${maxRetries})...`);
                console.log(`🔄 [PICSART] ${action} API attempt ${attempt}/${maxRetries}...`);

                const formData = new FormData();
                
                if (action === "remove_bg") {
                    formData.append('output_type', 'cutout');
                    formData.append('bg_blur', '0');
                    formData.append('scale', 'fit');
                    formData.append('auto_center', 'false');
                    formData.append('stroke_size', '0');
                    formData.append('stroke_color', 'FFFFFF');
                    formData.append('stroke_opacity', '100');
                    formData.append('shadow', 'disabled');
                    formData.append('shadow_opacity', '20');
                    formData.append('shadow_blur', '50');
                    formData.append('format', 'PNG');
                    formData.append('image', imageBlob, 'image.png');
                } else if (action === "upscale") {
                    formData.append('upscale_factor', upscaleFactor.toString());
                    formData.append('format', 'JPG');
                    formData.append('image', imageBlob, 'image.jpg');
                }

                const apiUrl = action === "remove_bg" 
                    ? API_CONFIG.ENDPOINTS.REMOVE_BG
                    : API_CONFIG.ENDPOINTS.UPSCALE;

                const timeout = getProgressiveTimeout(attempt);
                console.log(`🎨 [PICSART] Calling ${action} API with timeout ${timeout}ms...`);

                const response = await fetchWithTimeout(apiUrl, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'X-Picsart-API-Key': this.apiKey,
                    },
                    body: formData
                }, timeout);

                console.log('🎨 [PICSART] Response status:', response.status);

                if (response.ok) {
                    const result: PicsartAPIResponse = await response.json();
                    console.log('✅ [PICSART] API responded with:', result);
                    
                    if (result.status !== 'success' || !result.data || !result.data.url) {
                        throw new Error(`Picsart API error: ${JSON.stringify(result)}`);
                    }
                    
                    return result.data.url;
                }

                if (response.status === 429) {
                    const waitTime = getRateLimitWaitTime(attempt);
                    setProcessingStatus(`⏳ Rate limited, waiting ${Math.round(waitTime/1000)}s before retry...`);
                    console.log(`⏳ [PICSART] API rate limited (429), waiting ${waitTime}ms before retry ${attempt}/${maxRetries}...`);
                    
                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue;
                    }
                    lastError = new Error(`Rate limit exceeded after ${maxRetries} attempts`);
                    break;
                }

                const errorText = await response.text();
                console.error('❌ [PICSART] API failed with status:', response.status, errorText);
                
                if (response.status === 401) {
                    throw new Error(`Invalid API key. Status: ${response.status}`);
                } else if (response.status === 402) {
                    throw new Error(`API quota exceeded. Status: ${response.status}`);
                } else if (response.status >= 500) {
                    // Server errors - retry
                    lastError = new Error(`Server error (${response.status}): ${errorText}`);
                    if (attempt < maxRetries) {
                        const waitTime = attempt <= 2 ? 2000 * attempt : 5000;
                        setProcessingStatus(`⏳ Server error, retrying in ${waitTime/1000}s...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue;
                    }
                } else {
                    throw new Error(`API error (${response.status}): ${errorText}`);
                }

            } catch (error: unknown) {
                lastError = error instanceof Error ? error : new Error(String(error));
                console.error(`❌ [PICSART] API attempt ${attempt} failed:`, lastError.message);
                
                const isNetworkError = lastError.message.includes('timeout') || 
                                     lastError.message.includes('network') ||
                                     lastError.message.includes('fetch');
                
                if (attempt < maxRetries && isNetworkError) {
                    const waitTime = attempt <= 2 ? 500 * attempt : 2000;
                    setProcessingStatus(`⏳ Network error, retrying in ${waitTime/1000}s...`);
                    console.log(`⏳ [PICSART] Network error, waiting ${waitTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else if (attempt === maxRetries) {
                    break;
                }
            }
        }

        console.error('❌ [PICSART] All API attempts failed');
        throw lastError || new Error(`${action} failed after ${maxRetries} attempts`);
    }

    async downloadProcessedImage(
        imageUrl: string, 
        setProcessingStatus: (status: string) => void
    ): Promise<string> {
        const maxRetries = API_CONFIG.MAX_RETRIES;
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                setProcessingStatus(`📥 Downloading processed image (attempt ${attempt}/${maxRetries})...`);
                console.log(`🔄 [PICSART] Download attempt ${attempt}/${maxRetries}...`);

                const timeout = getProgressiveTimeout(attempt);
                const response = await fetchWithTimeout(imageUrl, {}, timeout);

                if (response.ok) {
                    console.log('✅ [PICSART] Image downloaded successfully');
                    return response.url;
                }

                if (response.status === 429) {
                    const waitTime = attempt <= 2 ? 500 * attempt : Math.min(Math.pow(2, attempt - 2) * 2000, 10000);
                    setProcessingStatus(`⏳ CDN rate limited, waiting ${Math.round(waitTime/1000)}s...`);
                    console.log(`⏳ [PICSART] CDN rate limited (429), waiting ${waitTime}ms before retry...`);
                    
                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue;
                    }
                }

                lastError = new Error(`Failed to download processed image: ${response.status}`);
                
            } catch (error: unknown) {
                lastError = error instanceof Error ? error : new Error(String(error));
                console.error(`❌ [PICSART] Download attempt ${attempt} failed:`, lastError.message);
                
                if (attempt < maxRetries) {
                    const waitTime = attempt <= 2 ? 300 * attempt : 1000;
                    setProcessingStatus(`⏳ Download error, retrying in ${waitTime/1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        throw lastError || new Error('Failed to download processed image after retries');
    }
} 