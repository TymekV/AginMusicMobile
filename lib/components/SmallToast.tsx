import { useColors } from "@lib/hooks";
import { Image, ImageSource } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Title from "./Title";
import { Icon } from "@tabler/icons-react-native";

export type SmallToastProps = {
    title?: string;
    subtitle?: string;
    cover?: ImageSource;
    icon?: Icon;
    link?: string;
    reverse?: boolean;
}

export default function SmallToast({ title, subtitle, cover, icon: Icon, reverse, link }: SmallToastProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            alignItems: 'center',
            paddingHorizontal: 30,
        },
        toast: {
            padding: 8,
            paddingRight: 12,
            paddingLeft: Icon ? 12 : 8,
            borderRadius: 13,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border[0],
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
        },
        image: {
            width: 30,
            height: 30,
            borderRadius: 5,
        },
        reverse: {
            flexDirection: 'column-reverse',
        }
    }), [colors, Icon]);

    return (
        <View style={styles.container}>
            <View style={styles.toast}>
                {cover && <Image source={cover} style={styles.image} />}
                {Icon && <Icon size={20} color={colors.text[0]} />}
                <View style={reverse && styles.reverse}>
                    <Title size={12} fontFamily="Poppins-SemiBold">{title}</Title>
                    <Title size={10} fontFamily="Poppins-Regular" color={colors.text[1]}>{subtitle}</Title>
                </View>
            </View>
        </View>
    )
}