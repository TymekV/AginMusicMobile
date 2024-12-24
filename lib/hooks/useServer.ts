import { useContext } from 'react';
import { ServerContext } from '@lib/providers/ServerProvider';

export function useServer() {
    return useContext(ServerContext);
}