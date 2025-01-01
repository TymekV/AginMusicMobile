import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import MediaLibraryList, { LibLayout } from '@lib/components/MediaLibraryList';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { useCoverBuilder, useMemoryCache } from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';
import { router, useFocusEffect } from 'expo-router';

export function PlaylistsTab() {
    const cache = useMemoryCache();
    const cover = useCoverBuilder();

    const layout = useContext(LibLayout);

    const data = useMemo((): TMediaLibItem[] => cache.cache.allPlaylists.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.songCount} songs${layout !== 'grid' ? ` • edited ${formatDistanceToNow(new Date(p.changed), { addSuffix: true })}` : ''}`,
        coverUri: cover.generateUrl(p.coverArt ?? '', { size: layout == 'grid' ? 300 : 128 }),
        coverCacheKey: `${p.coverArt}-${layout == 'grid' ? '300x300' : '128x128'}`,
    })), [cache.cache.allPlaylists, cover, layout]);

    useEffect(() => {
        cache.refreshPlaylists();
    }, [cache.refreshPlaylists]);

    useFocusEffect(useCallback(() => {
        cache.refreshPlaylists();
    }, [cache.refreshPlaylists]));

    return (
        <MediaLibraryList
            data={data}
            onItemPress={(item) => router.push({ pathname: '/playlists/[id]', params: { id: item.id } })}
            layout={layout}
        />
    )
}