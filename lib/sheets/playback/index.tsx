import { StyledActionSheet } from "@/lib/components/StyledActionSheet";
import { StyleSheet, View } from "react-native";
import { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import { useColors } from "@/lib/hooks/useColors";
import { useNowPlaying } from "@/lib/hooks";
import { useCoverBuilder } from "@/lib/hooks/useCoverBuilder";
import BlurredBackground from "@/lib/components/BlurredBackground";
import Cover from "@/lib/components/Cover";
import Title from "@/lib/components/Title";
import ActionIcon from "@/lib/components/ActionIcon";
import { IconPlayerPauseFilled, IconPlayerSkipBack, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled, IconPlayerTrackNextFilled, IconPlayerTrackPrev, IconPlayerTrackPrevFilled } from "@tabler/icons-react-native";
import NowPlayingSlider from "@/lib/components/nowPlaying/NowPlayingSlider";
import { useSharedValue } from "react-native-reanimated";
import NowPlayingActions from "@/lib/components/nowPlaying/NowPlayingActions";
import { secondsToTimecode } from "@/lib/util";

function PlaybackSheet({ sheetId, payload }: SheetProps<'playback'>) {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const [nowPlaying] = useNowPlaying();
    const cover = useCoverBuilder();

    const sliderMin = useSharedValue(0);
    const sliderMax = useSharedValue(100);
    const progress = useSharedValue(30);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            padding: 30,
            justifyContent: 'space-between',
            // flex: 1,
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
        }
    }), []);

    return (
        <StyledActionSheet
            gestureEnabled={true}
            fullHeight
            safeAreaInsets={insets}
            // safeAreaInsets={{ bottom: 0, left: 0, right: 0, top: 0 }}
            // overdrawEnabled={false}
            // drawUnderStatusBar
            containerStyle={{ backgroundColor: colors.background, margin: 0, padding: 0, overflow: 'hidden' }}
            // indicatorStyle={{ backgroundColor: '#ffffff20' }}
            openAnimationConfig={{ bounciness: 0 }}
            closeAnimationConfig={{ bounciness: 0 }}
            // statusBarTranslucent
            isModal={false}
            CustomHeaderComponent={<View></View>}
            useBottomSafeAreaPadding={true}
        >
            <BlurredBackground source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }} />
            <View style={styles.container}>
                <View style={styles.cover}>
                    <Cover source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }} />
                </View>
                <View>
                    <View style={styles.metadata}>
                        <View style={styles.metadataContainer}>
                            <Title size={18} fontFamily="Poppins-SemiBold" numberOfLines={1}>{nowPlaying.title}</Title>
                            <Title size={16} color={colors.secondaryText} fontFamily="Poppins-Regular" numberOfLines={1}>{nowPlaying.artist}</Title>
                        </View>
                        <NowPlayingActions />
                    </View>
                    <NowPlayingSlider minimumValue={sliderMin} maximumValue={sliderMax} progress={progress} />
                    <View style={styles.time}>
                        <Title size={11} color={colors.secondaryText} fontFamily="Poppins-Regular">{secondsToTimecode(0)}</Title>
                        <Title size={11} color={colors.secondaryText} fontFamily="Poppins-Regular">-{secondsToTimecode(120)}</Title>
                    </View>
                    <View style={styles.buttons}>
                        <ActionIcon icon={IconPlayerSkipBackFilled} isFilled size={25} />
                        <ActionIcon icon={IconPlayerPauseFilled} isFilled size={50} stroke="transparent" />
                        <ActionIcon icon={IconPlayerSkipForwardFilled} isFilled size={25} />
                    </View>
                </View>
            </View>
        </StyledActionSheet>
    );
}

export default PlaybackSheet;