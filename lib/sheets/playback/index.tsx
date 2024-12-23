import { SheetContainer, StyledActionSheet } from "@/lib/components/StyledActionSheet";
import { Platform, View } from "react-native";
import { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Background from "./Background";
import { useEffect, useState } from "react";
import { getColors, ImageColorsResult } from "react-native-image-colors";
import { Image } from "expo-image";
import { AndroidImageColors, IOSImageColors, WebImageColors } from "react-native-image-colors/build/types";
import { useColors } from "@/lib/hooks/useColors";

function PlaybackSheet({ sheetId, payload }: SheetProps<'playback'>) {
    const insets = useSafeAreaInsets();

    const colors = useColors();

    const [coverColors, setCoverColors] = useState<ImageColorsResult>();

    const url = 'https://cdn.swiatksiazki.pl/media/catalog/product/6/8/6899907019068-1.jpg?width=650&height=650&store=default&image-type=small_image';

    useEffect(() => {
        (async () => {
            const colors = await getColors(url, {
                fallback: '#228B22',
                cache: true,
                key: url,
            })
            setCoverColors(colors);
        })();
    }, []);

    return (
        <StyledActionSheet
            gestureEnabled={true}
            fullHeight
            safeAreaInsets={insets}
            // safeAreaInsets={{ bottom: 0, left: 0, right: 0, top: 0 }}
            // overdrawEnabled={false}
            drawUnderStatusBar
            containerStyle={{ backgroundColor: Platform.OS == 'ios' ? (coverColors as IOSImageColors)?.background : Platform.OS == 'android' ? (coverColors as AndroidImageColors)?.dominant : colors.sheetBackgroundColor, }}
            indicatorStyle={{ backgroundColor: '#ffffff20' }}
            openAnimationConfig={{ bounciness: 0 }}
            closeAnimationConfig={{ bounciness: 0 }}
            isModal={false}
        // CustomHeaderComponent={<Background source={{ uri: 'https://cdn.swiatksiazki.pl/media/catalog/product/6/8/6899907019068-1.jpg?width=650&height=650&store=default&image-type=small_image' }} />}
        >
            <SheetContainer>
                <Image style={{ width: 100, height: 100 }} source={{ uri: url }} />
                {/* <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'red' }}></View> */}
            </SheetContainer>
        </StyledActionSheet>
    );
}

export default PlaybackSheet;