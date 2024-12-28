import { StyledActionSheet } from "@/lib/components/StyledActionSheet";
import { StyleSheet, View } from 'react-native';
import { SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { useColors } from '@/lib/hooks/useColors';
import { useGlobalPlayer, useQueue } from '@/lib/hooks';
import { useCoverBuilder } from '@/lib/hooks/useCoverBuilder';
import BlurredBackground from '@/lib/components/BlurredBackground';
import Cover from '@/lib/components/Cover';
import Title from '@/lib/components/Title';
import ActionIcon from '@/lib/components/ActionIcon';
import { IconCast, IconList, IconMessage, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled } from '@tabler/icons-react-native';
import NowPlayingSlider from '@/lib/components/nowPlaying/NowPlayingSlider';
import { useSharedValue } from 'react-native-reanimated';
import NowPlayingActions from '@/lib/components/nowPlaying/NowPlayingActions';
import { secondsToTimecode } from '@/lib/util';
import NowPlayingTab from '@/lib/components/nowPlaying/NowPlayingTab';
import { useAudioPlayerStatus } from 'expo-audio';
import { showRoutePicker, useExternalPlaybackAvailability } from 'react-airplay';
import CachedImage from '@/lib/components/CachedImage';

function PlaybackSheet({ sheetId, payload }: SheetProps<'playback'>) {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const { nowPlaying } = useQueue();
    const cover = useCoverBuilder();
    const isExternalPlaybackAvailable = useExternalPlaybackAvailability();

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
            padding: 30,
            justifyContent: 'space-between',
            // flex: 1,
            height: '100%',
            paddingBottom: Math.max(30, insets.bottom + 10),
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
        <StyledActionSheet
            gestureEnabled={true}
            fullHeight
            // safeAreaInsets={insets}
            safeAreaInsets={{ ...insets, bottom: 0, }}
            overdrawEnabled={false}
            drawUnderStatusBar
            containerStyle={{ backgroundColor: colors.background, margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}
            // indicatorStyle={{ backgroundColor: '#ffffff20' }}
            openAnimationConfig={{ bounciness: 0 }}
            closeAnimationConfig={{ bounciness: 0 }}
            // statusBarTranslucent
            isModal={false}
            CustomHeaderComponent={<View></View>}
            useBottomSafeAreaPadding={true}
        >
            <BlurredBackground source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }} cacheKey={nowPlaying.coverArt ? `${nowPlaying.coverArt}-full` : 'empty-full'} />
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
                    <View style={styles.tabs}>
                        <NowPlayingTab icon={IconMessage} active={false} />
                        <NowPlayingTab icon={IconCast} active={false} onPress={() => showRoutePicker({ prioritizesVideoDevices: false })} />
                        <NowPlayingTab icon={IconList} active={false} />
                    </View>
                </View>
            </View>
        </StyledActionSheet>
    );
}

export default PlaybackSheet;