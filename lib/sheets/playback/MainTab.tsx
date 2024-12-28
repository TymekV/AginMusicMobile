import ActionIcon from '@/lib/components/ActionIcon';
import Cover from '@/lib/components/Cover';
import NowPlayingActions from '@/lib/components/nowPlaying/NowPlayingActions';
import NowPlayingSlider from '@/lib/components/nowPlaying/NowPlayingSlider';
import Title from '@/lib/components/Title';
import { useGlobalPlayer, useQueue } from '@/lib/hooks';
import { useColors } from '@/lib/hooks/useColors';
import { useCoverBuilder } from '@/lib/hooks/useCoverBuilder';
import { secondsToTimecode } from '@/lib/util';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled } from '@tabler/icons-react-native';
import { useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MainTab() {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const { nowPlaying } = useQueue();
    const cover = useCoverBuilder();

    const player = useGlobalPlayer();
    const status = player ? useAudioPlayerStatus(player) : null;

    const [seeking, setSeeking] = useState(false);
    const [seekingValue, setSeekingValue] = useState(0);

    const sliderMin = useSharedValue(0);
    const sliderMax = useSharedValue(100);
    const progress = useSharedValue(0);

    const currentTime = seeking ? seekingValue : (status?.currentTime ?? 0);
    const duration = status?.duration ?? 0;

    useEffect(() => {
        if (seeking) return;
        sliderMin.value = 0;
        sliderMax.value = status?.duration ?? 0;
        progress.value = status?.currentTime ?? 0;
    }, [status, seeking]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            justifyContent: 'space-between',
            flex: 1,
            paddingHorizontal: 30,
            height: '100%',
        },
        metadata: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30,
            marginBottom: 20,
            alignItems: 'center',
            gap: 5,
        },
        metadataContainer: {
            flex: 1,
            overflow: 'hidden',
        },
        cover: {
            flex: 1,
            justifyContent: 'center',
        },
        buttons: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 40,
            alignItems: 'center',
            height: 170,
        },
        time: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        tabs: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            gap: 70,
        }
    }), [insets.bottom]);

    return (
        <View style={styles.container}>
            <View style={styles.cover}>
                <Cover source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }} cacheKey={nowPlaying.coverArt ? `${nowPlaying.coverArt}-full` : 'empty-full'} />
            </View>
            <View>
                <View style={styles.metadata}>
                    <View style={styles.metadataContainer}>
                        <Title size={18} fontFamily="Poppins-SemiBold" numberOfLines={1}>{nowPlaying.title}</Title>
                        <Title size={16} color={colors.text[1]} fontFamily="Poppins-Regular" numberOfLines={1}>{nowPlaying.artist}</Title>
                    </View>
                    <NowPlayingActions />
                </View>
                <NowPlayingSlider
                    minimumValue={sliderMin}
                    maximumValue={sliderMax}
                    progress={progress}
                    setSeeking={setSeeking}
                    onValueChange={(value) => {
                        progress.value = value;
                        setSeekingValue(value);
                    }}
                    onSlidingComplete={(value) => {
                        if (!player) return;
                        player.seekTo(value);
                        progress.value = value;
                    }}
                />
                <View style={styles.time}>
                    <Title size={12} color={colors.text[2]} fontFamily="Poppins-SemiBold">{status?.isBuffering ? 'Loading...' : secondsToTimecode(currentTime / 1000)}</Title>
                    <Title size={12} color={colors.text[2]} fontFamily="Poppins-SemiBold">{!status?.isBuffering && `-${secondsToTimecode((duration - currentTime) / 1000)}`}</Title>
                </View>
                <View style={styles.buttons}>
                    <ActionIcon icon={IconPlayerSkipBackFilled} isFilled size={30} />
                    <ActionIcon icon={status?.playing ? IconPlayerPauseFilled : IconPlayerPlayFilled} isFilled size={55} stroke="transparent" onPress={() => status?.playing ? player?.pause() : player?.play()} />
                    <ActionIcon icon={IconPlayerSkipForwardFilled} isFilled size={30} />
                </View>
            </View>
        </View>
    )
}