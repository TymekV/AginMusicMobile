import { StyleSheet, View, ViewProps } from 'react-native';
import { MediaLibItemProps, TMediaLibItem } from './Item';
import { useColors } from '@lib/hooks';
import { useContext, useMemo } from 'react';
import Title from '../Title';
import Cover from '../Cover';
import { LibSize, LibSeparators } from '.';
import { IconChevronRight } from '@tabler/icons-react-native';
import { LinearGradient } from 'expo-linear-gradient';


export default function GridCompactItem({ title, subtitle, coverUri, coverCacheKey, rightSection }: MediaLibItemProps) {
    const size = useContext(LibSize);

    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        item: {
            flex: 1 / 3,
            overflow: 'hidden',
            position: 'relative',
        },
        metadata: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 10,
            zIndex: 2,
        },
        gradient: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 50,
        }
    }), [colors, size]);

    return (
        <View style={styles.item}>
            <Cover
                source={{ uri: coverUri }}
                cacheKey={coverCacheKey}
                // size={50}
                withShadow={false}
            />
            <View style={styles.metadata}>
                {subtitle && <Title size={12} color={colors.text[1]} fontFamily='Poppins-Regular' numberOfLines={1}>{subtitle}</Title>}
                <Title size={14} numberOfLines={1}>{title}</Title>
            </View>
            <LinearGradient style={styles.gradient} colors={['#00000000', '#00000080']} />
        </View>
    )
}