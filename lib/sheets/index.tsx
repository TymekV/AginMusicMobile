import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import { Icon } from '@tabler/icons-react-native';
import { Dispatch, Key, SetStateAction } from 'react';
import PlaybackSheet from './playback';

registerSheet('playback', PlaybackSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
    interface Sheets {
        'playback': SheetDefinition<{}>;
    }
}

export { };