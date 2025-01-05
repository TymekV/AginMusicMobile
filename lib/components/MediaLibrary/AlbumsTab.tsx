import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import MediaLibraryList, { LibLayout } from '@lib/components/MediaLibraryList';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { useCoverBuilder, useHomeItemActions, useMemoryCache } from '@/lib/hooks';
import { router, useFocusEffect } from 'expo-router';

export function AlbumsTab() {
    const cache = useMemoryCache();
    const cover = useCoverBuilder();

    const { press, longPress } = useHomeItemActions();

    const layout = useContext(LibLayout);

    const data = useMemo((): TMediaLibItem[] => cache.cache.allAlbums.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.artist} • ${p.year}`,
        coverUri: cover.generateUrl(p.coverArt ?? '', { size: layout == 'grid' ? 300 : 128 }),
        coverCacheKey: `${p.coverArt}-${layout == 'grid' ? '300x300' : '128x128'}`,
        type: 'album',
    })), [cache.cache.allAlbums, cover]);

    useEffect(() => {
        cache.refreshAlbums();
    }, [cache.refreshAlbums]);

    useFocusEffect(useCallback(() => {
        cache.refreshAlbums();
    }, [cache.refreshAlbums]));

    return (
        <MediaLibraryList
            data={data}
            onItemPress={press}
            onItemLongPress={longPress}
            layout={layout}
        />
    )
}