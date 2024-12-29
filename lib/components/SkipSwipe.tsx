import { Child } from '@lib/types';
import Carousel, { CarouselRenderItem, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useQueue } from '../hooks';
import { View, ViewStyle } from 'react-native';
import { ReactElement, useEffect, useRef } from 'react';

export type SkipSwipeProps = {
    width: number;
    renderItem: (item: Child) => ReactElement;
    style?: ViewStyle;
};

export default function SkipSwipe({ width, renderItem, style }: SkipSwipeProps) {
    const queue = useQueue();

    const carosuelRef = useRef<ICarouselInstance>(null);

    useEffect(() => {
        carosuelRef.current?.scrollTo({ index: queue.activeIndex, animated: true });
    }, [queue.activeIndex]);

    return (
        <Carousel
            ref={carosuelRef}
            loop={false}
            data={queue.queue.entry ?? []}
            width={width}
            renderItem={({ index }) => {
                const item = queue.queue?.entry?.[index];
                if (!item) return <View />;
                return renderItem(item);
            }}
            onSnapToItem={(index) => {
                queue.jumpTo(index);
            }}
            panGestureHandlerProps={{
                activeOffsetX: [-20, 20],
            }}
            style={style}
        />
    )
}