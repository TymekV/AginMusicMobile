import { useQueue } from '@/lib/hooks';
import { StyleSheet, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, } from 'react-native-draggable-flatlist';
import QueueItem from './QueueItem';
import { useContext, useMemo } from 'react';
import { GestureEnabledContext } from '@/lib/sheets/playback';

export default function Queue() {
    const { queue, setQueue } = useQueue();

    const [gestureEnabled, setGestureEnabled] = useContext(GestureEnabledContext);

    const styles = useMemo(() => StyleSheet.create({
        // queue: {
        //     flex: 1,
        // },
        // list: {
        //     flex: 1,
        // },
    }), []);

    return (
        <View>
            {/* <QueueItem drag={() => { }} item={queue.entry[0]} /> */}
            <DraggableFlatList
                data={queue.entry ?? []}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={QueueItem}
                onDragEnd={({ data }) => {
                    setQueue(q => ({ ...q, entry: data }));
                    setGestureEnabled(true);
                }}
            />
        </View>
    )
}