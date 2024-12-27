import { useContext } from 'react';
import { PlayerContext } from '@lib/providers/PlayerProvider';

export function useGlobalPlayer() {
    return useContext(PlayerContext);
}