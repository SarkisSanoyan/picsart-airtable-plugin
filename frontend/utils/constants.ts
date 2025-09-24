import { ProcessingActionOption, ApiConfig, UpscaleFactorLimit, MaxOutputDimensions } from '../types/index';

export const PICSART_API_KEY: string = 'YOUR_PICSART_API_KEY';

export const PROCESSING_ACTIONS: ProcessingActionOption[] = [
    {value: "remove_bg", label: "🎭 Remove BG"},
    {value: "upscale", label: "🔍 Upscale"},
    {value: "process_both", label: "🎯 Both"}
];

export const API_CONFIG: ApiConfig = {
    MAX_RETRIES: 5,
    BASE_TIMEOUT: 10000,
    PROGRESSIVE_TIMEOUT_INCREMENT: 5000,
    MAX_TIMEOUT: 60000,
    RATE_LIMIT_WAIT: {
        INITIAL: 1000,
        MAX: 15000
    },
    ENDPOINTS: {
        REMOVE_BG: "https://api.picsart.io/tools/1.0/removebg",
        UPSCALE: "https://api.picsart.io/tools/1.0/upscale"
    }
};

export const UPSCALE_FACTOR_LIMITS: UpscaleFactorLimit[] = [
    { factor: 2, maxWidth: 2000, maxHeight: 2000 },
    { factor: 4, maxWidth: 1024, maxHeight: 1024 },
    { factor: 6, maxWidth: 800, maxHeight: 800 },
    { factor: 8, maxWidth: 600, maxHeight: 600 }
];

export const MAX_OUTPUT_DIMENSIONS: MaxOutputDimensions = {
    WIDTH: 4800,
    HEIGHT: 4800
};

export const UI_UPSCALE_FACTORS: number[] = [2, 4, 8]; 
