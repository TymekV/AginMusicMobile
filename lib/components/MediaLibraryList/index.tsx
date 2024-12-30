import { FlatList } from 'react-native-actions-sheet';
import MediaLibItem, { TMediaLibItem } from './Item';
import { createContext, useMemo } from 'react';
import { StyleSheet } from 'react-native';

export type MediaLibraryLayout = 'grid' | 'list';

export type MediaLibraryListProps = {
    data: TMediaLibItem[];
    onItemPress: (item: TMediaLibItem) => void;
    layout?: MediaLibraryLayout;
    compact?: boolean;
}

export const LibLayout = createContext<MediaLibraryLayout>('list');
export const LibCompact = createContext<boolean>(false);

export default function MediaLibraryList({ data, layout = 'list', compact = false, onItemPress }: MediaLibraryListProps) {
    const styles = useMemo(() => StyleSheet.create({
        list: {
            marginTop: 5,
        },
    }), []);

    return (
        <LibLayout.Provider value={layout}>
            <LibCompact.Provider value={compact}>
                <FlatList
                    style={styles.list}
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MediaLibItem {...item} onPress={() => onItemPress(item)} />}
                    numColumns={layout === 'grid' ? 2 : 1}
                />
            </LibCompact.Provider>
        </LibLayout.Provider>
    )
}