import { TouchableOpacity, View } from 'react-native';
import { TouchableOpacityProps } from 'react-native-gesture-handler';
import { LibLayout } from '.';
import { useContext } from 'react';
import ListItem from './ListItem';
import GridItem from './GridItem';
import React from 'react';

export type TMediaLibItem = {
    id: string;
    title: string;
    subtitle?: string;
    coverUri?: string;
    coverCacheKey?: string;
    isAlbumEntry?: boolean;
    trackNumber?: number;
}

export interface MediaLibItemProps extends TMediaLibItem, Omit<TouchableOpacityProps, 'id'> {
    rightSection?: React.ReactNode;
    index?: number;
}

function MediaLibItem({ id, title, subtitle, coverUri, coverCacheKey, rightSection, style, index, isAlbumEntry = false, trackNumber, ...props }: MediaLibItemProps) {
    const layout = useContext(LibLayout);
    const ItemRenderer = layout === 'grid' ? GridItem : ListItem;

    return (
        <TouchableOpacity activeOpacity={.8} style={[style, (index != undefined && layout == 'grid') && (index % 2 == 0 ? { marginRight: 5 } : { marginLeft: 5 })]} {...props}>
            <ItemRenderer id={id} title={title} subtitle={subtitle} coverUri={coverUri} coverCacheKey={coverCacheKey} rightSection={rightSection} isAlbumEntry={isAlbumEntry} trackNumber={trackNumber} />
        </TouchableOpacity>
    )
}

export default React.memo(MediaLibItem);