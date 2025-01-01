import Container from '@lib/components/Container';
import Header from '@lib/components/Header';
import Setting, { SettingSelectOption } from '@lib/components/Setting';
import SettingsSection from '@lib/components/SettingsSection';
import { useCache, useMemoryCache } from '@lib/hooks';
import { IconDownload, IconMobiledata, IconWifi } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';

const qualityLevels: SettingSelectOption[] = [
    { label: 'Normal', description: '128kbps', value: '128kbps' },
    { label: 'High', description: '256kbps', value: '256kbps' },
    { label: 'Lossless', description: 'ALAC, 24-bit/48 kHz', value: 'lossless' },
];

export default function Settings() {
    const cache = useCache();
    const memoryCache = useMemoryCache();

    const styles = useMemo(() => StyleSheet.create({
        settings: {
            paddingTop: 10,
        }
    }), []);

    return (
        <Container>
            <Header title="Settings" withBackIcon withAvatar={false} titleSize={20} />
            <View style={styles.settings}>
                <SettingsSection label='Audio Quality' />
                <Setting
                    type='select'
                    label='Wi-Fi Streaming'
                    description='Maximum quality on Wi-Fi'
                    icon={IconWifi}
                    options={qualityLevels}
                />
                <Setting
                    type='select'
                    label='Cellular Streaming'
                    description='Maximum quality on cellular data'
                    icon={IconMobiledata}
                    options={qualityLevels}
                />
                <Setting
                    type='select'
                    label='Download Quality'
                    description='Maximum quality for downloaded music'
                    icon={IconDownload}
                    options={qualityLevels}
                />
                <Setting
                    type='switch'
                    label='Dolby Atmos'
                    description='Enable Dolby Atmos when available'
                />
                <SettingsSection label='Storage' />
                <Setting
                    type='button'
                    label='Clear Cache'
                    description='This will not remove downloaded music'
                    onPress={async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        const confirmed = await SheetManager.show('confirm', {
                            payload: {
                                title: 'Clear Cache',
                                message: 'Are you sure you want to clear the cache? This will not remove downloaded music.',
                                confirmText: 'Clear',
                                cancelText: 'Cancel',
                            }
                        });
                        if (!confirmed) return;

                        await cache.clearAll();
                        memoryCache.clear();
                    }}
                />
                <SettingsSection label='Developer Options' />
                <Setting
                    type='switch'
                    label='Copy ID Option'
                    description='Show the copy ID option across the app'
                />
            </View>
        </Container>
    )
}