import { StyledActionSheet } from '@/lib/components/StyledActionSheet';
import { StyleSheet, View } from 'react-native';
import { SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { useColors } from '@/lib/hooks/useColors';
import { useQueue } from '@/lib/hooks';
import { useCoverBuilder } from '@/lib/hooks/useCoverBuilder';
import BlurredBackground from '@/lib/components/BlurredBackground';
import { IconCast, IconList, IconMessage } from '@tabler/icons-react-native';
import { showRoutePicker } from 'react-airplay';
import MainTab from './MainTab';
import Tabs, { Tab } from './Tabs';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { enterDown, enterUp, exitDown, exitUp } from './animations';
import Title from '@/lib/components/Title';

function PlaybackSheet({ sheetId, payload }: SheetProps<'playback'>) {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const { nowPlaying } = useQueue();
    const cover = useCoverBuilder();
    const isExternalPlaybackAvailable = true;// useExternalPlaybackAvailability();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            padding: 30,
            // justifyContent: 'space-between',
            // flex: 1,
            height: '100%',
            paddingBottom: Math.max(30, insets.bottom + 10),
        },
        tab: {
            flex: 1,
        },
        tabContainer: {
            flex: 1,
        }
    }), [insets.bottom]);

    const [currentTab, setCurrentTab] = useState('main');
    const [prevTab, setPrevTab] = useState('main');

    const handleTabChange = (newTab: string) => {
        setPrevTab(currentTab); // Store current tab before updating
        setCurrentTab(newTab);  // Update to new tab
    };

    const tabs = useMemo((): Tab[] => [
        {
            icon: IconMessage,
            value: 'lyrics',
        },
        {
            icon: IconCast,
            value: 'cast',
            onPress: () => showRoutePicker({ prioritizesVideoDevices: false }),
            disabled: !isExternalPlaybackAvailable,
        },
        {
            icon: IconList,
            value: 'queue',
        },
    ], []);

    return (
        <StyledActionSheet
            gestureEnabled={true}
            fullHeight
            safeAreaInsets={{ ...insets, bottom: 0, }}
            overdrawEnabled={false}
            drawUnderStatusBar
            containerStyle={{ backgroundColor: colors.background, margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}
            openAnimationConfig={{ bounciness: 0 }}
            closeAnimationConfig={{ bounciness: 0 }}
            isModal={false}
            CustomHeaderComponent={<View></View>}
            useBottomSafeAreaPadding={true}
        >
            <BlurredBackground source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '') }} cacheKey={nowPlaying.coverArt ? `${nowPlaying.coverArt}-full` : 'empty-full'} />
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    {currentTab == 'main' && <Animated.View style={styles.tab} exiting={exitUp} entering={enterDown}>
                        <MainTab />
                    </Animated.View>}
                    {currentTab == 'queue' && <Animated.View style={styles.tab} exiting={exitDown} entering={enterUp}>
                        <Title>Queue</Title>
                    </Animated.View>}
                    {currentTab == 'lyrics' && <Animated.View style={styles.tab} exiting={exitDown} entering={enterUp}>
                        <Title>Lyrics</Title>
                    </Animated.View>}
                </View>
                <Tabs tabs={tabs} active={currentTab} onChange={handleTabChange} />
            </View>
        </StyledActionSheet>
    );
}

export default PlaybackSheet;