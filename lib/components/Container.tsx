import { useColors } from "@/lib/hooks/useColors";
import { SafeAreaView } from "react-native-safe-area-context";

export type ContainerProps = {
    children?: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
    const colors = useColors();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {children}
        </SafeAreaView>
    )
}