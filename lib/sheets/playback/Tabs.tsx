import NowPlayingTab, { NowPlayingTabProps } from '@/lib/components/nowPlaying/NowPlayingTab';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export interface Tab extends Omit<NowPlayingTabProps, 'active'> {
    value: string;
}

export type TabsProps = {
    tabs: Tab[];
    active: string;
    onChange: (value: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
    const styles = useMemo(() => StyleSheet.create({
        tabs: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            gap: 70,
        },
    }), []);

    return (
        <View style={styles.tabs}>
            {tabs.map(tab => (
                <NowPlayingTab key={tab.value} active={tab.value === active} onPress={() => onChange(tab.value === active ? 'main' : tab.value)} {...tab} />
            ))}
        </View>
    )
}