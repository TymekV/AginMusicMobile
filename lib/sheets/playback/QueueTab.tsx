import Queue from '@/lib/components/Queue';
import SmallNowPlaying from './SmallNowPlaying';
import Title from '@lib/components/Title';
import { useColors } from '@lib/hooks';
import React from 'react';
import { View } from 'react-native';

export default function QueueTab() {
    const colors = useColors();
    return (
        <>
            <SmallNowPlaying />
            <Title size={16} fontFamily="Poppins-SemiBold">Up Next</Title>
            <Title size={12} fontFamily="Poppins-Regular" color={colors.text[1]}>Playing from Playlist 1</Title>
            <View style={{ marginTop: 10 }}>
                <Queue />
            </View>
        </>
    )
}