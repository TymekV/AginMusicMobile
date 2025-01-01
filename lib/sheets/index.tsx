import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import PlaybackSheet from './playback';
import ConfirmSheet from './Confirm';
import NewPlaylsitSheet from './NewPlaylist';
import { Child, Playlist } from '@lib/types';
import TrackSheet from './Track';
import PlaylistSheet from './Playlist';

registerSheet('playback', PlaybackSheet);
registerSheet('confirm', ConfirmSheet);
registerSheet('newPlaylist', NewPlaylsitSheet);
registerSheet('track', TrackSheet);
registerSheet('playlist', PlaylistSheet);

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
                variant?: 'default' | 'danger';
            },
            returnValue: boolean;
        }>;
        'newPlaylist': SheetDefinition<{
            payload: {
                editId?: string;
            },
            returnValue: {
                created: boolean;
                id?: string;
            };
        }>;
        'track': SheetDefinition<{
            payload: {
                id: string;
                data?: Child;
                context?: 'playlist' | 'album';
                contextId?: string;
            },
        }>;
        'playlist': SheetDefinition<{
            payload: {
                id: string;
                data?: Playlist;
            },
        }>;
    }
}

export { };