import { useApi, useMemoryCache } from '@lib/hooks';
import { useCallback } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';

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

    const removePlaylist = useCallback(async (playlistId: string) => {
        if (!api) return;
        await api.get('/deletePlaylist', {
            params: { id: playlistId },
        });
    }, [api]);

    const removePlaylistConfirm = useCallback(async (playlistId: string): Promise<boolean> => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const confirmed = await SheetManager.show('confirm', {
            payload: {
                title: 'Are you sure?',
                message: 'Are you sure you want to remove this playlist? This action cannot be undone.',
                cancelText: 'Cancel',
                confirmText: 'Remove',
                variant: 'danger',
            }
        });

        if (!confirmed) return false;

        await removePlaylist(playlistId);
        return true;
    }, []);

    const typesToFields = {
        track: 'id',
        album: 'albumId',
        artist: 'artistId',
    };

    const star = useCallback(async (id: string, type: 'track' | 'album' | 'artist', action: 'star' | 'unstar' = 'star') => {
        console.log('star', id, type, action);

        if (!api) return;
        await api.get(`/${action === 'star' ? 'star' : 'unstar'}`, {
            params: {
                [typesToFields[type]]: id,
            },
        });
    }, [api]);

    return {
        removeTrackFromPlaylist,
        removePlaylist,
        removePlaylistConfirm,
        star,
    }
}