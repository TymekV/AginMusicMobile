import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";

export type ContainerProps = {
    children?: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
    const bg = useThemeColor('background');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
            {children}
        </SafeAreaView>
    )
}