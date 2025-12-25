// src/navigation/TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
         headerTitle: () => null,
        // headerTitle: () => <Logo width={30} height={30} />,
        // headerTitleAlign: 'center',   for centering the logo
        headerStyle:{
          height:55
        },
          headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons
              name="menu"
              size={24}
              color={route.name === "Home" ? "white" : "Black"}
            />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate("PostProperty")}
            style={styles.postPropertyButton}
          >
            <Text style={{ color: "#007AFF" }}>Post Property</Text>
          </Pressable>
        ),

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

        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTransparent: true,
        }}
      />
      <Tab.Screen name="ShortListed" component={ShortListedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  postPropertyButton: {
    marginRight: 15,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 5,
  },
});
