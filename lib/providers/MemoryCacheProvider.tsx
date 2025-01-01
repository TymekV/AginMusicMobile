import { createContext, useCallback, useEffect, useState } from 'react';
import { AlbumID3, AlbumList2, AlbumWithSongsID3, Playlist, PlaylistWithSongs } from '@lib/types';
import { useApi, useServer } from '@lib/hooks';

export type MemoryCache = {
    allPlaylists: Playlist[];
    playlists: Record<string, PlaylistWithSongs>;
    allAlbums: AlbumID3[];
    albums: Record<string, AlbumWithSongsID3>;
};

export type MemoryCacheContextType = {
    cache: MemoryCache;
    refreshPlaylists: () => Promise<Playlist[] | void>;
    refreshPlaylist: (id: string) => Promise<PlaylistWithSongs | void>;
    refreshAlbums: () => Promise<AlbumID3[] | void>;
    refreshAlbum: (id: string) => Promise<AlbumWithSongsID3 | void>;
    clear: () => void;
}

export const initialCache: MemoryCacheContextType = {
    cache: {
        allPlaylists: [],
        playlists: {},
        allAlbums: [],
        albums: {},
    },
    refreshPlaylists: async () => { },
    refreshPlaylist: async () => { },
    refreshAlbums: async () => { },
    refreshAlbum: async () => { },
    clear: () => { },
};

export const MemoryCacheContext = createContext<MemoryCacheContextType>(initialCache);

export default function MemoryCacheProvider({ children }: { children?: React.ReactNode }) {
    const [cache, setCache] = useState<MemoryCache>(initialCache.cache);
    const api = useApi();
    const { server } = useServer();

    const clear = useCallback(() => {
        setCache(initialCache.cache);
    }, []);

    const refreshPlaylists = useCallback(async () => {
        if (!api) return;

        const playlistsRes = await api.get('/getPlaylists');
        const playlists = playlistsRes.data?.['subsonic-response']?.playlists?.playlist as Playlist[];
        if (!playlists) return;

        setCache(c => ({ ...c, allPlaylists: playlists }));
        return playlists;
    }, [api, server.url]);

    const refreshPlaylist = useCallback(async (id: string) => {
        if (!api) return;
        console.log('[MemoryCache] Fetching playlist', id);

        const playlistRes = await api.get('/getPlaylist', { params: { id } });
        const playlist = playlistRes.data?.['subsonic-response']?.playlist as PlaylistWithSongs;
        if (!playlist) return;

        setCache(c => ({ ...c, playlists: { ...c.playlists, [id]: playlist } }));
        return playlist;
    }, [api, server.url]);

    const refreshAlbums = useCallback(async () => {
        // TODO: Add pagination support
        if (!api) return;
        console.log('[MemoryCache] Fetching albums');

        const albumsRes = await api.get('/getAlbumList2', { params: { type: 'newest', size: 500 } });
        const albums = albumsRes.data?.['subsonic-response']?.albumList2?.album as AlbumID3[];
        if (!albums) return;
        console.log({ albums });

        setCache(c => ({ ...c, allAlbums: albums }));
        return albums;
    }, [api, server.url]);

    const refreshAlbum = useCallback(async (id: string) => {
        if (!api) return;
        console.log('[MemoryCache] Fetching album');

        const albumRes = await api.get('/getAlbum', { params: { id } });
        const album = albumRes.data?.['subsonic-response']?.album as AlbumWithSongsID3;
        if (!album) return;
        console.log({ album });

        setCache(c => ({ ...c, albums: { ...c.albums, [id]: album } }));
        return album;
    }, [api, server.url]);

    // Prefetch the data
    useEffect(() => {
        if (!api) return;
        (async () => {
            await refreshPlaylists();
            await refreshAlbums();
        })();
    }, [api, server.url, refreshPlaylists, refreshAlbums]);

    return (
        <MemoryCacheContext.Provider value={{ cache, clear, refreshPlaylists, refreshPlaylist, refreshAlbums, refreshAlbum }}>
            {children}
        </MemoryCacheContext.Provider>
    )
}