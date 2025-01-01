/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0969ff';
const tintColorDark = '#ECEDEE';

export const Colors = {
  light: {
    theme: 'light',
    text: [
      '#11181C',
      '#11181C80',
      '#11181C60',
      '#11181C40',
    ],
    background: '#ffffff',
    tint: tintColorLight,
    tintText: '#ffffff',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    secondaryBackground: '#FAFAFA',
    sheetBackgroundColor: '#ffffff',
    sheetIndicatorColor: '#e4e6ed',
    sheetActionBackgroundColor: '#dedfe0',
    segmentedControlBackground: '#dedfe0',
    danger: '#f21616',
    border: [
      '#00000010',
      '#00000020',
    ]
  },
  dark: {
    theme: 'dark',
    text: [
      '#ECEDEE',
      '#ECEDEE80',
      '#ECEDEE60',
      '#ECEDEE40',
    ],
    background: '#0A0A0B',
    tint: tintColorDark,
    tintText: '#11181C',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    secondaryBackground: '#18181B',
    sheetBackgroundColor: '#121212',
    sheetIndicatorColor: '#1d1d1d',
    sheetActionBackgroundColor: '#1d1d1d',
    segmentedControlBackground: '#000000',
    danger: '#f21616',
    border: [
      '#ffffff10',
      '#ffffff20',
    ]
  },
};
