import MediaLibItem, { TMediaLibItem } from './Item';
import { createContext, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

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
            marginTop: 5,
        },
    }), []);

    return (
        <LibLayout.Provider value={layout}>
            <LibSize.Provider value={size}>
                <LibSeparators.Provider value={withSeparators}>
                    <FlatList
                        style={styles.list}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <MediaLibItem {...item} onPress={() => onItemPress(item)} />}
                        numColumns={layout === 'grid' ? 2 : 1}
                    />
                </LibSeparators.Provider>
            </LibSize.Provider>
        </LibLayout.Provider>
    )
}