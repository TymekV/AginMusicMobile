import Container from '@/lib/components/Container';
import NowPlayingBackground from '@/lib/components/NowPlayingBackground';
import Title from '@/lib/components/Title';
import { useQueue, useServer } from '@/lib/hooks';
import { useEffect } from 'react';
import { Button, ScrollView, View } from 'react-native';



export default function Home() {
    const server = useServer();
    const queue = useQueue();
    // useEffect(() => {
    //     (async () => {
    //         const serverInfo = await server.discoverServer('192.168.1.64:4533');
    //         console.log(serverInfo);

    //         await server.saveAndTestPasswordCredentials('', '');

    //     })();
    // }, [server.discoverServer]);

    return (
        <Container>
            {/* <NowPlayingBackground image={images[2]} /> */}
            <Button title="Log in" onPress={async () => {
                const serverInfo = await server.discoverServer('192.168.1.64:4533');
                console.log(serverInfo);

                await server.saveAndTestPasswordCredentials('', '');
                console.log('DONE');

            }} />
            <Button title="Play Something" onPress={async () => await queue.add('34ad9fc80c3b33366cecf87fe6c4ed44')} />
            {/* <ScrollView style={{ flex: 1 }}>
                {new Array(500).fill(0).map((x, i) => <Title key={i}>ahgihudfgshiudfgshiougdfsiou</Title>)}
            </ScrollView> */}
        </Container>
    )
}