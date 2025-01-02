import Container from '@lib/components/Container';
import Header from '@lib/components/Header';
import { Input } from '@lib/components/Input';
import MediaLibraryList from '@lib/components/MediaLibraryList';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import SearchRightSection from '@lib/components/SearchRightSection';
import SearchSection from '@lib/components/SearchSection';
import TagTabs from '@lib/components/TagTabs';
import { TTagTab } from '@lib/components/TagTabs/TagTab';
import { useApi, useCoverBuilder, useSearchHistory } from '@lib/hooks';
import { AlbumID3, ArtistID3, Child, SearchResult3 } from '@lib/types';
import { IconDisc, IconMicrophone2, IconMusic, IconSearch } from '@tabler/icons-react-native';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

type Offsets = {
    album: number;
    artist: number;
    song: number;
}

export interface MappedResult extends TMediaLibItem {
    type: 'album' | 'artist' | 'track';
    fullData: Child | AlbumID3 | ArtistID3;
};

const tabs: TTagTab[] = [
    {
        label: 'All',
        id: 'all',
        icon: IconSearch,
    },
    {
        label: 'Artists',
        id: 'artist',
        icon: IconMicrophone2,
    },
    {
        label: 'Albums',
        id: 'album',
        icon: IconDisc,
    },
    {
        label: 'Songs',
        id: 'track',
        icon: IconMusic,
    }
];

const entering = FadeIn.duration(100).easing(Easing.inOut(Easing.ease));
const exiting = FadeOut.duration(100).easing(Easing.inOut(Easing.ease));

export default function Search() {
    const history = useSearchHistory();
    const cover = useCoverBuilder();
    const api = useApi();

    const [tab, setTab] = useState<string>('all');
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<MappedResult[]>([]);
    const [offset, setOffset] = useState<Offsets>({
        album: 0,
        artist: 0,
        song: 0,
    });

    const filteredResults = useMemo<MappedResult[]>(() => results.filter(item => item.type === tab || tab === 'all'), [results, tab]);

    useEffect(() => {
        (async () => {
            if (!api) return;
            const res = await api.get('/search3', {
                params: {
                    query,
                    albumCount: 20,
                    artistConut: 20,
                    songCount: 20,
                    albumOffset: offset.album,
                    artistOffset: offset.artist,
                    songOffset: offset.song,
                }
            });
            const results = res.data?.['subsonic-response']?.searchResult3 as SearchResult3;

            const albums: MappedResult[] = results.album?.map((item): MappedResult => ({
                id: item.id,
                type: 'album',
                title: item.name,
                subtitle: `Album • ${item.artist} • ${item.year}`,
                coverUri: cover.generateUrl(item.coverArt ?? '', { size: 128 }),
                coverCacheKey: `${item.coverArt}-128x128`,
                fullData: item,
            })) ?? [];

            const artists: MappedResult[] = results.artist?.map((item): MappedResult => ({
                id: item.id,
                type: 'artist',
                title: item.name,
                subtitle: 'Artist',
                coverUri: cover.generateUrl(item.coverArt ?? '', { size: 128 }),
                coverCacheKey: `${item.coverArt}-128x128`,
                fullData: item,
            })) ?? [];

            const songs: MappedResult[] = results.song?.map((item): MappedResult => ({
                id: item.id,
                type: 'track',
                title: item.title,
                subtitle: `Song • ${item.artist}`,
                coverUri: cover.generateUrl(item.coverArt ?? '', { size: 128 }),
                coverCacheKey: `${item.coverArt}-128x128`,
                fullData: item,
            })) ?? [];

            // TODO: Add sorting
            const mappedData = [...songs, ...artists, ...albums];
            setResults(mappedData);
        })();

    }, [query, api, offset, cover.generateUrl]);

    const mappedHistory = useMemo<TMediaLibItem[]>(() => history.items.map((item, index): TMediaLibItem => ({
        id: item.id,
        title: item.name,
        subtitle: item.description,
        coverUri: cover.generateUrl(item.coverArt, { size: 128 }),
        coverCacheKey: `${item.coverArt}-128x128`,
        type: item.type,
    })), [history]);

    const styles = useMemo(() => StyleSheet.create({
        history: {
            paddingTop: 5,
        },
        main: {
            flex: 1,
        }
    }), []);

    const inputRef = useRef<TextInput>(null);

    useFocusEffect(useCallback(() => {
        inputRef.current?.focus();
    }, []));

    return (
        <Container>
            <KeyboardAvoidingView behavior='padding' style={styles.main}>
                <Header withAvatar={false}>
                    <Input compact icon={IconSearch} placeholder='Search songs, artists, albums...' autoFocus ref={inputRef} clearButtonMode='always' value={query} onChangeText={setQuery} />
                </Header>
                {query !== '' && <Animated.View entering={entering} exiting={exiting}>
                    <TagTabs data={tabs} tab={tab} onChange={setTab} keyboardShouldPersistTaps='handled' />
                    <MediaLibraryList data={filteredResults} onItemPress={() => { }} size='medium' keyboardShouldPersistTaps='handled' rightSection={SearchRightSection} />
                </Animated.View>}
                {query === '' && <Animated.View style={styles.history} entering={entering} exiting={exiting}>
                    {mappedHistory.length !== 0 && <SearchSection label='Recently Searched' />}
                    <MediaLibraryList data={mappedHistory} onItemPress={() => { }} size='medium' withTopMargin={false} keyboardShouldPersistTaps='handled' rightSection={SearchRightSection} />
                </Animated.View>}
            </KeyboardAvoidingView>
        </Container>
    )
}