import { useContext } from 'react';
import { ApiContext } from '@lib/providers/ApiProvider';

export function useApi() {
    return useContext(ApiContext);
}