import Container from '@/lib/components/Container';
import Header from '@/lib/components/Header';
import { demoAccounts } from '@/lib/demoAccounts';
import { useQueue, useServer, useCache, useMemoryCache } from '@/lib/hooks';
import { Button } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

export default function Home() {
    const server = useServer();
    const queue = useQueue();
    const cache = useCache();
    const memoryCache = useMemoryCache();

    return (
        <Container>
            <Header title="Home" subtitle="Welcome back!" />
            <Button title="Log in (Account 1)" onPress={async () => {
                const serverInfo = await server.discoverServer(demoAccounts[0].server);
                await cache.clearAll();
                console.log('si', serverInfo);

                await server.saveAndTestPasswordCredentials(serverInfo?.url ?? '', demoAccounts[0].username, demoAccounts[0].password);

                console.log('DONE');

            }} />
            <Button title="Log in (Account 2)" onPress={async () => {
                const serverInfo = await server.discoverServer(demoAccounts[1].server);
                await cache.clearAll();
                console.log('si', serverInfo);

                await server.saveAndTestPasswordCredentials(serverInfo?.url ?? '', demoAccounts[1].username, demoAccounts[1].password);

                console.log('DONE');

            }} />
            {server.server.auth.username == demoAccounts[0].username && <>
                <Button title="Play Something" onPress={async () => await queue.add('34ad9fc80c3b33366cecf87fe6c4ed44')} />
                <Button title="Play Something" onPress={async () => await queue.add('ffcb34e1bf61ae7214368c245491d5de')} />
                <Button title="Play Something" onPress={async () => await queue.add('348b4c77d7e15d55d9a93b00fa4a4931')} />
            </>}
            {server.server.auth.username == demoAccounts[1].username && <>
                <Button title="Play Something" onPress={async () => await queue.add('2b3d5b5c432f9f8ae208806fdc1060b5')} />
                <Button title="Play Something" onPress={async () => await queue.add('a2c11dbe7bcbb396edd41ffdd1ab0481')} />
                <Button title="Play Something" onPress={async () => await queue.add('506270e419db3dfbf65bcf51a57bde3e')} />
                <Button title="Play Something" onPress={async () => await queue.add('488ce4e2dac87919abe8f15941203dc2')} />
            </>}
            <Button title="Playlist" onPress={() => router.push('/playlists/1')} />
            <Button title="Clear Cache" onPress={async () => {
                await cache.clearAll();
                memoryCache.clear();
            }} />
        </Container>
    )
}