import Container from '@lib/components/Container';
import Header from '@lib/components/Header';
import { Pinned, Playlists, Random } from '@lib/components/HomeSections';
import { useQueue, useServer, useTabsHeight } from '@lib/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Home() {
    const [tabsHeight] = useTabsHeight();
    const queue = useQueue();

    const localParams = useLocalSearchParams();
    const playId = useMemo(() => localParams?.playId, [localParams]);
    const server = useServer();
    useEffect(() => {
        (async () => {
            if (server.serverAuth.hash != '' && playId && typeof playId === 'string' && playId !== '') {
                await queue.playTrackNow(playId);
                router.setParams({ playId: '' });
            }
        })();
    }, [playId, server]);

    const styles = useMemo(() => StyleSheet.create({
        main: {
            flex: 1,
        },
        spacer: {
            height: tabsHeight + 10,
        }
    }), [tabsHeight]);

    return (
        <Container>
            <ScrollView style={styles.main}>
                <Header title="Home" withAvatar />
                <Pinned />
                <Playlists />
                <Random />
                <View style={styles.spacer}></View>
            </ScrollView>
        </Container>
    )
}