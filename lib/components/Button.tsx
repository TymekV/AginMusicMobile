import { StyleSheet, TouchableHighlight, TouchableHighlightProps, View, ViewStyle } from 'react-native';
import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { CustomFont } from '../types';
import Title from './Title';

export type ButtonVariant = 'primary' | 'subtle' | 'danger';

type VariantConfig = {
    styles: ViewStyle;
    fontFamily?: CustomFont;
    textColor: string;
}

export interface ButtonProps extends TouchableHighlightProps {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    disabled?: boolean;
}

export default function Button({ children, variant = 'primary', disabled, onPress, ...props }: ButtonProps) {
    const colors = useColors();

    const variants = useMemo<Record<ButtonVariant, VariantConfig>>(() => ({
        primary: {
            styles: {
                backgroundColor: colors.tint,
            },
            textColor: colors.tintText,
            fontFamily: 'Poppins-SemiBold',
        },
        subtle: {
            styles: {
                backgroundColor: colors.background,
            },
            textColor: colors.text[1],
            fontFamily: 'Poppins-SemiBold',
        },
        danger: {
            styles: {
                backgroundColor: colors.danger,
            },
            textColor: colors.text[0],
            fontFamily: 'Poppins-SemiBold',
        }
    }), [colors]);

    const variantStyles = variants[variant];

    const styles = useMemo(() => StyleSheet.create({
        touchable: {
            borderRadius: 12,
        },
        button: {
            borderRadius: 12,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            opacity: disabled ? 0.5 : 1,
            ...variantStyles.styles,
        },
    }), [variantStyles, disabled]);

    return (
        <TouchableHighlight onPress={disabled ? undefined : onPress} {...props} style={styles.touchable}>
            <View style={styles.button}>
                <Title size={15} fontFamily={variantStyles.fontFamily} color={variantStyles.textColor}>{children}</Title>
            </View>
        </TouchableHighlight>
    )
}