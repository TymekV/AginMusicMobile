import CachedImage from '@/lib/components/CachedImage';
import { ImageSource } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export type CoverProps = {
    source: ImageSource;
    cacheKey?: string;
}

export default function Cover({ source, cacheKey }: CoverProps) {
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
            width: '100%',
            // height: 300,
            aspectRatio: 1 / 1,
            borderRadius: 15,
            borderColor: '#ffffff10',
            borderWidth: 1,
        }
    }), []);

    return (
        <View style={styles.container}>
            <CachedImage uri={source.uri ?? ''} cacheKey={cacheKey} style={styles.image} />
        </View>
    )
}