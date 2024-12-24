import Container from '@/lib/components/Container';
import NowPlayingBackground from '@/lib/components/NowPlayingBackground';
import Title from '@/lib/components/Title';
import { useServer } from '@/lib/hooks';
import { useEffect } from 'react';
import { View } from 'react-native';



export default function Home() {
    const server = useServer();
    useEffect(() => {
        (async () => {
            const serverInfo = await server.discoverServer('');
            console.log(serverInfo);

            await server.saveAndTestPasswordCredentials('', '');

        })();
    }, [server.discoverServer]);

    return (
        <Container>
            <Title>{server.server.auth.username}</Title>
            <Title>{server.server.auth.password}</Title>
            {/* <NowPlayingBackground image={images[2]} /> */}
        </Container>
    )
}