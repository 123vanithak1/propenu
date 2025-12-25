// src/navigation/DrawerNavigator.js
import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import { View, Text, StyleSheet, Pressable } from "react-native";
import useDimensions from "../components/CustomHooks/UseDimension";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const Drawer = createDrawerNavigator();

function CustomDrawerContent() {
  const { width, height, isLandscape } = useDimensions();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = ({ type, value }) => {
    console.log(`Login with ${type}:`, value);
    setModalVisible(false);
  };

  return (
    <View style={styles.drawerContent}>
      <View style={[styles.drawerHeader, { height: height * 0.15 }]}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <FontAwesome name="user-circle" size={40} color="white" />
          <View>
            <Text style={styles.textColor}>Welcome</Text>
            <Text style={styles.textColor}>Guest Profile</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={[
            styles.loginButton,
            { width: isLandscape ? width * 0.35 : width * 0.6 },
          ]}
        >
          <Text style={{ color: "#007AFF" }}>Login / Register</Text>
        </Pressable>
      </View>

    
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={() => <CustomDrawerContent />}>
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  drawerContent: { flex: 1 },
  drawerHeader: {
    justifyContent: "center",
    // borderTopRightRadius:15, to corner profile
    backgroundColor: "#007AFF",
    width: "100%",
    paddingLeft: 40,
    gap: 10,
  },
  textColor: { color: "white" },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
