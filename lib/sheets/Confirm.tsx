import { StyledActionSheet } from '@/lib/components/StyledActionSheet';
import { Platform, StyleSheet, View } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../hooks';
import { useMemo } from 'react';
import Title from '../components/Title';
import Button from '../components/Button';

function ConfirmSheet({ sheetId, payload }: SheetProps<'confirm'>) {
    const insets = useSafeAreaInsets();
    const colors = useColors();

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
            isModal={Platform.OS == 'android' ? false : true}
        >
            <View style={styles.container}>
                <Title size={20} align="center" fontFamily="Poppins-Bold">{payload?.title}</Title>
                <View style={styles.subtitle}>
                    <Title size={14} align="center" fontFamily="Poppins-Regular" color={colors.text[1]}>{payload?.message}</Title>
                </View>
                <View style={styles.button}>
                    <Button variant='primary' onPress={() => SheetManager.hide(sheetId, { payload: true })}>{payload?.confirmText}</Button>
                </View>
                <Button variant='subtle' onPress={() => SheetManager.hide(sheetId, { payload: false })}>{payload?.cancelText}</Button>
            </View>
        </StyledActionSheet>
    );
}

export default ConfirmSheet;