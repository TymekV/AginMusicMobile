import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import { fixUrl, generateSubsonicToken } from '@lib/util';
import { BaseResponse, DiscoverServerResult, OpenSubsonicExtensions } from '@lib/types';
import config from '../constants/config';
import { useSecureState } from '@lib/hooks/useSecureState';

export type Server = {
    url: string;
    authMethod: '' | 'openid' | 'apiKey' | 'saltedPassword' | 'password';
    auth: {
        username?: string;
        password?: string;
        apiKey?: string;
    };
    version: string;
    extensions: OpenSubsonicExtensions[];
};

const initialServer: Server = {
    url: '',
    authMethod: '',
    auth: {

    },
    version: '',
    extensions: [],
}

export type ServerContextType = {
    server: Server;
    discoverServer: (url: string) => Promise<DiscoverServerResult> | void;
    saveAndTestPasswordCredentials: (username: string, password: string) => Promise<void>;
}

const initialServerContext: ServerContextType = {
    server: initialServer,
    discoverServer: () => { },
    saveAndTestPasswordCredentials: async () => { }
}

export const ServerContext = createContext<ServerContextType>(initialServerContext);

export default function ServerProvider({ children }: { children?: React.ReactNode }) {
    const [server, setServer] = useState<Server>(initialServer);
    const [password, setPassword] = useSecureState('password', '');

    useEffect(() => {
        if (!server.auth.password) return;
        setPassword(server.auth.password);
    }, [server.auth.password]);

    useEffect(() => {
        setServer(s => ({ ...s, auth: { ...s.auth, password } }))
    }, [password]);

    const discoverServer = useCallback(async (url: string): Promise<DiscoverServerResult> => {
        try {
            const correctUrl = fixUrl(url);
            const rawRes = await axios.get(`${correctUrl}/rest/getOpenSubsonicExtensions`, {
                params: {
                    c: `${config.clientName}/${config.clientVersion}`,
                    f: 'json',
                    v: config.protocolVersion,
                }
            });

            const res = rawRes.data['subsonic-response'] as (BaseResponse & { openSubsonicExtensions: OpenSubsonicExtensions[] });
            if (res.status != 'ok') {
                return {
                    success: false,
                    error: 0
                }
            }

            // let authMethod = 'saltedPassword';
            // let serverData:Server = initialServer;
            // if (res.openSubsonicExtensions.find(e => e.name == 'apiKeyAuthentication')) {
            //     // TODO: Implement API Key auth
            //     // authMethod = 'apiKey';
            // } else {
            //     // Assume support for salted passwords
            // }
            // serverData = {
            //     auth: {

            //     }
            // }

            const authMethod = res.openSubsonicExtensions.find(e => e.name == 'apiKeyAuthentication') ? 'apiKey' : 'saltedPassword';

            const serverData: Server = {
                url: correctUrl,
                extensions: res.openSubsonicExtensions,
                version: res.serverVersion,
                authMethod,
                auth: {

                }
            }

            setServer(serverData);

            return {
                success: true,
                server: serverData,
            }
        } catch (error) {
            return {
                success: false,
                error: 'ERR_SERVER_UNREACHABLE',
            }
        }
    }, []);

    const saveAndTestPasswordCredentials = useCallback(async (username: string, password: string) => {
        // TODO: Add error handling
        console.log(server.url);
        const { salt, hash } = await generateSubsonicToken(password);
        try {
            const rawRes = await axios.get(`${server.url}/rest/ping`, {
                params: {
                    c: `${config.clientName}/${config.clientVersion}`,
                    f: 'json',
                    v: config.protocolVersion,
                    u: username,
                    t: hash,
                    s: salt,
                }
            });
            const res = rawRes.data['subsonic-response'] as BaseResponse;
            if (res.status != 'ok') return;

            setServer(s => ({ ...s, auth: { ...s.auth, username, password } }));
        } catch (error) {
            console.log(error);
        }
    }, [server.url]);

    return (
        <ServerContext.Provider value={{ server, discoverServer, saveAndTestPasswordCredentials }}>
            {children}
        </ServerContext.Provider>
    )
}