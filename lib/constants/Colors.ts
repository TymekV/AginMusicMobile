/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0969ff';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    secondaryText: '#11181C80',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    secondaryBackground: '#FAFAFA'
  },
  dark: {
    text: '#ECEDEE',
    secondaryText: '#ECEDEE80',
    background: '#0A0A0B',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    secondaryBackground: '#18181B'
  },
};
