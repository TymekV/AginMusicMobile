import { StructuredLyrics } from '@lib/types';
import LyricsLine from './Line';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useGlobalPlayer } from '@/lib/hooks';
import { FlatList } from 'react-native';

export type LyricsViewProps = {
    lyrics: StructuredLyrics;
}

export default function LyricsView({ lyrics }: LyricsViewProps) {
    const [activeLine, setActiveLine] = useState<number>(-1);
    const [enableAutoScroll, setEnableAutoScroll] = useState<boolean>(true);
    const enableTimeout = useRef<NodeJS.Timeout | null>(null);

    const isLocked = useRef<boolean>(false);

    const player = useGlobalPlayer();

    const listRef = useRef<FlatList>(null);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            paddingHorizontal: 20,
        },
        separator: {
            height: 10,
        },
        footer: {
            height: 40,
        }
    }), []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isLocked.current) return console.log('locked :(');
            let activeLine = lyrics?.line.findIndex(line => {
                if (!line.start || !player?.currentTime) return false;
                return line.start >= (player.currentTime * 1000) - 100;
            }) - 1;
            if (activeLine == -2) activeLine = lyrics.line.length - 1;
            setActiveLine(activeLine);
        }, 100);

        return () => {
            clearInterval(interval);
        }
    }, [lyrics]);

    useEffect(() => {
        if (!enableAutoScroll) return;
        const prevLine = activeLine - 1;
        const toScroll = prevLine < 0 ? 0 : prevLine;

        if (toScroll > lyrics?.line.length - 1 || !lyrics?.line.length || isNaN(toScroll)) return;
        console.log(toScroll);

        try {
            listRef.current?.scrollToIndex({ index: toScroll, animated: true });
        } catch (error) {
        }
    }, [activeLine, lyrics?.line, enableAutoScroll]);

    return (
        <FlatList
            style={styles.container}
            data={lyrics?.line}
            renderItem={({ item, index }) => <LyricsLine line={item} active={activeLine == index} onPress={() => {
                player?.play();
                player?.seekTo(item.start);
                listRef.current?.scrollToIndex({ index: index - 1 > 0 ? index - 1 : 0, animated: true });
                isLocked.current = true;
                setActiveLine(index);
                setTimeout(() => {
                    isLocked.current = false;
                }, 500);
            }} />}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            ref={listRef}
            keyExtractor={(item, index) => index.toString()}
            onScrollBeginDrag={() => {
                if (enableTimeout.current) clearTimeout(enableTimeout.current);
                setEnableAutoScroll(false);
            }}
            onScrollEndDrag={() => {
                if (enableTimeout.current) clearTimeout(enableTimeout.current);
                enableTimeout.current = setTimeout(() => {
                    setEnableAutoScroll(true);
                }, 3000);
            }}
            ListFooterComponent={() => <View style={styles.footer}></View>}
        />
    )
}