import { useCallback } from 'react';
import { useServer } from './useServer';
import { useSubsonicParams } from './useSubsonicParams';
import qs from 'qs';

export type CoverOptions = {
    size?: number;
}

export function useCoverBuilder() {
    const { server } = useServer();
    const params = useSubsonicParams();

    const generateUrl = useCallback((id: string, options?: CoverOptions) => `${server.url}/rest/getCoverArt?${qs.stringify({ id, ...params, ...(options?.size ? { size: options?.size } : {}) })}`, [server.url, params]);

    return { generateUrl, params };
}