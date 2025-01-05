![](https://raw.githubusercontent.com/TymekV/AginMusicMobile/refs/heads/main/banner.png)
# Agin Music
Agin Music is an open source client for OpenSubsonic-compatible servers written in React Native. It has been tested to work properly with [Navidrome](https://www.navidrome.org/).

## Features
- :microphone: Synced lyrics support
- :headphones: Bluetooth audio/AirPlay support
- :new_moon: Dark mode support
- :sparkling_heart: Marking songs as favourite *(coming soon)*
- :pushpin: Pinning songs, albums and artist
- :iphone: Managing playback from the lock screen
- :point_up_2: Gesture support
- :floppy_disk: Offline playback *(coming soon)*

More features coming soon!

## Roadmap
- [x] Core playback features
- [x] Synced lyrics support
- [x] Bluetooth audio/AirPlay support
- [x] Dark mode support
- [x] Managing playback from the lock screen
- [x] Gesture support
- [ ] Marking songs as favourite
- [ ] Artists and songs view in the Library
- [ ] Offline playback
- [ ] Playlist items reordering
- [ ] Playlist renaming
- [ ] Quality settings
- [ ] Locally storing playback history
- [ ] Homepage improvements
- [ ] Widgets on Android and iOS
- [ ] Performance improvements

## TestFlight
If you want to help testing the app, click [here](https://testflight.apple.com/join/jH76ZDQs).

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