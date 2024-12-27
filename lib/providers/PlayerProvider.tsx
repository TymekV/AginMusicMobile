import { createContext } from 'react';
import { AudioPlayer, useAudioPlayer } from 'expo-audio';

export const PlayerContext = createContext<AudioPlayer | null>(null);

export default function PlayerProvider({ children }: { children?: React.ReactNode }) {
    const player = useAudioPlayer();

    return (
        <PlayerContext.Provider value={player}>
            {children}
        </PlayerContext.Provider>
    )
}