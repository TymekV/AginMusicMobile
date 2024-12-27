import { PlayQueue } from '@lib/types';
import React, { createContext, useCallback, useState } from 'react';
import { useCache } from '../hooks/useCache';

export type QueueContextType = {
    queue: PlayQueue;
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
    add: async (id: string) => { },
    clear: async () => { },
}

export const QueueContext = createContext<QueueContextType>(initialQueueContext);

export default function QueueProvider({ children }: { children: React.ReactNode }) {
    const [queue, setQueue] = useState<PlayQueue>(initialQueue);
    const cache = useCache();

    const add = useCallback(async (id: string) => {

    }, []);

    const clear = useCallback(async () => {

    }, []);

    return (
        <QueueContext.Provider value={{ queue, add, clear }}>
            {children}
        </QueueContext.Provider>
    )
}