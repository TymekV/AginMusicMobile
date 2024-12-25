import { Pressable, StyleSheet, TouchableHighlight, View } from 'react-native';
import Title from './Title';
import { useMemo } from 'react';
import { useColors } from '@/lib/hooks/useColors';
import { Image } from 'expo-image';
import ActionIcon from './ActionIcon';
import { IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerTrackNext, IconPlayerTrackNextFilled } from '@tabler/icons-react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useNowPlaying } from '../hooks';
import { useCoverBuilder } from '../hooks/useCoverBuilder';

export default function Miniplayer() {
    const colors = useColors();

    const [nowPlaying] = useNowPlaying();

    const cover = useCoverBuilder();

    const styles = useMemo(() => StyleSheet.create({
        miniplayer: {
            backgroundColor: colors.secondaryBackground,
            marginHorizontal: 15,
            borderRadius: 16,
            height: 55,
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 7,
            // shadowColor: '#000000',
            // shadowOffset: {
            //     width: 0,
            //     height: 3,
            // },
            // shadowOpacity: 0.17,
            // shadowRadius: 3.05,
            // elevation: 4
        },
        metadata: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        image: {
            width: 41,
            height: 41,
            borderRadius: 9,
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            // gap: 10,
            paddingRight: 10
        }
    }), [colors.secondaryBackground]);

    const isEmpty = nowPlaying.id == '';

    return (
        <Pressable onPress={() => SheetManager.show('playback')} style={styles.miniplayer}>
            <View style={styles.metadata}>
                <Image source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '', { size: 128 }) }} style={styles.image} cachePolicy="disk" />
                <View>
                    <Title size={14} fontFamily='Poppins-SemiBold'>{isEmpty ? 'Not Playing' : nowPlaying.title}</Title>
                    {!isEmpty && <Title size={12} fontFamily='Poppins-Regular' color={colors.secondaryText}>{nowPlaying.artist}</Title>}
                </View>
            </View>
            {!isEmpty && <View style={styles.actions}>
                <ActionIcon icon={IconPlayerPlayFilled} isFilled />
                <ActionIcon icon={IconPlayerTrackNextFilled} size={20} isFilled />
            </View>}
        </Pressable>
    )
}