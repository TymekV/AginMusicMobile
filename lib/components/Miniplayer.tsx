import { Pressable, StyleSheet, View } from 'react-native';
import Title from './Title';
import { useMemo } from 'react';
import { useColors } from '@/lib/hooks/useColors';
import { Image } from 'expo-image';
import ActionIcon from './ActionIcon';
import { IconPlayerPlayFilled, IconPlayerTrackNextFilled } from '@tabler/icons-react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useCoverBuilder } from '@lib/hooks/useCoverBuilder';
import { useQueue } from '../hooks';

export default function Miniplayer() {
    const colors = useColors();

    const { nowPlaying } = useQueue();

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
        },
        metadata: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
        },
        image: {
            width: 41,
            height: 41,
            borderRadius: 9,
        },
        textContainer: {
            flex: 1,
            overflow: 'hidden',
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
        },
    }), [colors.secondaryBackground]);

    const isEmpty = nowPlaying.id === '';

    return (
        <Pressable onPress={() => SheetManager.show('playback')} style={styles.miniplayer}>
            <View style={styles.metadata}>
                <Image
                    source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '', { size: 128 }) }}
                    style={styles.image}
                    cachePolicy="disk"
                />
                <View style={styles.textContainer}>
                    <Title size={14} fontFamily="Poppins-SemiBold" numberOfLines={1}>
                        {isEmpty ? 'Not Playing' : nowPlaying.title}
                    </Title>
                    {!isEmpty && (
                        <Title
                            size={12}
                            fontFamily="Poppins-Regular"
                            color={colors.text[1]}
                            numberOfLines={1}
                        >
                            {nowPlaying.artist}
                        </Title>
                    )}
                </View>
            </View>
            {!isEmpty && (
                <View style={styles.actions}>
                    <ActionIcon icon={IconPlayerPlayFilled} isFilled />
                    <ActionIcon icon={IconPlayerTrackNextFilled} size={20} isFilled />
                </View>
            )}
        </Pressable>
    );
}
