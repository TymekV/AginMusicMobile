import { TabsHeightContext } from '@lib/providers/TabsHeightProvider';
import { useContext } from 'react';

export function useTabsHeight() {
    return useContext(TabsHeightContext);
}