import { useContext } from 'react';
import { QueueContext } from '@lib/providers/QueueProvider';

export function useQueue() {
    return useContext(QueueContext);
}