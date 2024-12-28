import { useColors } from "@/lib/hooks/useColors";
import { CustomFont } from "@/lib/types";
import { useMemo } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

export interface TitleProps extends TextProps {
    children?: React.ReactNode;
    size?: number;
    fontFamily?: CustomFont;
    color?: string;
    align?: 'left' | 'center' | 'right';
}

export default function Title({ children, size, fontFamily, color, align = 'left', ...props }: TitleProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        title: {
            color: color ?? colors.text[0],
            fontFamily: fontFamily ?? 'Poppins-Medium',
            fontSize: size,
            includeFontPadding: false,
            textAlign: align,
        }
    }), [colors.text[0], size, fontFamily, color, align]);

    return (
        <Text style={styles.title} {...props}>
            {children}
        </Text>
    )
}