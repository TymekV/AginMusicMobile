import { Child, PlayQueue } from '@lib/types';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useCache } from '@lib/hooks/useCache';
import { useApi, useGlobalPlayer, useServer, useSubsonicParams } from '@lib/hooks';
import qs from 'qs';
import { useAudioPlayerStatus } from 'expo-audio';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';

export type ClearConfirmOptions = {
    wait?: boolean;
    onConfirm?: () => void;
}

export type QueueContextType = {
    queue: PlayQueue;
    nowPlaying: Child;
    activeIndex: number;
    canGoForward: boolean;
    canGoBackward: boolean;
    setQueue: React.Dispatch<React.SetStateAction<PlayQueue>>;
    add: (id: string) => Promise<void>;
    clear: () => void;
    clearConfirm: (options?: ClearConfirmOptions) => Promise<boolean>;
    jumpTo: (index: number) => void;
    skipBackward: () => void;
    skipForward: () => void;
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
    activeIndex: 0,
    canGoBackward: false,
    canGoForward: false,
    setQueue: () => { },
    add: async (id: string) => { },
    clear: () => { },
    clearConfirm: async () => false,
    jumpTo: (index: number) => { },
    skipBackward: () => { },
    skipForward: () => { },
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
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const canGoBackward = nowPlaying.id != '';
    const canGoForward = activeIndex < (queue.entry?.length ?? 0) - 1;

    const cache = useCache();
    const api = useApi();
    const params = useSubsonicParams();
    const { server } = useServer();
    const player = useGlobalPlayer();
    const status = player ? useAudioPlayerStatus(player) : null;

    const generateMediaUrl = useCallback((options: StreamOptions) => `${server.url}/rest/stream?${qs.stringify({ ...params, ...options })}`, [params, server.url]);

    // const playNow = 

    const add = useCallback(async (id: string) => {
        const data = await cache.fetchChild(id);

        if (!data) return;
        setQueue(q => ({ ...q, entry: [...(q?.entry ?? []), data] }));

        if (nowPlaying.id == '') {
            setNowPlaying(data);
            setActiveIndex(0);
        }
    }, [cache, queue, nowPlaying]);

    const clear = useCallback(async () => {
        setQueue(q => ({ ...q, entry: [] }));
        setActiveIndex(0);
        setNowPlaying(initialQueueContext.nowPlaying);
    }, []);

    const clearConfirm = useCallback(async (options?: ClearConfirmOptions) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const confirmed = await SheetManager.show('confirm', {
            payload: {
                title: 'Clear Queue',
                message: 'Are you sure you want to clear the queue?',
                confirmText: 'Clear',
                cancelText: 'Cancel',
            },
        });
        if (!confirmed) return false;

        if (options?.wait) {
            player?.pause();
            if (options?.onConfirm) options.onConfirm();
            await new Promise(r => setTimeout(r, 500));
        }

        clear();
        return true;
    }, [clear, player]);

    const jumpTo = useCallback((index: number) => {
        console.log('jumping to', index);

        const data = queue.entry?.[index];
        if (!data) return;

        setActiveIndex(index);
        setNowPlaying(data);
    }, [queue.entry]);

    const skipForward = useCallback(() => {
        if (!queue.entry) return;

        const nextIndex = queue.entry.findIndex(x => x.id == nowPlaying.id) + 1;
        jumpTo(nextIndex);
    }, [jumpTo, queue.entry, nowPlaying]);

    const skipBackward = useCallback(() => {
        if (!queue.entry) return;

        if ((status?.currentTime && status.currentTime > 5000) || activeIndex == 0) {
            player?.seekTo(0);
            return;
        }

        const prevIndex = queue.entry.findIndex(x => x.id == nowPlaying.id) - 1;
        jumpTo(prevIndex);
    }, [jumpTo, queue.entry, nowPlaying, status, activeIndex]);

    useEffect(() => {
        if (!queue.entry) return;
        const index = queue.entry.findIndex(x => x.id == nowPlaying.id);
        setActiveIndex(index);
    }, [queue.entry, nowPlaying.id]);

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
    }, [!!api, !!cache]);

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
    }, [!!api, !!queue]);

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
        <QueueContext.Provider value={{
            queue,
            nowPlaying,
            canGoBackward,
            canGoForward,
            activeIndex,
            add,
            clear,
            setQueue,
            jumpTo,
            skipBackward,
            skipForward,
            clearConfirm,
        }}>
            {children}
        </QueueContext.Provider>
    )
}