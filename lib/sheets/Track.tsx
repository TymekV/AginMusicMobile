import { StyledActionSheet } from '@lib/components/StyledActionSheet';
import { Platform } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCache, useColors, useCoverBuilder, useQueue } from '@lib/hooks';
import { useEffect, useState } from 'react';
import { Child } from '@lib/types';
import SheetTrackHeader from '@lib/components/sheet/SheetTrackHeader';
import SheetOption from '@lib/components/sheet/SheetOption';
import { IconCircleMinus, IconCirclePlus, IconDisc, IconMicrophone2, IconPlayerTrackNext, IconPlaylistAdd } from '@tabler/icons-react-native';

function TrackSheet({ sheetId, payload }: SheetProps<'track'>) {
    const insets = useSafeAreaInsets();
    const cache = useCache();
    const cover = useCoverBuilder();
    const queue = useQueue();

    const [data, setData] = useState<Child | undefined>(payload?.data);

    useEffect(() => {
        (async () => {
            if (!payload?.id) return;

            const data = await cache.fetchChild(payload?.id);
            if (data) setData(data);
        })();
    }, [payload?.id]);

    return (
        <StyledActionSheet
            gestureEnabled={true}
            safeAreaInsets={insets}
            isModal={Platform.OS == 'android' ? false : true}
        >
            <SheetTrackHeader
                cover={{ uri: cover.generateUrl(data?.coverArt ?? '', { size: 128 }) }}
                coverCacheKey={`${data?.coverArt}-128x128`}
                title={data?.title}
                artist={data?.artist}
            />
            <SheetOption
                icon={IconPlayerTrackNext}
                label='Play Next'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
            <SheetOption
                icon={IconPlaylistAdd}
                label='Add to Queue'
                onPress={async () => {
                    await queue.add(data?.id ?? '');
                    SheetManager.hide(sheetId);
                }}
            />
            <SheetOption
                icon={IconMicrophone2}
                label='Go to Artist'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
            <SheetOption
                icon={IconDisc}
                label='Go to Album'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
            <SheetOption
                icon={IconCirclePlus}
                label='Add to a Playlist'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />
            {payload?.context == 'playlist' && <SheetOption
                icon={IconCircleMinus}
                label='Remove from this Playlist'
                variant='destructive'
                onPress={() => {
                    SheetManager.hide(sheetId);
                }}
            />}
        </StyledActionSheet>
    );
}

export default TrackSheet;