import { useColors } from '@/lib/hooks/useColors';
import { Icon } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

export interface NowPlayingTabProps extends TouchableOpacityProps {
    icon: Icon;
    active: boolean;
}

export default function NowPlayingTab({ icon: Icon, active, ...props }: NowPlayingTabProps) {
    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        tab: {
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
        },
        activeTab: {
            backgroundColor: colors.text[1],
        }
    }), [colors]);

    const iconColor = active ? colors.background : colors.text[1];

    return (
        <TouchableOpacity activeOpacity={.6} {...props}>
            <View style={[styles.tab, active && styles.activeTab]}>
                <Icon color={iconColor} size={22} />
            </View>
        </TouchableOpacity>
    )
}