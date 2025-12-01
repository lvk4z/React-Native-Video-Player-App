import React from 'react';
import { Tabs } from 'expo-router';
import Navbar from '@/components/Navbar';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarStyle: {
          borderTopWidth: 1,
          elevation:0
        },
        header: () => <Navbar />
      }}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: true,
          title: 'Search',
        }}
      />
    </Tabs>
  );
}
