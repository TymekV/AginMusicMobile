import Button from '@lib/components/Button';
import { Input } from '@lib/components/Input';
import { SetupPage } from '@lib/components/SetupPage';
import { useServer } from '@lib/hooks';
import { IconMusic } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function Login() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const server = useServer();

    const goNext = useCallback(async () => {
        if (url === '') return;
        setLoading(true);

        try {
            const result = await server.discoverServer(url);
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
            actions={<Button onPress={goNext} disabled={url === '' || loading}>Next</Button>}
        >
            <Input
                placeholder='Server URL...'
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus
                value={url}
                onChangeText={setUrl}
                returnKeyType='next'
                onSubmitEditing={goNext}
                submitBehavior='submit'
                enablesReturnKeyAutomatically
            />
        </SetupPage>
    )
}