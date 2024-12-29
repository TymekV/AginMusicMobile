import { useColors } from '@lib/hooks';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from './Title';
import Avatar from './Avatar';

export type HeaderProps = {
    title?: string;
    subtitle?: string;
    rightSection?: React.ReactNode;
};

export default function Header({ title, subtitle, rightSection }: HeaderProps) {
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
        }
    }), [colors]);

    return (
        <View style={styles.header}>
            <View style={styles.top}>
                <View>
                    <Title size={24} fontFamily='Poppins-SemiBold'>{title}</Title>
                    {subtitle && <Title size={14} fontFamily='Poppins-Regular' color={colors.text[1]}>{subtitle}</Title>}
                </View>
                <Avatar />
            </View>
        </View>
    )
}