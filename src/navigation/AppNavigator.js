import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DrawerNavigator from "./DrawerNavigator";
import StackNavigator from "./StackNavigator";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/ToastConfig";

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <StackNavigator />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
