import { SearchHistoryContext } from '@lib/providers/SearchHistoryProvider';
import { useContext } from 'react';

export function useSearchHistory() {
    return useContext(SearchHistoryContext);
}