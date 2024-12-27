import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { Child } from '@lib/types';
import { useApi } from './useApi';

// TODO: Finish caching
export function useCache() {
    const db = useSQLiteContext();

    const api = useApi();

    const cacheChild = useCallback(async (child: Child) => {
        console.log('[cache] Saving ', child.id);
        const row = await db.getFirstAsync('SELECT * FROM childrenCache WHERE id = $id', { $id: child.id });
        if (row) await db.runAsync('UPDATE childrenCache SET data = $data WHERE id = $id', { $id: child.id, $data: JSON.stringify(child) });
        else await db.runAsync('INSERT INTO childrenCache (id, data) VALUES ($id, $data)', { $id: child.id, $data: JSON.stringify(child) });
    }, [db]);

    const getChild = useCallback(async (id: string): Promise<Child | null> => {
        // TODO: Add expiring
        const row = await db.getFirstAsync<{ id: string, data: string }>('SELECT * FROM childrenCache WHERE id = $id', { $id: id });
        if (!row) return null;

        const data = JSON.parse(row.data) as Child;
        return data;
    }, [db]);

    const fetchChild = useCallback(async (id: string): Promise<Child | undefined> => {
        console.log('[cache] requesting ', id);

        if (!api) return;

        const cached = await getChild(id);
        if (cached) {
            console.log('[cache] HIT ', id);
            return cached;
        }
        console.log('[cache] MISS ', id);

        const child = await api.get('/getSong', { params: { id } });
        const childData = child.data?.['subsonic-response']?.song as Child | undefined;
        if (!childData) return;

        await cacheChild(childData);
        return childData;
    }, [getChild, cacheChild, api]);

    return {
        fetchChild,
        cacheChild,
    }
}