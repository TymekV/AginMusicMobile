import React, { useMemo } from 'react';
import HomeSectionHeader from '../HomeSectionHeader';
import MediaLibraryList from '../MediaLibraryList';
import { usePins, useCoverBuilder, useMemoryCache } from '@lib/hooks';
import { TMediaLibItem } from '../MediaLibraryList/Item';

export function Pinned() {
    const { pins } = usePins();
    const cover = useCoverBuilder();

    const pinsData = useMemo(() => pins.map((pin): TMediaLibItem => ({
        id: pin.id,
        title: pin.name.replace(/\(.*/g, '').trim(),
        coverArt: pin.coverArt,
        coverUri: cover.generateUrl(pin.coverArt, { size: 300 }),
        coverCacheKey: `${pin.coverArt}-300x300`,
        type: pin.type,
    })), [pins]);

    return (
        <>
            {pinsData.length > 0 && <>
                <HomeSectionHeader label="Pinned" description="Your favorite music at a glance" action={{ label: 'Edit', onPress: () => { } }} />
                <MediaLibraryList
                    data={pinsData}
                    onItemPress={() => { }}
                    layout='gridCompact'
                    withTopMargin={false}
                    scrollEnabled={false}
                    isFullHeight={false}
                />
            </>}
        </>
    )
}