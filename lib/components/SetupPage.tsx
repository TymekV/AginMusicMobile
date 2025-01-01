import { useColors } from '@lib/hooks';
import { Icon } from '@tabler/icons-react-native';
import React, { useMemo } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import Title from './Title';
import { SafeAreaView } from 'react-native-safe-area-context';

export type SetupPageProps = {
    icon: Icon,
    title: string,
    description?: string,
    children?: React.ReactNode,
    actions?: React.ReactNode,
}

export function SetupPageContent({ icon: Icon, title, description, children, actions }: SetupPageProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        header: {
            alignItems: 'center',
            marginBottom: 25,
        },
        icon: {
            marginBottom: 25,
        },
        title: {
            marginBottom: 5,
        },
        content: {
            flex: 1,
        },
        bottomActions: {
            position: 'absolute',
            left: 15,
            right: 15,
            bottom: 15,
            zIndex: 1,
        },
    }), []);

    return (
        <>
            <View style={styles.header}>
                <Icon size={36} color={colors.text[0]} style={styles.icon} />

                <View style={styles.title}>
                    <Title align='center' fontFamily='Poppins-SemiBold' size={24}>{title}</Title>
                </View>

                <Title align='center' fontFamily='Poppins-Medium' size={12} color={colors.text[1]}>{description}</Title>
            </View>
            <View style={styles.content}>
                {children}
            </View>
            {actions && <View style={styles.bottomActions}>
                {actions}
            </View>}
        </>
    )
}

export function SetupPage({ ...props }: SetupPageProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            padding: 25,
            paddingTop: 45,
            position: 'relative',
            flex: 1,
        },
        main: {
            flex: 1,
            backgroundColor: colors.background,
        },
    }), [colors]);

    return (
        <SafeAreaView style={styles.main}>
            <KeyboardAvoidingView style={styles.container} behavior='height'>
                <SetupPageContent {...props} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}