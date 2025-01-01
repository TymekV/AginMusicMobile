import { useColors } from '@lib/hooks';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from './Title';
import Avatar from './Avatar';
import ActionIcon from './ActionIcon';
import { IconChevronLeft } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export type HeaderProps = {
    title?: string;
    subtitle?: string;
    rightSection?: React.ReactNode;
    withBackIcon?: boolean;
    withAvatar?: boolean;
    floating?: boolean;
    rightSpacing?: number;
};

export default function Header({ title, subtitle, rightSection, withBackIcon = false, withAvatar = true, floating = false, rightSpacing = 10 }: HeaderProps) {
    const colors = useColors();

    const Root = floating ? SafeAreaView : View;

    const styles = useMemo(() => StyleSheet.create({
        header: {
            paddingHorizontal: 20,
            paddingTop: 10,
        },
        floatingHeader: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
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
        },
        rightContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: rightSpacing,
        }
    }), [colors, rightSpacing]);

    return (
        <Root style={[styles.header, floating && styles.floatingHeader]}>
            <View style={styles.top}>
                <View style={styles.iconGroup}>
                    {withBackIcon && <ActionIcon icon={IconChevronLeft} size={16} variant='secondary' onPress={() => router.back()} />}
                    <View>
                        {title && <Title size={24} fontFamily='Poppins-SemiBold'>{title}</Title>}
                    </View>
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
    )
}