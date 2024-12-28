import ActionIcon from '@/lib/components/ActionIcon';
import Cover from '@/lib/components/Cover';
import NowPlayingActions from '@/lib/components/nowPlaying/NowPlayingActions';
import Title from '@/lib/components/Title';
import { useColors, useCoverBuilder, useGlobalPlayer, useQueue } from '@lib/hooks';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerTrackNextFilled } from '@tabler/icons-react-native';
import { useAudioPlayerStatus } from 'expo-audio';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SmallNowPlaying() {
    const queue = useQueue();
    const { nowPlaying } = queue;

    const cover = useCoverBuilder();
    const colors = useColors();

    const player = useGlobalPlayer();
    const status = player ? useAudioPlayerStatus(player) : null;

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        left: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
    }), []);

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Cover source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }} cacheKey={nowPlaying.coverArt ? `${nowPlaying.coverArt}-full` : 'empty-full'} size={70} radius={12} />
                <View>
                    <Title size={16} fontFamily="Poppins-Medium" numberOfLines={1}>{nowPlaying.title}</Title>
                    <Title size={14} color={colors.text[1]} fontFamily="Poppins-Regular" numberOfLines={1}>{nowPlaying.artist}</Title>
                </View>
            </View>
            <View style={styles.actions}>
                <ActionIcon icon={status?.playing ? IconPlayerPauseFilled : IconPlayerPlayFilled} size={24} stroke="transparent" isFilled onPress={() => status?.playing ? player?.pause() : player?.play()} variant="subtleFilled" />
                <ActionIcon icon={IconPlayerTrackNextFilled} size={18} isFilled onPress={() => queue.skipForward()} disabled={!queue.canGoForward} />
            </View>
            {/* <NowPlayingActions /> */}
        </View>
    )
}