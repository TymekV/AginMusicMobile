import Container from '@/lib/components/Container';
import NowPlayingBackground from '@/lib/components/NowPlayingBackground';
import Title from '@/lib/components/Title';
import { useServer } from '@/lib/hooks';
import { useEffect } from 'react';
import { Button, ScrollView, View } from 'react-native';



export default function Home() {
    const server = useServer();
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

                await server.saveAndTestPasswordCredentials('nigger', 'nigger');
                console.log('DONE');

            }} />
            <ScrollView style={{ flex: 1 }}>
                {new Array(500).fill(0).map((x, i) => <Title key={i}>ahgihudfgshiudfgshiougdfsiou</Title>)}
            </ScrollView>
        </Container>
    )
}