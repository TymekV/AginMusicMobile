import showToast from "@lib/showToast";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

export type SearchHistoryItem = {
    id: string;
    name: string;
    type: 'track' | 'album' | 'artist' | 'playlist';
    searchedAt: Date;
    description: string;
    coverArt: string;
}

export function useSearchHistory() {
    const db = useSQLiteContext();
    const [items, setItems] = useState<SearchHistoryItem[]>([]);

    useEffect(() => {
        (async () => {
            const result = await db.getAllAsync<SearchHistoryItem>('SELECT * FROM searchHistory ORDER BY searchedAt DESC');
            setItems(result);
        })();
    }, []);

    const addItem = useCallback(async (item: SearchHistoryItem) => {
        // TODO
        await db.runAsync('INSERT INTO searchHistory (id, name, description, type, coverArt, searchedAt) VALUES ($id, $name, $description, $type, $coverArt, NULL)', {
            $id: item.id,
            $name: item.name,
            $description: item.description,
            $type: item.type,
            $coverArt: item.coverArt,
        });
        setItems([...items, item]);
    }, []);

    return {
        items,
        addItem,
    }
}