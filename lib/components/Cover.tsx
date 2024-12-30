import { Image, ImageSource } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export type CoverProps = {
    source: ImageSource;
    size?: number;
    radius?: number;
    withShadow?: boolean;
}

export default function Cover({ source, size, radius, withShadow = true }: CoverProps) {
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
        }
    }), [size, radius]);

    return (
        <View style={withShadow && styles.container}>
            <Image source={source} style={styles.image} />
        </View>
    )
}