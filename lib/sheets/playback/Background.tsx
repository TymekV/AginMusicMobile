import { BlurView } from "expo-blur";
import { Image, ImageSource } from "expo-image"
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export type BackgroundProps = {
    source: ImageSource;
}

export default function Background({ source }: BackgroundProps) {
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
            <Image source={source} style={styles.image} />
            <BlurView
                intensity={100}
                experimentalBlurMethod="dimezisBlurView"
                tint="dark"
                style={styles.blur}
            />
        </View>
    )
}