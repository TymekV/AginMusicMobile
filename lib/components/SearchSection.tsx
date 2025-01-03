import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Title from '@lib/components/Title';

export type SearchSectionProps = {
    label?: string;
    action?: {
        label: string;
        onPress: () => void;
    }
}

export default function SearchSection({ label, action }: SearchSectionProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border[0],
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    }), [colors]);

    return (
        <View style={styles.container}>
            <Title size={14} fontFamily='Poppins-SemiBold'>{label}</Title>
            {action && <TouchableOpacity onPress={action.onPress}>
                <Title size={12} color={colors.forcedTint} fontFamily='Poppins-Regular'>{action.label}</Title>
            </TouchableOpacity>}
        </View>
    )
}