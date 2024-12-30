import { useColors } from '@lib/hooks';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from './Title';
import Avatar from './Avatar';
import ActionIcon from './ActionIcon';
import { IconChevronLeft } from '@tabler/icons-react-native';
import { router } from 'expo-router';

export type HeaderProps = {
    title?: string;
    subtitle?: string;
    rightSection?: React.ReactNode;
    withBackIcon?: boolean;
    withAvatar?: boolean;
};

export default function Header({ title, subtitle, rightSection, withBackIcon = false, withAvatar = true }: HeaderProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        header: {
            paddingHorizontal: 20,
            paddingTop: 10,
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
        }
    }), [colors]);

    return (
        <View style={styles.header}>
            <View style={styles.top}>
                <View style={styles.iconGroup}>
                    {withBackIcon && <ActionIcon icon={IconChevronLeft} size={16} variant='secondary' onPress={() => router.back()} />}
                    <View>
                        {title && <Title size={24} fontFamily='Poppins-SemiBold'>{title}</Title>}
                        {subtitle && <Title size={14} fontFamily='Poppins-Regular' color={colors.text[1]}>{subtitle}</Title>}
                    </View>
                </View>
                <View style={styles.iconGroup}>
                    <View style={styles.rightContent}>
                        {rightSection}
                    </View>
                    {withAvatar && <Avatar />}
                </View>
            </View>
        </View>
    )
}