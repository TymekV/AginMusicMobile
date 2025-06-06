import { AwesomeSliderProps, Slider } from 'react-native-awesome-slider';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors } from '../../hooks/useColors';
import React, { useState } from 'react';

export interface NowPlayingSliderProps extends AwesomeSliderProps {
    setSeeking?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NowPlayingSlider({ progress, cache, onSlidingStart, onSlidingComplete, onValueChange, setSeeking, ...props }: NowPlayingSliderProps) {
    const colors = useColors();
    const [realSeeking, setRealSeeking] = useState(false);

    return (
        <Slider
            progress={progress}
            cache={cache}
            theme={{
                disableMinTrackTintColor: colors.text[1],
                maximumTrackTintColor: '#ffffff10',
                minimumTrackTintColor: colors.text[1],
                cacheTrackTintColor: '#ffffff10',
                // bubbleBackgroundColor: colors.secondaryText,
                // bubbleTextColor: '#000000',
                heartbeatColor: colors.text[1],
            }}
            thumbWidth={0}
            containerStyle={{
                borderRadius: 9999,
                height: 5
            }}
            disableTapEvent
            panHitSlop={{ top: 20, left: 0, bottom: 50, right: 0, }}
            onSlidingStart={() => {
                if (setSeeking) setSeeking(true);
                setRealSeeking(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (typeof onSlidingStart == 'function') onSlidingStart();
            }}
            onSlidingComplete={(number) => {
                // TODO: Find a better fix
                if (setSeeking) setTimeout(() => {
                    setSeeking(false);
                }, 500);
                setRealSeeking(false);
                // videoRef?.current?.seek(Math.floor(number));
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (typeof onSlidingComplete == 'function') onSlidingComplete(number);
            }}
            onValueChange={onValueChange}
            // setBubbleText={(s) => displaySeconds(s)}
            renderBubble={() => <></>}
            {...props}
        />
    )
}