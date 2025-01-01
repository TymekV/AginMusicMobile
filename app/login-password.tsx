import Button from '@lib/components/Button';
import { Input } from '@lib/components/Input';
import { SetupPage } from '@lib/components/SetupPage';
import { useServer } from '@lib/hooks';
import { IconKey, IconMusic, IconUser } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const server = useServer();

    const passwordRef = useRef<TextInput>(null);

    const logIn = useCallback(async () => {
        if (username === '' || password === '') return;
        setLoading(true);

        const success = await server.saveAndTestPasswordCredentials(username, password);
        if (!success) {
            setLoading(false);
            await SheetManager.show('confirm', {
                payload: {
                    title: 'Error',
                    message: 'Username or password is incorrect. Please try again.',
                    confirmText: 'OK',
                    withCancel: false
                }
            });
            return;
        }

        setLoading(false);
        router.replace('/');
    }, [username, password, server.saveAndTestPasswordCredentials]);

    const styles = useMemo(() => ({
        container: {
            gap: 10,
        }
    }), []);

    return (
        <SetupPage
            icon={IconKey}
            title='Enter username and password'
            description='Enter your username and password to get started.'
            actions={<Button disabled={username === '' || password === '' || loading} onPress={logIn}>Done</Button>}
        >
            <View style={styles.container}>
                <Input
                    icon={IconUser}
                    placeholder='Username...'
                    autoCapitalize='none'
                    autoCorrect={false}
                    autoFocus
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType='next'
                    onSubmitEditing={() => passwordRef.current?.focus()}
                />
                <Input
                    icon={IconKey}
                    placeholder='Password...'
                    secureTextEntry
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType='done'
                    ref={passwordRef}
                    onSubmitEditing={logIn}
                />
            </View>
        </SetupPage>
    )
}