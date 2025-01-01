import { SmallToastProps } from '@lib/components/SmallToast';
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

export default async function showToast(options: SmallToastProps) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({
        type: 'info',
        props: options,
    });
}