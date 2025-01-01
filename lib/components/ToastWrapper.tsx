import { useTabsHeight } from '@lib/hooks';
import { toastConfig } from '@lib/toastConfig';
import Toast from 'react-native-toast-message';

export default function ToastWrapper() {
    const [tabsHeight] = useTabsHeight();

    return (
        <Toast config={toastConfig} position='bottom' bottomOffset={tabsHeight + 10} />
    )
}