import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostProperty from  "../screens/PostPropertyScreen/PostProperty"
import DrawerNavigator from './DrawerNavigator'; 

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
 return (
  <Stack.Navigator initialRouteName="Drawer">
    <Stack.Screen
      name="Drawer"
      component={DrawerNavigator}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="PostProperty"
      component={PostProperty}
      options={{ title: 'Post Property' }}
    />
  
  </Stack.Navigator>
)
}
