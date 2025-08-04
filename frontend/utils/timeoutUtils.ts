import { API_CONFIG } from './constants';
import { GetProgressiveTimeout, GetRateLimitWaitTime, FetchWithTimeout } from '../types/index';

export const getProgressiveTimeout: GetProgressiveTimeout = (attempt: number): number => {
    return Math.min(API_CONFIG.BASE_TIMEOUT + (attempt * API_CONFIG.PROGRESSIVE_TIMEOUT_INCREMENT), API_CONFIG.MAX_TIMEOUT); 
};

export const getRateLimitWaitTime: GetRateLimitWaitTime = (attempt: number): number => {
    return attempt <= 2 ? 
        API_CONFIG.RATE_LIMIT_WAIT.INITIAL * attempt :  // Fast: 1s, 2s for first attempts
        Math.min(Math.pow(2, attempt - 2) * 3000, API_CONFIG.RATE_LIMIT_WAIT.MAX); // Then: 3s, 6s, 12s max
};

export const fetchWithTimeout: FetchWithTimeout = async (
    url: string, 
    options: RequestInit, 
    timeoutMs: number
): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
        throw error;
    }
}; 