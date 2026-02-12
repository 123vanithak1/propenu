import React, {useEffect} from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import StepIndicator from "./StepsIndicator";
import StepRenderer from "./MainContent/StepRenderer";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { setDraftId } from "../../redux/slice/PostPropertySlice";
import { createDraftThunk } from "../../redux/thunk/SubmitPropertyThunk";

export default function PostProperty({ navigation }) {
  const STEPS = [
    "Add Basic Details",
    "Add Location Details",
    "Add Property Profile",
    "Verify and Publish",
  ];
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.postProperty.currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;
  
  const propertyType = useSelector(
    (state) => state.postProperty.propertyType,
  );

    useEffect(() => {
    if (!propertyType) return;

    dispatch(createDraftThunk(propertyType))
      .unwrap()
      .then((res) => {
        dispatch(setDraftId(res?.data?._id));
      })
      .catch(console.error);
  }, [propertyType, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"white"}}>
      <StepIndicator steps={STEPS} currentStep={currentStep - 1} />
      <StepRenderer />
    </SafeAreaView>
  );
}
