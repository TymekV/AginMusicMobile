import { useContext } from 'react';
import { NowPlayingContext } from '../providers/NowPlayingProvider';

export function useNowPlaying() {
    return useContext(NowPlayingContext);
}