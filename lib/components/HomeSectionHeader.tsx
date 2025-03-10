import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Title from './Title';
import { Icon, IconChevronRight } from '@tabler/icons-react-native';

export type HomeSectionHeaderProps = {
    label: string;
    description?: string;
    action?: {
        label?: string;
        onPress: () => void;
        type?: 'text' | 'more';
    }
}

export default function HomeSectionHeader({ label, description, action }: HomeSectionHeaderProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        section: {
            paddingHorizontal: 20,
            paddingTop: 15,
            paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    }), []);

    return (
        <Pressable onPress={action && action.type == 'more' ? action.onPress : () => { }}>
            <View style={styles.section}>
                <View>
                    <Title size={18} fontFamily='Poppins-SemiBold'>{label}</Title>
                    {description && <Title size={12} fontFamily='Poppins-Regular' color={colors.text[1]}>{description}</Title>}
                </View>
                {action && action.type == 'text' && <TouchableOpacity onPress={action.onPress}>
                    <Title size={12} color={colors.forcedTint} fontFamily='Poppins-Regular'>{action.label}</Title>
                </TouchableOpacity>}
                {action && action.type == 'more' && <IconChevronRight size={20} color={colors.text[1]} />}
            </View>
        </Pressable>
    )
}