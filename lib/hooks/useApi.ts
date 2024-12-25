import { useEffect, useMemo, useState } from 'react';
import { useServer } from './useServer';
import axios from 'axios';
import { generateSubsonicToken } from '../util';
import config from '../constants/config';
import { useSubsonicParams } from './useSubsonicParams';

export function useApi() {
    const { server } = useServer();
    const params = useSubsonicParams();

    const api = useMemo(() => params != null ? axios.create({
        baseURL: `${server.url}/rest/`,
        params,
    }) : null, [server, params]);

    return api;
}