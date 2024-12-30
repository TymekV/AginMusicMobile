import { useColors } from '@/lib/hooks';
import { StructuredLyrics } from '@lib/types';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from '../Title';
import { FlatList } from 'react-native-actions-sheet';

export type LyricsViewProps = {
    lyrics: StructuredLyrics;
}

export default function UnsyncedLyricsView({ lyrics }: LyricsViewProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            paddingHorizontal: 30,
        },
        separator: {
            height: 10,
        },
        header: {
            height: 10,
        },
        footer: {
            height: 20,
        },
    }), []);


    return (
        <FlatList
            style={styles.container}
            data={lyrics?.line}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Title size={16} color={colors.text[1]}>{item.value}</Title>}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            ListHeaderComponent={() => <View style={styles.header}></View>}
            ListFooterComponent={() => <View style={styles.footer}></View>}
        />
    )
}