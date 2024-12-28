import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import PlaybackSheet from './playback';
import ConfirmSheet from './Confirm';

registerSheet('playback', PlaybackSheet);
registerSheet('confirm', ConfirmSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
    interface Sheets {
        'playback': SheetDefinition<{}>;
        'confirm': SheetDefinition<{
            payload: {
                title: string;
                message: string;
                confirmText?: string;
                cancelText?: string;
            },
            returnValue: boolean;
        }>;
    }
}

export { };