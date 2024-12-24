import { Canvas, LinearGradient, Rect, Skia, TileMode, useCanvasRef, vec } from "@shopify/react-native-skia";
import { useCallback, useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import useImageColors from "./useImageColors";
import { useColors } from "@/lib/hooks/useColors";

type NowPlayingBackgroundProps = {
    image: string;
}

export default function NowPlayingBackground({ image }: NowPlayingBackgroundProps) {
    const { width, height } = useWindowDimensions();

    const themeColors = useColors();

    const leftColor = useSharedValue(themeColors.background);
    const rightColor = useSharedValue(themeColors.background);

    const colors = useDerivedValue(() => {
        return [leftColor.value, rightColor.value];
    }, []);

    // const changeColors = useCallback((left: string, right: string) => {
    //     leftColor.value = withTiming(left, { duration: 1000 });
    //     rightColor.value = withTiming(right, { duration: 1000 });
    // }, []);

    const imageColors = useImageColors({ image });

    useEffect(() => {
        if (imageColors.length < 2) return console.log('err');
        leftColor.value = withTiming(imageColors[0], { duration: 1000 });
        rightColor.value = withTiming(imageColors[1], { duration: 1000 });
        // changeColors(imageColors[0], imageColors[1]);
        console.log({ imageColors });

    }, [imageColors]);

    return (
        <Canvas style={{ flex: 1 }}>
            <Rect x={0} y={0} width={width} height={height}>
                <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, height)}
                    colors={colors}
                />
            </Rect>
        </Canvas>
    )
}