import { PinsContext } from '@lib/providers/PinsProvider';
import { useContext } from 'react';

export function usePins() {
    return useContext(PinsContext);
}