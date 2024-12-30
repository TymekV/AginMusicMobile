import { createContext, useCallback, useEffect, useState } from 'react';
import { AlbumID3, AlbumList2, Playlist, PlaylistWithSongs } from '@lib/types';
import { useApi } from '@lib/hooks';

export type MemoryCache = {
    allPlaylists: Playlist[];
    playlists: Record<string, PlaylistWithSongs>;
    allAlbums: AlbumID3[];
};

export type MemoryCacheContextType = {
    cache: MemoryCache;
    refreshPlaylists: () => Promise<void>;
    refreshPlaylist: (id: string) => Promise<void>;
    refreshAlbums: () => Promise<void>;
    clear: () => void;
}

export const initialCache: MemoryCacheContextType = {
    cache: {
        allPlaylists: [],
        playlists: {},
        allAlbums: [],
    },
    refreshPlaylists: async () => { },
    refreshPlaylist: async () => { },
    refreshAlbums: async () => { },
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
        console.log('[MemoryCache] Fetching playlists');

        const playlistsRes = await api.get('/getPlaylists');
        const playlists = playlistsRes.data?.['subsonic-response']?.playlists?.playlist as Playlist[];
        if (!playlists) return;

        setCache(c => ({ ...c, allPlaylists: playlists }));
    }, [api]);

    const refreshPlaylist = useCallback(async (id: string) => {
        if (!api) return;
        console.log('[MemoryCache] Fetching playlist', id);

        const playlistRes = await api.get('/getPlaylist', { params: { id } });
        const playlist = playlistRes.data?.['subsonic-response']?.playlist as PlaylistWithSongs;
        if (!playlist) return;

        setCache(c => ({ ...c, playlists: { ...c.playlists, [id]: playlist } }));
    }, [api]);

    const refreshAlbums = useCallback(async () => {
        // TODO: Add pagination support
        if (!api) return;
        console.log('[MemoryCache] Fetching albums');

        const albumsRes = await api.get('/getAlbumList2', { params: { type: 'newest', size: 500 } });
        const albums = albumsRes.data?.['subsonic-response']?.albumList2?.album as AlbumID3[];
        if (!albums) return;
        console.log({ albums });

        setCache(c => ({ ...c, allAlbums: albums }));
    }, [api]);

    // Prefetch the data
    useEffect(() => {
        if (!api) return;
        (async () => {
            await refreshPlaylists();
            await refreshAlbums();
        })();
    }, [api, refreshPlaylists, refreshAlbums]);

    return (
        <MemoryCacheContext.Provider value={{ cache, clear, refreshPlaylists, refreshPlaylist, refreshAlbums }}>
            {children}
        </MemoryCacheContext.Provider>
    )
}