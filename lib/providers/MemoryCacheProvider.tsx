import { createContext, useCallback, useEffect, useState } from 'react';
import { Playlist, PlaylistWithSongs } from '@lib/types';
import { useApi } from '@lib/hooks';

export type MemoryCache = {
    allPlaylists: Playlist[];
    playlists: Record<string, PlaylistWithSongs>;
};

export type MemoryCacheContextType = {
    cache: MemoryCache;
    refreshPlaylists: () => void;
    clear: () => void;
}

export const initialCache: MemoryCacheContextType = {
    cache: {
        allPlaylists: [],
        playlists: {},
    },
    refreshPlaylists: () => { },
    clear: () => { },
};

export const MemoryCacheContext = createContext<MemoryCacheContextType>(initialCache);

export default function MemoryCacheProvider({ children }: { children?: React.ReactNode }) {
    const [cache, setCache] = useState<MemoryCache>(initialCache.cache);
    const api = useApi();

    const clear = useCallback(() => {
        setCache(initialCache.cache);
    }, []);

    const refreshPlaylists = useCallback(async () => {
        if (!api) return;

        const playlistsRes = await api.get('/getPlaylists');
        const playlists = playlistsRes.data?.['subsonic-response']?.playlists?.playlist as Playlist[];
        if (!playlists) return;

        setCache(c => ({ ...c, allPlaylists: playlists }));
    }, [cache, api]);

    // Prefetch the data
    useEffect(() => {
        if (!api) return;
        (async () => {
            await refreshPlaylists();
        })();
    }, [api, refreshPlaylists]);

    return (
        <MemoryCacheContext.Provider value={{ cache, clear, refreshPlaylists }}>
            {children}
        </MemoryCacheContext.Provider>
    )
}