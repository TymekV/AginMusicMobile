import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from '@lib/components/Title';

export type SearchSectionProps = {
    label?: string;
}

export default function SearchSection({ label }: SearchSectionProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border[0],
        },
    }), [colors]);

    return (
        <View style={styles.container}>
            <Title size={14} fontFamily='Poppins-SemiBold'>{label}</Title>
        </View>
    )
}