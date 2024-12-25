import Title from '@/lib/components/Title';
import { useNowPlaying } from '@/lib/hooks';
import { useCoverBuilder } from '@/lib/hooks/useCoverBuilder';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function NowPlaying() {
    const [nowPlaying] = useNowPlaying();
    const cover = useCoverBuilder();

    const router = useRouter();

    return (
        <View>
            <Title>fgdhklnjfdgsilohjpdfgshjlopkfgdshiopgdfihspfsgioh</Title>
            <Animated.View sharedTransitionTag="cover" style={{ width: 200, height: 200 }}>
                <Image
                    source={{ uri: cover.generateUrl(nowPlaying.coverArt ?? '', { size: 128 }) }}
                    style={{ width: 200, height: 200 }}
                    cachePolicy="disk"
                />
            </Animated.View>
            <Button title='close' onPress={() => router.back()} />
        </View>
    )
}