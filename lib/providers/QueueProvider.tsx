import { Child, PlayQueue } from '@lib/types';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useCache } from '@lib/hooks/useCache';
import { useApi, useGlobalPlayer, useServer, useSubsonicParams } from '@lib/hooks';
import qs from 'qs';
import { useCoverBuilder } from '../hooks/useCoverBuilder';

export type QueueContextType = {
    queue: PlayQueue;
    nowPlaying: Child;
    add: (id: string) => Promise<void>;
    clear: () => Promise<void>;
}

const initialQueue: PlayQueue = {
    changed: new Date(0),
    changedBy: '',
    current: 0,
    position: 0,
    username: '',
    entry: [],
};

const initialQueueContext: QueueContextType = {
    queue: initialQueue,
    nowPlaying: {
        id: '',
        isDir: false,
        title: '',
    },
    add: async (id: string) => { },
    clear: async () => { },
}

export const QueueContext = createContext<QueueContextType>(initialQueueContext);

export type StreamOptions = {
    id: string;
    maxBitRate?: string;
    format?: string;
    timeOffset?: string;
    estimateContentLength?: boolean;
}

export default function QueueProvider({ children }: { children?: React.ReactNode }) {
    const [queue, setQueue] = useState<PlayQueue>(initialQueue);
    const [nowPlaying, setNowPlaying] = useState<Child>(initialQueueContext.nowPlaying);

    const cache = useCache();
    const api = useApi();
    const params = useSubsonicParams();
    const { server } = useServer();
    const player = useGlobalPlayer();
    const cover = useCoverBuilder();

    const generateMediaUrl = useCallback((options: StreamOptions) => `${server.url}/rest/stream?${qs.stringify({ ...params, ...options })}`, [params, server.url]);

    // const playNow = 

    const add = useCallback(async (id: string) => {
        const data = await cache.fetchChild(id);

        if (!data) return;
        setQueue(q => ({ ...q, entry: [...(q?.entry ?? []), data] }));

        if (nowPlaying.id == '') {
            setNowPlaying(data);
        }
    }, [cache, queue, nowPlaying]);

    const clear = useCallback(async () => {
        setQueue(q => ({ ...q }))
    }, []);

    useEffect(() => {
        (async () => {
            // Load queue
            if (!api) return;

            const rawRes = await api.get('/getPlayQueue');
            const queue = rawRes.data?.['subsonic-response']?.playQueue as PlayQueue;
            if (!queue) return console.log('no saved queue');

            if (queue.entry) {
                for (const entry of queue.entry) {
                    await cache.cacheChild(entry);
                }
            }

            setQueue(queue);
        })();
    }, [api, cache]);

    useEffect(() => {
        (async () => {
            // Save queue on the server
            if (!api) return;

            const queueData = queue.entry?.map(x => x.id);
            if (queueData?.length == 0 || !queueData) return;
            console.log('saving', queueData);

            await api.get('/savePlayQueue', {
                params: {
                    id: queueData,
                }
            });
        })();
    }, [api, queue]);

    useEffect(() => {
        (async () => {
            if (!player) return;
            const url = generateMediaUrl({
                id: nowPlaying.id,
            });
            console.log({ url });

            player.replace({ uri: url });
            player.play();
        })();
    }, [nowPlaying, player]);

    return (
        <QueueContext.Provider value={{ queue, add, clear, nowPlaying, }}>
            {children}
        </QueueContext.Provider>
    )
}