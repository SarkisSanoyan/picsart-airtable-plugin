import { useEffect } from 'react';
import { PICSART_API_KEY } from '../utils/constants';
import { UseConfigurationReturn, AirtableGlobalConfig } from '../types/index';

export function useConfiguration(globalConfig: AirtableGlobalConfig): UseConfigurationReturn {
    useEffect(() => {
        const currentApiKey = globalConfig.get("picsartApiKey");
        if (!currentApiKey) {
            globalConfig.setAsync("picsartApiKey", PICSART_API_KEY);
        }
    }, [globalConfig]);

    const picsartApiKey: string = globalConfig.get("picsartApiKey");

    return {
        picsartApiKey
    };
} 