import MediaLibItem, { TMediaLibItem } from './Item';
import { createContext, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export type MediaLibraryLayout = 'grid' | 'list';

export type MediaLibrarySize = 'small' | 'medium' | 'large';

export type MediaLibraryListProps = {
    data: TMediaLibItem[];
    onItemPress: (item: TMediaLibItem) => void;
    layout?: MediaLibraryLayout;
    size?: MediaLibrarySize;
    withSeparators?: boolean;
}

export const LibLayout = createContext<MediaLibraryLayout>('list');
export const LibSize = createContext<MediaLibrarySize>('large');
export const LibSeparators = createContext<boolean>(true);

export default function MediaLibraryList({ data, layout = 'list', size = 'large', withSeparators = true, onItemPress }: MediaLibraryListProps) {
    const styles = useMemo(() => StyleSheet.create({
        list: {
            marginTop: layout == 'grid' ? 10 : 5,
        },
        gridList: {
            paddingHorizontal: 20,
        },
        gridSeparator: {
            height: 10,
        }
    }), [layout]);

    return (
        <LibLayout.Provider value={layout}>
            <LibSize.Provider value={size}>
                <LibSeparators.Provider value={withSeparators}>
                    <FlatList
                        style={[styles.list, layout === 'grid' && styles.gridList]}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => <MediaLibItem {...item} onPress={() => onItemPress(item)} style={layout === 'grid' && { flex: 1 / 2 }} index={index} />}
                        numColumns={layout === 'grid' ? 2 : 1}
                        ItemSeparatorComponent={layout === 'grid' ? () => <View style={styles.gridSeparator} /> : undefined}
                        key={layout}
                    />
                </LibSeparators.Provider>
            </LibSize.Provider>
        </LibLayout.Provider>
    )
}