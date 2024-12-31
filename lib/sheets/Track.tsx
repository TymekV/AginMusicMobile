import { StyledActionSheet } from '@lib/components/StyledActionSheet';
import { Platform, StyleSheet, View } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCache, useColors } from '@lib/hooks';
import { useEffect, useMemo, useState } from 'react';
import Title from '@lib/components/Title';
import Button from '@lib/components/Button';
import { Child } from '@lib/types';

function TrackSheet({ sheetId, payload }: SheetProps<'track'>) {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const cache = useCache();

    const [data, setData] = useState<Child | undefined>(payload?.data);

    useEffect(() => {
        (async () => {
            if (!payload?.id) return;

            const data = await cache.fetchChild(payload?.id);
            if (data) setData(data);
        })();
    }, [payload?.id]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            padding: 15,
            paddingBottom: Platform.OS == 'ios' ? 0 : 15,
        },
        subtitle: {
            marginTop: 5,
            marginBottom: 20,
        },
        button: {
            marginBottom: 5,
        }
    }), []);

    return (
        <StyledActionSheet
            gestureEnabled={true}
            safeAreaInsets={insets}
            containerStyle={{ backgroundColor: colors.background }}
            isModal={Platform.OS == 'android' ? false : true}
        >
            <View style={styles.container}>

            </View>
        </StyledActionSheet>
    );
}

export default TrackSheet;