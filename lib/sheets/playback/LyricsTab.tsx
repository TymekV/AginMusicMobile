import Queue from '@/lib/components/Queue';
import SmallNowPlaying from './SmallNowPlaying';
import Title from '@lib/components/Title';
import { useApi, useCache, useColors, useQueue } from '@lib/hooks';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionIcon from '@/lib/components/ActionIcon';
import { IconTrash } from '@tabler/icons-react-native';
import { IdContext } from '.';
import { SheetManager } from 'react-native-actions-sheet';
import { StructuredLyrics } from '@/lib/types';
import SycnedLyricsView from '@/lib/components/LyricsView';
import UnsyncedLyricsView from '@/lib/components/UnsyncedLyricsView';

export default function LyricsTab() {
    const colors = useColors();
    const queue = useQueue();
    const { nowPlaying } = queue;
    const cache = useCache();
    const api = useApi();

    const [lyrics, setLyrics] = useState<StructuredLyrics[]>([]);

    useEffect(() => {
        if (nowPlaying.id == '' || !api) return;
        (async () => {
            const lyrics = await cache.fetchLyrics(nowPlaying.id);
            if (lyrics) setLyrics(lyrics);
        })();
    }, [api, nowPlaying.id]);

    const styles = useMemo(() => StyleSheet.create({
        top: {
            paddingHorizontal: 30,
        },
        actionBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        queue: {
            marginTop: 10,
            flex: 1,
        },
    }), []);

    return (
        <>
            <View style={styles.top}>
                <SmallNowPlaying />
            </View>
            {lyrics?.[0]?.synced == false ? <UnsyncedLyricsView lyrics={lyrics?.[0]} /> : <SycnedLyricsView lyrics={lyrics?.[0]} />}
        </>
    )
}