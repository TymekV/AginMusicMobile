import Container from '@/lib/components/Container';
import Header from '@/lib/components/Header';
import PlaylistBackground from '@/lib/components/Playlist/PlaylistBackground';
import Title from '@/lib/components/Title';
import { useLocalSearchParams } from 'expo-router';

export default function Playlist() {
    const { id } = useLocalSearchParams();

    return (
        <Container>
            <Header withBackIcon withAvatar={false} />
            <PlaylistBackground
                source={{ uri: 'https://picsum.photos/200' }}
                cacheKey="a"
            />
            <Title>Playlist{id}</Title>
        </Container>
    )
}