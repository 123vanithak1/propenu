import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useSelector } from "react-redux";
import { setProfileField } from "../../../redux/slice/PostPropertySlice";
import { submitPropertyThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { useAppDispatch } from "../../../redux/store/store";
import CounterField from "../../../components/ui/CounterField";
import Dropdownui from "../../../components/ui/DropDownUI";
import AmenitiesSelect from "./AmenitiesSelect";
import { AMENITIES } from "../constants/amenities";
import Toggle from "../../../components/ui/ToggleSwitch";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import DateInputField from "../../../components/ui/DateInputField";
import { ToastSuccess, ToastError } from "../../../utils/Toast";
import { setFiles as setFileStoreFiles } from "../../../lib/FileStore";
import * as ImagePicker from "expo-image-picker";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ImageListIcon } from "../../../../assets/svg/Logo";

export const FLOORING_TYPES = [
  "vitrified",
  "marble",
  "granite",
  "wooden",
  "ceramic-tiles",
  "mosaic",
  "normal-tiles",
  "cement",
  "other",
];

export const KITCHEN_TYPES = [
  "open",
  "closed",
  "semi-open",
  "island",
  "parallel",
  "u-shaped",
  "l-shaped",
];

export const FACING_TYPES = ["North", "South", "East", "West"];

export const ParkingTypes = ["open", "closed", "both"];

