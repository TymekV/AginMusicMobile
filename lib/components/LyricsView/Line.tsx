import { useColors } from '@lib/hooks';
import { Line } from '@lib/types';
import { IconDots } from '@tabler/icons-react-native';
import { useEffect, useMemo, useRef } from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export interface LineProps extends PressableProps {
    line: Line;
    active: boolean;
    onPress: () => void;
}

export default function LyricsLine({ line, active, ...props }: LineProps) {
    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        line: {
            padding: 10,
            borderRadius: 15,
        },
        lineText: {
            fontSize: 24,
            fontFamily: 'Poppins-SemiBold',
            color: colors.text[0],
            // textShadowColor: colors.text[0], // Adjust shadow color for better visibility
            // textShadowOffset: { width: 0, height: 0 },
            // textShadowRadius: 10,
        },
        dotsContainer: {
            marginLeft: -4,
        },
        dots: {
            width: 40,
            transformOrigin: 'left center',
        }
    }), [colors]);

    const ref = useRef<Animated.View>(null);

    const isSilence = line.value === '';

    const lineOpacity = useSharedValue(active ? 1 : .2);

    const dotsScale = useSharedValue(1);

    const lineTextStyles = useAnimatedStyle(() => ({
        opacity: lineOpacity.value,
    }));

    const scaleDownAnimation = useSharedValue(1);
    const backgroundColor = useSharedValue('#ffffff00');

    const scaleHandler = Gesture.Tap()
        .onBegin(() => {
            "worklet";
            scaleDownAnimation.value = withSpring(0.98);
            backgroundColor.value = withSpring('#ffffff10');
        })
        .onFinalize(() => {
            "worklet";
            scaleDownAnimation.value = withSpring(1);
            backgroundColor.value = withSpring('#ffffff00');
        });

    const lineStyles = useAnimatedStyle(() => ({
        transform: [{ scale: scaleDownAnimation.value }],
        backgroundColor: backgroundColor.value,
    }));

    const dotsStyles = useAnimatedStyle(() => ({
        transform: [{ scale: dotsScale.value }],
    }));

    useEffect(() => {
        lineOpacity.value = withTiming(active ? 1 : .2, { duration: 200 });
        dotsScale.value = withTiming(active ? 1.5 : 1, { duration: 500, easing: Easing.inOut(Easing.ease) });
    }, [active]);

    return (
        <GestureDetector gesture={scaleHandler}>
            <Pressable {...props}>
                <Animated.View style={[styles.line, lineStyles]} ref={ref}>
                    {isSilence && <View style={styles.dotsContainer}>
                        <Animated.View style={[styles.dots, lineTextStyles, dotsStyles]}>
                            <IconDots size={40} color={colors.text[0]} />
                        </Animated.View>
                    </View>}
                    {!isSilence && <Animated.Text style={[styles.lineText, lineTextStyles]}>{line.value}</Animated.Text>}
                </Animated.View>
            </Pressable>
        </GestureDetector>
    )
}