import { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionIcon from '../ActionIcon';
import { IconDots, IconDownload, IconHeart, IconHeartFilled } from '@tabler/icons-react-native';
import { useApiHelpers, useQueue } from '@/lib/hooks';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';
import { IdContext } from '@lib/sheets/playback';

export default function NowPlayingActions() {
    const { nowPlaying, toggleStar } = useQueue();
    const helpers = useApiHelpers();

    const sheetId = useContext(IdContext);

    const styles = useMemo(() => StyleSheet.create({
        actions: {
            flexDirection: 'row',
            gap: 10,
        }
    }), []);

    return (
        <View style={styles.actions}>
            {/* FIXME */}
            <ActionIcon variant={nowPlaying.starred ? 'secondaryFilled' : 'secondary'} icon={nowPlaying.starred ? IconHeartFilled : IconHeart} size={16} onPress={toggleStar} isFilled={!!nowPlaying.starred} />
            <ActionIcon variant='secondary' icon={IconDownload} size={16} onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                await SheetManager.show('confirm', {
                    payload: {
                        title: 'Sorry!',
                        message: 'Downloads feature will be avalibale soon. Stay tuned!',
                        withCancel: false,
                        confirmText: 'OK',
                    }
                });
            }} />
            <ActionIcon variant='secondary' icon={IconDots} size={16} onPress={async () => {
                Haptics.selectionAsync();
                const data = await SheetManager.show('track', {
                    payload: {
                        id: nowPlaying.id,
                        data: nowPlaying,
                        context: 'nowPlaying'
                    }
                });
                if (data.shouldCloseSheet) SheetManager.hide(sheetId);
            }} />
        </View>
    )
}