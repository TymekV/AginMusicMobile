import { useColors } from '@lib/hooks';
import { ImageSource } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Cover from '../Cover';
import Title from '../Title';

type SheetTrackHeaderProps = {
    cover: ImageSource;
    coverCacheKey?: string;
    title?: string;
    artist?: string;
}

export default function SheetTrackHeader({ title, cover, coverCacheKey, artist }: SheetTrackHeaderProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            overflow: 'hidden',
            paddingHorizontal: 25,
            marginBottom: 10,
            paddingBottom: 15,
            paddingTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: colors.border[0],
        },
        metadata: {
            flex: 1,
            overflow: 'hidden',
        }
    }), [colors]);

    return (
        <View style={styles.container}>
            <Cover source={cover} size={50} radius={10} cacheKey={coverCacheKey} />
            <View style={styles.metadata}>
                <Title size={14} fontFamily="Poppins-Medium" numberOfLines={1}>{title}</Title>
                <Title size={12} color={colors.text[1]} fontFamily="Poppins-Regular" numberOfLines={1}>{artist}</Title>
            </View>
        </View>
    )
}