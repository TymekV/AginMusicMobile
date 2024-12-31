import TrackPlayer, { Event } from "react-native-track-player";

export const PlaybackService = async () => {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        const position = await TrackPlayer.getPosition();
        if (position < 5) {
            TrackPlayer.skipToPrevious();
        } else {
            TrackPlayer.seekTo(0);
        }
    });

    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        TrackPlayer.skipToNext();
    });
}