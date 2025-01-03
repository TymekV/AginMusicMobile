import { IconDots } from '@tabler/icons-react-native';
import ActionIcon from '@lib/components/ActionIcon';
import React, { useCallback } from 'react';
import { MappedResult } from '@/app/(tabs)/(search)/search';
import * as Haptics from 'expo-haptics';
import { SheetManager } from 'react-native-actions-sheet';
import { AlbumID3, Child } from '@lib/types';
import { TMediaLibItem } from './MediaLibraryList/Item';
import { Keyboard } from 'react-native';

export type SearchRightSectionProps = {
    item: MappedResult | TMediaLibItem;
}

export default function SearchRightSection({ item }: SearchRightSectionProps) {
    const showContextMenu = useCallback(() => {
        Keyboard.dismiss();
        Haptics.selectionAsync();
        if (item.type == 'album') {
            SheetManager.show('album', {
                payload: {
                    id: item.id,
                    data: 'fullData' in item ? item.fullData as AlbumID3 : undefined,
                    context: 'search',
                }
            });
        } else if (item.type == 'artist') {
            // TODO: Show artist context menu
        } else if (item.type == 'track') {
            SheetManager.show('track', {
                payload: {
                    id: item.id,
                    data: 'fullData' in item ? item.fullData as Child : undefined,
                    context: 'search',
                }
            });
        }
    }, []);

    return (
        <ActionIcon icon={IconDots} size={16} variant='secondaryTransparent' onPress={showContextMenu} />
    )
}