import { useColors } from '@lib/hooks';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TagTab, { TTagTab } from './TagTab';
import * as Haptics from 'expo-haptics';

export type TagTabsProps = {
    data: TTagTab[];
    tab: string;
    onChange: (tab: string) => void;
};

export default function TagTabs({ data, tab, onChange }: TagTabsProps) {
    const colors = useColors();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            marginTop: 10,
        },
        separator: {
            width: 5,
        },
        horizontalSpacer: {
            width: 20,
        },
    }), [colors]);

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <TagTab {...item} active={item.id == tab} onPress={async () => {
                    Haptics.selectionAsync();
                    onChange(item.id);
                }} />}
                horizontal
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => <View style={styles.horizontalSpacer} />}
                ListFooterComponent={() => <View style={styles.horizontalSpacer} />}
            />
        </View>
    )
}