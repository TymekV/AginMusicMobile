import { StyledActionSheet } from '@/lib/components/StyledActionSheet';
import { Platform, StyleSheet, View } from 'react-native';
import { FlatList, SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApi, useColors, useCoverBuilder, useMemoryCache } from '../hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { Input } from '@lib/components/Input';
import { IconPlus, IconSearch } from '@tabler/icons-react-native';
import MediaLibraryList from '@lib/components/MediaLibraryList';
import { TMediaLibItem } from '@lib/components/MediaLibraryList/Item';
import showToast from '@lib/showToast';

function AddToPlaylistSheet({ sheetId, payload }: SheetProps<'addToPlaylist'>) {
    const insets = useSafeAreaInsets();
    const cache = useMemoryCache();
    const cover = useCoverBuilder();
    const api = useApi();

    const [filter, setFilter] = useState('');

    const rawPlaylists = useMemo(() => cache.cache.allPlaylists.map((playlist): TMediaLibItem => ({
        id: playlist.id,
        title: playlist.name,
        coverUri: cover.generateUrl(playlist.coverArt ?? '', { size: 128 }),
        coverCacheKey: `${playlist.coverArt}-128x128`,
        coverArt: playlist.coverArt,
    })).filter(p => filter === '' ? true : p.title.toLowerCase().includes(filter.toLowerCase())), [cache.cache.allPlaylists, cover.generateUrl, filter]);

    const playlists = useMemo((): TMediaLibItem[] => [{
        id: 'new',
        title: 'New Playlist',
        icon: IconPlus,
        coverUri: cover.generateUrl('', { size: 128 }),
        coverCacheKey: '-128x128',
    }, ...rawPlaylists], [rawPlaylists]);

    useEffect(() => {
        cache.refreshPlaylists();
    }, [cache.refreshPlaylists]);

    const addToPlaylist = useCallback(async (item: TMediaLibItem) => {
        if (!api) return;
        if (item.id === 'new') {
            const newPlaylist = await SheetManager.show('newPlaylist');
            if (!newPlaylist.created || !newPlaylist.id) return;
            item = {
                ...item,
                id: newPlaylist.id,
                title: newPlaylist.name ?? '',
            }
        }

        await api.get('/updatePlaylist', {
            params: {
                playlistId: item.id,
                songIdToAdd: payload?.idList,
            },
            paramsSerializer: {
                indexes: null,
            }
        });

        const addedCount = payload?.idList.length ?? 0;

        await showToast({
            cover: { uri: item.coverUri, cacheKey: item.coverCacheKey },
            title: item.title,
            subtitle: `Added ${addedCount} song${addedCount > 1 ? 's' : ''}`,
            reverse: true,
        });

        await cache.refreshPlaylist(item.id);

        SheetManager.hide(sheetId, {
            payload: {
                added: true,
                playlistId: item.id,
            }
        });
    }, [payload?.idList, sheetId, api]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            paddingTop: 10,
            paddingHorizontal: 20,
        },
        title: {
            marginBottom: 10,
        }
    }), []);

    return (
        <StyledActionSheet
            gestureEnabled={true}
            safeAreaInsets={insets}
            isModal={Platform.OS == 'android' ? false : true}
            fullHeight
        >
            <View style={styles.container}>
                <Title size={16} align="center" fontFamily="Poppins-SemiBold" style={styles.title}>Add to a Playlist</Title>
                <Input icon={IconSearch} placeholder='Search Playlists' compact value={filter} onChangeText={setFilter} />
            </View>
            <MediaLibraryList
                data={playlists}
                onItemPress={addToPlaylist}
                size='small'
                FlatListComponent={FlatList}
            />
        </StyledActionSheet>
    );
}

export default AddToPlaylistSheet;