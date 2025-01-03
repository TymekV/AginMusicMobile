import { useSQLiteContext } from "expo-sqlite";
import { createContext, useCallback, useEffect, useState } from "react";

export type SearchHistoryItem = {
    id: string;
    name: string;
    type: 'track' | 'album' | 'artist' | 'playlist';
    searchedAt: Date;
    description: string;
    coverArt: string;
}

export type SearchHistoryContextType = {
    items: SearchHistoryItem[];
    addItem: (item: SearchHistoryItem) => Promise<void>;
}

const initial: SearchHistoryContextType = {
    items: [],
    addItem: async () => { },
};

export const SearchHistoryContext = createContext<SearchHistoryContextType>(initial);

export default function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
    const db = useSQLiteContext();
    const [items, setItems] = useState<SearchHistoryItem[]>([]);

    useEffect(() => {
        (async () => {
            const result = await db.getAllAsync<SearchHistoryItem>('SELECT * FROM searchHistory ORDER BY searchedAt DESC');
            setItems(result);
        })();
    }, []);

    const addItem = useCallback(async (item: SearchHistoryItem) => {
        const exists = await db.getFirstSync('SELECT * FROM searchHistory WHERE id = $id', { $id: item.id });
        if (exists) {
            // TODO
            await db.runAsync('UPDATE searchHistory SET searchedAt = $searchedAt WHERE id = $id', {
                $searchedAt: Date.now(),
                $id: item.id,
            });
        }
        else {
            await db.runAsync('INSERT INTO searchHistory (id, name, description, type, coverArt, searchedAt) VALUES ($id, $name, $description, $type, $coverArt, NULL)', {
                $id: item.id,
                $name: item.name,
                $description: item.description,
                $type: item.type,
                $coverArt: item.coverArt,
            });
            setItems([...items, item]);
        }
    }, []);

    return (
        <SearchHistoryContext.Provider value={{ items, addItem }}>
            {children}
        </SearchHistoryContext.Provider>
    );
}