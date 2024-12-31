import { useEffect, useRef } from 'react';
import TrackPlayer, { Capability, IOSCategory, IOSCategoryMode, RepeatMode } from 'react-native-track-player';

async function setupPlayer() {
    await TrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 10,
        iosCategory: IOSCategory.Playback,
        iosCategoryMode: IOSCategoryMode.Default,
        autoUpdateMetadata: true,
    });

    await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
            Capability.SeekTo,
            Capability.Like,
        ],

        compactCapabilities: [Capability.Play, Capability.Pause],
        progressUpdateEventInterval: 300,
    });

    // await TrackPlayer.setVolume(1);
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
}

export type useSetupTrackPlayerProps = {
    onLoad?: () => void;
}

export function useSetupTrackPlayer({ onLoad }: useSetupTrackPlayerProps) {
    const isInitialized = useRef(false);

    useEffect(() => {
        (async () => {
            try {
                await setupPlayer();
                isInitialized.current = true;
                onLoad?.();
            } catch (error) {
                console.log(error);
                isInitialized.current = false;
            }
        })();
    }, [onLoad]);
}