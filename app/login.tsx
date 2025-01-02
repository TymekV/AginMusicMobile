import Button from '@lib/components/Button';
import { Input } from '@lib/components/Input';
import { SetupPage } from '@lib/components/SetupPage';
import { useServer } from '@lib/hooks';
import { IconMusic } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function Login() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const server = useServer();

    const demoConfirm = useCallback(async () => {
        const confirmed = await SheetManager.show('confirm', {
            payload: {
                title: 'Use Navidrome demo server',
                message: 'The demo server is provided by Navidrome at https://demo.navidrome.org. Do you want to continue?',
                confirmText: 'Continue',
                cancelText: 'Cancel',
            }
        });
        return confirmed;
    }, []);

    const goNext = useCallback(async (useDemo?: boolean) => {
        if (url === '' && !useDemo) return;
        const confirmed = useDemo ? await demoConfirm() : true;
        if (!confirmed) return;
        setLoading(true);

        try {
            const result = await server.discoverServer(useDemo ? 'https://demo.navidrome.org' : url);
            if (result && !result.success) {
                setLoading(false);
                await SheetManager.show('confirm', {
                    payload: {
                        title: 'Error',
                        message: 'Could not connect to server. Please check the URL and try again.',
                        confirmText: 'OK',
                        withCancel: false
                    }
                });
                return;
            }

            if (useDemo) {
                const success = await server.saveAndTestPasswordCredentials('demo', 'demo', 'https://demo.navidrome.org');
                return router.push('/');
            }

            setLoading(false);
            router.push('/login-password');
        } catch (e) {
            console.error(e);
            setLoading(false);
            await SheetManager.show('confirm', {
                payload: {
                    title: 'Error',
                    message: 'Could not connect to server. Please check the URL and try again.',
                    confirmText: 'OK',
                    withCancel: false
                }
            });
        }
    }, [url]);

    return (
        <SetupPage
            icon={IconMusic}
            title='Welcome to Agin Music'
            description='Agin Music is an open source OpenSubsonic client. Enter your server URL to get started.'
            actions={<View style={{ gap: 10 }}>
                <Button onPress={() => goNext(false)} disabled={url === '' || loading}>Next</Button>
                <Button onPress={() => goNext(true)} variant='subtle'>Use Navidrome demo server</Button>
            </View>}
        >
            <Input
                placeholder='Server URL...'
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus
                value={url}
                onChangeText={setUrl}
                returnKeyType='next'
                onSubmitEditing={() => goNext(false)}
                submitBehavior='submit'
                enablesReturnKeyAutomatically
            />
        </SetupPage>
    )
}