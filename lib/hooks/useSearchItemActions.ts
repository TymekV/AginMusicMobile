import { useCallback } from 'react';
import { useQueue } from '@lib/hooks';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { router } from 'expo-router';

export function useSearchItemActions() {
    const queue = useQueue();
    const press = useCallback(async (item: TMediaLibItem) => {
        if (item.type === 'track') {
            await queue.playTrackNow(item.id);
        } else if (item.type === 'album') {
            router.push({ pathname: '/albums/[id]', params: { id: item.id } });
        }
    }, []);

    return { press };
}
