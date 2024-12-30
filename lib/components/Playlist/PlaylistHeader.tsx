import { useColors, useCoverBuilder } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Cover from '../Cover';
import { Playlist } from '@lib/types';

export type PlaylistHeaderProps = {
    playlist: Playlist;
};

export function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
    const colors = useColors();
    const cover = useCoverBuilder();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            alignItems: 'center',
        }
    }), [colors]);

    return (
        <View style={styles.container}>
            <Cover
                source={{ uri: cover.generateUrl(playlist?.coverArt ?? '') }}
                cacheKey={`${playlist?.coverArt}-full`}
                size={250}
            />
        </View>
    )
}