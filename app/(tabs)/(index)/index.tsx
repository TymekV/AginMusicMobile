import Container from '@lib/components/Container';
import Header from '@lib/components/Header';
import HomeSectionHeader from '@lib/components/HomeSectionHeader';
import MediaLibraryList from '@lib/components/MediaLibraryList';
import GridCompactItem from '@lib/components/MediaLibraryList/GridCompactItem';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import { useCoverBuilder, usePins } from '@lib/hooks';
import React, { useMemo } from 'react';

export default function Home() {
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
        <Container>
            <Header title="Home" withAvatar />
            <HomeSectionHeader label="Pinned" description="Your favorite music at a glance" action={{ label: 'Edit', onPress: () => { } }} />
            <MediaLibraryList
                data={pinsData}
                onItemPress={() => { }}
                layout='gridCompact'
                withTopMargin={false}
                scrollEnabled={false}
            />
        </Container>
    )
}