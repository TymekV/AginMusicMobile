import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MediaLibraryList from '@lib/components/MediaLibraryList';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { useCoverBuilder, useMemoryCache } from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';
import { useFocusEffect } from 'expo-router';

export function AlbumsTab() {
    const cache = useMemoryCache();
    const cover = useCoverBuilder();

    const data = useMemo((): TMediaLibItem[] => cache.cache.allAlbums.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.artist} • ${p.year}`,
        coverUri: cover.generateUrl(p.coverArt ?? '', { size: 128 }),
        coverCacheKey: `${p.coverArt}-128x128`,
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
            onItemPress={() => { }}
        />
    )
}