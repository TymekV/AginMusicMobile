import { Pressable, StyleSheet, View } from 'react-native';
import Title from './Title';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useColors } from '@/lib/hooks/useColors';
import CachedImage from '@/lib/components/CachedImage';
import ActionIcon from './ActionIcon';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerTrackNextFilled } from '@tabler/icons-react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useCoverBuilder } from '@lib/hooks/useCoverBuilder';
import { useGlobalPlayer, useQueue } from '@lib/hooks';
import { useAudioPlayerStatus } from 'expo-audio';
import SkipSwipe from './SkipSwipe';
import { Child } from '@lib/types';
import Animated, { Easing, FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import React from 'react';

function RenderItem(item: Child) {
    const colors = useColors();
    const cover = useCoverBuilder();
    const { nowPlaying } = useQueue();
    const isEmpty = nowPlaying.id === '';

    const styles = useMemo(() => StyleSheet.create({
        metadata: {
            paddingLeft: 7,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
        },
        image: {
            width: 41,
            height: 41,
            borderRadius: 9,
        },
        textContainer: {
            flex: 1,
            overflow: 'hidden',
        },
        swipeContainer: {
            overflow: 'hidden',
            flex: 1,
        }
    }), [colors.secondaryBackground]);
    return (
        <View style={styles.metadata}>
            <CachedImage
                uri={cover.generateUrl(item.coverArt ?? '', { size: 128 })}
                cacheKey={item.coverArt ? `${item.coverArt}-128x128` : 'empty-128x128'}
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Title size={14} fontFamily="Poppins-SemiBold" numberOfLines={1}>
                    {isEmpty ? 'Not Playing' : item.title}
                </Title>
                {!isEmpty && (
                    <Title
                        size={12}
                        fontFamily="Poppins-Regular"
                        color={colors.text[1]}
                        numberOfLines={1}
                    >
                        {item.artist}
                    </Title>
                )}
            </View>
        </View>
    )
}

export default function Miniplayer() {
    const colors = useColors();

    const queue = useQueue();
    const { nowPlaying } = queue;

    const player = useGlobalPlayer();
    const status = player ? useAudioPlayerStatus(player) : null;

    const [carouselWidth, setCarouselWidth] = useState(0);

    const containerRef = useRef<View>(null);

    useLayoutEffect(() => {
        containerRef.current?.measureInWindow((x, y, width) => {
            setCarouselWidth(width);
        });
    }, [containerRef.current]);

    const styles = useMemo(() => StyleSheet.create({
        miniplayer: {
            backgroundColor: colors.secondaryBackground,
            marginHorizontal: 15,
            borderRadius: 16,
            height: 55,
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // paddingLeft: 7,
            overflow: 'hidden',
        },
        metadata: {
            paddingLeft: 7,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
        },
        image: {
            width: 41,
            height: 41,
            borderRadius: 9,
        },
        textContainer: {
            flex: 1,
            overflow: 'hidden',
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
        },
        swipeContainer: {
            overflow: 'hidden',
            flex: 1,
        }
    }), [colors.secondaryBackground]);

    const isEmpty = nowPlaying.id === '';

    return (
        <>
            {!isEmpty && <Animated.View entering={FadeInDown.duration(300).easing(Easing.inOut(Easing.ease))} exiting={FadeOutDown.duration(300).easing(Easing.inOut(Easing.ease))}>
                <Pressable onPress={() => SheetManager.show('playback')} style={styles.miniplayer}>
                    <View style={styles.swipeContainer} ref={containerRef}>
                        {carouselWidth != 0 && <SkipSwipe width={carouselWidth} renderItem={RenderItem} />}
                    </View>
                    {!isEmpty && (
                        <View style={styles.actions}>
                            <ActionIcon icon={status?.playing ? IconPlayerPauseFilled : IconPlayerPlayFilled} size={24} stroke="transparent" isFilled onPress={() => status?.playing ? player?.pause() : player?.play()} />
                            <ActionIcon icon={IconPlayerTrackNextFilled} size={18} isFilled onPress={() => queue.skipForward()} disabled={!queue.canGoForward} />
                        </View>
                    )}
                </Pressable>
            </Animated.View>}
        </>
    );
}
