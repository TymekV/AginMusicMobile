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
        console.log('fuck axios', api);

        if (!api) return;
        console.log('fetchibng1');

        (async () => {
            try {
                console.log('fetching');
                const rawRes = await api.get('/getNowPlaying');
                console.log('a');
                const res = rawRes.data?.['subsonic-response'] as (BaseResponse & { nowPlaying: NowPlaying });
                console.log('b', res);

                const nowPlaying = res.nowPlaying?.entry?.[0];
                console.log('c');
                console.log(nowPlaying);
                console.log('d');

                if (!nowPlaying) return;

                console.log('e');
                setNowPlaying(nowPlaying);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [api]);

    return (
        <NowPlayingContext.Provider value={[nowPlaying, setNowPlaying]}>
            {children}
        </NowPlayingContext.Provider>
    )
}