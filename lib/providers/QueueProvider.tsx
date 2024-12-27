import { Child, PlayQueue } from '@lib/types';
import React, { createContext, useCallback, useState } from 'react';
import { useCache } from '../hooks/useCache';

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

export default function QueueProvider({ children }: { children: React.ReactNode }) {
    const [queue, setQueue] = useState<PlayQueue>(initialQueue);
    const [nowPlaying, setNowPlaying] = useState<Child>(initialQueueContext.nowPlaying);

    const cache = useCache();

    const add = useCallback(async (id: string) => {
        const data = await cache.fetchChild(id);
    }, [cache]);

    const clear = useCallback(async () => {

    }, []);

    return (
        <QueueContext.Provider value={{ queue, add, clear, nowPlaying, }}>
            {children}
        </QueueContext.Provider>
    )
}