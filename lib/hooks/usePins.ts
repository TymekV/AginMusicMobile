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
    const [pins, setPins] = useState<Pin[]>([]);

    useEffect(() => {
        (async () => {
            const result = await db.getAllAsync<Pin>('SELECT * FROM pins ORDER BY pinOrder ASC');
            setPins(result);
        })();
    }, []);

    const addPin = useCallback(async (pin: Pin) => {
        if (!pin.pinOrder) pin.pinOrder = pins.length;
        await db.runAsync('INSERT INTO pins (id, name, description, type, coverArt, pinOrder) VALUES ($id, $name, $description, $type, $coverArt, $pinOrder)', {
            $id: pin.id,
            $name: pin.name,
            $description: pin.description,
            $type: pin.type,
            $coverArt: pin.coverArt,
            $pinOrder: pin.pinOrder,
        });
        setPins([...pins, pin]);
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
        setPins(pins.filter(p => p.id !== id));

        await showToast({
            title: 'Unpinned',
            subtitle: pin.name,
            icon: IconPinnedOff,
        });
    }, []);

    const isPinned = useCallback((id: string) => pins.some(p => p.id === id), [pins]);

    return {
        pins,
        addPin,
        removePin,
        isPinned,
    }
}