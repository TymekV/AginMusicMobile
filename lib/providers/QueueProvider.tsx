import { Child, PlayQueue } from '@lib/types';
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useCache } from '@lib/hooks/useCache';
import { useApi, useCoverBuilder, useGlobalPlayer, useServer, useSubsonicParams } from '@lib/hooks';
import qs from 'qs';
import { useAudioPlayerStatus } from 'expo-audio';
import { SheetManager } from 'react-native-actions-sheet';
import * as Haptics from 'expo-haptics';
import TrackPlayer, { Event, Track, useProgress, useTrackPlayerEvents } from 'react-native-track-player';

export type ClearConfirmOptions = {
    wait?: boolean;
    onConfirm?: () => void;
}

export type TQueueItem = Track & { _child: Child };

export type QueueContextType = {
    queue: TQueueItem[];
    nowPlaying: Child;
    activeIndex: number;
    canGoForward: boolean;
    canGoBackward: boolean;
    setQueue: (queue: TQueueItem[]) => void;
    add: (id: string) => Promise<void>;
    clear: () => void;
    clearConfirm: (options?: ClearConfirmOptions) => Promise<boolean>;
    jumpTo: (index: number) => void;
    skipBackward: () => void;
    skipForward: () => void;
    replace: (items: Child[], initialIndex?: number) => void;
}

const initialQueueContext: QueueContextType = {
    queue: [],
    nowPlaying: {
        id: '',
        isDir: false,
        title: '',
    },
    activeIndex: 0,
    canGoBackward: false,
    canGoForward: false,
    setQueue: () => { },
    add: async (id: string) => { },
    clear: () => { },
    clearConfirm: async () => false,
    jumpTo: (index: number) => { },
    skipBackward: () => { },
    skipForward: () => { },
    replace: (items: Child[]) => { },
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

    const canGoBackward = nowPlaying.id != '';
    const canGoForward = activeIndex < (queue.length ?? 0) - 1;

    const cache = useCache();
    const api = useApi();
    const params = useSubsonicParams();
    const { server } = useServer();
    const cover = useCoverBuilder();
    const { position } = useProgress();

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
        }
    });

    const add = useCallback(async (id: string) => {
        const data = await cache.fetchChild(id);
        if (!data) return;

        TrackPlayer.add(convertToTrack(data));
        TrackPlayer.play();

        await updateQueue();
        await updateActive();
    }, [cache, convertToTrack]);

    const replace = useCallback(async (items: Child[], initialIndex?: number) => {
        TrackPlayer.reset();
        TrackPlayer.add(items.map(convertToTrack));
        TrackPlayer.skip(initialIndex ?? 0);
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
        }}>
            {children}
        </QueueContext.Provider>
    )
}