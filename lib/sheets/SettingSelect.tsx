import { StyledActionSheet } from '@lib/components/StyledActionSheet';
import { Linking, Platform } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, useServer } from '@lib/hooks';
import SheetTrackHeader from '@lib/components/sheet/SheetTrackHeader';
import SheetOption from '@lib/components/sheet/SheetOption';
import { IconArrowsSort, IconBrandGithub, IconExclamationCircle, IconLogout, IconMusic, IconSettings } from '@tabler/icons-react-native';
import Avatar from '@lib/components/Avatar';
import config from '@lib/constants/config';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';

function SettingSelectSheet({ sheetId, payload }: SheetProps<'settingSelect'>) {
    const insets = useSafeAreaInsets();
    const colors = useColors();

    const Icon = payload?.setting.icon;

    return (
        <StyledActionSheet
            gestureEnabled={true}
            safeAreaInsets={insets}
            isModal={Platform.OS == 'android' ? false : true}
        >
            <SheetTrackHeader
                coverComponent={Icon ? <Icon size={24} color={colors.text[0]} /> : <></>}
                title={payload?.setting.label}
                artist={payload?.setting.description}
            />
            {payload?.options.map((option) => <SheetOption
                key={option.value}
                icon={option.icon}
                label={option.label}
                description={option.description}
                onPress={() => {
                    SheetManager.hide(sheetId, { payload: { value: option.value } });
                }}
            />)}
        </StyledActionSheet>
    );
}

export default SettingSelectSheet;