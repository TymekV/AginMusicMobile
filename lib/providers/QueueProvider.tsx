import { Child } from '@lib/types';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useCache } from '@lib/hooks/useCache';
import { useApi, useApiHelpers, useCoverBuilder, useServer, useSubsonicParams } from '@lib/hooks';
import qs from 'qs';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';
import TrackPlayer, { Event, RepeatMode, Track, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import showToast from '@lib/showToast';
import { IconExclamationCircle } from '@tabler/icons-react-native';
import { shuffleArray } from '@lib/util';

export type ClearConfirmOptions = {
    wait?: boolean;
    onConfirm?: () => void;
}

export type QueueReplaceOptions = {
    initialIndex?: number;
    source?: QueueSource;
    shuffle?: boolean;
}

export type TQueueItem = Track & { _child: Child };

export type QueueSource = {
    source: 'playlist' | 'album' | 'none';
    sourceId?: string;
    sourceName?: string;
}

const initialSource: QueueSource = {
    source: 'none',
}

export type QueueContextType = {
    queue: TQueueItem[];
    source: QueueSource;
    nowPlaying: Child;
    activeIndex: number;
    canGoForward: boolean;
    canGoBackward: boolean;
    setQueue: (queue: TQueueItem[]) => void;
    add: (id: string) => Promise<boolean>;
    clear: () => void;
    clearConfirm: (options?: ClearConfirmOptions) => Promise<boolean>;
    jumpTo: (index: number) => void;
    skipBackward: () => void;
    skipForward: () => void;
    replace: (items: Child[], options?: QueueReplaceOptions) => void;
    playTrackNow: (id: string) => Promise<boolean>;
    playNext: (id: string) => Promise<boolean>;
    repeatMode: RepeatMode;
    changeRepeatMode: (mode: RepeatMode) => Promise<void>;
    cycleRepeatMode: () => Promise<void>;
    toggleStar: () => Promise<void>;
}

const initialQueueContext: QueueContextType = {
    queue: [],
    source: initialSource,
    nowPlaying: {
        id: '',
        isDir: false,
        title: '',
    },
    activeIndex: 0,
    canGoBackward: false,
    canGoForward: false,
    setQueue: () => { },
    add: async (id: string) => false,
    clear: () => { },
    clearConfirm: async () => false,
    jumpTo: (index: number) => { },
    skipBackward: () => { },
    skipForward: () => { },
    replace: (items: Child[]) => { },
    playTrackNow: async (id: string) => false,
    playNext: async (id: string) => false,
    repeatMode: RepeatMode.Off,
    changeRepeatMode: async () => { },
    cycleRepeatMode: async () => { },
    toggleStar: async () => { },
}

export const QueueContext = createContext<QueueContextType>(initialQueueContext);

export type StreamOptions = {
    id: string;
    maxBitRate?: string;
    format?: string;
    timeOffset?: string;
    estimateContentLength?: boolean;
}

export default function QueueProvider({ children }: { children?: React.ReactNode }) {
    const [queue, setQueue] = useState<TQueueItem[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Child>(initialQueueContext.nowPlaying);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [source, setSource] = useState<QueueSource>(initialSource);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

    const canGoBackward = nowPlaying.id != '';
    const canGoForward = activeIndex < (queue.length ?? 0) - 1;

    const cache = useCache();
    const api = useApi();
    const params = useSubsonicParams();
    const { server } = useServer();
    const cover = useCoverBuilder();
    const { position } = useProgress();
    const helpers = useApiHelpers();

    useEffect(() => {
        (async () => {
            if (nowPlaying.id == '' || !api) return;
            console.log('scrobbling', nowPlaying.id);

            await api.get('/scrobble', { params: { id: nowPlaying.id } });
        })();
    }, [api, nowPlaying]);

    const generateMediaUrl = useCallback((options: StreamOptions) => `${server.url}/rest/stream?${qs.stringify({ ...params, ...options })}`, [params, server.url]);

    const convertToTrack = useCallback((data: Child): Track => ({
        url: generateMediaUrl({ id: data.id }),
        album: data.album,
        artist: data.artist,
        title: data.title,
        artwork: cover.generateUrl(data.id),
        _child: data,
    }), [generateMediaUrl, cover.generateUrl]);

    const updateNowPlaying = useCallback(async () => {
        console.log('updating...');

        const trackNumber = await TrackPlayer.getCurrentTrack();
        if (trackNumber == null) return;

        const track = await TrackPlayer.getTrack(trackNumber);
        console.log({ track });
        if (!track) return;
        setNowPlaying(track?._child as Child);
    }, []);

    const updateQueue = useCallback(async () => {
        const queue = await TrackPlayer.getQueue();
        console.log('updq', { queue });

        setQueue(queue as TQueueItem[]);
    }, []);

    const updateActive = useCallback(async () => {
        const trackNumber = await TrackPlayer.getCurrentTrack();
        if (trackNumber == null) return;

        setActiveIndex(trackNumber);
    }, []);

    useEffect(() => {
        updateNowPlaying();
        updateQueue();
        updateActive();
    }, []);

    const modifyQueue = useCallback(async (tracks: TQueueItem[]): Promise<void> => {
        const currentQueue = await TrackPlayer.getQueue();
        const currentlyPlaying = await TrackPlayer.getCurrentTrack();

        const toRemove = currentQueue?.map((track, index) => index).filter(index => index !== currentlyPlaying);
        console.log({ toRemove });
        toRemove.reverse();
        // for (const index of toRemove.reverse()) {
        //     await TrackPlayer.remove(index);
        // }
        await TrackPlayer.remove(toRemove);
        if (currentlyPlaying === null) {
            await TrackPlayer.reset();
            await TrackPlayer.add(tracks);
            return;
        }

        const currentlyPlayingMetadata = currentQueue[currentlyPlaying];
        const newCurrentIndex = tracks.findIndex(track => track._child.id === currentlyPlayingMetadata._child.id);
        const beforeCurrent = tracks.slice(0, newCurrentIndex);
        const afterCurrent = tracks.slice(newCurrentIndex + 1);
        console.log({ beforeCurrent, afterCurrent });


        await TrackPlayer.add(beforeCurrent, 0);
        const updatedQueue = await TrackPlayer.getQueue();

        await TrackPlayer.add(afterCurrent, updatedQueue.length);

        await updateQueue();
        await updateActive();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        if (event.type === Event.PlaybackTrackChanged) {
            await updateNowPlaying();
            await updateActive();
        }
    });

    const add = useCallback(async (id: string) => {
        const data = await cache.fetchChild(id);
        if (!data) return false;
        const currentlyPlaying = await TrackPlayer.getCurrentTrack();
        await TrackPlayer.add(convertToTrack(data));
        if (currentlyPlaying == null) await TrackPlayer.play();
        // TrackPlayer.play();

        await updateQueue();
        await updateActive();
        return true;
    }, [cache, convertToTrack]);

    const playNext = useCallback(async (id: string) => {
        const data = await cache.fetchChild(id);
        if (!data) return false;
        const currentlyPlaying = await TrackPlayer.getCurrentTrack();
        await TrackPlayer.add(convertToTrack(data), (currentlyPlaying ?? 0) + 1);

        await updateQueue();
        await updateActive();
        return true;
    }, [cache, convertToTrack]);

    const playTrackNow = useCallback(async (id: string) => {
        const data = await cache.fetchChild(id);
        if (!data) {
            await showToast({
                title: 'Track Not Found',
                subtitle: 'The track you\'re trying to play does not exist on this server.',
                icon: IconExclamationCircle,
                haptics: 'error',
            });
            return false;
        }
        await TrackPlayer.reset();
        await TrackPlayer.add(convertToTrack(data));
        await TrackPlayer.play();

        await updateQueue();
        await updateActive();
        return true;
    }, [cache, convertToTrack]);

    const replace = useCallback(async (items: Child[], options?: QueueReplaceOptions) => {
        let itemsCopy = [...items];
        if (options?.shuffle) itemsCopy = shuffleArray(itemsCopy);
        if (options?.source) setSource(options.source);
        TrackPlayer.reset();
        TrackPlayer.add(itemsCopy.map(convertToTrack));
        TrackPlayer.skip(options?.initialIndex ?? 0);
        TrackPlayer.play();

        await updateQueue();
        await updateActive();
    }, [convertToTrack]);

    const clear = useCallback(async () => {
        TrackPlayer.reset();

        setQueue([]);
        await updateQueue();
        await updateActive();
        setNowPlaying(initialQueueContext.nowPlaying);
    }, []);

    const clearConfirm = useCallback(async (options?: ClearConfirmOptions) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const confirmed = await SheetManager.show('confirm', {
            payload: {
                title: 'Clear Queue',
                message: 'Are you sure you want to clear the queue?',
                confirmText: 'Clear',
                cancelText: 'Cancel',
            },
        });
        if (!confirmed) return false;

        if (options?.wait) {
            TrackPlayer.pause();
            if (options?.onConfirm) options.onConfirm();
            await new Promise(r => setTimeout(r, 500));
        }

        clear();
        return true;
    }, [clear]);

    const jumpTo = useCallback((index: number) => {
        console.log('jumping to', index);

        TrackPlayer.skip(index);
        updateActive();
    }, [queue]);

    const skipForward = useCallback(async () => {
        await TrackPlayer.skipToNext();
        updateActive();
    }, []);

    const skipBackward = useCallback(async () => {
        console.log('skipping backward', position);

        if (position > 5) {
            await TrackPlayer.seekTo(0);
        } else {
            await TrackPlayer.skipToPrevious();
            await updateActive();
        }
    }, [jumpTo, position]);

    const changeRepeatMode = useCallback(async (mode: RepeatMode) => {
        setRepeatMode(mode);
        TrackPlayer.setRepeatMode(mode);
    }, []);

    const cycleRepeatMode = useCallback(async () => {
        if (repeatMode === RepeatMode.Off) {
            await changeRepeatMode(RepeatMode.Queue);
        } else if (repeatMode === RepeatMode.Queue) {
            await changeRepeatMode(RepeatMode.Track);
        } else {
            await changeRepeatMode(RepeatMode.Off);
        }
    }, [repeatMode]);

    const setStarred = useCallback(async (set: boolean) => {
        const starred = set ? new Date() : undefined;
        setNowPlaying(nowPlaying => ({ ...nowPlaying, starred }));
        setQueue(q => q.map(x => x.id === nowPlaying.id ? ({ ...x, starred }) : x));
    }, [queue, nowPlaying, cache]);

    const toggleStar = useCallback(async () => {
        console.log('toggle', nowPlaying.starred);

        if (!nowPlaying.id) return;

        await setStarred(!nowPlaying.starred);

        try {
            await helpers.star(nowPlaying.id, 'track', nowPlaying.starred ? 'unstar' : 'star');
        } catch (error) {
            // await setStarred(!nowPlaying.starred);
            await showToast({
                haptics: 'error',
                icon: IconExclamationCircle,
                title: 'Error',
                subtitle: 'An error occurred while liking the track.',
            });
            return;
        }

        await cache.fetchChild(nowPlaying.id, true);
    }, [queue, nowPlaying, cache]);

    return (
        <QueueContext.Provider value={{
            queue,
            nowPlaying,
            canGoBackward,
            canGoForward,
            activeIndex,
            add,
            clear,
            setQueue: modifyQueue,
            jumpTo,
            skipBackward,
            skipForward,
            replace,
            clearConfirm,
            source,
            playTrackNow,
            playNext,
            repeatMode,
            changeRepeatMode,
            cycleRepeatMode,
            toggleStar,
        }}>
            {children}
        </QueueContext.Provider>
    )
}