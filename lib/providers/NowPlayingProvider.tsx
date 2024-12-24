import { createContext, useState } from "react";
import { Child } from "../types";

export type NowPlayingContextType = [
    Child,
    React.Dispatch<React.SetStateAction<Child>>,
];

const initialNowPlaying: Child = {
    id: '',
    isDir: false,
    title: '',
};

const initialNowPlayingContext: NowPlayingContextType = [
    initialNowPlaying,
    () => { },
];

export const NowPlayingContext = createContext<NowPlayingContextType>(initialNowPlayingContext);

export default function NowPlayingProvider({ children }: { children?: React.ReactNode }) {
    const [nowPlaying, setNowPlaying] = useState<Child>(initialNowPlaying);

    return (
        <NowPlayingContext.Provider value={[nowPlaying, setNowPlaying]}>
            {children}
        </NowPlayingContext.Provider>
    )
}