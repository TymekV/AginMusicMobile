import ActionIcon from '@/lib/components/ActionIcon';
import Cover from '@/lib/components/Cover';
import NowPlayingActions from '@/lib/components/nowPlaying/NowPlayingActions';
import NowPlayingSlider from '@/lib/components/nowPlaying/NowPlayingSlider';
import Title from '@/lib/components/Title';
import { useQueue } from '@/lib/hooks';
import { useColors } from '@/lib/hooks/useColors';
import { useCoverBuilder } from '@/lib/hooks/useCoverBuilder';
import { secondsToTimecode } from '@/lib/util';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled } from '@tabler/icons-react-native';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { State, usePlaybackState, useProgress } from 'react-native-track-player';

export default function MainTab() {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const queue = useQueue();
    const { nowPlaying } = queue;
    const cover = useCoverBuilder();

    const [seeking, setSeeking] = useState(false);
    const [seekingValue, setSeekingValue] = useState(0);

    const sliderMin = useSharedValue(0);
    const sliderMax = useSharedValue(100);
    const progress = useSharedValue(0);

    const { width, height } = useWindowDimensions();

    const { position, duration } = useProgress();
    const state = usePlaybackState();

    useEffect(() => {
        if (seeking) return;
        sliderMin.value = 0;
        sliderMax.value = duration;
        progress.value = position;
    }, [position, duration, seeking]);

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
            height: height < 750 ? 120 : 170,
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
    }), [insets.bottom, height]);

    const buffering = state === State.Connecting;

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
                        TrackPlayer.seekTo(value);
                        progress.value = value;
                    }}
                />
                <View style={styles.time}>
                    <Title size={12} color={colors.text[2]} fontFamily="Poppins-SemiBold">{buffering ? 'Loading...' : secondsToTimecode(position)}</Title>
                    <Title size={12} color={colors.text[2]} fontFamily="Poppins-SemiBold">{!buffering && `-${secondsToTimecode(duration - position)}`}</Title>
                </View>
                <View style={styles.buttons}>
                    <ActionIcon icon={IconPlayerSkipBackFilled} isFilled size={30} onPress={() => queue.skipBackward()} disabled={!queue.canGoBackward} />
                    <ActionIcon icon={(state == State.Paused || state == State.None) ? IconPlayerPlayFilled : IconPlayerPauseFilled} isFilled size={55} stroke="transparent" onPress={() => (state == State.Paused || state == State.None) ? TrackPlayer.play() : TrackPlayer.pause()} />
                    <ActionIcon icon={IconPlayerSkipForwardFilled} isFilled size={30} onPress={() => queue.skipForward()} disabled={!queue.canGoForward} />
                </View>
            </View>
        </View>
    )
}