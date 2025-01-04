import Container from '@lib/components/Container';
import Header from '@lib/components/Header';
import { Pinned, Playlists, Random } from '@lib/components/HomeSections';
import { useTabsHeight } from '@lib/hooks';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Home() {
    const [tabsHeight] = useTabsHeight();

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