import { useState, useEffect, useMemo } from 'react';
import { generateSubsonicToken } from '../util';
import { useServer } from './useServer';
import config from '../constants/config';

export type SubsonicParams = {
    /** Client name */
    c: string;

    /** Username */
    u: string;

    /** Token (salted MD5 hash of the password) */
    t: string;

    /** Salt used in the token */
    s: string;

    /** Protocol version */
    v: string;

    /** Format */
    f: string;
} | null;

export function useSubsonicParams(): SubsonicParams {
    const { server } = useServer();
    const [tokenData, setTokenData] = useState<{ salt: string, hash: string } | null>(null);

    useEffect(() => {
        (async () => {
            console.log('generasted token');
            console.log({ server });

            if (!server.auth.username || !server.auth.password) return;

            const { salt, hash } = await generateSubsonicToken(server.auth.password);

            setTokenData({ salt, hash });
        })();
    }, [server]);

    const params = useMemo(() => ({
        c: `${config.clientName}/${config.clientVersion}`,
        f: 'json',
        v: config.protocolVersion,
        u: server.auth.username ?? '',
        t: tokenData?.hash ?? '',
        s: tokenData?.salt ?? '',
    }), [server, tokenData]);

    if (!tokenData) return null;
    return params;
}