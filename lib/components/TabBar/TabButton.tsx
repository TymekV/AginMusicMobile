import { forwardRef, Ref, useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { Icon } from '@tabler/icons-react-native';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { useColors } from '@/lib/hooks/useColors';
import Title from '../Title';

export type TabButtonProps = TabTriggerSlotProps & {
    label: string;
    icon: Icon;
}

export const TabButton = forwardRef(({ icon: Icon, label, isFocused, ...props }: TabButtonProps, ref: Ref<View>) => {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        tab: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 5,
            padding: 10,
            paddingBottom: 0,
            flex: 1,
        }
    }), []);

    return (
        <Pressable ref={ref} {...props} style={styles.tab}>
            <Icon color={isFocused ? colors.tabIconSelected : colors.tabIconDefault} />
            <Title size={10} color={isFocused ? colors.tabIconSelected : colors.tabIconDefault}>{label}</Title>
        </Pressable>
    )
});