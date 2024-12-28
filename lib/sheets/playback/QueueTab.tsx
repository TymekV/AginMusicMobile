import Queue from '@/lib/components/Queue';
import SmallNowPlaying from './SmallNowPlaying';
import Title from '@lib/components/Title';
import { useColors } from '@lib/hooks';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function QueueTab() {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        top: {
            paddingHorizontal: 30,
        },
        queue: {
            marginTop: 10,
        }
    }), []);

    return (
        <>
            <View style={styles.top}>
                <SmallNowPlaying />
                <Title size={16} fontFamily="Poppins-SemiBold">Up Next</Title>
                <Title size={12} fontFamily="Poppins-Regular" color={colors.text[1]}>Playing from Playlist 1</Title>
            </View>
            <View style={styles.queue}>
                <Queue />
            </View>
        </>
    )
}