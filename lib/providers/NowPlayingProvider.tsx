import { createContext, useEffect, useState } from "react";
import { BaseResponse, Child, NowPlaying } from "../types";
import { useApi } from "../hooks";

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

    const api = useApi();

    useEffect(() => {
        console.log({ api });

        if (!api) return;
        (async () => {
            console.log('fetching', api.defaults.baseURL);
            const rawRes = await api.get('/getNowPlaying');
            console.log('a');
            const res = rawRes.data?.['subsonic-response'] as (BaseResponse & { nowPlaying: NowPlaying });
            console.log('b');

            const nowPlaying = res.nowPlaying.entry?.[0];
            console.log('c');
            console.log(nowPlaying);
            console.log('d');

            if (!nowPlaying) return;

            console.log('e');
            setNowPlaying(nowPlaying);
        })();
    }, [api]);

    return (
        <NowPlayingContext.Provider value={[nowPlaying, setNowPlaying]}>
            {children}
        </NowPlayingContext.Provider>
    )
}