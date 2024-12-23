import { useColors } from "@/lib/hooks/useColors";
import { CustomFont } from "@/types";
import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";

export type TitleProps = {
    children?: React.ReactNode;
    size?: number;
    fontFamily?: CustomFont;
    color?: string;
}

export default function Title({ children, size, fontFamily, color }: TitleProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        title: {
            color: color ?? colors.text,
            fontFamily: fontFamily ?? 'Poppins-Medium',
            fontSize: size,
            includeFontPadding: false,
        }
    }), [colors.text, size, fontFamily, color]);

    return (
        <Text style={styles.title}>
            {children}
        </Text>
    )
}