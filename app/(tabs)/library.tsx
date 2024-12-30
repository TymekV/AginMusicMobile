import ActionIcon from '@/lib/components/ActionIcon';
import Container from '@/lib/components/Container';
import Header from '@/lib/components/Header';
import MediaLibraryList, { MediaLibraryLayout } from '@/lib/components/MediaLibraryList';
import { TMediaLibItem } from '@/lib/components/MediaLibraryList/Item';
import TagTabs from '@/lib/components/TagTabs';
import { TTagTab } from '@/lib/components/TagTabs/TagTab';
import { IconDisc, IconHeart, IconLayoutGrid, IconLayoutList, IconMicrophone2, IconMusic, IconPlaylist, IconPlus } from '@tabler/icons-react-native';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { AlbumsTab, PlaylistsTab } from '@/lib/components/MediaLibrary';

const tabs: TTagTab[] = [
    {
        label: 'Playlists',
        id: 'playlists',
        icon: IconPlaylist,
    },
    // {
    //     label: 'Favorite',
    //     id: 'favorite',
    //     icon: IconHeart,
    // },
    {
        label: 'Artists',
        id: 'artists',
        icon: IconMicrophone2,
    },
    {
        label: 'Albums',
        id: 'albums',
        icon: IconDisc,
    },
    {
        label: 'Songs',
        id: 'songs',
        icon: IconMusic,
    }
];

const mockData: TMediaLibItem[] = [
    {
        id: '1',
        title: 'Song 1',
        subtitle: 'Artist 1',
        coverUri: 'https://picsum.photos/200',
        coverCacheKey: '',
    },
    {
        id: '2',
        title: 'Song 2',
        subtitle: 'Artist 2',
        coverUri: 'https://picsum.photos/200',
        coverCacheKey: '',
    },
]

export default function Library() {
    const [tab, setTab] = useState('playlists');
    const [layout, setLayout] = useState<MediaLibraryLayout>('list');

    return (
        <Container>
            <Header title="Library" rightSection={<>
                {tab == 'playlists' && <ActionIcon size={16} icon={IconPlus} />}
                <ActionIcon size={16} icon={layout == 'list' ? IconLayoutGrid : IconLayoutList} onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLayout(l => l == 'list' ? 'grid' : 'list');
                }} />
            </>} />
            <TagTabs data={tabs} tab={tab} onChange={setTab} />
            {tab == 'playlists' && <PlaylistsTab />}
            {tab == 'albums' && <AlbumsTab />}
        </Container>
    )
}