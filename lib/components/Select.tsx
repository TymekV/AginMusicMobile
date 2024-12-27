import { Icon } from "@tabler/icons-react-native";
import { useColors } from "../hooks/useColors";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export type SelectOption = {
    label: string;
    value: string;
    icon?: Icon;
}

export type SelectProps = {
    data: SelectOption[];
    value: string;
    onChange: (value: string) => void;
}

export default function Select({ data, value, onChange }: SelectProps) {
    const colors = useColors();
    const styles = useMemo(() => StyleSheet.create({

    }), []);

    return (
        <View>

        </View>
    )
}