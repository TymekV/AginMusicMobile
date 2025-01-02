import { useSetting, useTabsHeight } from '@lib/hooks';
import { toastConfig } from '@lib/toastConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function ToastWrapper() {
    const [tabsHeight] = useTabsHeight();
    const insets = useSafeAreaInsets();
    const position = useSetting('ui.toastPosition');

    return (
        <Toast config={toastConfig} position={(position as 'top' | 'bottom') ?? 'top'} bottomOffset={tabsHeight + 10} topOffset={insets.top + 10} />
    )
}