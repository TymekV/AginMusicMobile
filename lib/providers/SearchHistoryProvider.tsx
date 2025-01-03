import { useSQLiteContext } from "expo-sqlite";
import { createContext, useCallback, useEffect, useState } from "react";

export type SearchHistoryItem = {
    id: string;
    name: string;
    type: 'track' | 'album' | 'artist' | 'playlist';
    searchedAt: number;
    description: string;
    coverArt: string;
}

export type SearchHistoryContextType = {
    items: SearchHistoryItem[];
    addItem: (item: SearchHistoryItem) => Promise<void>;
    clearAll: () => Promise<void>;
}

const initial: SearchHistoryContextType = {
    items: [],
    addItem: async () => { },
    clearAll: async () => { },
};

export const SearchHistoryContext = createContext<SearchHistoryContextType>(initial);

export default function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
    const db = useSQLiteContext();
    const [items, setItems] = useState<SearchHistoryItem[]>([]);

    useEffect(() => {
        (async () => {
            const result = await db.getAllAsync<SearchHistoryItem>('SELECT * FROM searchHistory ORDER BY searchedAt DESC');
            console.log('_history', result)

            setItems(result);
        })();
    }, []);

    const addItem = useCallback(async (item: SearchHistoryItem) => {
        console.log({ item });

        const exists = await db.getFirstSync('SELECT * FROM searchHistory WHERE id = $id', { $id: item.id });
        console.log({ exists });

        if (exists) {
            // TODO
            await db.runAsync('UPDATE searchHistory SET searchedAt = $searchedAt WHERE id = $id', {
                $searchedAt: Date.now(),
                $id: item.id,
            });
            setItems(prevItems => {
                const updatedItems = prevItems.map(i => i.id === item.id ? { ...i, searchedAt: Date.now() } : i);
                return updatedItems.sort((a, b) => b.searchedAt - a.searchedAt);
            });
        }
        else {
            await db.runAsync('INSERT INTO searchHistory (id, name, description, type, coverArt, searchedAt) VALUES ($id, $name, $description, $type, $coverArt, $searchedAt)', {
                $id: item.id,
                $name: item.name,
                $description: item.description,
                $type: item.type,
                $coverArt: item.coverArt,
                $searchedAt: Date.now(),
            });
            setItems(items => [item, ...items]);
        }
    }, []);

    const clearAll = useCallback(async () => {
        await db.runAsync('DELETE FROM searchHistory');
        setItems([]);
    }, []);

    return (
        <SearchHistoryContext.Provider value={{ items, addItem, clearAll }}>
            {children}
        </SearchHistoryContext.Provider>
    );
}