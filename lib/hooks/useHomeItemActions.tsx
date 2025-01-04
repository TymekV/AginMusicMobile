import { useCallback } from 'react';
import { useQueue } from '@lib/hooks';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';

export function useHomeItemActions() {
    const queue = useQueue();

    const press = useCallback(async (item: TMediaLibItem) => {
        if (item.type === 'track') {
            await queue.playTrackNow(item.id);
        } else if (item.type === 'album') {
            router.push({ pathname: '/albums/[id]', params: { id: item.id } });
        } else if (item.type === 'playlist') {
            router.push({ pathname: '/playlists/[id]', params: { id: item.id } });
        }
    }, []);

    const longPress = useCallback(async (item: TMediaLibItem) => {
        Haptics.selectionAsync();
        if (item.type === 'track') {
            await SheetManager.show('track', {
                payload: {
                    id: item.id,
                    context: 'home',
                }
            });
        } else if (item.type === 'album') {
            await SheetManager.show('album', {
                payload: {
                    id: item.id,
                    context: 'home',
                }
            });
        } else if (item.type === 'playlist') {
            await SheetManager.show('playlist', {
                payload: {
                    id: item.id,
                    context: 'home',
                }
            });
        }
    }, []);

    return { press, longPress };
}
