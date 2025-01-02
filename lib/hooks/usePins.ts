import showToast from "@lib/showToast";
import { IconPin, IconPinnedOff } from "@tabler/icons-react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

export type Pin = {
    id: string;
    name: string;
    description: string;
    type: 'track' | 'album' | 'artist' | 'playlist';
    coverArt: string;
    pinOrder?: number;
}

export function usePins() {
    const db = useSQLiteContext();
    const [history, setHistory] = useState<Pin[]>([]);

    useEffect(() => {
        (async () => {
            const result = await db.getAllAsync<Pin>('SELECT * FROM pins ORDER BY pinOrder ASC');
            setHistory(result);
        })();
    }, []);

    const addPin = useCallback(async (pin: Pin) => {
        if (!pin.pinOrder) pin.pinOrder = history.length;
        await db.runAsync('INSERT INTO pins (id, name, description, type, coverArt, pinOrder) VALUES ($id, $name, $description, $type, $coverArt, $pinOrder)', {
            $id: pin.id,
            $name: pin.name,
            $description: pin.description,
            $type: pin.type,
            $coverArt: pin.coverArt,
            $pinOrder: pin.pinOrder,
        });
        setHistory([...history, pin]);
        await showToast({
            title: 'Pinned',
            subtitle: pin.name,
            icon: IconPin,
        });
    }, []);

    const removePin = useCallback(async (id: string) => {
        const pin = await db.getFirstAsync<Pin>('SELECT * FROM pins WHERE id = $id', { $id: id });
        if (!pin) return;

        await db.runAsync('DELETE FROM pins WHERE id = $id', { $id: id });
        setHistory(history.filter(p => p.id !== id));

        await showToast({
            title: 'Unpinned',
            subtitle: pin.name,
            icon: IconPinnedOff,
        });
    }, []);

    const isPinned = useCallback((id: string) => history.some(p => p.id === id), [history]);

    return {
        pins: history,
        addPin,
        removePin,
        isPinned,
    }
}