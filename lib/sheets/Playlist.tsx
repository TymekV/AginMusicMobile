import { StyledActionSheet } from '@lib/components/StyledActionSheet';
import { Platform } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCoverBuilder, useMemoryCache, usePins, useQueue } from '@lib/hooks';
import { useEffect, useState } from 'react';
import { Playlist } from '@lib/types';
import SheetTrackHeader from '@lib/components/sheet/SheetTrackHeader';
import SheetOption from '@lib/components/sheet/SheetOption';
import { IconArrowsSort, IconEdit, IconPencil, IconPin, IconPinnedOff, IconPlayerTrackNext, IconTrash } from '@tabler/icons-react-native';
import { formatDistanceToNow } from 'date-fns';

function PlaylistSheet({ sheetId, payload }: SheetProps<'playlist'>) {
    const insets = useSafeAreaInsets();
    const memoryCache = useMemoryCache();
    const cover = useCoverBuilder();

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
            <SheetOption
                icon={IconTrash}
                label='Remove Playlist'
                variant='destructive'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
        </StyledActionSheet>
    );
}

export default PlaylistSheet;