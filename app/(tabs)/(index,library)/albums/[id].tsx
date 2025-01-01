import Container from '@/lib/components/Container';
import Header from '@/lib/components/Header';
import { PlaylistBackground, PlaylistHeader } from '@lib/components/Playlist';
import { useColors, useCoverBuilder, useMemoryCache, useQueue, useTabsHeight } from '@lib/hooks';
import ActionIcon from '@lib/components/ActionIcon';
import { LibSize, LibLayout, LibSeparators } from '@lib/components/MediaLibraryList';
import MediaLibItem from '@lib/components/MediaLibraryList/Item';
import { IconDots, IconSearch } from '@tabler/icons-react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';
import Animated, { Easing, FadeIn, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function Album() {
    const { id } = useLocalSearchParams();

    const cache = useMemoryCache();
    const cover = useCoverBuilder();
    const [tabsHeight] = useTabsHeight();
    const listRef = useAnimatedRef<FlatList>();

    const data = useMemo(() => cache.cache.albums[id as string], [cache.cache.albums, id]);

    const tracksData = useMemo(() => data?.song, [data?.song]);

    const containerOpacity = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
    }));

    useEffect(() => {
        if (!data) return;
        containerOpacity.value = withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) });
    }, [data]);

    useFocusEffect(useCallback(() => {
        cache.refreshAlbum(id as string);
    }, [cache.refreshAlbum, id]));

    return (
        <Container includeTop={false} includeBottom={false}>
            <Header
                withBackIcon
                withAvatar={false}
                floating
                scrollRef={listRef}
                interpolationRange={[200, 350]}
                title={data?.name}
                titleSize={18}
                initialHideTitle
                rightSection={<>
                    <ActionIcon icon={IconSearch} size={16} variant='secondary' />
                    <ActionIcon icon={IconDots} size={16} variant='secondary' />
                </>} />
            <Animated.View style={[{ flex: 1 }, containerStyle]}>
                <LibLayout.Provider value="list">
                    <LibSize.Provider value="medium">
                        <LibSeparators.Provider value={false}>
                            <FlatList
                                data={tracksData}
                                keyExtractor={(item) => item.id ?? `fallback-${Math.random()}`}
                                ref={listRef}
                                renderItem={({ item, index }) => (
                                    <MediaLibItem
                                        id={item.id}
                                        title={item.title}
                                        coverUri={cover.generateUrl(item.coverArt ?? '', { size: 128 })}
                                        coverCacheKey={`${item.coverArt}-128x128`}
                                        isAlbumEntry
                                        trackNumber={item.track}
                                        rightSection={<>
                                            <ActionIcon icon={IconDots} size={16} variant='secondaryTransparent' onPress={() => {
                                                Haptics.selectionAsync();
                                                SheetManager.show('track', {
                                                    payload: {
                                                        id: item.id,
                                                        data: item,
                                                        context: 'album',
                                                    }
                                                });
                                            }} />
                                        </>}
                                        onPress={() => {

                                        }}
                                    />
                                )}
                                ListHeaderComponent={<PlaylistHeader album={data} />}
                                ListFooterComponent={<View style={{ height: tabsHeight + 10 }} />}
                            />
                        </LibSeparators.Provider>
                    </LibSize.Provider>
                </LibLayout.Provider>
            </Animated.View>
        </Container>
    )
}