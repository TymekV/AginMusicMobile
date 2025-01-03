import { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionIcon from '../ActionIcon';
import { IconDots, IconDownload, IconHeart, IconHeartFilled } from '@tabler/icons-react-native';
import { useQueue } from '@/lib/hooks';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';
import { IdContext } from '@lib/sheets/playback';

export default function NowPlayingActions() {
    const { nowPlaying } = useQueue();

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
            <ActionIcon variant='secondary' icon={nowPlaying.starred ? IconHeartFilled : IconHeart} size={16} />
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