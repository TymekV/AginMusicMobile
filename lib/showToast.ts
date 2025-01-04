import { SmallToastProps } from '@lib/components/SmallToast';
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

export interface ToastOptions extends SmallToastProps {
    haptics?: 'success' | 'error' | 'none';
}

export default async function showToast({ haptics = 'success', ...options }: ToastOptions) {
    if (haptics != 'none') Haptics.notificationAsync(haptics == 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
    Toast.show({
        type: 'info',
        props: options,
    });
}