import { StyledActionSheet } from "@/lib/components/StyledActionSheet";
import { Platform, StyleSheet, View } from "react-native";
import { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { getColors, ImageColorsResult } from "react-native-image-colors";
import { Image } from "expo-image";
import { AndroidImageColors, IOSImageColors } from "react-native-image-colors/build/types";
import { useColors } from "@/lib/hooks/useColors";
import { useNowPlaying } from "@/lib/hooks";
import { useCoverBuilder } from "@/lib/hooks/useCoverBuilder";
import BlurredBackground from "@/lib/components/BlurredBackground";
import Cover from "@/lib/components/Cover";

function PlaybackSheet({ sheetId, payload }: SheetProps<'playback'>) {
    const insets = useSafeAreaInsets();

    const colors = useColors();

    const [nowPlaying] = useNowPlaying();

    const cover = useCoverBuilder();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            padding: 40,
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
            indicatorStyle={{ backgroundColor: '#ffffff20' }}
            openAnimationConfig={{ bounciness: 0 }}
            closeAnimationConfig={{ bounciness: 0 }}
            statusBarTranslucent
            isModal={false}
            CustomHeaderComponent={<View></View>}
        >
            <BlurredBackground source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }}>
                <View style={styles.container}>
                    <Cover source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }} />
                </View>
            </BlurredBackground>
        </StyledActionSheet>
    );
}

export default PlaybackSheet;