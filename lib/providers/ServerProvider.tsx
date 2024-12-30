import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import { fixUrl, generateSubsonicToken } from '@lib/util';
import { BaseResponse, DiscoverServerResult, OpenSubsonicExtensions } from '@lib/types';
import config from '../constants/config';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    saveAndTestPasswordCredentials: (url: string, username: string, password: string) => Promise<void>;
}

const initialServerContext: ServerContextType = {
    server: initialServer,
    discoverServer: () => { },
    saveAndTestPasswordCredentials: async () => { }
}

export const ServerContext = createContext<ServerContextType>(initialServerContext);

export default function ServerProvider({ children }: { children?: React.ReactNode }) {
    const [server, setServer] = useState<Server>(initialServer);

    useEffect(() => {
        if (server.url == '') return;
        (async () => {
            try {
                if (server?.auth?.password) {
                    await SecureStore.setItemAsync('password', server.auth.password);
                }

                const { auth, ...rest } = server || {};
                const serverObject = { ...rest, auth: { ...auth, password: undefined, apiKey: undefined } };

                await AsyncStorage.setItem('server', JSON.stringify(serverObject));
            } catch (error) {
                console.error('Error saving server data:', error);
            }
        })();
    }, [server]);

    useEffect(() => {
        (async () => {
            try {
                let updatedServer = { ...initialServer };

                const serverStored = await AsyncStorage.getItem('server');
                if (serverStored) {
                    const serverInfo = JSON.parse(serverStored);
                    updatedServer = { ...updatedServer, ...serverInfo };
                }

                console.log('stored', serverStored);

                const storedPassword = await SecureStore.getItemAsync('password');
                if (storedPassword) {
                    updatedServer.auth = { ...updatedServer.auth, password: storedPassword };
                }

                setServer(updatedServer);
            } catch (error) {
                console.error('Error loading server data:', error);
            }
        })();
    }, []);


    const discoverServer = useCallback(async (url: string): Promise<DiscoverServerResult> => {
        let correctUrl = '';
        let authMethod: Server['authMethod'] = '';
        try {
            correctUrl = fixUrl(url);

            const rawRes = await axios.get(`${correctUrl}/rest/getOpenSubsonicExtensions`, {
                params: {
                    c: `${config.clientName}/${config.clientVersion}`,
                    f: 'json',
                    v: config.protocolVersion,
                }
            });

            const res = rawRes.data['subsonic-response'] as (BaseResponse & { openSubsonicExtensions: OpenSubsonicExtensions[] });

            if (res.status != 'ok' && res.status != 'failed') {
                if (res.status == 'failed') {
                    // Server rejects /getOpenSubsonicExtensions but still returns a valid response
                    authMethod = 'saltedPassword';
                }
                return {
                    success: false,
                    error: 0,
                    url: correctUrl,
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

            authMethod = res.openSubsonicExtensions?.find(e => e.name == 'apiKeyAuthentication') ? 'apiKey' : 'saltedPassword';

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
                url: correctUrl,
            }
        } catch (error) {
            console.error(error);
            return {
                success: false,
                error: 'ERR_SERVER_UNREACHABLE',
                url: correctUrl,
            }
        }
    }, []);

    const saveAndTestPasswordCredentials = useCallback(async (url: string, username: string, password: string) => {
        // TODO: Add error handling
        console.log(server.url);
        const { salt, hash } = await generateSubsonicToken(password);
        console.log('TESTING1', username, password, salt, hash, server.url);

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
            if (res.status != 'ok') return console.log('server returnred error', res);
            console.log('ok');

            setServer(s => ({ ...s, auth: { ...s.auth, username, password } }));
        } catch (error) {
            console.log('data', (error as any).response.data);

            console.log('fbghdfgfgdfghdfghsdf', error, {
                c: `${config.clientName}/${config.clientVersion}`,
                f: 'json',
                v: config.protocolVersion,
                u: username,
                t: hash,
                s: salt,
            });
        }
    }, [server.url]);

    return (
        <ServerContext.Provider value={{ server, discoverServer, saveAndTestPasswordCredentials }}>
            {children}
        </ServerContext.Provider>
    )
}