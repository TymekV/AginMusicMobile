import Container from '@/lib/components/Container';
import Header from '@/lib/components/Header';
import { PlaylistBackground, PlaylistHeader } from '@/lib/components/Playlist';
import Title from '@/lib/components/Title';
import { useCoverBuilder, useMemoryCache } from '@/lib/hooks';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';

export default function Playlist() {
    const { id } = useLocalSearchParams();

    const cache = useMemoryCache();
    const cover = useCoverBuilder();
    const data = useMemo(() => cache.cache.playlists[id as string], [cache.cache.playlists, id]);

    useEffect(() => {
        cache.refreshPlaylist(id as string);
    }, [cache.refreshPlaylist, id]);

    return (
        <Container>
            <Header withBackIcon withAvatar={false} />
            <PlaylistBackground
                source={{ uri: cover.generateUrl(data?.coverArt ?? '') }}
                cacheKey={`${data?.coverArt}-full`}
            />
            <PlaylistHeader playlist={data} />
        </Container>
    )
}