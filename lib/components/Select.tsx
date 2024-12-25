import { Icon } from "@tabler/icons-react-native";

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

export default function Select() {

}