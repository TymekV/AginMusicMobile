import { useCoverBuilder, useMemoryCache } from '@lib/hooks';
import HomeSectionHeader from '../HomeSectionHeader';
import MediaLibraryList from '../MediaLibraryList';
import React, { useMemo } from 'react';
import { TMediaLibItem } from '../MediaLibraryList/Item';
import { router } from 'expo-router';

export function Playlists() {
    const memoryCache = useMemoryCache();
    const cover = useCoverBuilder();

    const data = useMemo(() => memoryCache.cache.allPlaylists.map((playlist): TMediaLibItem => ({
        id: playlist.id,
        title: playlist.name,
        coverArt: playlist.coverArt,
        coverUri: cover.generateUrl(playlist.coverArt ?? '', { size: 300 }),
        coverCacheKey: `${playlist.coverArt}-300x300`,
    })), [memoryCache.cache.allPlaylists, cover.generateUrl]);

    return (
        <>
            <HomeSectionHeader label="Your Playlists" action={{ type: 'more', onPress: () => router.push('/library') }} />
            <MediaLibraryList
                data={data}
                onItemPress={() => { }}
                layout='horizontal'
                withTopMargin={false}
                isFullHeight={false}
                snapToAlignment='start'
            />
        </>
    )
}