import { Colors } from '@/lib/constants/Colors';
import { useColorScheme } from 'react-native';

export function useColors() {
    const theme = useColorScheme() ?? 'light';
    return Colors[theme];
}