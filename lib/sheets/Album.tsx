import { StyledActionSheet } from '@lib/components/StyledActionSheet';
import { Platform } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApiHelpers, useCoverBuilder, useMemoryCache, usePins, useSetting } from '@lib/hooks';
import { useEffect } from 'react';
import SheetTrackHeader from '@lib/components/sheet/SheetTrackHeader';
import SheetOption from '@lib/components/sheet/SheetOption';
import { IconArrowsSort, IconCirclePlus, IconCopy, IconPin, IconPinnedOff } from '@tabler/icons-react-native';
import * as Clipboard from 'expo-clipboard';

function AlbumSheet({ sheetId, payload }: SheetProps<'album'>) {
    const insets = useSafeAreaInsets();
    const memoryCache = useMemoryCache();
    const cover = useCoverBuilder();
    const helpers = useApiHelpers();

    const copyIdEnabled = useSetting('developer.copyId');

    const pins = usePins();
    const isPinned = pins.isPinned(payload?.id ?? '');

    const data = memoryCache.cache.albums[payload?.id ?? ''];

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
                artist={`${data?.artist} • ${data?.year}`}
            />
            <SheetOption
                icon={IconArrowsSort}
                label='Sort By'
                description='Album Order'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
            <SheetOption
                icon={isPinned ? IconPinnedOff : IconPin}
                label={isPinned ? 'Unpin Album' : 'Pin Album'}
                onPress={async () => {
                    if (!payload?.id) return;
                    if (isPinned) await pins.removePin(payload?.id);
                    else await pins.addPin({
                        id: payload?.id,
                        name: data?.name ?? '',
                        description: data?.artist ?? '',
                        type: 'album',
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
                    SheetManager.hide(sheetId);
                }}
            />}
            <SheetOption
                icon={IconCirclePlus}
                label='Add to a Playlist'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
        </StyledActionSheet>
    );
}

export default AlbumSheet;