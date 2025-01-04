import { useColors } from '@lib/hooks';
import { Icon } from '@tabler/icons-react-native';
import { Image, ImageSource } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export type CoverProps = {
    source?: ImageSource;
    cacheKey?: string;
    size?: number;
    radius?: number;
    withShadow?: boolean;
    icon?: Icon;
}

export default function Cover({ source, size, radius, withShadow = true, cacheKey, icon: Icon }: CoverProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,

            elevation: 5,
        },
        image: {
            width: size ?? '100%',
            // height: 300,
            aspectRatio: 1 / 1,
            borderRadius: radius ?? 15,
            borderColor: '#ffffff10',
            borderWidth: 1,
        },
        icon: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.secondaryBackground,
        }
    }), [size, radius, colors]);

    return (
        <View style={withShadow && styles.container}>
            {Icon ? <View style={[styles.image, styles.icon]}>
                <Icon size={20} color={colors.forcedTint} />
            </View> : <Image source={{ ...source, cacheKey }} style={styles.image} cachePolicy="disk" />}
        </View>
    )
}