import { useCallback } from 'react';
import { useQueue, useSearchHistory } from '@lib/hooks';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { router } from 'expo-router';
import { SHItemType } from '@lib/providers/SearchHistoryProvider';

export type SearchPressOptions = {
    addToHistory?: boolean;
}

export function useSearchItemActions() {
    const queue = useQueue();
    const history = useSearchHistory();
    const press = useCallback(async (item: TMediaLibItem, options?: SearchPressOptions) => {
        if (options?.addToHistory !== false) await history.addItem({
            type: item.type as SHItemType,
            id: item.id,
            coverArt: item.coverArt ?? '',
            name: item.title,
            description: item.subtitle ?? '',
            searchedAt: Date.now(),
        });
        if (item.type === 'track') {
            await queue.playTrackNow(item.id);
        } else if (item.type === 'album') {
            router.push({ pathname: '/albums/[id]', params: { id: item.id } });
        }
    }, []);

    return { press };
}
