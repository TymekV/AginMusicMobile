import { StyledActionSheet } from '@lib/components/StyledActionSheet';
import { Linking, Platform } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCache, useMemoryCache, useQueue, useServer } from '@lib/hooks';
import SheetTrackHeader from '@lib/components/sheet/SheetTrackHeader';
import SheetOption from '@lib/components/sheet/SheetOption';
import { IconArrowsSort, IconBrandGithub, IconExclamationCircle, IconLogout, IconMusic, IconSettings } from '@tabler/icons-react-native';
import Avatar from '@lib/components/Avatar';
import config from '@lib/constants/config';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

function UserMenuSheet({ sheetId, payload }: SheetProps<'userMenu'>) {
    const insets = useSafeAreaInsets();
    const server = useServer();
    const cache = useCache();
    const memoryCache = useMemoryCache();
    const queue = useQueue();

    return (
        <StyledActionSheet
            gestureEnabled={true}
            safeAreaInsets={insets}
            isModal={Platform.OS == 'android' ? false : true}
        >
            <SheetTrackHeader
                coverComponent={<Avatar />}
                title={server.server.auth.username}
                artist={server.server.url}
            />
            <SheetOption
                icon={IconSettings}
                label='App Settings'
                onPress={() => {
                    router.push('/settings');
                    SheetManager.hide(sheetId);
                }}
            />
            {config.repoUrl && <SheetOption
                icon={IconBrandGithub}
                label='Contribute on GitHub'
                onPress={() => {
                    if (!config.repoUrl) return;
                    Linking.openURL(config.repoUrl);
                    SheetManager.hide(sheetId);
                }}
            />}
            {config.repoUrl && <SheetOption
                icon={IconExclamationCircle}
                label='Report an Issue'
                onPress={() => {
                    if (!config.repoUrl) return;
                    Linking.openURL(`${config.repoUrl}/issues/new`);
                    SheetManager.hide(sheetId);
                }}
            />}
            <SheetOption
                icon={IconLogout}
                label='Log out'
                onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    const confirmed = await SheetManager.show('confirm', {
                        payload: {
                            title: 'Log out',
                            message: 'Are you sure you want to log out?',
                            cancelText: 'Cancel',
                            confirmText: 'Log out',
                            variant: 'danger',
                        }
                    });
                    if (!confirmed) return;

                    SheetManager.hide(sheetId);

                    await cache.clearAll();
                    memoryCache.clear();
                    queue.clear();

                    await server.logOut();
                }}
            />
        </StyledActionSheet>
    );
}

export default UserMenuSheet;