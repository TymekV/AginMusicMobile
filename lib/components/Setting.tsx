import { useColors } from '@lib/hooks';
import { useCallback, useMemo } from 'react';
import { Platform, StyleSheet, Switch, TouchableHighlight, TouchableHighlightProps, View } from 'react-native';
import Title from '@lib/components/Title';
import { Icon } from '@tabler/icons-react-native';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';

export type SettingSelectOption = {
    icon?: Icon;
    label: string;
    description?: string;
    value: string;
}

export interface SettingProps extends TouchableHighlightProps {
    icon?: Icon;
    label: string;
    description?: string;
    value?: string;
    type: 'select' | 'switch' | 'button';
    options?: SettingSelectOption[];
}

export default function Setting({ icon, label, description, value, type, options, ...props }: SettingProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        option: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 10,
            // borderBottomWidth: 1,
            // borderBottomColor: colors.border[0],
        },
    }), [colors]);

    const handlePress = useCallback(async () => {
        if (type == 'select') {
            Haptics.selectionAsync();
            const newValue = await SheetManager.show('settingSelect', {
                payload: {
                    setting: {
                        icon,
                        label,
                        description,
                    },
                    options: options ?? [],
                    value: value ?? '',
                }
            });
        }
    }, [icon, label, description, value, options]);

    return (
        <TouchableHighlight onPress={handlePress} underlayColor={colors.secondaryBackground} {...props}>
            <View style={styles.option}>
                <View>
                    <Title size={14}>{label}</Title>
                    {description && <Title size={12} color={colors.text[1]} fontFamily="Poppins-Regular">{description}</Title>}
                </View>
                {type == 'switch' && <Switch
                    trackColor={{ false: colors.segmentedControlBackground, true: colors.tint }}
                    thumbColor={colors.text[0]}
                    ios_backgroundColor={colors.segmentedControlBackground}
                    value={!!value}
                />}
                {type == 'select' && <Title size={12} color={colors.text[1]}>{value}</Title>}
            </View>
        </TouchableHighlight>
    )
}