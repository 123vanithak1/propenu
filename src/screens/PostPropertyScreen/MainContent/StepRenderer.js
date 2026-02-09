import React, { useEffect } from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import BasicDetailsStep from "../steps/BasicDetailsStep";
import LocationDetailsStep from "../steps/LocationDetailsStep";
import PropertyProfileStep from "../steps/PropertyProfileStep";
import { useDispatch } from "react-redux";
import { createDraftThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { setDraftId } from "../../../redux/slice/PostPropertySlice";
import VerificationStep  from "../steps/VerificationStep";
import { ToastError } from "../../../utils/Toast";

export default function StepRenderer() {
  const dispatch = useDispatch();
  const step = useSelector((state) => state.postProperty.currentStep);
  const propertyType = useSelector((state) => state.postProperty.propertyType);
  console.log("Step :", step, propertyType);

  useEffect(() => {
    if (!propertyType) return;

    const createDraft = async () => {
      try {
        const res = await dispatch(createDraftThunk(propertyType)).unwrap();
        console.log("Step :", step, res?.data?._id);
        dispatch(setDraftId(res?.data?._id));
      } catch (error) {
        console.log("Error when getting the draft ",propertyType, error);
      }
    };

    createDraft();
  }, [propertyType, dispatch]);

  switch (step) {
    case 1:
      return <BasicDetailsStep />;
    case 2:
      return <LocationDetailsStep />;
    case 3:
      return <PropertyProfileStep />;
    case 4:
      return <VerificationStep />;
    default:
      return ToastError("Nothing to Display")
  }
}
