import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  nextStep,
  setBaseField,
  setProfileField,
  setPropertyType,
} from "../../../redux/slice/PostPropertySlice";
import {
  RESIDENTIAL_PROPERTY_OPTIONS,
  COMMERCIAL_PROPERTY_OPTIONS,
  COMMERCIAL_SUBTYPE_MAP,
  LAND_PROPERTY_KEYS,
  LAND_PROPERTY_OPTIONS,
  LAND_PROPERTY_SUBTYPES,
} from "../../PostPropertyScreen/constants/subTypes";
import { validateBasicDetails } from "../../../zod/basicDetailsZod";
import * as ImagePicker from "expo-image-picker";

export default function BasicDetailsStep() {
  const { propertyType, base, residential, commercial, land, agricultural } =
    useSelector((state) => state.postProperty);

  const [files, setFiles] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const dispatch = useDispatch();

  const listingOptions = [
    { label: "Buy", value: "buy" },
    { label: "Rent", value: "rent" },
    { label: "Lease", value: "lease" },
  ];
  const property = ["residential", "commercial", "land", "agricultural"];

  const categoryState =
    propertyType === "residential"
      ? residential
      : propertyType === "commercial"
      ? commercial
      : propertyType === "land"
      ? land
      : agricultural;

  const validationResult = validateBasicDetails(
    {
      ...base,
      propertyType: categoryState?.propertyType || base.propertyType,
      title: base.title || "",
      price: base.price || "",
      carpetArea: base.carpetArea || "",
      description: base.description || "",
    },
    propertyType,
    files
  );

  const isFormValid = validationResult.success;

  const fieldErrors =
    showErrors && !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};

  const handleSelect = (type) => {
    dispatch(setPropertyType(type));
  };

  const pickImages = async () => {
    // Ask permission
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5, // iOS 14+ & Android supported
      quality: 0.8,
    });

    if (!result.canceled) {
      setFiles(result.assets);

      // OPTIONAL: save metadata to redux
      dispatch(
        setBaseField({
          key: "galleryFiles",
          value: result.assets.map((img) => ({
            uri: img.uri,
            name: img.fileName || "image.jpg",
            type: img.type,
          })),
        })
      );
    }
  };

  const subTypes =
    propertyType === "residential"
      ? RESIDENTIAL_PROPERTY_OPTIONS
      : propertyType === "commercial"
      ? COMMERCIAL_PROPERTY_OPTIONS
      : propertyType === "land"
      ? LAND_PROPERTY_OPTIONS
      : [];

  const selectedCommercialType = commercial.propertyType;

  const commercialSubTypes =
    propertyType === "commercial" &&
    selectedCommercialType &&
    COMMERCIAL_SUBTYPE_MAP[selectedCommercialType]
      ? COMMERCIAL_SUBTYPE_MAP[selectedCommercialType]
      : [];

  const landSubTypes = propertyType === "land" ? LAND_PROPERTY_SUBTYPES : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Basic Details</Text>
      {/* Listing Type */}
      <Text style={styles.label}>Listing Type</Text>

      <View style={styles.row}>
        {listingOptions.map((option) => {
          const isActive = base.listingType === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() =>
                dispatch(
                  setBaseField({
                    key: "listingType",
                    value: option.value,
                  })
                )
              }
              style={[styles.optionBtn, isActive && styles.optionBtnActive]}
            >
              <Text
                style={[styles.optionText, isActive && styles.optionTextActive]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Property Type */}
      <Text style={styles.label}>Property Type</Text>

      <View style={styles.rowWrap}>
        {property.map((type) => {
          const selected = propertyType === type;

          return (
            <Pressable
              key={type}
              onPress={() => handleSelect(type)}
              style={styles.radioItem}
            >
              <View
                style={[styles.radioOuter, selected && styles.radioOuterActive]}
              >
                {selected && <View style={styles.radioInner} />}
              </View>

              <Text style={styles.radioLabel}>
                {type === "land" ? "Plot / Land" : type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Property Sub-Type */}
      {subTypes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Property Sub-Type</Text>

          <View style={styles.grid}>
            {subTypes.map((sub) => {
              const isSelected = categoryState?.propertyType === sub.key;

              return (
                <Pressable
                  key={sub.key}
                  onPress={() =>
                    dispatch(
                      setProfileField({
                        propertyType,
                        key: "propertyType",
                        value: sub.key,
                      })
                    )
                  }
                  style={[styles.card, isSelected && styles.cardActive]}
                >
                  <Text style={styles.cardIcon}>{sub.icon}</Text>
                  <Text
                    style={[
                      styles.cardText,
                      isSelected && styles.cardTextActive,
                    ]}
                  >
                    {sub.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Commercial Sub Types */}
      {commercialSubTypes.length > 0 && (
        <View style={styles.specificType}>
          <Text style={styles.label}>
            Specific Type for {selectedCommercialType?.replace("-", " ")}
          </Text>

          <View style={styles.rowWrap}>
            {commercialSubTypes.map((subType) => {
              const isSelected = commercial.commercialSubType === subType;

              return (
                <Pressable
                  key={subType}
                  onPress={() =>
                    dispatch(
                      setProfileField({
                        propertyType: "commercial",
                        key: "commercialSubType",
                        value: subType,
                      })
                    )
                  }
                  style={[
                    styles.optionBtn,
                    isSelected && styles.optionBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextActive,
                    ]}
                  >
                    {subType.replace("-", " ").toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Land Sub Types */}
      {landSubTypes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Land Characteristics</Text>

          <View style={styles.rowWrap}>
            {landSubTypes.map((subType) => {
              const isSelected = land.landSubType === subType;

              return (
                <Pressable
                  key={subType}
                  onPress={() =>
                    dispatch(
                      setProfileField({
                        propertyType: "land",
                        key: "landSubType",
                        value: subType,
                      })
                    )
                  }
                  style={[
                    styles.optionBtn,
                    isSelected && styles.optionBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextActive,
                    ]}
                  >
                    {subType.replace(/-/g, " ").toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
      <Text style={styles.label}>Property Images</Text>
      {/* Image Upload Placeholder */}
      <Pressable style={styles.uploadBox} onPress={pickImages}>
        <Text style={styles.uploadText}>
          {files.length > 0
            ? `${files.length} image(s) selected`
            : "Upload Property Images"}
        </Text>

        {fieldErrors?.images && (
          <Text style={styles.errorText}>{fieldErrors.images[0]}</Text>
        )}
      </Pressable>

      {/* Continue Button */}
      <Pressable
        style={[
          styles.continueBtn,
          !isFormValid && showErrors && styles.disabledBtn,
        ]}
        onPress={() => {
          setShowErrors(true);
          if (isFormValid) {
            dispatch(nextStep());
          }
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    // padding: 16,
    paddingHorizontal:16,
    paddingBottom:16
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  optionBtnActive: {
    borderColor: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  optionTextActive: {
    color: "#16A34A",
    fontWeight: "600",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 12,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioOuterActive: {
    borderColor: "#22C55E",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  radioLabel: {
    fontSize: 14,
    color: "#374151",
    textTransform: "capitalize",
  },
  section: {
    marginBottom: 20 ,
  },
  specificType:{
    marginBottom:5
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "30%",
    minWidth: 100,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c0c3c7ff",
    alignItems: "center",
  },
  cardActive: {
    borderColor: "#22C55E",
    backgroundColor: "#ECFDF5",
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 12,
    color: "#474a52ff",
  },
  cardTextActive: {
    color: "#16A34A",
    fontWeight: "600",
  },
  uploadBox: {
    padding: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    borderColor: "#acaeb3ff",
    marginBottom: 24,
  },
  uploadText: {
    textAlign: "center",
    color: "#6B7280",
  },
  errorText: {
    color: "#DC2626",
    marginTop: 5,
    fontSize: 12,
    alignSelf:"center"
  },
  continueBtn: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
