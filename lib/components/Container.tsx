import { useColors } from "@/lib/hooks/useColors";
import { View } from "react-native";
import { SafeAreaView, SafeAreaViewProps, useSafeAreaInsets } from "react-native-safe-area-context";

export interface ContainerProps extends SafeAreaViewProps {
    children?: React.ReactNode;
    includeTop?: boolean;
}

export default function Container({ children, edges, includeTop = true, ...props }: ContainerProps) {
    const colors = useColors();

    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: includeTop ? insets.top : 0, paddingBottom: insets.bottom }} {...props}>
            {children}
        </View>
    )
}