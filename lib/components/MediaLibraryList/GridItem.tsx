import { StyleSheet, useWindowDimensions, View, ViewProps } from 'react-native';
import { MediaLibItemProps, TMediaLibItem } from './Item';
import { useColors } from '@lib/hooks';
import { useContext, useMemo } from 'react';
import Title from '../Title';
import Cover from '../Cover';
import { LibSize, LibSeparators, LibLayout } from '.';
import { IconChevronRight } from '@tabler/icons-react-native';
import React from 'react';

export default function GridItem({ title, subtitle, coverUri, coverCacheKey, rightSection }: MediaLibItemProps) {
    const size = useContext(LibSize);
    const layout = useContext(LibLayout);

    const { width } = useWindowDimensions();

    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        item: {
            overflow: 'hidden',
        },
        metadata: {
            marginTop: 5,
        },
        horizontalItem: {
            maxWidth: (width - 40 - 10) / 2,
        }
    }), [colors, size, width]);

    return (
        <View style={[styles.item, layout == 'horizontal' && styles.horizontalItem]}>
            <Cover
                source={{ uri: coverUri }}
                cacheKey={coverCacheKey}
                withShadow={false}
            />
            <View style={styles.metadata}>
                <Title size={14} numberOfLines={1}>{title}</Title>
                {subtitle && <Title size={12} color={colors.text[1]} fontFamily='Poppins-Regular' numberOfLines={1}>{subtitle}</Title>}
            </View>
        </View>
    )
}