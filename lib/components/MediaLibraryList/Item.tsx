import { TouchableOpacity, View } from 'react-native';
import { TouchableOpacityProps } from 'react-native-gesture-handler';
import { LibLayout } from '.';
import { useContext } from 'react';
import ListItem from './ListItem';

export type TMediaLibItem = {
    id: string;
    title: string;
    subtitle?: string;
    coverUri?: string;
    coverCacheKey?: string;
}

export interface MediaLibItemProps extends TMediaLibItem, Omit<TouchableOpacityProps, 'id'> {
    rightSection?: React.ReactNode;
}

export default function MediaLibItem({ id, title, subtitle, coverUri, coverCacheKey, rightSection, ...props }: MediaLibItemProps) {
    const layout = useContext(LibLayout);
    const ItemRenderer = layout === 'grid' ? ListItem : ListItem;

    return (
        <TouchableOpacity activeOpacity={.8} {...props}>
            <ItemRenderer id={id} title={title} subtitle={subtitle} coverUri={coverUri} coverCacheKey={coverCacheKey} rightSection={rightSection} />
        </TouchableOpacity>
    )
}