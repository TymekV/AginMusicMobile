import { useColors } from "@/lib/hooks/useColors";
import { View } from "react-native";
import { SafeAreaView, SafeAreaViewProps, useSafeAreaInsets } from "react-native-safe-area-context";

export interface ContainerProps extends SafeAreaViewProps {
    children?: React.ReactNode;
}

export default function Container({ children, ...props }: ContainerProps) {
    const colors = useColors();

    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }} {...props}>
            {children}
        </View>
    )
}