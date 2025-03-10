import { useMemo } from 'react';
import { useColors } from '@lib/hooks/useColors';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSource } from 'expo-image';

export type BlurredBackgroundProps = {
    source: ImageSource;
    cacheKey?: string;
    animated?: boolean;
}

export default function BlurredBackground({ source, cacheKey, animated }: BlurredBackgroundProps) {
    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        background: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 0,
            // height: '100%'
            // backgroundColor: 'red'
        },
        image: {
            width: '100%',
            // height: 500,
            // height: 800,
            flex: 1,
            opacity: .6,
            objectFit: 'cover',
        },
        gradient: {
            position: 'absolute',
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        }
    }), [colors.background]);

    return (
        <View style={styles.background}>
            <Image style={styles.image} source={{ ...source, cacheKey }} blurRadius={500} cachePolicy="disk" transition={animated ? { duration: 1000, effect: 'cross-dissolve', timing: 'ease-in-out' } : undefined} />
            <LinearGradient style={styles.gradient} colors={[colors.background + '50', colors.background + '90']} />
        </View>
    )
}