import { StyleSheet, View } from 'react-native';
import { TMediaLibItem } from './Item';
import { useColors } from '@lib/hooks';
import { useContext, useMemo } from 'react';
import Title from '../Title';
import Cover from '../Cover';
import { LibCompact } from '.';
import { IconChevronRight } from '@tabler/icons-react-native';

export default function ListItem({ title, subtitle, coverUri, coverCacheKey }: TMediaLibItem) {
    const compact = useContext(LibCompact);
    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border[0],
        },
        itemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: compact ? 10 : 12,
        }
    }), [colors, compact]);

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <Cover
                    source={{ uri: coverUri }}
                    cacheKey={coverCacheKey}
                    size={compact ? 40 : 60}
                    radius={compact ? 6 : 8}
                    withShadow={false}
                />
                <View>
                    <Title size={compact ? 14 : 16}>{title}</Title>
                    {subtitle && <Title size={12} color={colors.text[1]} fontFamily='Poppins-Regular'>{subtitle}</Title>}
                </View>
            </View>
            {!compact && <IconChevronRight size={16} color={colors.text[1]} />}
        </View>
    )
}