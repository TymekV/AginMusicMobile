import { useColors } from "@/lib/hooks/useColors";
import { forwardRef, Ref, useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Miniplayer from "../Miniplayer";

export type TabBarProps = ViewProps & {

}

export const TabBar = forwardRef(({ children }: TabBarProps, ref: Ref<View>) => {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        bar: {
            backgroundColor: colors.background,
        },
        tabs: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
        }
    }), [colors.background]);

    return (
        <SafeAreaView style={styles.bar} ref={ref} edges={['bottom']}>
            <Miniplayer />
            <View style={styles.tabs}>
                {children}
            </View>
        </SafeAreaView>
    )
});