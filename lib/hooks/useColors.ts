import { Colors } from '@/lib/constants/Colors';
import { useEffect, useState } from 'react';
import { AppState, ColorSchemeName, useColorScheme } from 'react-native';
import { Appearance } from 'react-native';

export type UseColorsOptions = {
    forceTheme?: 'light' | 'dark';
}

export function useColors(options?: UseColorsOptions) {
    const [currentTheme, setTheme] = useState<ColorSchemeName>(
        Appearance.getColorScheme(),
    );

    useEffect(() => {
        const listener = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                const theme = Appearance.getColorScheme();
                setTheme(theme);
            }
        });

        return () => {
            listener.remove();
        }
    }, []);

    const theme = currentTheme ?? 'light';
    return Colors[options?.forceTheme ?? theme];
}