import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import Title from '../Title';
import { Icon } from '@tabler/icons-react-native';

export type TTagTab = {
    label: string;
    id: string;
    icon?: Icon;
}

export interface TagTabProps extends TTagTab, Omit<TouchableOpacityProps, 'id'> {
    active: boolean;
}

export default function TagTab({ label, icon: Icon, id, active, ...props }: TagTabProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        tab: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border[0],
            backgroundColor: active ? colors.tint : colors.secondaryBackground,
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
        }
    }), [colors, active]);

    const innerColor = active ? colors.tintText : colors.text[0];

    return (
        <TouchableOpacity activeOpacity={.8} {...props}>
            <View style={styles.tab}>
                {Icon && <Icon size={14} color={innerColor} />}
                <Title size={13} color={innerColor}>{label}</Title>
            </View>
        </TouchableOpacity>
    )
}