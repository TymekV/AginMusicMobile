import React, { useEffect, useMemo, useState } from 'react';
import MediaLibraryList from '@lib/components/MediaLibraryList';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { useCoverBuilder, useMemoryCache } from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';

export function PlaylistsTab() {
    const cache = useMemoryCache();
    const cover = useCoverBuilder();

    const data = useMemo((): TMediaLibItem[] => cache.cache.allPlaylists.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.songCount} songs • edited ${formatDistanceToNow(new Date(p.changed), { addSuffix: true })}`,
        coverUri: cover.generateUrl(p.coverArt ?? '', { size: 128 }),
        coverCacheKey: `${p.coverArt}-128x128`,
    })), [cache.cache.allPlaylists, cover]);

    useEffect(() => {
        cache.refreshPlaylists();
    }, [cache]);

    return (
        <MediaLibraryList
            data={data}
            onItemPress={() => { }}
        />
    )
}