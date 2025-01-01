import { useApi, useMemoryCache } from '@lib/hooks';
import { useCallback } from 'react';

export function useApiHelpers() {
    const api = useApi();
    const memoryCache = useMemoryCache();

    const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
        if (!api) return;

        const playlist = await memoryCache.refreshPlaylist(playlistId);
        if (!playlist?.entry) return;

        const toRemove = playlist.entry.findIndex(x => x.id === trackId);

        await api.get('/updatePlaylist', {
            params: {
                playlistId,
                songIndexToRemove: toRemove,
            }
        });
        await memoryCache.refreshPlaylist(playlistId);
    }, [api, memoryCache.refreshPlaylist]);

    return {
        removeTrackFromPlaylist,
    }
}