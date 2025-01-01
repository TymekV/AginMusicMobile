import React, { createContext, useState } from 'react';

export type TabsHeightContextType = [
    number,
    React.Dispatch<React.SetStateAction<number>>,
];

const initialTabsHeight: TabsHeightContextType = [
    0,
    () => { },
];

export const TabsHeightContext = createContext<TabsHeightContextType>(initialTabsHeight);

export default function TabsHeightProvider({ children }: { children: React.ReactNode }) {
    const [tabsHeight, setTabsHeight] = useState(0);

    return (
        <TabsHeightContext.Provider value={[tabsHeight, setTabsHeight]}>
            {children}
        </TabsHeightContext.Provider>
    );
}