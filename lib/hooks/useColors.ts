import { Colors } from '@/lib/constants/Colors';
import { useColorScheme } from 'react-native';

export type UseColorsOptions = {
    forceTheme?: 'light' | 'dark';
}

export function useColors(options?: UseColorsOptions) {
    const theme = useColorScheme() ?? 'light';
    return Colors[options?.forceTheme ?? theme];
}