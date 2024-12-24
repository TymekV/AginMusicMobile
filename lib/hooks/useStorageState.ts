import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useStorageState(key: string, initialState: string): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [state, setState] = useState<string>(initialState);

    useEffect(() => {
        (async () => {
            const value = await AsyncStorage.getItem(key);
            if (!value) return;
            setState(value as string);
        })();
    }, [key]);

    useEffect(() => {
        (async () => {
            await AsyncStorage.setItem(key, state);
        })();
    }, [state]);

    return [state, setState];
}