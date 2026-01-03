import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { setProfileField } from "../../../redux/slice/PostPropertySlice";
import { submitPropertyThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { useAppDispatch } from "../../../redux/store/store";
import { AMENITIES } from "../constants/amenities";
import InputWithUnit from "../../../components/ui/InputWithUnit";
import { ToastError, ToastSuccess } from "../../../utils/Toast";
import InputField from "../../../components/ui/InputField";
import CounterField from "../../../components/ui/CounterField";
import Dropdownui from "../../../components/ui/DropDownUI";
import Toggle from "../../../components/ui/ToggleSwitch";
import TextArea from "../../../components/ui/TextArea";

const AREA_UNITS = ["sqft", "sqmt", "acre", "guntha", "cent", "hectare"];
const ROAD_WIDTH_UNITS = ["ft", "meter"];

const PROPERTY_TYPES = [
  "agricultural-land",
  "farm-land",
  "orchard-land",
  "plantation",
  "wet-land",
  "dry-land",
  "ranch",
  "dairy-farm",
];

const PROPERTY_SUB_TYPES = [
  "irrigated",
  "non-irrigated",
  "fenced",
  "unfenced",
  "with-well",
  "with-borewell",
  "with-electricity",
  "near-road",
  "inside-village",
  "farmhouse-permission",
];

const SOIL_TYPES = [
  "clay",
  "sandy",
  "loamy",
  "red-soil",
  "black-soil",
  "alluvial",
];
const IRRIGATION_TYPES = [
  "canal",
  "bore-well",
  "tube-well",
  "open-well",
  "sprinkler",
  "drip",
  "rain-fed",
];
const WATER_SOURCES = [
  "bore-well",
  "open-well",
  "tube-well",
  "canal",
  "river",
  "tank",
  "pond",
];
const ACCESS_ROAD_TYPES = ["paved", "unpaved", "gravel", "concrete", "earthen"];
const AGRICULTURAL_FEATURES = [
  {
    key: "boundaryWall",
    label: "Boundary Wall",
  },
  {
    key: "electricityConnection",
    label: "Electricity Connection",
  },
];
const AgriculturalProfile = () => {
  const dispatch = useAppDispatch();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { agricultural } = useSelector((state) => state.postProperty);
  const navigation = useNavigation();

  const setField = (key, value) => {
    dispatch(
      setProfileField({
        propertyType: "agricultural",
        key,
        value,
      })
    );
  };

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
  const Section = ({ title, subtitle, children }) => (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: keyboardOpen ? 135 : 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={[styles.sectionTitle]}>Property Basics</Text>
          <Text style={styles.sectionSubTitle}>
            Enter the size, road access, and plantation age of the land
          </Text>
          <View style={styles.column}>
            <InputWithUnit
              label="Total Area"
              value={agricultural.totalArea?.value || ""}
              placeholder="1200"
              unit={agricultural.totalArea?.unit || "acre"}
              units={[
                { label: "SQ.FT", value: "sqft" },
                { label: "SQ.MT", value: "sqmt" },
                { label: "ACRE", value: "acre" },
                { label: "GUNTHA", value: "guntha" },
                { label: "CENT", value: "cent" },
                { label: "HECTARE", value: "hectare" },
              ]}
              onValueChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
                    key: "totalArea",
                    value: {
                      value,
                      unit: agricultural.totalArea?.unit || "acre",
                    },
                  })
                )
              }
              onUnitChange={(unit) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
                    key: "totalArea",
                    value: { value: agricultural.totalArea?.value || "", unit },
                  })
                )
              }
            />

            <InputWithUnit
              label="Road Width"
              value={agricultural.roadWidth?.value || ""}
              unit={agricultural.roadWidth?.unit || "ft"}
              placeholder="40"
              units={[
                { label: "FT", value: "ft" },
                { label: "METER", value: "meter" },
              ]}
              onValueChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
                    key: "roadWidth",
                    value: {
                      value,
                      unit: agricultural.roadWidth?.unit || "ft",
                    },
                  })
                )
              }
              onUnitChange={(unit) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
                    key: "roadWidth",
                    value: { value: agricultural.roadWidth?.value || "", unit },
                  })
                )
              }
            />
            <View style={styles.plantation}>
              <CounterField
                label="Plantation Age (years)"
                value={agricultural.plantationAge || 0}
                min={0}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "agricultural",
                      key: "plantationAge",
                      value,
                    })
                  )
                }
              />
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Soil & Irrigation</Text>
          <Text style={styles.sectionSubTitle}>
            Select soil type, irrigation method, and available water sources
          </Text>
        </View>
        <View style={styles.columnStart}>
          <Dropdownui
            label="Soil Type"
            value={agricultural.soilType}
            options={SOIL_TYPES.map((t) => ({
              label: t.replace("-", " ").toUpperCase(),
              value: t,
            }))}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "soilType",
                  value,
                })
              )
            }
          />

          <Dropdownui
            label="Irrigation Type"
            value={agricultural.irrigationType}
            options={IRRIGATION_TYPES.map((t) => ({
              label: t.replace("-", " ").toUpperCase(),
              value: t,
            }))}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "irrigationType",
                  value,
                })
              )
            }
          />

          <Dropdownui
            label="Water Source"
            value={agricultural.waterSource}
            options={WATER_SOURCES.map((t) => ({
              label: t.replace("-", " ").toUpperCase(),
              value: t,
            }))}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "waterSource",
                  value,
                })
              )
            }
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Borewell Details</Text>
          <Text style={styles.sectionSubTitle}>
            Provide borewell count, depth, yield, and drilling year
          </Text>
        </View>
        <View style={styles.columnStart}>
          <View style={styles.plantation}>
            <CounterField
              label="Number of Borewells"
              value={agricultural.numberOfBorewells || 0}
              min={0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
                    key: "numberOfBorewells",
                    value,
                  })
                )
              }
            />
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Crop Details</Text>
          <Text style={styles.sectionSubTitle}>
            Mention current crops, land usage, and suitable cultivation types
          </Text>
        </View>
        <View style={styles.columnStart}>
          <InputField
            label="Current Crop"
            value={agricultural.currentCrop || ""}
            placeholder="e.g. Sugarcane"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "currentCrop",
                  value,
                })
              )
            }
          />
          <InputField
            label="Suitable For"
            value={agricultural.suitableFor || ""}
            placeholder="e.g. Cotton, Wheat"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "suitableFor",
                  value,
                })
              )
            }
          />
          <InputField
            label="Land Shape"
            value={agricultural.landShape || ""}
            placeholder="e.g. Square, Rectangular"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "landShape",
                  value,
                })
              )
            }
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Legal & Accessibility</Text>
          <Text style={styles.sectionSubTitle}>
            Provide information about purchase restrictions and access road type
          </Text>
        </View>
        <View style={styles.columnStart}>
          <InputField
            label="State Purchase Restrictions"
            value={agricultural.statePurchaseRestrictions || ""}
            placeholder="e.g. None, Restricted"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "statePurchaseRestrictions",
                  value,
                })
              )
            }
          />
          <InputField
            label="Access Road Type"
            value={agricultural.accessRoadType || ""}
            placeholder="e.g. Paved, Unpaved"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "agricultural",
                  key: "accessRoadType",
                  value,
                })
              )
            }
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Legal & Accessibility</Text>
          <Text style={styles.sectionSubTitle}>
            Provide information about purchase restrictions and access road type
          </Text>
        </View>
        <View style={styles.columnStart}>
          {AGRICULTURAL_FEATURES.map((item) => {
            const enabled = agricultural[item.key] || false;

            return (
              <Pressable
                key={item.key}
                style={[styles.featureRow, enabled && styles.featureRowActive]}
                onPress={() =>
                  dispatch(
                    setProfileField({
                      propertyType: "agricultural",
                      key: item.key,
                      value: !enabled,
                    })
                  )
                }
              >
                <Text
                  style={[
                    styles.featureText,
                    enabled && styles.featureTextActive,
                  ]}
                >
                  {item.label}
                </Text>

                <Toggle
                  enabled={enabled}
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "agricultural",
                        key: item.key,
                        value,
                      })
                    )
                  }
                />
              </Pressable>
            );
          })}
        </View>

        <InputField
          label="Total Price"
          placeholder="e.g. 75,00,000"
          value={agricultural.price || ""}
          keyboardType="numeric"
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "agricultural",
                key: "price",
                value: value.replace(/\D/g, ""),
              })
            )
          }
        />

        <InputField
          label="Price Per Sqft"
          keyboardType="numeric"
          placeholder="e.g. 6250"
          value={agricultural.pricePerSqft || ""}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "agricultural",
                key: "pricePerSqft",
                value: value.replace(/\D/g, ""),
              })
            )
          }
        />

        <View style={styles.negotiableContainer}>
          <View>
            <Text style={styles.label}>Is the price negotiable?</Text>
            <Text style={styles.smallText}>
              Enable this if you are open to offers from buyers
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text
              style={{
                color: agricultural.isPriceNegotiable ? "green" : "gray",
              }}
            >
              {agricultural.isPriceNegotiable ? "YES" : "NO"}
            </Text>
            <Toggle
              enabled={agricultural.isPriceNegotiable || false}
              onChange={(val) =>
                dispatch(
                  setProfileField({
                    propertyType: "agricultural",
                    key: "isPriceNegotiable",
                    value: val,
                  })
                )
              }
            />
          </View>
        </View>

        <TextArea
          label="Additional Description"
          value={agricultural.description || ""}
          placeholder="e.g. This plot is located in a prime area with easy access to main roads..."
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "agricultural",
                key: "description",
                value,
              })
            )
          }
        />

        {/* SUBMIT */}
        <Pressable
          style={styles.submitBtn}
          // onPress={() => dispatch(submitPropertyThunk())}
          onPress={() => {
            dispatch(submitPropertyThunk())
              .unwrap()
              .then((response) => {
                if (response.success) {
                  ToastSuccess("Property posted successfully");
                  console.log(
                    "Property Submission Successful:",
                    response.status,
                    response
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
          <Text style={styles.submitText}>Submit Property</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default AgriculturalProfile;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sectionSubTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  column: {
    gap: 10,
    marginBottom: 5,
  },
  columnStart: {
    marginBottom: 10,
  },
  plantation: {
    width: "40%",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 10,
  },
  featureRowActive: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },
  featureText: {
    fontSize: 14,
  },
  featureTextActive: {
    color: "#15803d",
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },

  cardActive: {
    borderColor: "#22c55e", // green-500
    backgroundColor: "#ecfdf5", // green-50
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  toggleHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  pressed: {
    opacity: 0.85,
  },

  cardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151", // gray-700
  },

  cardTextActive: {
    color: "#166534", // green-800
  },
  negotiableBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginTop: 12,
  },
  activeBox: {
    borderColor: "#16a34a",
    backgroundColor: "#ecfdf5",
  },
  negotiableText: {
    fontSize: 14,
    fontWeight: "500",
  },
  negotiableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
    borderStyle: "dashed",
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
  submitBtn: {
    padding: 12,
    backgroundColor: "#22C55E",
    borderRadius: 8,
    width: "60%",
    alignSelf: "center",
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
  },
});
