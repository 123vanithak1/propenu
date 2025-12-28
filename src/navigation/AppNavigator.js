import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DrawerNavigator from "./DrawerNavigator";
import StackNavigator from "./StackNavigator";
import { StatusBar } from "react-native";

export default function AppNavigator() {
  
  return (
   
    <SafeAreaProvider>
     <StatusBar
  translucent
  backgroundColor="transparent"
  barStyle="light-content"
/>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
