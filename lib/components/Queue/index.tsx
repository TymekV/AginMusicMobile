import { useQueue } from '@/lib/hooks';
import { StyleSheet, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import QueueItem from './QueueItem';
import { useCallback, useContext, useMemo } from 'react';
import { GestureEnabledContext } from '@/lib/sheets/playback';
import { Child } from '@/lib/types';

export default function Queue() {
    const { queue, setQueue } = useQueue();

    const [gestureEnabled, setGestureEnabled] = useContext(GestureEnabledContext);

    const styles = useMemo(() => StyleSheet.create({
        queue: {
            flex: 1,
        },
        list: {
            // flex: 1,
            height: '100%',
        },
    }), []);

    const handleDragEnd = useCallback(({ data }: { data: Child[] }) => {
        setQueue(q => ({ ...q, entry: data }));
        setGestureEnabled(true);
    }, [setQueue, setGestureEnabled]);

    return (
        <View style={styles.queue}>
            {/* <QueueItem drag={() => { }} item={queue.entry[0]} /> */}
            <DraggableFlatList
                style={styles.list}
                data={queue.entry ?? []}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={QueueItem}
                onDragEnd={handleDragEnd}
            />
        </View>
    )
}