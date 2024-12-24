import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useSecureState(key: string, initialState: string, options?: SecureStore.SecureStoreOptions): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [state, setState] = useState<string>(initialState);

    useEffect(() => {
        (async () => {
            const value = await SecureStore.getItemAsync(key, options);
            if (!value) return;
            setState(value as string);
        })();
    }, [key, options]);

    useEffect(() => {
        (async () => {
            await SecureStore.setItemAsync(key, state, options);
        })();
    }, [state, options]);

    return [state, setState];
}