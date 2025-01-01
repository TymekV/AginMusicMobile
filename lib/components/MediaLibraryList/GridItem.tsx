import { StyleSheet, View, ViewProps } from 'react-native';
import { MediaLibItemProps, TMediaLibItem } from './Item';
import { useColors } from '@lib/hooks';
import { useContext, useMemo } from 'react';
import Title from '../Title';
import Cover from '../Cover';
import { LibSize, LibSeparators } from '.';
import { IconChevronRight } from '@tabler/icons-react-native';

export default function GridItem({ title, subtitle, coverUri, coverCacheKey, rightSection }: MediaLibItemProps) {
    const size = useContext(LibSize);

    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        item: {
            flex: 1 / 2,
            overflow: 'hidden',
        },
        metadata: {
            marginTop: 5,
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
                <Title size={14} numberOfLines={1}>{title}</Title>
                {subtitle && <Title size={12} color={colors.text[1]} fontFamily='Poppins-Regular' numberOfLines={1}>{subtitle}</Title>}
            </View>
        </View>
    )
}