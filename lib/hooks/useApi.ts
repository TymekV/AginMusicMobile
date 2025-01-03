import { useMemo } from 'react';
import { useServer } from './useServer';
import axios from 'axios';
import { useSubsonicParams } from './useSubsonicParams';

export function useApi() {
    const { server } = useServer();
    const params = useSubsonicParams();

    const api = useMemo(() => {
        return params != null ? axios.create({
            baseURL: `${server.url}/rest/`,
            params,
        }) : null
    }, [server, params]);

    return api;
}