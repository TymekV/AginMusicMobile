import { useTabsHeight } from '@lib/hooks';
import React from 'react';
import MediaLibItem, { TMediaLibItem } from './Item';
import { createContext, useMemo } from 'react';
import { FlatList, FlatListProps, StyleSheet, View } from 'react-native';

export type MediaLibraryLayout = 'grid' | 'list' | '';

export type MediaLibrarySize = 'small' | 'medium' | 'large';

export interface MediaLibraryListProps extends Omit<FlatListProps<TMediaLibItem>, 'renderItem' | 'data'> {
    data: TMediaLibItem[];
    onItemPress: (item: TMediaLibItem) => void;
    layout?: MediaLibraryLayout;
    size?: MediaLibrarySize;
    withSeparators?: boolean;
    withTopMargin?: boolean;
    rightSection?: ({ item, index }: { item: TMediaLibItem, index: number }) => React.ReactNode;
}

export const LibLayout = createContext<MediaLibraryLayout>('list');
export const LibSize = createContext<MediaLibrarySize>('large');
export const LibSeparators = createContext<boolean>(true);

export default function MediaLibraryList({ data, layout = 'list', size = 'large', withSeparators = true, withTopMargin = true, onItemPress, rightSection: RightSection, ...props }: MediaLibraryListProps) {
    const [tabsHeight] = useTabsHeight();

    const styles = useMemo(() => StyleSheet.create({
        list: {
            marginTop: withTopMargin ? layout == 'grid' ? 10 : 5 : 0,
        },
        gridList: {
            paddingHorizontal: 20,
        },
        gridSeparator: {
            height: 10,
        },
        footer: {
            height: tabsHeight + 10,
        }
    }), [layout, withTopMargin]);

    return (
        <LibLayout.Provider value={layout}>
            <LibSize.Provider value={size}>
                <LibSeparators.Provider value={withSeparators}>
                    <FlatList
                        style={[styles.list, layout === 'grid' && styles.gridList]}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => <MediaLibItem {...item} onPress={() => onItemPress(item)} style={layout === 'grid' && { flex: 1 / 2 }} index={index} rightSection={RightSection ? <RightSection item={item} index={index} /> : undefined} />}
                        numColumns={layout === 'grid' ? 2 : 1}
                        ItemSeparatorComponent={layout === 'grid' ? () => <View style={styles.gridSeparator} /> : undefined}
                        ListFooterComponent={<View style={styles.footer} />}
                        key={layout}
                        {...props}
                    />
                </LibSeparators.Provider>
            </LibSize.Provider>
        </LibLayout.Provider>
    )
}