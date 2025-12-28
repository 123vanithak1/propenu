import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepIndicator from '../../components/StepsIndicator';

export default function PostProperty({ navigation }) {
  const STEPS = [
  "Basic Details",
  "Location",
  "Property Profile",
  "Verify & Publish",
];
  return (
    <SafeAreaView style={{ flex: 1,  }}>
      <StepIndicator  steps={STEPS} />
      <Text>post</Text>
    </SafeAreaView>
  );
}