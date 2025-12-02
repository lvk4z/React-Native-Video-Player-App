import React from "react";
import { Tabs } from "expo-router";
import Navbar from "@/components/Navbar";
import HomeIcon from "@/assets/icons/home-icon.svg";
import SearchIcon from "@/assets/icons/search-icon.svg";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarStyle: {
          backgroundColor: "#8D99AE",
          height: 72,
          borderTopWidth: 0,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarInactiveTintColor: '#2B2D42',
        header: () => <Navbar />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
          title: "Home",
          tabBarIcon: () => (<HomeIcon/>)
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: true,
          title: "Search",
          tabBarIcon: () => (<SearchIcon/>)
        }}
      />
    </Tabs>
  );
}
