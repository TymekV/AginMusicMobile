import { useColors } from '@lib/hooks';
import { Icon } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from './Title';

export type FullscreenMessageProps = {
    icon: Icon;
    label: string;
    description?: string;
}

export default function FullscreenMessage({ icon: Icon, label, description }: FullscreenMessageProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            marginBottom: 5,
        }
    }), []);

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Icon size={32} color={colors.text[1]} />
            </View>
            <Title size={16} align='center'>{label}</Title>
            <Title size={12} align='center' fontFamily='Poppins-Regular' color={colors.text[1]}>{description}</Title>
        </View>
    )
}