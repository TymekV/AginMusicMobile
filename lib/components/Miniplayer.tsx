import { StyleSheet, View } from 'react-native';
import Title from './Title';
import { useMemo } from 'react';
import { useColors } from '@/lib/hooks/useColors';
import { Image } from 'expo-image';
import ActionIcon from './ActionIcon';
import { IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerTrackNext, IconPlayerTrackNextFilled } from '@tabler/icons-react-native';

export default function Miniplayer() {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        miniplayer: {
            backgroundColor: colors.secondaryBackground,
            marginHorizontal: 15,
            borderRadius: 16,
            height: 55,
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 7,
            // shadowColor: '#000000',
            // shadowOffset: {
            //     width: 0,
            //     height: 3,
            // },
            // shadowOpacity: 0.17,
            // shadowRadius: 3.05,
            // elevation: 4
        },
        metadata: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        image: {
            width: 41,
            height: 41,
            borderRadius: 9,
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            // gap: 10,
            paddingRight: 10
        }
    }), [colors.secondaryBackground]);

    return (
        <View style={styles.miniplayer}>
            <View style={styles.metadata}>
                <Image source={{ uri: 'https://cdn.swiatksiazki.pl/media/catalog/product/6/8/6899907019068-1.jpg?width=650&height=650&store=default&image-type=small_image' }} style={styles.image} cachePolicy="disk" />
                <View>
                    <Title size={14} fontFamily='Poppins-SemiBold'>LosT</Title>
                    <Title size={12} fontFamily='Poppins-Regular' color={colors.secondaryText}>Bring Me The Horizon</Title>
                </View>
            </View>
            <View style={styles.actions}>
                <ActionIcon icon={IconPlayerPlayFilled} isFilled />
                <ActionIcon icon={IconPlayerTrackNextFilled} size={20} isFilled />
            </View>
        </View>
    )
}