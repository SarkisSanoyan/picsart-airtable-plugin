import { ProcessingActionOption, ApiConfig, UpscaleFactorLimit, MaxOutputDimensions } from '../types/index';

export const PICSART_API_KEY: string = 'eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtYzFhYTg5ODAtODBmNi00ZWZjLTkwZTAtOThiMjljNjEyNzdlIiwiYXVkIjoiNDY4NTc2NzQwMDExMTAxIiwibmJmIjoxNzQ0NjM1ODc2LCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiNDY4NTc2NzQwMDExMTAxIiwiaWF0IjoxNzQ0NjM1ODc2LCJqdGkiOiIzNWNmZTJhNi0xNDczLTRkMmYtYTU0Ny02ZGI5ZDY5M2E5MDMifQ.C8_KvtOLyimxRQYdA7yQO8LHZnjCqFBrogq0C09I7saQgaRxvS8cl2jHzMVhiCqQ4xXDNwGfgjIViUOxObtwzsGcfw3vy_YMjAiWMxEo0DP3J1IhqvLN5rAzSZMDZcY-FX2vqXDH2JZber3LunsevRm3DjSpwJJ2fysmgh_reqIH4Nujf8gn1yMRkNe43cZgPKTc0vbDicCf7uHZsk7Fe8t8sV-S9MGMrLO_pICGgSweuAp5hNI0bkNGRwApKrZdVaF8CpmSAjwvlrtdVBEyrkBQOB2kIKm0SiYw9kV-Wm9hcinn2B14yCfPMVEftBZiPYYHmJNi3jKq905VGMHs_g';

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