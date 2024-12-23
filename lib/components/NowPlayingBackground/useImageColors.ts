import { useEffect, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image, Platform } from 'react-native';
import { getColors } from 'react-native-image-colors';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/build/types';
import { useColors } from '@/lib/hooks/useColors';
import chroma from 'chroma-js';

export type ImageColorsProps = {
    image: string;
}

export type ImageColors = string[];
const numberOfTiles = 2;

async function cropImageIntoTiles(uri: string): Promise<ImageManipulator.ImageResult[]> {
    return new Promise((resolve, reject) => {
        Image.getSize(
            uri,
            async (imageWidth, imageHeight) => {
                const results = [];
                const tileHeight = imageHeight / numberOfTiles;

                for (let i = 0; i < numberOfTiles; i++) {
                    const croppedImage = await ImageManipulator.manipulateAsync(
                        uri,
                        [
                            {
                                crop: {
                                    originX: 0,
                                    originY: i * tileHeight,
                                    width: imageWidth,
                                    height: tileHeight,
                                },
                            },
                        ],
                        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
                    );
                    results.push(croppedImage);
                }

                resolve(results);
            },
            (error) => reject(error)
        );
    })
}

function darkenIfLight(color: string): string {
    const colorInstance = chroma(color);

    if (colorInstance.luminance() > 0.8) {
        return colorInstance.darken(3).hex();
    }

    if (colorInstance.luminance() > 0.5) {
        return colorInstance.darken(1).hex();
    }

    return colorInstance.hex();
}

export default function useImageColors({ image }: ImageColorsProps) {
    const [colors, setColors] = useState<ImageColors>([]);

    const themeColors = useColors();

    useEffect(() => {
        (async () => {
            const results = [];
            const imageData = await cropImageIntoTiles(image);

            let i = 0;
            for (const tile of imageData) {
                const color = await getColors(tile.uri);
                const hexColor = Platform.OS == 'ios' ? (color as IOSImageColors)?.background : Platform.OS == 'android' ? (color as AndroidImageColors)?.dominant : themeColors.sheetBackgroundColor;
                const finalColor = darkenIfLight(hexColor);
                results.push(finalColor);
                i++;
            }
            console.log(results);

            setColors(results);
        })();
    }, [image, themeColors]);

    return colors;
}