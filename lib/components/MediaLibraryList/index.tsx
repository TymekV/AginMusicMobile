import { useTabsHeight } from '@lib/hooks';
import React from 'react';
import MediaLibItem, { TMediaLibItem } from './Item';
import { createContext, useMemo } from 'react';
import { FlatList, FlatListProps, StyleSheet, useWindowDimensions, View } from 'react-native';

export type MediaLibraryLayout = 'grid' | 'list' | 'gridCompact' | 'horizontal' | '';

export type MediaLibrarySize = 'small' | 'medium' | 'large';

export interface MediaLibraryListProps extends Omit<FlatListProps<TMediaLibItem>, 'renderItem' | 'data'> {
    data: TMediaLibItem[];
    onItemPress: (item: TMediaLibItem) => void;
    onItemLongPress?: (item: TMediaLibItem) => void;
    layout?: MediaLibraryLayout;
    size?: MediaLibrarySize;
    withSeparators?: boolean;
    withTopMargin?: boolean;
    rightSection?: ({ item, index }: { item: TMediaLibItem, index: number }) => React.ReactNode;
    isFullHeight?: boolean;
    FlatListComponent?: React.ComponentType<FlatListProps<TMediaLibItem>>;
}

export const LibLayout = createContext<MediaLibraryLayout>('list');
export const LibSize = createContext<MediaLibrarySize>('large');
export const LibSeparators = createContext<boolean>(true);

export default function MediaLibraryList({ data, layout = 'list', size = 'large', withSeparators = true, withTopMargin = true, onItemPress, onItemLongPress, rightSection: RightSection, isFullHeight = true, FlatListComponent = FlatList, ...props }: MediaLibraryListProps) {
    const [tabsHeight] = useTabsHeight();

    const { width } = useWindowDimensions();

    const styles = useMemo(() => StyleSheet.create({
        list: {
            marginTop: withTopMargin ? (layout == 'grid' || layout == 'gridCompact') ? 10 : 5 : 0,
        },
        gridList: {
            paddingHorizontal: 20,
        },
        gridSeparator: {
            height: 10,
        },
        horizontalSeparator: {
            width: 10,
        },
        footer: {
            height: isFullHeight ? (tabsHeight + 10) : 0,
        },
        horizontalPadding: {
            width: 20,
        }
    }), [layout, withTopMargin, isFullHeight, layout]);

    return (
        <LibLayout.Provider value={layout}>
            <LibSize.Provider value={size}>
                <LibSeparators.Provider value={withSeparators}>
                    <FlatListComponent
                        style={[styles.list, (layout === 'grid' || layout == 'gridCompact') && styles.gridList]}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => <MediaLibItem {...item} onPress={() => onItemPress(item)} onLongPress={() => onItemLongPress?.(item)} style={[layout === 'grid' && { flex: 1 / 2 }, layout === 'gridCompact' && { flex: 1 / 3 }]} index={index} rightSection={RightSection ? <RightSection item={item} index={index} /> : undefined} />}
                        numColumns={layout === 'grid' ? 2 : layout === 'gridCompact' ? 3 : 1}
                        ItemSeparatorComponent={(layout === 'grid' || layout == 'gridCompact') ? () => <View style={styles.gridSeparator} /> : layout == 'horizontal' ? () => <View style={styles.horizontalSeparator} /> : undefined}
                        ListFooterComponent={<View style={layout === 'horizontal' ? styles.horizontalPadding : styles.footer} />}
                        ListHeaderComponent={layout === 'horizontal' ? <View style={styles.horizontalPadding} /> : undefined}
                        horizontal={layout === 'horizontal'}
                        showsHorizontalScrollIndicator={false}
                        snapToAlignment={layout === 'horizontal' ? 'start' : undefined}
                        snapToInterval={layout === 'horizontal' ? ((width - 40 - 10) / 2) + 10 : undefined}
                        key={layout}
                        {...props}
                    />
                </LibSeparators.Provider>
            </LibSize.Provider>
        </LibLayout.Provider>
    )
}