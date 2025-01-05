import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { Pinned } from './widgets/Pinned';
import * as SQLite from 'expo-sqlite';
import { Pin } from './providers/PinsProvider';
import { Appearance } from 'react-native';
import { generateSubsonicToken } from './util';
import { initialServer, Server } from './providers/ServerProvider';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import config from './constants/config';

const nameToWidget = {
    // Hello will be the **name** with which we will reference our widget.
    Pinned: Pinned,
};

async function getServer() {
    let server = { ...initialServer };

    const serverStored = await AsyncStorage.getItem('server');
    if (serverStored) {
        const serverInfo = JSON.parse(serverStored);
        server = { ...server, ...serverInfo };
    }

    console.log('stored', serverStored);

    const storedPassword = await SecureStore.getItemAsync('password');
    if (storedPassword) {
        server.auth = { ...server.auth, password: storedPassword };
    }

    const { salt, hash } = await generateSubsonicToken(server.auth.password ?? '');
    return { server, salt, hash };
}

type BuildUrlOptions = {
    server: Server;
    salt: string;
    hash: string;
    size?: number;
}

function buildUrl(id: string, { server, salt, hash, size }: BuildUrlOptions) {
    return `${server.url}/rest/getCoverArt?${qs.stringify({
        c: `${config.clientName}/${config.clientVersion}`,
        f: 'json',
        v: config.protocolVersion,
        u: server.auth.username ?? '',
        t: hash ?? '',
        s: salt ?? '',
        id,
        ...(size ? { size: size } : {}),
    })}`;
}

export async function renderPinned(pins?: Pin[]) {
    const colorScheme = Appearance.getColorScheme();

    if (!pins) {
        const db = await SQLite.openDatabaseAsync('cache.db');
        pins = await db.getAllAsync<Pin>('SELECT * FROM pins ORDER BY pinOrder ASC');
    }
    const { server, salt, hash } = await getServer();

    const preparedPins = pins.map(pin => ({
        ...pin,
        coverArt: buildUrl(pin.id, { server, salt, hash, size: 256 }),
    }));

    console.log('Prepared pins:', preparedPins);

    return (
        <Pinned pins={preparedPins} colorScheme={colorScheme} />
    )
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;
    const Widget =
        nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

    if (widgetInfo.widgetName === 'Pinned') {

        switch (props.widgetAction) {
            case 'WIDGET_ADDED':
            case 'WIDGET_UPDATE':
                const widget = await renderPinned();
                props.renderWidget(widget);
                // Not needed for now
                break;

            case 'WIDGET_RESIZED':
                // Not needed for now
                break;

            case 'WIDGET_DELETED':
                // Not needed for now
                break;

            case 'WIDGET_CLICK':
                // Not needed for now
                break;

            default:
                break;
        }
    }
}