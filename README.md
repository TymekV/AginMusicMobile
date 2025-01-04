# Agin Music
Agin Music is an open source client for OpenSubsonic-compatible servers written in React Native. It has been tested to work properly with [Navidrome](https://www.navidrome.org/).

## Features
- Synced lyrics support
- Bluetooth audio/AirPlay support
- Dark mode support
- Marking songs as favourite
- Pinning songs, albums and artist
- Managing playback from the lock screen
- Gesture support
- Offline playback *(coming soon)*

More features coming soon!

## Demo
If you don't have a Navidrome server, you can test the app using Naivdrome's demo server.

**URL:** demo.navidrome.org

**Username:** demo

**Password:** demo

## Building locally

To build the app locally, first clone the repo and `cd` into the folder.

Install dependencies by running:
```
npm i
```

### Building for iOS
Requirements:
- Xcode

**Building in development mode**
```
npx expo run:ios
```
**Building in release mode**
```
npx expo run:ios --configuration Release
```

### Building for Android
Requirements:
- Android SDK
- OpenJDK 17+

**Building in development mode**
```
npx expo run:android
```
**Building in release mode**
```
npx expo run:ios --variant Release
```