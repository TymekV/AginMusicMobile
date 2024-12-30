import { useColors } from '@lib/hooks';
import { Icon } from '@tabler/icons-react-native';
import { forwardRef, useMemo, useState } from 'react';
import { NativeSyntheticEvent, Platform, StyleSheet, Text, TextInput, TextInputFocusEventData, TextInputProps, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
    icon?: Icon,
    noIcon?: boolean,
    withBg?: boolean,
    label?: string,
    inputStyle?: TextStyle,
    containerStyle?: ViewStyle,
    compact?: boolean,
    style?: ViewStyle,
}

export const Input = forwardRef<TextInput, InputProps>((props, ref) => {
    const { icon: Icon, noIcon, withBg, label, placeholder, style, onPress, inputStyle, onFocus, onBlur, compact, containerStyle, ...other } = (props || {});
    const colors = useColors();

    const [isFocused, setIsFocused] = useState(false);

    const styles = useMemo(() => StyleSheet.create({
        inputContainer: {
            width: compact ? 45 : '100%',
            height: 60,
            paddingHorizontal: compact ? 0 : 20,
            borderWidth: 1.5,
            borderColor: isFocused ? colors.tint : colors.border[0],
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            ...(compact && {
                flexDirection: 'row',
                justifyContent: 'center',
            }),
            ...containerStyle,
        },
        input: {
            fontFamily: 'Poppins-Medium',
            fontSize: compact ? 20 : 15,
            color: colors.text[0],
            flex: 1,
            height: '100%',
            ...(compact && {
                textAlign: 'center',
            }),
            ...inputStyle,
        },
        label: {
            fontFamily: 'Poppins-Medium',
            color: colors.text[0],
            fontSize: 15,
            marginLeft: 12,
            marginBottom: 5,
        }
    }), [inputStyle, colors, isFocused]);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={style}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.inputContainer, withBg ? { backgroundColor: colors.background } : {}]}>
                    {Icon && <Icon />}
                    <TextInput
                        placeholder={placeholder ?? ''}
                        placeholderTextColor={colors.text[1]}
                        style={styles.input}
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...other}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
});
