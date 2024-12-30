import { useColors, useCoverBuilder } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Cover from '../Cover';
import { Playlist } from '@lib/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title from '../Title';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import ActionIcon from '../ActionIcon';
import { IconArrowsShuffle, IconDownload, IconPlayerPlayFilled } from '@tabler/icons-react-native';

export type PlaylistHeaderProps = {
    playlist?: Playlist;
};

export function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
    const colors = useColors();
    const cover = useCoverBuilder();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 10,
        },
        title: {
            marginTop: 20,
        },
        actions: {
            flexDirection: 'row',
            marginTop: 15,
            gap: 15,
            alignItems: 'center',
        }
    }), [colors]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Cover
                source={{ uri: cover.generateUrl(playlist?.coverArt ?? '') }}
                cacheKey={`${playlist?.coverArt}-full`}
                size={250}
            />
            <View style={styles.title}>
                <Title align="center" size={24} fontFamily="Poppins-SemiBold">{playlist?.name}</Title>
                <Title align="center" size={14} fontFamily="Poppins-Regular" color={colors.text[1]}>{playlist && `${playlist.songCount} songs • edited ${formatDistanceToNow(new Date(playlist.changed), { addSuffix: true })}`}</Title>
            </View>
            <View style={styles.actions}>
                <ActionIcon icon={IconDownload} variant='subtleFilled' size={20} extraSize={24} />
                <ActionIcon icon={IconPlayerPlayFilled} variant='primary' isFilled size={24} extraSize={32} />
                <ActionIcon icon={IconArrowsShuffle} variant='subtleFilled' size={20} extraSize={24} />
            </View>
        </SafeAreaView>
    )
}