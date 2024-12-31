import { createContext, useEffect } from 'react';
import { AudioPlayer, setAudioModeAsync, useAudioPlayer } from 'expo-audio';

export const PlayerContext = createContext<AudioPlayer | null>(null);

// setAudioModeAsync({
//     playsInSilentMode: true,
//     shouldPlayInBackground: true,
//     allowsRecording: true,
//     interruptionMode: 'doNotMix',
//     shouldRouteThroughEarpiece: false,
// });

export default function PlayerProvider({ children }: { children?: React.ReactNode }) {
    const player = useAudioPlayer();

    return (
        <PlayerContext.Provider value={player}>
            {children}
        </PlayerContext.Provider>
    )
}