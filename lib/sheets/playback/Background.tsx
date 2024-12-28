import { BlurView } from "expo-blur";
import { ImageSource } from "expo-image"
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import CachedImage from '@/lib/components/CachedImage';

export type BackgroundProps = {
    source: ImageSource;
    cacheKey: string;
}

export default function Background({ source, cacheKey }: BackgroundProps) {
    const styles = useMemo(() => StyleSheet.create({
        image: {
            // height: '100%',
            flex: 1,
        },
        container: {
            position: 'relative',
            flex: 1,
        },
        blur: {
            ...StyleSheet.absoluteFillObject,
        }
    }), []);

    return (
        <View style={styles.container}>
            <CachedImage uri={source.uri ?? ''} cacheKey={cacheKey} style={styles.image} />
            <BlurView
                intensity={100}
                experimentalBlurMethod="dimezisBlurView"
                tint="dark"
                style={styles.blur}
            />
        </View>
    )
}