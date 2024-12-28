import { useColors, useCoverBuilder } from '@lib/hooks';
import { Child } from '@lib/types';
import { useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import Cover from '../Cover';
import Title from '../Title';
import { IconMenu } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { GestureEnabledContext } from '@/lib/sheets/playback';

export default function QueueItem({ item, drag, isActive }: RenderItemParams<Child>) {
    const colors = useColors();
    const cover = useCoverBuilder();

    const [gestureEnabled, setGestureEnabled] = useContext(GestureEnabledContext);

    const styles = useMemo(() => StyleSheet.create({
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 3,
        },
        left: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        }
    }), []);

    return (
        <TouchableOpacity activeOpacity={.6} onLongPress={async () => {
            setGestureEnabled(false);
            drag();
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }}>
            <View style={styles.item}>
                <View style={styles.left}>
                    <Cover
                        source={{ uri: cover.generateUrl(item.coverArt ?? '', { size: 128 }) }}
                        cacheKey={item.coverArt ? `${item.coverArt}-128x128` : 'empty-128x128'}
                        size={50}
                        radius={6}
                        withShadow={false}
                    />
                    <View>
                        <Title size={14}>{item.title}</Title>
                        <Title size={12} fontFamily="Poppins-Regular" color={colors.text[1]}>{item.artist}</Title>
                    </View>
                </View>
                <IconMenu size={20} color={colors.text[1]} />
            </View>
        </TouchableOpacity>
    )
}