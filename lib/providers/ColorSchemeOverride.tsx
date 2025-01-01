import { createContext } from "react";

type ColorSchemeOverride = 'light' | 'dark' | undefined;

export const ColorSchemeOverride = createContext<ColorSchemeOverride>(undefined);