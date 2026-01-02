import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  setBaseField,
  nextStep,
  prevStep,
} from "../../../redux/slice/PostPropertySlice";
import { validateLocationDetails } from "../../../zod/locationDetailsZod";
import InputField from "../../../components/ui/InputField";

import TextArea from "../../../components/ui/TextArea";
import MapScreen from "../../../components/location/MapScreen";
import NearbyLocationSearch from "../../../components/location/NearbyLocationSearch";

import { search } from "india-pincode-search";

const LocationDetailsStep = () => {
  const { propertyType, base } = useSelector((state) => state.postProperty);

  const dispatch = useDispatch();
  const [showErrors, setShowErrors] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const validationResult = validateLocationDetails(base);
  const isFormValid = validationResult.success;

  const fieldErrors =
    showErrors && !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};

  /* ---------------- Helpers ---------------- */

  const formatToTitleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getCustomError = (key, msg) => {
    const error = fieldErrors?.[key]?.[0];
    if (!error) return undefined;
    if (error.includes("expected string") || error === "Required") {
      return msg;
    }
    return error;
  };

  /* ---------------- Pincode ---------------- */

  const handlePincodeChange = (value) => {
    const numericValue = value.replace(/\D/g, "");
    dispatch(setBaseField({ key: "pincode", value: numericValue }));
    if (numericValue.length !== 6) return;
    const data = search(numericValue);
    if (!data || !data.length) return;
    const pin = data[0];
    dispatch(
      setBaseField({
        key: "state",
        value: formatToTitleCase(pin.state),
      })
    );
    dispatch(
      setBaseField({
        key: "city",
        value: formatToTitleCase(pin.city),
      })
    );
    dispatch(
      setBaseField({
        key: "locality",
        value: formatToTitleCase(pin.village || pin.office),
      })
    );
  };

  const isLandOrAgri =
    propertyType === "land" || propertyType === "agricultural";

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardOpen(true)
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardOpen(false)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: keyboardOpen ? 100 : 0 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Address */}
        <TextArea
          label="Property Line"
          value={base.address || ""}
          placeholder="e.g. Flat 302, Green Residency, Near Metro Station"
          rows={4}
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setBaseField({
                key: "address",
                value: formatToTitleCase(value),
              })
            )
          }
          error={getCustomError("address", "Enter property address")}
        />

        {/* Building + Pincode */}
        <View style={styles.row}>
          <InputField
            label={
              isLandOrAgri
                ? "Land Name / Layout Name"
                : "Building / Society Name"
            }
            value={base.buildingName || ""}
            placeholder="Enter Building or Society name"
            onChange={(value) =>
              dispatch(
                setBaseField({
                  key: "buildingName",
                  value: formatToTitleCase(value),
                })
              )
            }
            error={getCustomError("buildingName", "Enter name")}
          />

          <InputField
            label="Pincode"
            value={base.pincode || ""}
            placeholder="e.g. 500033"
            keyboardType="numeric"
            onChange={handlePincodeChange}
            error={getCustomError("pincode", "Enter valid pincode")}
          />
        </View>

        {/* Locality / City / State */}
        <View style={styles.row}>
          <InputField
            label="Locality"
            value={base.locality || ""}
            placeholder="Enter Locality"
            onChange={(value) =>
              dispatch(
                setBaseField({
                  key: "locality",
                  value: formatToTitleCase(value),
                })
              )
            }
            error={getCustomError("locality", "Enter locality")}
          />

          <InputField
            label="City"
            value={base.city || ""}
            placeholder="Enter City"
            onChange={(value) =>
              dispatch(
                setBaseField({
                  key: "city",
                  value: formatToTitleCase(value),
                })
              )
            }
            error={getCustomError("city", "Enter city")}
          />

          <InputField
            label="State"
            value={base.state || ""}
            placeholder="Enter State"
            onChange={(value) =>
              dispatch(
                setBaseField({
                  key: "state",
                  value: formatToTitleCase(value),
                })
              )
            }
            error={getCustomError("state", "Enter state")}
          />
        </View>

        {/* Map placeholder */}
        <Text style={styles.mapText}>Pin Property Location</Text>
        <View style={styles.mapBox}>
          {Platform.OS === "web" ? (
            <Text>Map is available on mobile only</Text>
          ) : (
            <MapScreen />
          )}
        </View>
        <Text style={styles.markLocation}>
          Click on the map to mark the exact location of your property.
        </Text>

        {/* Nearby places */}
        <NearbyLocationSearch />

        {/* Continue */}
        <View style={styles.btnOptions}>
          <Pressable
            style={styles.backButton}
            onPress={() => dispatch(prevStep())}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setShowErrors(true);
              if (isFormValid) {
                // console.log("Location Data:", base);
                dispatch(nextStep());
              }
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LocationDetailsStep;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // gap: 12,
  },
  row: {
    // flexDirection: "column",
    // gap: 12,
  },
  mapBox: {
    height: 180,
    borderWidth: 1,
    borderColor: "#d1d5db",
    // borderRadius: 8,
    // justifyContent: "center",
    // alignItems: "center",
  },
  mapText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },
  markLocation: {
    fontSize: 12,
    color: "#74777eff",
  },
  btnOptions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    alignItems: "center",
    marginRight: 10,
    marginBottom: 20,
    marginTop: 15,
  },
  backButton: {
    width: "35%",
    alignSelf: "center",
    backgroundColor: "white",
    borderColor: "#22C55E",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    // marginVertical: 15,
    // marginBottom: 40,
  },
  backButtonText: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    width: "35%",
    alignSelf: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    // marginVertical: 15,
    // marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
