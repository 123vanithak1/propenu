import React from "react";
import { Pressable, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostProperty from "../screens/PostPropertyScreen/PostProperty";
import PropertyDetailsScreen from "../screens/PropertyDetails/PropertyDetailsScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DrawerNavigator from "./DrawerNavigator";
import Entypo from "@expo/vector-icons/Entypo";

const Stack = createNativeStackNavigator();

export default function StackNavigator({navigation}) {
  return (
    <Stack.Navigator
    // screenOptions={({ navigation }) => ({
    //   headerTitle: () => <Text style={{ color: "white", fontWeight: "bold" }}>Propenu</Text>,
    //   headerTitleAlign: "center",
    //   headerSafeAreaInsetsEnabled: true,
    //   headerLeft: () => (
    //     <Pressable onPress={() => navigation.openDrawer()} style={{ paddingLeft: 20 }}>
    //       <MaterialIcons name="menu" size={24} color="white" />
    //     </Pressable>
    //   ),
    //   headerRight: () => (
    //     <View style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
    //       <Pressable
    //         onPress={() => navigation.navigate("PostProperty")}
    //         style={{ marginRight: 8, backgroundColor: "white", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5 }}
    //       >
    //         <Text style={{ color: "#27AE60" }}>Post Property</Text>
    //       </Pressable>
    //       <Pressable onPress={() => console.log("Notifications Pressed")}>
    //         <Ionicons name="notifications" size={20} color="white" />
    //       </Pressable>
    //     </View>
    //   ),
    //   headerStyle: {
    //     backgroundColor: "#27AE60",
    //   },
    // })}
    >
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetailsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PostProperty"
        component={PostProperty}
        options={({ navigation }) => ({
          headerTitle: () => (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Post Your Property
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Sell or rent your property
              </Text>
            </View>
          ),

          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Drawer")} 
              hitSlop={10}
              style={{ marginRight: 16 }}
            >
              <Entypo name="cross" size={24} color="#363636ff" />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
