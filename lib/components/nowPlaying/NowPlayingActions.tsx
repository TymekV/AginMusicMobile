import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionIcon from '../ActionIcon';
import { IconDots, IconDownload, IconHeart } from '@tabler/icons-react-native';

export default function NowPlayingActions() {
    const styles = useMemo(() => StyleSheet.create({
        actions: {
            flexDirection: 'row',
            gap: 10,
        }
    }), []);

    return (
        <View style={styles.actions}>
            <ActionIcon variant='secondary' icon={IconHeart} size={16} />
            <ActionIcon variant='secondary' icon={IconDownload} size={16} />
            <ActionIcon variant='secondary' icon={IconDots} size={16} />
        </View>
    )
}