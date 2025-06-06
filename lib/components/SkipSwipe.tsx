import { Child } from '@lib/types';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
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
            data={queue.queue ?? []}
            windowSize={5}
            width={width}
            renderItem={({ index }) => {
                const item = queue.queue?.[index];
                if (!item) return <View />;
                return renderItem(item._child);
            }}
            onSnapToItem={(index) => {
                if (index == queue.activeIndex) return;
                queue.jumpTo(index);
            }}
            panGestureHandlerProps={{
                // activeOffsetX: [-20, 20],
            }}
            style={style}
        />
    )
}