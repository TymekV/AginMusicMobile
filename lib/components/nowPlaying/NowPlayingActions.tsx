import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionIcon from '../ActionIcon';
import { IconDots, IconDownload, IconHeart, IconHeartFilled } from '@tabler/icons-react-native';
import { useQueue } from '@/lib/hooks';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';

export default function NowPlayingActions() {
    const { nowPlaying } = useQueue();

    const styles = useMemo(() => StyleSheet.create({
        actions: {
            flexDirection: 'row',
            gap: 10,
        }
    }), []);

    return (
        <View style={styles.actions}>
            {/* FIXME */}
            <ActionIcon variant='secondary' icon={nowPlaying.starred ? IconHeartFilled : IconHeart} size={16} />
            <ActionIcon variant='secondary' icon={IconDownload} size={16} />
            <ActionIcon variant='secondary' icon={IconDots} size={16} onPress={() => {
                Haptics.selectionAsync();
                SheetManager.show('track', {
                    payload: {
                        id: nowPlaying.id,
                        data: nowPlaying,
                        context: 'nowPlaying'
                    }
                })
            }} />
        </View>
    )
}