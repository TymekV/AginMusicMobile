import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { Child, StructuredLyrics } from '@lib/types';
import { useApi } from './useApi';
import * as FileSystem from 'expo-file-system';

// TODO: Finish caching
export function useCache() {
    const db = useSQLiteContext();

    const api = useApi();

    const cacheChild = useCallback(async (child: Child) => {
        console.log('[cache] Saving ', child.id);
        const row = await db.getFirstAsync('SELECT * FROM childrenCache WHERE id = $id', { $id: child.id });
        if (row) await db.runAsync('UPDATE childrenCache SET data = $data WHERE id = $id', { $id: child.id, $data: JSON.stringify(child) });
        else await db.runAsync('INSERT INTO childrenCache (id, data) VALUES ($id, $data)', { $id: child.id, $data: JSON.stringify(child) });
    }, [db]);

    const getChild = useCallback(async (id: string): Promise<Child | null> => {
        // TODO: Add expiring
        const row = await db.getFirstAsync<{ id: string, data: string }>('SELECT * FROM childrenCache WHERE id = $id', { $id: id });
        if (!row) return null;

        const data = JSON.parse(row.data) as Child;
        return data;
    }, [db]);

    const fetchChild = useCallback(async (id: string, forceRefresh: boolean = false): Promise<Child | undefined> => {
        console.log('[cache] requesting ', id);

        if (!api) return;

        if (!forceRefresh) {
            const cached = await getChild(id);
            if (cached) {
                console.log('[cache] HIT ', id);
                return cached;
            }
        }
        console.log(`[cache] MISS${forceRefresh ? ' (force refreshing)' : ''}`, id);

        const child = await api.get('/getSong', { params: { id } });
        const childData = child.data?.['subsonic-response']?.song as Child | undefined;
        if (!childData) return;

        await cacheChild(childData);
        return childData;
    }, [getChild, cacheChild, api]);

    const rawFetchLyrics = useCallback(async (songId: string): Promise<StructuredLyrics[] | undefined> => {
        if (!api) return;

        const lyrics = await api.get('/getLyricsBySongId', { params: { id: songId } });
        const lyricsData = lyrics.data?.['subsonic-response']?.lyricsList?.structuredLyrics as StructuredLyrics[] | undefined;
        if (!lyricsData) return;

        return lyricsData;
    }, [api]);

    const cacheLyrics = useCallback(async (songId: string, lyrics: StructuredLyrics[]) => {
        const row = await db.getFirstAsync('SELECT * FROM lyricsCache WHERE id = $id', { $id: songId });
        if (row) await db.runAsync('UPDATE lyricsCache SET data = $data, updatedAt = CURRENT_TIMESTAMP WHERE id = $id', { $id: songId, $data: JSON.stringify(lyrics) });
        else await db.runAsync('INSERT INTO lyricsCache (id, data, updatedAt) VALUES ($id, $data, CURRENT_TIMESTAMP)', { $id: songId, $data: JSON.stringify(lyrics) });
    }, [db]);

    const getLyrics = useCallback(async (songId: string): Promise<StructuredLyrics[] | null> => {
        console.log('[lyricsCache] getting ', songId);
        const row = await db.getFirstAsync<{ id: string, data: string, updatedAt: Date }>('SELECT * FROM lyricsCache WHERE id = $id', { $id: songId });

        if (!row) return null;

        if (row.updatedAt < new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)) {
            console.log('[lyricsCache] Expired, refetching');

            (async () => {
                const lyrics = await rawFetchLyrics(songId);
                if (lyrics) await cacheLyrics(songId, lyrics);
            })();
        }

        const data = JSON.parse(row.data) as StructuredLyrics[];
        return data;
    }, [db, rawFetchLyrics, cacheLyrics]);

    const fetchLyrics = useCallback(async (id: string): Promise<StructuredLyrics[] | undefined> => {
        try {
            console.log('[lyricsCache] requesting ', id);

            if (!api) return;

            const cached = await getLyrics(id);
            if (cached) {
                console.log('[lyricsCache] HIT ', id);
                return cached;
            }
            console.log('[lyricsCache] MISS ', id);

            const lyrics = await rawFetchLyrics(id);
            if (!lyrics) return;

            await cacheLyrics(id, lyrics);
            return lyrics;
        } catch (error) {
            console.error('[lyricsCache] Error fetching lyrics', error);
            return undefined;
        }
    }, [getLyrics, cacheLyrics, rawFetchLyrics, api]);

    const clearImages = useCallback(async () => {
        const cacheDir = `${FileSystem.cacheDirectory}imagesCache/`;
        await FileSystem.deleteAsync(cacheDir, { idempotent: true });
    }, []);

    const clearMetadata = useCallback(async () => {
        await db.runAsync('DELETE FROM childrenCache');
        await db.runAsync('DELETE FROM lyricsCache');
    }, []);

    const clearAll = useCallback(async () => {
        await clearImages();
        await clearMetadata();
    }, [clearImages, clearMetadata]);

    return {
        fetchChild,
        cacheChild,

        fetchLyrics,
        cacheLyrics,

        clearImages,
        clearMetadata,
        clearAll,
    }
}