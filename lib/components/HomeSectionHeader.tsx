import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from './Title';

export type HomeSectionHeaderProps = {
    label: string;
    description?: string;
}

export default function HomeSectionHeader({ label, description }: HomeSectionHeaderProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        section: {
            paddingHorizontal: 20,
            paddingTop: 15,
            paddingBottom: 5,
        }
    }), []);

    return (
        <View style={styles.section}>
            <Title size={18} fontFamily='Poppins-SemiBold'>{label}</Title>
            <Title size={12} fontFamily='Poppins-Regular' color={colors.text[1]}>{description}</Title>
        </View>
    )
}