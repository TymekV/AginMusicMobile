import { SettingId } from "@/app/(tabs)/(index,library,search)/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type SettingValue = boolean | string | undefined;

export function useSetting(settingName: SettingId): SettingValue {
    const [value, setValue] = useState<SettingValue>(undefined);

    useEffect(() => {
        (async () => {
            const value = await AsyncStorage.getItem(`settings.${settingName}`);
            if (!value) return;

            setValue(JSON.parse(value));
        })();
    }, [settingName]);

    return value;
}