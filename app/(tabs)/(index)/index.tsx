import Container from '@lib/components/Container';
import Header from '@lib/components/Header';
import { Pinned, Playlists } from '@lib/components/HomeSections';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function Home() {
    const styles = useMemo(() => StyleSheet.create({
        main: {
            flex: 1,
        }
    }), []);

    return (
        <Container>
            <ScrollView style={styles.main}>
                <Header title="Home" withAvatar />
                <Pinned />
                <Playlists />
            </ScrollView>
        </Container>
    )
}