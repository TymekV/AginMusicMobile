import React, { useState, useEffect } from 'react';
import { Image, ImageProps } from 'expo-image';
import * as FileSystem from 'expo-file-system';
import { ActivityIndicator, View, StyleProp, ImageStyle } from 'react-native';

interface CachedImageProps extends ImageProps {
    uri: string;
    cacheKey?: string;
}

const CachedImage: React.FC<CachedImageProps> = ({ uri, cacheKey, ...props }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadImage = async () => {
            console.log('[CachedImage] key =', cacheKey);

            if (!cacheKey || !uri) return;
            const cacheDir = `${FileSystem.cacheDirectory}imagesCache/`;
            const cachePath = `${cacheDir}${cacheKey}`;

            try {
                const dirInfo = await FileSystem.getInfoAsync(cacheDir);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
                }

                const metadata = await FileSystem.getInfoAsync(cachePath);
                if (metadata.exists) {
                    console.log('[CachedImage] HIT');
                    setImageUri(cachePath);
                } else {
                    console.log('[CachedImage] MISS');
                    setImageUri(uri);
                    const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, cachePath);
                }
            } catch (error) {
                // console.error('Error loading image:', error);
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [uri, cacheKey]);

    return <Image source={{ uri: (!cacheKey || !uri) ? uri : imageUri }} {...props} />;
};

export default CachedImage;