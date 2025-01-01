import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { StyleSheet, TouchableHighlight, TouchableHighlightProps, View } from 'react-native';
import Title from '@lib/components/Title';
import { Icon } from '@tabler/icons-react-native';

export interface SettingSectionProps {
    icon?: Icon;
    label: string;
    description?: string;
}

export default function SettingsSection({ icon, label, description, ...props }: SettingSectionProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        option: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 15,
            paddingBottom: 5,
            borderTopWidth: 1,
            borderTopColor: colors.border[0],
            marginTop: 5,
        },
    }), [colors]);

    return (
        <TouchableHighlight underlayColor={colors.secondaryBackground} {...props}>
            <View style={styles.option}>
                <View>
                    <Title size={16} fontFamily='Poppins-SemiBold'>{label}</Title>
                    {description && <Title size={14} color={colors.text[1]} fontFamily="Poppins-Regular">{description}</Title>}
                </View>
            </View>
        </TouchableHighlight>
    )
}