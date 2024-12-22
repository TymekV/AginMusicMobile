/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string } | (keyof typeof Colors.light & keyof typeof Colors.dark)
): string {
  const theme = useColorScheme() ?? 'light';

  if (typeof props === 'object') {
    return props[theme] ?? '';
  } else {
    return Colors[theme][props];
  }
}
