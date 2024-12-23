import { Icon, IconProps } from '@tabler/icons-react-native';
import React, { useMemo } from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useColors } from '../hooks/useColors';

export type ActionIconProps = PressableProps & {
    icon: Icon;
    size?: number;
    iconProps?: IconProps;
    isFilled?: boolean;
}

const ActionIcon = ({ icon: Icon, size = 24, isFilled = false, iconProps, ...props }: ActionIconProps) => {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            width: size + 18,
            height: size + 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 999999
        }
    }), [size]);

    const scaleDownAnimation = useSharedValue(1);
    const opacity = useSharedValue(1);
    const backgroundColor = useSharedValue('#ffffff00');

    const scaleHandler = Gesture.Tap()
        .onBegin(() => {
            "worklet";
            scaleDownAnimation.value = withSpring(0.8);
            opacity.value = withSpring(0.5);
            backgroundColor.value = withSpring('#ffffff15');
        })
        .onFinalize(() => {
            "worklet";
            scaleDownAnimation.value = withSpring(1);
            opacity.value = withSpring(1);
            backgroundColor.value = withSpring('#ffffff00');
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleDownAnimation.value }],
        opacity: opacity.value,
        backgroundColor: backgroundColor.value,
    }));

    return (
        <GestureDetector gesture={scaleHandler}>
            <Pressable {...props}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    <Icon color={colors.text} fill={isFilled ? colors.text : undefined} size={size} {...iconProps} />
                </Animated.View>
            </Pressable>
        </GestureDetector>
    )
}

export default React.memo(ActionIcon);
