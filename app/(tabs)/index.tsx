import Container from '@/lib/components/Container';
import Header from '@/lib/components/Header';
import NowPlayingBackground from '@/lib/components/NowPlayingBackground';
import Title from '@/lib/components/Title';
import { useQueue, useServer, useCache } from '@/lib/hooks';
import { useEffect } from 'react';
import { Button, ScrollView, View } from 'react-native';

export default function Home() {
    const server = useServer();
    const queue = useQueue();
    const cache = useCache();

    return (
        <Container>
            <Header title="Home" subtitle="Welcome back!" />
            <Button title="Log in" onPress={async () => {
                const serverInfo = await server.discoverServer('192.168.1.64:4533');
                await cache.clearAll();
                console.log('si', serverInfo);

                await server.saveAndTestPasswordCredentials(serverInfo?.url ?? '', '', '');

                console.log('DONE');

            }} />
            {/* <Button title="Play Something" onPress={async () => await queue.add('34ad9fc80c3b33366cecf87fe6c4ed44')} />
            <Button title="Play Something" onPress={async () => await queue.add('ffcb34e1bf61ae7214368c245491d5de')} />
            <Button title="Play Something" onPress={async () => await queue.add('348b4c77d7e15d55d9a93b00fa4a4931')} /> */}
            <Button title="Play Something" onPress={async () => await queue.add('2b3d5b5c432f9f8ae208806fdc1060b5')} />
            <Button title="Play Something" onPress={async () => await queue.add('a2c11dbe7bcbb396edd41ffdd1ab0481')} />
            <Button title="Clear Cache" onPress={async () => await cache.clearAll()} />
        </Container>
    )
}