const ResidentialProfile = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { residential } = useSelector((state) => state.postProperty);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [files, setFiles] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [checked, setChecked] = useState(false);

  const fieldErrors =
    showErrors && !validationResult.success
      ? validationResult.error.flatten().fieldErrors
      : {};

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
      // selectionLimit: 5, // iOS 14+ & Android supported
      quality: 0.8,
    });

    if (!result.canceled) {
      setFiles(result.assets);
      console.log("result assets", result.assets);
      // OPTIONAL: save metadata to redux
      dispatch(
        setBaseField({
          key: "galleryFiles",
          value: result.assets.map((img) => ({
            uri: img.uri,
            name: img.fileName || "image.jpg",
            type: img.type,
          })),
        }),
      );
      setFileStoreFiles("postProperty", result.assets);
    }
  };

  useEffect(() => {
    const price =
      Number(residential.price) || Number(residential.expectedPrice);
    const area = Number(residential.carpetArea);

    if (price > 0 && area > 0) {
      dispatch(
        setProfileField({
          propertyType: "residential",
          key: "pricePerSqft",
          value: String(Math.round(price / area)),
        }),
      );
    }
  }, [residential.price, residential.expectedPrice, residential.carpetArea]);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardOpen(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const OptionButton = ({ label, active, onPress }) => (
    <Pressable
      onPress={onPress}
      style={[styles.optionButton, active && styles.optionActive]}
    >
      <Text style={[styles.optionText, active && styles.optionTextActive]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={[styles.container, { paddingBottom: insets.bottom + 16 }]}
        // contentContainerStyle={{ paddingBottom: keyboardOpen ? 135 : 40 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Amenities */}
        <AmenitiesSelect
          label="Amenities"
          options={AMENITIES}
          value={residential.amenities || []}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "residential",
                key: "amenities",
                value,
              }),
            )
          }
        />

        {/* Floor Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floor Details</Text>
          <View style={styles.grid3}>
            <Dropdownui
              label="Flooring Type"
              value={residential.flooringType || null}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "residential",
                    key: "flooringType",
                    value,
                  }),
                )
              }
              options={FLOORING_TYPES.map((t) => ({
                value: t,
                label: t.replace("-", " ").toUpperCase(),
              }))}
              placeholder="Select"
            />
            <View style={styles.counterGrid}>
              <View style={styles.parkingItem}>
                <CounterField
                  label="Floor Number"
                  value={residential.floorNumber || 0}
                  min={0}
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "floorNumber",
                        value,
                      }),
                    )
                  }
                />
              </View>
              <View style={styles.parkingItem}>
                <CounterField
                  label="Total Floors"
                  value={residential.totalFloors || 0}
                  min={0}
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "totalFloors",
                        value,
                      }),
                    )
                  }
                />
              </View>
            </View>
          </View>
        </View>

        {/* Parking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parking Details (Optional)</Text>
          <View style={styles.grid3}>
            <Dropdownui
              label="Parking Type"
              value={residential.parkingType || null}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "residential",
                    key: "parkingType",
                    value,
                  }),
                )
              }
              options={ParkingTypes.map((t) => ({
                value: t,
                label: t.toUpperCase(),
              }))}
              placeholder="Select"
            />
            <View style={styles.counterGrid}>
              <View style={styles.parkingItem}>
                <CounterField
                  label="Two-Wheeler Parking"
                  value={residential.parkingDetails?.twoWheeler || 0}
                  min={0}
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "parkingDetails",
                        value: {
                          ...residential.parkingDetails,
                          twoWheeler: value,
                        },
                      }),
                    )
                  }
                />
              </View>
              <View style={styles.parkingItem}>
                <CounterField
                  label="Four-Wheeler Parking"
                  value={residential.parkingDetails?.fourWheeler || 0}
                  min={0}
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "parkingDetails",
                        value: {
                          ...residential.parkingDetails,
                          fourWheeler: value,
                        },
                      }),
                    )
                  }
                />
              </View>
            </View>
          </View>
        </View>

        {/* Kitchen Type & Modular */}
        <View style={styles.row}>
          <Dropdownui
            label="Kitchen Type"
            value={residential.kitchenType || null}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "residential",
                  key: "kitchenType",
                  value,
                }),
              )
            }
            options={KITCHEN_TYPES.map((t) => ({
              value: t,
              label: t.replace("-", " ").toUpperCase(),
            }))}
            placeholder="Select"
          />
        </View>
        <View style={styles.modularKitchen}>
          <Text style={styles.modularKitchenText}>Modular Kitchen</Text>

          <Pressable onPress={() => setChecked(!checked)}>
            <View style={styles.modular}>
              <Text style={styles.smallText}>Available</Text>

              <View style={[styles.checkbox, checked && styles.checked]}>
                {checked && <Entypo name="check" size={14} color="white" />}
              </View>
            </View>
          </Pressable>
        </View>

        <Text style={styles.label}>Add photos of your property</Text>
        <View style={styles.previewContainer}>
          {files.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.uri }}
              style={styles.previewImage}
            />
          ))}
        </View>

        {/* Image Upload */}
        <Pressable style={styles.uploadBox} onPress={pickImages}>
          <ImageListIcon width={50} height={40} color="#82D1A3" />

          {files.length > 0 ? (
            <Text style={styles.uploadText}>
              {files.length} image(s) selected
            </Text>
          ) : (
            <View style={styles.uploadContent}>
              <Text style={styles.uploadText}>
                Click here to upload property images
              </Text>

              <Text style={styles.uploadText}>
                Max 5 photos upto size 10 MB • png, jpg
              </Text>
            </View>
          )}
          <Text style={styles.uploadButton}>Upload photos</Text>

          {fieldErrors?.images && (
            <Text style={styles.errorText}>{fieldErrors.images[0]}</Text>
          )}
        </Pressable>

        <Text style={[styles.warning, styles.smallText]}>
          <Ionicons name="warning" size={17} color="orange" />
          {"  "}Postings with no photos attract less attention
        </Text>

        {/* Price Negotiable */}
        <View style={styles.negotiableContainer}>
          <View>
            <Text style={styles.label}>Is the price negotiable?</Text>
            <Text style={styles.smallText}>
              Enable this if you are open to offers from buyers
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text
              style={{
                color: residential.isPriceNegotiable ? "green" : "gray",
              }}
            >
              {residential.isPriceNegotiable ? "YES" : "NO"}
            </Text>
            <Toggle
              enabled={residential.isPriceNegotiable || false}
              onChange={(val) =>
                dispatch(
                  setProfileField({
                    propertyType: "residential",
                    key: "isPriceNegotiable",
                    value: val,
                  }),
                )
              }
            />
          </View>
        </View>

        {/* Property Description */}
        <TextArea
          label="Property Description"
          value={residential.description || ""}
          placeholder="e.g. Spacious 3 BHK apartment with east-facing balcony, covered parking, power backup, and close to IT parks."
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "residential",
                key: "description",
                value,
              }),
            )
          }
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            dispatch(submitPropertyThunk())
              .unwrap()
              .then((response) => {
                if (response.success) {
                  ToastSuccess("Property posted successfully");
                  console.log(
                    "Property Submission Status:",
                    response.status,
                    response.success,
                  );
                  navigation.navigate("Drawer");
                }
              })
              .catch((error) => {
                ToastError("Failed to post property");
                console.error("Property submission failed:", error);
              });
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Submit Property
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResidentialProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },

  counterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  facingDropDown: {
    width: "65%",
    // marginRight: 20,
  },
  parkingItem: {
    width: "48%",
  },
  counterItem: {
    width: "30%",
    // marginBottom: 16,
  },
  optionActive: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },
  uploadContent: {
    alignItems: "center",
    // gap:5
    // marginTop: 8,
  },
  warning: {
    backgroundColor: "#F1FCF5",
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 7,
  },

  optionText: {
    color: "#374151",
    fontSize: 14,
  },

  optionTextActive: {
    color: "#16a34a",
    fontWeight: "600",
  },

  furnish: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 10,
    color: "#374151",
  },

  modularKitchenText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
  },
  modular: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  section: {
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 5,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#82D1A3",
    backgroundColor: "#F1FCF5",
    borderRadius: 8,
    padding: 16,
    // minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
  uploadButton: {
    alignSelf: "center",
    color: "white",
    width: 150,
    alignItems: "center",
    textAlign: "center",
    padding: 5,
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  errorText: {
    color: "#DC2626",
    marginTop: 5,
    fontSize: 12,
    alignSelf: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 7,
    color: "#374151",
  },

  smallText: {
    fontSize: 12,
    color: "#555",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    // marginBottom: 10,
  },
  side: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  buttonGroupWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionInactive: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },

  modularKitchen: {
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 15,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  tick: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
  },

  grid3: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: 7
  },
  grid4: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: 10,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:"flex-start",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  previewImage: {
    width: "30%",
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  negotiableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
    marginTop: 15,
  },
  submitButton: {
    padding: 12,
    backgroundColor: "#22C55E",
    borderRadius: 8,
    width: "60%",
    alignSelf: "center",
  },
});
