import Container from '@/lib/components/Container';
import NowPlayingBackground from '@/lib/components/NowPlayingBackground';
import Title from '@/lib/components/Title';
import { useQueue, useServer } from '@/lib/hooks';
import { useEffect } from 'react';
import { Button, ScrollView, View } from 'react-native';

export default function Home() {
    const server = useServer();
    const queue = useQueue();

    return (
        <Container>
            <Title size={20} fontFamily='Poppins-SemiBold'>Welcome back!</Title>
            <Button title="Log in" onPress={async () => {
                const serverInfo = await server.discoverServer('192.168.1.64:4533');
                console.log(serverInfo);

                await server.saveAndTestPasswordCredentials('', '');
                console.log('DONE');

            }} />
            <Button title="Play Something" onPress={async () => await queue.add('34ad9fc80c3b33366cecf87fe6c4ed44')} />
            <Button title="Play Something" onPress={async () => await queue.add('ffcb34e1bf61ae7214368c245491d5de')} />
            <Button title="Play Something" onPress={async () => await queue.add('348b4c77d7e15d55d9a93b00fa4a4931')} />
            <Button title="Clear Queue" onPress={async () => await queue.clear()} />
        </Container>
    )
}