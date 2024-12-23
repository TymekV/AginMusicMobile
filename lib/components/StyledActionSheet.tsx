import { useColors } from "@/lib/hooks/useColors";
import { useMemo } from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import ActionSheet, { ActionSheetProps } from "react-native-actions-sheet";

export interface StyledActionSheetProps extends ActionSheetProps {
    fullHeight?: boolean;
}

export function StyledActionSheet({ fullHeight, children, containerStyle, indicatorStyle, ...props }: StyledActionSheetProps) {
    const { sheetBackgroundColor, sheetIndicatorColor } = useColors();

    return (
        <ActionSheet
            containerStyle={{
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                backgroundColor: sheetBackgroundColor,
                ...(fullHeight ? { flex: 1 } : {}),
                ...containerStyle,
            }}
            indicatorStyle={{
                width: 50,
                height: 5,
                borderRadius: 5,
                backgroundColor: sheetIndicatorColor,
                marginTop: 10,
                ...indicatorStyle,
            }}
            {...props}
        >
            {children}
        </ActionSheet>
    )
}

export function SheetContainer({ children, style, ...props }: ViewProps) {
    const styles = useMemo(() => StyleSheet.create({
        container: {
            padding: 15,
            paddingTop: 5,
            paddingBottom: Platform.OS === 'ios' ? 0 : 15,
            paddingHorizontal: 25,
            // flex: 1,
        },
    }), []);

    return (
        <View style={[styles.container, style]} {...props}>
            {children}
        </View>
    );
}