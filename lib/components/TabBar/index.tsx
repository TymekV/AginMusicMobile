import { useColors } from "@/lib/hooks/useColors";
import { createContext, forwardRef, Ref, useMemo, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Miniplayer from "../Miniplayer";
import { LinearGradient } from "expo-linear-gradient";
import { useTabsHeight } from "@lib/hooks";

export type TabBarProps = ViewProps & {

}

export const TabBar = forwardRef(({ children }: TabBarProps, ref: Ref<View>) => {
    const colors = useColors();

    const [height, setHeight] = useTabsHeight();

    const insets = useSafeAreaInsets();

    const styles = useMemo(() => StyleSheet.create({
        bar: {
            // backgroundColor: colors.background,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
        },
        barFiller: {
            backgroundColor: colors.background,
            height: insets.bottom,
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
    }), [colors.background, insets]);

    return (
        <View style={styles.bar} ref={ref} onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setHeight(height);
        }}>
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
            <View style={styles.barFiller} />
        </View>
    )
});