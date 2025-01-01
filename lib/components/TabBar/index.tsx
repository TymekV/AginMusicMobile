import { useColors } from "@/lib/hooks/useColors";
import { forwardRef, Ref, useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Miniplayer from "../Miniplayer";
import { LinearGradient } from "expo-linear-gradient";

export type TabBarProps = ViewProps & {

}

export const TabBar = forwardRef(({ children }: TabBarProps, ref: Ref<View>) => {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        bar: {
            // backgroundColor: colors.background,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
        },
        barContainer: {
            position: 'relative',
            flex: 1,
        },
        tabs: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
        },
        gradient: {
            ...StyleSheet.absoluteFillObject,
        }
    }), [colors.background]);

    return (
        <SafeAreaView style={styles.bar} ref={ref} edges={['bottom']}>
            <View style={styles.barContainer}>
                <LinearGradient
                    colors={[colors.theme === 'dark' ? '#00000000' : '#ffffff00', colors.background + '99', colors.background]}
                    locations={[0, 0.3, .85]}
                    style={styles.gradient}
                />
                <Miniplayer />
                <View style={styles.tabs}>
                    {children}
                </View>
            </View>
        </SafeAreaView>
    )
});