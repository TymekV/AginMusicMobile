import Queue from '@/lib/components/Queue';
import SmallNowPlaying from './SmallNowPlaying';
import Title from '@lib/components/Title';
import { useColors } from '@lib/hooks';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionIcon from '@/lib/components/ActionIcon';
import { IconTrash } from '@tabler/icons-react-native';

export default function QueueTab() {
    const colors = useColors();

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
                <View style={styles.actionBar}>
                    <View>
                        <Title size={16} fontFamily="Poppins-SemiBold">Queue</Title>
                        <Title size={12} fontFamily="Poppins-Regular" color={colors.text[1]}>Playing from Playlist 1</Title>
                    </View>
                    <View style={styles.actions}>
                        <ActionIcon icon={IconTrash} variant='secondary' size={16} />
                    </View>
                </View>
            </View>
            <View style={styles.queue}>
                <Queue />
            </View>
        </>
    )
}