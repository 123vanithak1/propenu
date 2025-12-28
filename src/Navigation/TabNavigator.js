// src/navigation/TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, Text, StyleSheet, View } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import ShortListedScreen from "../screens/ShortListedScreen/ShortListedScreen";
import { Logo } from "../../assets/svg/Logo";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        headerTitle: () => (
          <Text style={{ color: "white", fontWeight: "bold" }}>Propenu</Text>
        ),
        headerTitleAlign: "center",
        headerTransparent: false,
         headerSafeAreaInsetsEnabled: true,
        headerLeft: () => (
          <Pressable onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={26} color="white" />
          </Pressable>
        ),
        headerLeftContainerStyle: { paddingLeft: 20 },
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              marginRight: 8,
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => navigation.navigate("PostProperty")}
              style={{
                marginRight: 8,
                backgroundColor: "white",
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#27AE60" }}>Post Property</Text>
            </Pressable>
            <Pressable onPress={() => console.log("Notifications Pressed")}>
              <Ionicons name="notifications" size={20} color="white" />
            </Pressable>
          </View>
        ),
        headerRightContainerStyle: { justifyContent: "center" },
        // headerTitle: () => <Logo width={30} height={30} />,

        headerStyle: {
          backgroundColor: "#27AE60",
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "ShortListed") {
            iconName = focused ? "star" : "star-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={18} color={color} />;
        },

        tabBarStyle: {
          height: 55,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginBottom: -3,
        },

        tabBarActiveTintColor: "#27AE60",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="ShortListed" component={ShortListedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  postPropertyButton: {
    marginRight: 8,
    // backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 5,
  },
});
