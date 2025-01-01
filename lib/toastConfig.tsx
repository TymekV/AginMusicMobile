import { ToastConfig, ToastConfigParams } from "react-native-toast-message";
import SmallToast, { SmallToastProps } from "./components/SmallToast";

export const toastConfig: ToastConfig = {
    info: ({ props }: ToastConfigParams<SmallToastProps>) => (
        <SmallToast {...props} />
    ),
}