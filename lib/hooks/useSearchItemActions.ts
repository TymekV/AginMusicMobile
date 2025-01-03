import { useCallback } from 'react';
import { useQueue, useSearchHistory } from '@lib/hooks';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { router } from 'expo-router';

export function useSearchItemActions() {
    const queue = useQueue();
    const history = useSearchHistory();
    const press = useCallback(async (item: TMediaLibItem) => {
        if (item.type === 'track') {
            await history.addItem({
                type: 'track',
                id: item.id,
                coverArt: item.coverArt ?? '',
                name: item.title,
                description: item.subtitle ?? '',
                searchedAt: new Date(),
            });
            await queue.playTrackNow(item.id);
        } else if (item.type === 'album') {
            router.push({ pathname: '/albums/[id]', params: { id: item.id } });
        }
    }, []);

    return { press };
}
