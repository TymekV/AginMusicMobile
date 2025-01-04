import { StyleSheet, View, ViewProps } from 'react-native';
import { MediaLibItemProps, TMediaLibItem } from './Item';
import { useColors } from '@lib/hooks';
import { useContext, useMemo } from 'react';
import Title from '../Title';
import Cover from '../Cover';
import { LibSize, LibSeparators } from '.';
import { IconChevronRight } from '@tabler/icons-react-native';

export default function ListItem({ title, subtitle, coverUri, coverCacheKey, rightSection, isAlbumEntry, trackNumber, type, icon }: MediaLibItemProps) {
    const size = useContext(LibSize);
    const withSeparators = useContext(LibSeparators);

    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: withSeparators ? 10 : size == 'small' ? 8 : 6,
            paddingHorizontal: 20,
            overflow: 'hidden',
            gap: 10,
        },
        separator: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border[0],
        },
        itemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: size == 'small' ? 10 : 12,
            flex: 1,
        },
        metadata: {
            flex: 1,
            overflow: 'hidden',
        },
        right: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        albumNumberContainer: {
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 10,
        }
    }), [colors, size, withSeparators]);

    return (
        <View style={[styles.item, withSeparators && styles.separator]}>
            <View style={styles.itemLeft}>
                {isAlbumEntry ? <View style={styles.albumNumberContainer}>
                    <Title size={18} color={colors.text[1]}>{trackNumber}</Title>
                </View> : <Cover
                    source={{ uri: coverUri }}
                    cacheKey={coverCacheKey}
                    size={size == 'small' ? 40 : size == 'medium' ? 50 : 60}
                    radius={type == 'artist' ? 999999 : (size == 'small' || size == 'medium') ? 6 : 8}
                    withShadow={false}
                    icon={icon}
                />}
                <View style={styles.metadata}>
                    <Title size={(size == 'small' || size == 'medium') ? 14 : 16} numberOfLines={1}>{title}</Title>
                    {subtitle && <Title size={12} color={colors.text[1]} fontFamily='Poppins-Regular' numberOfLines={1}>{subtitle}</Title>}
                </View>
            </View>
            {rightSection ? <View style={styles.right}>
                {rightSection}
            </View> : (
                size == 'large' && <IconChevronRight size={16} color={colors.text[1]} />
            )}
        </View>
    )
}