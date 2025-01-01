import { StyledActionSheet } from '@lib/components/StyledActionSheet';
import { Alert, Platform } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApiHelpers, useCoverBuilder, useMemoryCache, usePins, useSetting } from '@lib/hooks';
import { useEffect } from 'react';
import SheetTrackHeader from '@lib/components/sheet/SheetTrackHeader';
import SheetOption from '@lib/components/sheet/SheetOption';
import { IconArrowsSort, IconCopy, IconPencil, IconPin, IconPinnedOff, IconTrash } from '@tabler/icons-react-native';
import { formatDistanceToNow } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import showToast from '@lib/showToast';

function PlaylistSheet({ sheetId, payload }: SheetProps<'playlist'>) {
    const insets = useSafeAreaInsets();
    const memoryCache = useMemoryCache();
    const cover = useCoverBuilder();
    const helpers = useApiHelpers();

    const copyIdEnabled = useSetting('developer.copyId');

    const pins = usePins();
    const isPinned = pins.isPinned(payload?.id ?? '');

    const data = memoryCache.cache.playlists[payload?.id ?? ''];

    useEffect(() => {
        (async () => {
            if (!payload?.id) return;
            await memoryCache.refreshPlaylist(payload?.id);
        })();
    }, [payload?.id, memoryCache.refreshPlaylist]);

    return (
        <StyledActionSheet
            gestureEnabled={true}
            safeAreaInsets={insets}
            isModal={Platform.OS == 'android' ? false : true}
        >
            <SheetTrackHeader
                cover={{ uri: cover.generateUrl(data?.coverArt ?? '', { size: 128 }) }}
                coverCacheKey={`${data?.coverArt}-128x128`}
                title={data?.name}
                artist={`${data?.songCount} songs • edited ${formatDistanceToNow(new Date(data?.changed), { addSuffix: true })}`}
            />
            <SheetOption
                icon={IconPencil}
                label='Edit'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
            <SheetOption
                icon={IconArrowsSort}
                label='Sort By'
                description='Playlist Order'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
            <SheetOption
                icon={isPinned ? IconPinnedOff : IconPin}
                label={isPinned ? 'Unpin Playlist' : 'Pin Playlist'}
                onPress={async () => {
                    if (!payload?.id) return;
                    if (isPinned) await pins.removePin(payload?.id);
                    else await pins.addPin({
                        id: payload?.id,
                        name: data?.name ?? '',
                        description: '',
                        type: 'playlist',
                        coverArt: data?.coverArt ?? '',
                    });
                    SheetManager.hide(sheetId);
                }}
            />
            {copyIdEnabled && <SheetOption
                icon={IconCopy}
                label='Copy ID'
                onPress={async () => {
                    await Clipboard.setStringAsync(payload?.id ?? '');
                    await showToast({
                        title: 'Copied ID',
                        subtitle: payload?.id,
                        icon: IconCopy,
                    });
                    SheetManager.hide(sheetId);
                }}
            />}
            <SheetOption
                icon={IconTrash}
                label='Remove Playlist'
                variant='destructive'
                onPress={async () => {
                    if (!payload?.id) return;

                    const removed = await helpers.removePlaylistConfirm(payload?.id);
                    if (!removed) return;

                    SheetManager.hide(sheetId);
                    router.back();
                    await memoryCache.refreshPlaylists();
                }}
            />
        </StyledActionSheet>
    );
}

export default PlaylistSheet;