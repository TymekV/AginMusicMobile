import { useColors } from '@lib/hooks';
import { Icon } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { StyleSheet, TouchableHighlight, TouchableHighlightProps, View } from 'react-native';
import Title from '../Title';

export interface SheetOptionProps extends TouchableHighlightProps {
    icon?: Icon;
    label: string;
    description?: string;
    variant?: 'default' | 'destructive';
}

export default function SheetOption({ icon: Icon, label, description, variant = 'default', ...props }: SheetOptionProps) {
    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 25,
            height: 50,
            gap: 12,
        },
        metadata: {
            flex: 1,
            overflow: 'hidden',
        },
    }), [colors]);

    return (
        <TouchableHighlight underlayColor={colors.secondaryBackground} {...props}>
            <View style={styles.option}>
                {Icon && <Icon size={20} color={variant == 'destructive' ? colors.danger : colors.text[0]} />}
                <View>
                    <Title size={14} fontFamily="Poppins-SemiBold" numberOfLines={1} color={variant == 'destructive' ? colors.danger : colors.text[0]}>{label}</Title>
                    {description && <Title size={11} fontFamily="Poppins-Regular" color={variant == 'destructive' ? colors.danger : colors.text[1]} numberOfLines={1}>{description}</Title>}
                </View>
            </View>
        </TouchableHighlight>
    )
}