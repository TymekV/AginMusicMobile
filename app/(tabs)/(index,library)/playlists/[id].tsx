import Container from '@/lib/components/Container';
import Header from '@/lib/components/Header';
import { PlaylistBackground, PlaylistHeader } from '@lib/components/Playlist';
import Title from '@/lib/components/Title';
import { useColors, useCoverBuilder, useMemoryCache, useQueue } from '@lib/hooks';
import ActionIcon from '@lib/components/ActionIcon';
import { LibSize, LibLayout, LibSeparators } from '@lib/components/MediaLibraryList';
import MediaLibItem from '@lib/components/MediaLibraryList/Item';
import { IconDots, IconSearch } from '@tabler/icons-react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';

export default function Playlist() {
    const { id } = useLocalSearchParams();

    const cache = useMemoryCache();
    const cover = useCoverBuilder();
    const colors = useColors();
    const queue = useQueue();

    const data = useMemo(() => cache.cache.playlists[id as string], [cache.cache.playlists, id]);

    useEffect(() => {
        cache.refreshPlaylist(id as string);
    }, [cache.refreshPlaylist, id]);

    return (
        <Container edges={['left', 'right', 'bottom']}>
            <Header withBackIcon withAvatar={false} floating rightSection={<>
                <ActionIcon icon={IconSearch} size={16} variant='secondary' />
                <ActionIcon icon={IconDots} size={16} variant='secondary' />
            </>} />
            <PlaylistBackground
                source={{ uri: cover.generateUrl(data?.coverArt ?? '') }}
                cacheKey={`${data?.coverArt}-full`}
            />
            <LibLayout.Provider value="list">
                <LibSize.Provider value="medium">
                    <LibSeparators.Provider value={false}>
                        <FlatList
                            data={data?.entry}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => (
                                <MediaLibItem
                                    id={item.id}
                                    title={item.title}
                                    subtitle={item.artist}
                                    coverUri={cover.generateUrl(item.coverArt ?? '', { size: 128 })}
                                    coverCacheKey={`${item.coverArt}-128x128`}
                                    rightSection={<>
                                        <ActionIcon icon={IconDots} size={16} variant='secondaryTransparent' />
                                    </>}
                                    onPress={() => {
                                        if (!data.entry) return;
                                        queue.replace(data.entry, data.entry.findIndex(x => x.id === item.id));
                                    }}
                                />
                            )}
                            ListHeaderComponent={<PlaylistHeader playlist={data} />}
                        />
                    </LibSeparators.Provider>
                </LibSize.Provider>
            </LibLayout.Provider>
        </Container>
    )
}