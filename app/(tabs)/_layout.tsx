import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import React from 'react';

import { useColorScheme } from '@/lib/hooks/useColorScheme';
import Title from '@/lib/components/Title';
import { TabBar } from '@/lib/components/TabBar';
import { TabButton } from '@/lib/components/TabBar/TabButton';
import { IconCircleArrowDown, IconHome, IconLayoutGrid, IconSearch } from '@tabler/icons-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs>
        <TabSlot />
        <TabList asChild>
          <TabBar>
            <TabTrigger name="home" href="/" style={{ flex: 1 }} asChild>
              <TabButton
                icon={IconHome}
                label='Home'
              />
            </TabTrigger>
            <TabTrigger name="library" href="/library" style={{ flex: 1 }} asChild>
              <TabButton
                icon={IconLayoutGrid}
                label='Library'
              />
            </TabTrigger>
            <TabTrigger name="downloads" href="/downloads" style={{ flex: 1 }} asChild>
              <TabButton
                icon={IconCircleArrowDown}
                label='Downloads'
              />
            </TabTrigger>
            <TabTrigger name="search" href="/search" style={{ flex: 1 }} asChild>
              <TabButton
                icon={IconSearch}
                label='Search'
              />
            </TabTrigger>
          </TabBar>
        </TabList>
      </Tabs>
      {/* <Miniplayer /> */}
      {/* <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
          animation: 'shift',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconHome color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <IconLayoutGrid color={color} />,
          }}
        />
        <Tabs.Screen
          name="downloads"
          options={{
            title: 'Downloads',
            tabBarIcon: ({ color }) => <IconCircleArrowDown color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <IconSearch color={color} />,
          }}
        />
      </Tabs> */}
    </>
  );
}
