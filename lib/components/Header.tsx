import { useColors } from '@lib/hooks';
import React, { useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Title from './Title';
import Avatar from './Avatar';
import ActionIcon from './ActionIcon';
import { IconChevronLeft } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { AnimatedRef, interpolate, interpolateColor, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/component/ScrollView';

export type HeaderProps = {
    title?: string;
    subtitle?: string;
    rightSection?: React.ReactNode;
    withBackIcon?: boolean;
    withAvatar?: boolean;
    floating?: boolean;
    rightSpacing?: number;
    scrollRef?: AnimatedRef<any>;
    interpolationRange?: [number, number];
    initialHideTitle?: boolean;
    titleSize?: number;
};

export default function Header({ title, subtitle, rightSection, withBackIcon = false, withAvatar = true, floating = false, rightSpacing = 10, scrollRef, interpolationRange = [0, 200], initialHideTitle = false, titleSize = 24 }: HeaderProps) {
    const colors = useColors();

    const Root = floating ? SafeAreaView : View;

    const scrollOffset = useScrollViewOffset(scrollRef ?? null);

    const navbarStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            scrollOffset ? scrollOffset.value : 0,
            interpolationRange,
            [colors.background + '00', colors.background],
        ),
        borderColor: interpolateColor(
            scrollOffset ? scrollOffset.value : 0,
            interpolationRange,
            ['transparent', colors.border[0]],
        ),
    }));

    const titleStyle = useAnimatedStyle(() => ({
        opacity: initialHideTitle ? interpolate(
            scrollOffset ? scrollOffset.value : 0,
            interpolationRange,
            [0, 1],
        ) : 1,
    }));

    const styles = useMemo(() => StyleSheet.create({
        header: {
            paddingHorizontal: 20,
            paddingTop: 10,
            overflow: 'hidden',
            maxWidth: '100%',
        },
        titleContainer: {
            flex: 1,
        },
        floatingHeader: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            paddingBottom: 15,
            borderBottomWidth: 1,
        },
        top: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        iconGroup: {
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            overflow: 'hidden',
        },
        iconGroupLeft: {
            gap: 12,
            flex: 1,
        },
        rightContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: rightSpacing,
        }
    }), [colors, rightSpacing]);

    return (
        <Animated.View style={[floating && styles.floatingHeader, navbarStyle]}>
            <Root style={styles.header} edges={['top']}>
                <View style={styles.top}>
                    <View style={[styles.iconGroup, styles.iconGroupLeft]}>
                        {withBackIcon && <ActionIcon icon={IconChevronLeft} size={16} variant='secondary' onPress={() => router.back()} />}
                        <Animated.View style={[styles.titleContainer, titleStyle]}>
                            {title && <Title size={titleSize} fontFamily='Poppins-SemiBold' numberOfLines={1}>{title}</Title>}
                        </Animated.View>
                    </View>
                    <View style={styles.iconGroup}>
                        <View style={styles.rightContent}>
                            {rightSection}
                        </View>
                        {withAvatar && <Avatar />}
                    </View>
                </View>
                {subtitle && <Title size={14} fontFamily='Poppins-Regular' color={colors.text[1]}>{subtitle}</Title>}
            </Root>
        </Animated.View>
    )
}