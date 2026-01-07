import React from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import StepIndicator from "./StepsIndicator";
import StepRenderer from "./MainContent/StepRenderer";
import { useDispatch, useSelector } from "react-redux";


export default function PostProperty({ navigation }) {
  const STEPS = [
    "Basic Details",
    "Location",
    "Property Profile",
    // "Verify & Publishff",
  ];
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.postProperty.currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;

  return (
    <View style={{ flex: 1 }}>
      <StepIndicator steps={STEPS} currentStep={currentStep - 1} />
      <StepRenderer />
    </View>
  );
}