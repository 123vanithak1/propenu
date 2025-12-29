import React from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StepIndicator from "./StepsIndicator";
import StepRenderer from "./MainContent/StepRenderer";
import { useDispatch, useSelector } from "react-redux";

import { nextStep, prevStep } from "../../redux/slice/PostPropertySlice";

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
    <SafeAreaView style={{ flex: 1 }}>
      <StepIndicator steps={STEPS} currentStep={currentStep - 1} />
      <StepRenderer />

      <View style={[styles.footer, isFirstStep && styles.centerFooter]}>
        {isFirstStep ? (
          <Pressable
            onPress={() => dispatch(nextStep())}
            style={styles.singleButton}
          >
            <Text style={styles.btnTextColor}>Next</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={() => dispatch(prevStep())}
              style={styles.backBtn}
            >
              <Text style={styles.btnTextColor}>Back</Text>
            </Pressable>
            <Pressable
              onPress={() =>dispatch(nextStep())
                // isLastStep ? handleSubmit() : dispatch(nextStep())
              }
              style={styles.nextBtn}
            ><Text style={styles.btnTextColor}>{isLastStep ? "Submit" : "Next" }</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  centerFooter: {
    justifyContent: "center",
  },

  backBtn: {
    // flex: 1,
    marginRight: 8,
    backgroundColor: "#2785e9ff",
    paddingHorizontal:20,
    justifyContent:"center",
    alignItems:"center",
    paddingVertical:5,
    borderRadius:5
  },

  nextBtn: {
    // flex: 1,
    marginLeft: 8,
    backgroundColor: "#2785e9ff",
    paddingHorizontal:20,
    justifyContent:"center",
    alignItems:"center",
    paddingVertical:5,
    borderRadius:5
  },
  btnTextColor: {
    color: "white",
    fontWeight:500
  },
  singleButton: {
    backgroundColor: "#2785e9ff",
    // width: "60%",
    paddingHorizontal:50,
    justifyContent:"center",
    alignItems:"center",
    paddingVertical:5,
    borderRadius:5
  },
});
