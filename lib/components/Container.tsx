import { useColors } from "@/lib/hooks/useColors";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

export interface ContainerProps extends SafeAreaViewProps {
    children?: React.ReactNode;
}

export default function Container({ children, ...props }: ContainerProps) {
    const colors = useColors();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}{...props}>
            {children}
        </SafeAreaView>
    )
}