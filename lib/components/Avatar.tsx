import { useColors, useServer } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, TouchableHighlight, TouchableHighlightProps, View } from 'react-native';
import Title from './Title';

export interface AvatarProps extends TouchableHighlightProps {
    size?: number;
    children?: React.ReactNode;
};

export default function Avatar({ size, children, ...props }: AvatarProps) {
    const colors = useColors();
    const server = useServer();

    const styles = useMemo(() => StyleSheet.create({
        avatar: {
            width: 30,
            height: 30,
            borderRadius: 99999,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.tint,
        },
        touchable: {
            borderRadius: 99999,
        }
    }), [colors]);

    return (
        <TouchableHighlight style={styles.touchable} {...props}>
            <View style={styles.avatar}>
                <Title size={15} color={colors.tintText}>{children ?? server.server.auth.username?.charAt(0).toUpperCase()}</Title>
            </View>
        </TouchableHighlight>
    )
}