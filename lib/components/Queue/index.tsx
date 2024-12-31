import { useQueue } from '@/lib/hooks';
import { StyleSheet, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import QueueItem from './QueueItem';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GestureEnabledContext } from '@/lib/sheets/playback';
import { Child } from '@/lib/types';
import { TQueueItem } from '@lib/providers/QueueProvider';

export default function Queue() {
    const { queue, setQueue } = useQueue();

    const [delayedQueue, setDelayedQueue] = useState<TQueueItem[]>(queue ?? []);

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

    const handleDragEnd = useCallback(({ data }: { data: TQueueItem[] }) => {
        setQueue(data);
        setDelayedQueue(data);
        setGestureEnabled(true);
    }, [setQueue, setGestureEnabled]);

    useEffect(() => {
        setDelayedQueue(queue);
    }, [queue]);

    return (
        <View style={styles.queue}>
            {/* <QueueItem drag={() => { }} item={queue.entry[0]} /> */}
            <DraggableFlatList
                style={styles.list}
                data={delayedQueue ?? []}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item, ...props }) => <QueueItem item={item._child} {...props} />}
                onDragEnd={handleDragEnd}
            />
        </View>
    )
}