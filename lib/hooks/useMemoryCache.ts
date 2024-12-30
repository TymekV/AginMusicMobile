import { useContext } from 'react';
import { MemoryCacheContext } from '@lib/providers/MemoryCacheProvider';

export function useMemoryCache() {
    return useContext(MemoryCacheContext);
}