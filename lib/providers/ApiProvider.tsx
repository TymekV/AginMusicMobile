import axios, { AxiosInstance } from 'axios';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useServer } from '../hooks';
import { generateSubsonicToken } from '../util';
import config from '../constants/config';

export type Api = AxiosInstance | undefined;

export const ApiContext = createContext<Api>(undefined);

export default function ApiProvider({ children }: { children?: React.ReactNode }) {
    const { server } = useServer();
    const [api, setApi] = useState<Api>(undefined);

    useEffect(() => {
        (async () => {
            console.log({ server });

            if (!server.auth.username || !server.auth.password) return;

            const { salt, hash } = await generateSubsonicToken(server.auth.password);

            const api = axios.create({
                baseURL: `${server.url}/rest/`,
                params: {
                    c: `${config.clientName}/${config.clientVersion}`,
                    f: 'json',
                    v: config.protocolVersion,
                    u: server.auth.username,
                    t: hash,
                    s: salt,
                }
            });

            setApi(api);
        })();
    }, [server]);

    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    )
}