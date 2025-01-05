import { Colors } from '@lib/constants/Colors';
import config from '@lib/constants/config';
import { Pin } from '@lib/providers/PinsProvider';
import React from 'react';
import { ColorSchemeName } from 'react-native';
import { ColorProp, FlexWidget, ImageWidget, ImageWidgetSource, TextWidget } from 'react-native-android-widget';

export type PinnedProps = {
    pins: Pin[];
    colorScheme: ColorSchemeName;
};

export function Pinned({ pins, colorScheme }: PinnedProps) {
    const colors = Colors[colorScheme ?? 'light'];
    console.log('Rendering widget...', { pins, colorScheme });

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: colors.background as ColorProp,
                borderRadius: 24,
            }}
        >
            {/* <FlexWidget
                style={{
                    paddingTop: 10,
                    paddingBottom: 3,
                    paddingHorizontal: 15,
                }}
            >
                <TextWidget
                    text="Pinned"
                    style={{
                        fontSize: 13,
                        fontFamily: 'Poppins-SemiBold',
                        color: colors.text[0] as ColorProp,
                    }}
                />
            </FlexWidget> */}
            <FlexWidget
                style={{
                    height: 'match_parent',
                    width: 'match_parent',
                    // backgroundColor: colors.secondaryBackground as ColorProp,
                    flexGap: 5,
                    padding: 10,
                    paddingLeft: 8,
                    flexDirection: 'row',
                }}
            >
                {pins.map(p => <ImageWidget
                    clickAction='OPEN_URI'
                    clickActionData={{ uri: `${config.uriScheme}://${p.type == 'album' ? 'albums/' : p.type == 'playlist' ? 'playlists/' : p.type == 'track' ? '?playId=' : ''}${p.id}` }}
                    key={p.id}
                    image={p.coverArt as ImageWidgetSource}
                    imageWidth={100}
                    imageHeight={100}
                    radius={14}
                />)}
            </FlexWidget>
        </FlexWidget>
    );
}