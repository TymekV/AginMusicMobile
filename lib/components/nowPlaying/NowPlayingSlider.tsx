import { AwesomeSliderProps, Slider } from 'react-native-awesome-slider';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors } from '../../hooks/useColors';
import React from 'react';

export interface NowPlayingSliderProps extends AwesomeSliderProps {

}

export default function NowPlayingSlider({ progress, cache, onSlidingStart, onSlidingComplete, onValueChange, ...props }: NowPlayingSliderProps) {
    const colors = useColors();

    return (
        <Slider
            progress={progress}
            cache={cache}
            theme={{
                disableMinTrackTintColor: colors.secondaryText,
                maximumTrackTintColor: '#ffffff10',
                minimumTrackTintColor: colors.secondaryText,
                cacheTrackTintColor: '#ffffff10',
                // bubbleBackgroundColor: colors.secondaryText,
                // bubbleTextColor: '#000000',
                heartbeatColor: colors.secondaryText,
            }}
            thumbWidth={0}
            containerStyle={{
                borderRadius: 9999,
                height: 5
            }}
            disableTapEvent
            panHitSlop={{ top: 20, left: 0, bottom: 50, right: 0, }}
            onSlidingStart={() => {
                // setSeeking(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (typeof onSlidingStart == 'function') onSlidingStart();
            }}
            onSlidingComplete={(number) => {
                // setSeeking(false);
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