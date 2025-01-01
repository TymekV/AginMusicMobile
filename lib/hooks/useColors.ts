import { Colors } from '@/lib/constants/Colors';
import { ColorSchemeOverride } from '@lib/providers/ColorSchemeOverride';
import { useContext, useEffect, useState } from 'react';
import { AppState, ColorSchemeName, useColorScheme } from 'react-native';
import { Appearance } from 'react-native';

export type UseColorsOptions = {
    forceTheme?: 'light' | 'dark';
}

export function useColors(options?: UseColorsOptions) {
    const override = useContext(ColorSchemeOverride);

    const [currentTheme, setTheme] = useState<ColorSchemeName>(
        override ?? Appearance.getColorScheme(),
    );

    useEffect(() => {
        if (override) return setTheme(override);
        const listener = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                const theme = Appearance.getColorScheme();
                setTheme(theme);
            }
        });

        return () => {
            listener.remove();
        }
    }, [override]);

    const theme = currentTheme ?? 'light';
    return Colors[options?.forceTheme ?? theme];
}