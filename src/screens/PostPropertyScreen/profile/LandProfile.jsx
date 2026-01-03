import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../redux/store/store";
import { setProfileField } from "../../../redux/slice/PostPropertySlice";
import { submitPropertyThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import Toggle from "../../../components/ui/ToggleSwitch";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import Dropdownui from "../../../components/ui/DropDownUI";
import AmenitiesSelect from "./AmenitiesSelect";
import { AMENITIES } from "../constants/amenities";
import InputWithUnit from "../../../components/ui/InputWithUnit";
import { ToastError, ToastSuccess } from "../../../utils/Toast";

const AREA_UNITS = ["sqft"];
const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

const LAND_APPROVAL_AUTHORITIES = ["dtcp", "hmda", "cmda", "bda", "panchayat"];

const LandProfile = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { land } = useSelector((state) => state.postProperty);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleSubmitProperty = () => {
    dispatch(submitPropertyThunk("land"))
      .unwrap()
      .then((response) => {
        if (response?.success) {
          ToastSuccess("Property posted successfully");

          console.log(
            "Property Submission Successful:",
            response.status,
            response.success
          );

          navigation.navigate("Drawer");
        } else {
          ToastError("Failed to post property");
        }
      })
      .catch((error) => {
        ToastError("Failed to post property");
        console.error("Property submission failed:", error);
      });
  };

  useEffect(() => {
    dispatch(
      setProfileField({
        propertyType: "land",
        key: "dimensions",
        value: {
          length: land?.dimensions?.length || "",
          width: land?.dimensions?.width || "",
        },
      })
    );
  }, []);
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

  const SwitchRow = ({ label, value, onChange }) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <Switch value={!!value} onValueChange={onChange} />
      <Text style={{ marginLeft: 8 }}>{label}</Text>
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
        {/* 1. PLOT DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot Details</Text>
          <Text style={styles.sectionSubTitle}>
            Provide essential information about the plot.
          </Text>

          {/* Plot Dimensions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Plot Dimensions (Optional)</Text>
            <Text style={styles.cardSubTitle}>
              Enter length and width in feet
            </Text>

            <View style={styles.row}>
              <View style={styles.subrow}>
                <InputField
                  label="Length"
                  type="number"
                  placeholder="e.g. 40"
                  value={land.dimensions?.length ?? ""}
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "land",
                        key: "dimensions",
                        value: {
                          length: value,
                          width: land.dimensions?.width || "",
                        },
                      })
                    )
                  }
                />
              </View>
              <View style={styles.multiplyContainer}>
                <Text style={styles.multiply}>×</Text>
              </View>
              <View style={styles.subrow}>
                <InputField
                  label="Width"
                  type="number"
                  placeholder="e.g. 60"
                  value={land.dimensions?.width ?? ""}
                  onChange={(value) =>
                    dispatch(
                      setProfileField({
                        propertyType: "land",
                        key: "dimensions",
                        value: {
                          length: land.dimensions?.length || "",
                          width: value,
                        },
                      })
                    )
                  }
                />
              </View>
            </View>
          </View>

          {/* Layout Type */}
          <View style={styles.block}>
            <Text style={styles.label}>Layout Type</Text>

            <View style={styles.wrapRow}>
              {[
                { label: "Approved Layout", value: "approved-layout" },
                { label: "Un-approved Layout", value: "unapproved-layout" },
                { label: "Gated Layout", value: "gated-layout" },
                { label: "Individual Plot", value: "individual-plot" },
              ].map((item) => {
                const active = land.layoutType === item.value;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() =>
                      dispatch(
                        setProfileField({
                          propertyType: "land",
                          key: "layoutType",
                          value: item.value,
                        })
                      )
                    }
                    style={[styles.choiceBtn, active && styles.choiceBtnActive]}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        active && styles.choiceTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Facing & Approval */}
          <View style={styles.column}>
            <Dropdownui
              label="Facing"
              value={land.facing || null}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "facing",
                    value,
                  })
                )
              }
              options={FACING_OPTIONS.map((t) => ({
                value: t,
                label: t.replace(/-/g, " "),
              }))}
            />

            <Dropdownui
              label="Approved By Authority"
              value={land.approvedByAuthority || null}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "approvedByAuthority",
                    value,
                  })
                )
              }
              options={LAND_APPROVAL_AUTHORITIES.map((a) => ({
                value: a,
                label: a.replace(/-/g, " ").toUpperCase(),
              }))}
            />
          </View>
        </View>

        {/* AMENITIES */}
        <AmenitiesSelect
          label="Amenities"
          options={AMENITIES}
          value={land.amenities || []}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "land",
                key: "amenities",
                value,
              })
            )
          }
        />

        <View>
          <Text style={styles.sectionTitle}>Legal & Survey Details</Text>
          <Text style={styles.sectionSubTitle}>
            Survey and zoning information
          </Text>
          <View style={styles.section}>
            <InputField
              label="Survey Number"
              // type="number"
              value={land.surveyNumber || ""}
              placeholder="e.g. 123/45/B"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "surveyNumber",
                    value,
                  })
                )
              }
            />
            <InputField
              label="Land Use Zone"
              value={land.landUseZone || ""}
              placeholder="e.g. Residential Zone A"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
                    key: "landUseZone",
                    value,
                  })
                )
              }
            />
          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot Features & Utilities</Text>
          <Text style={styles.sectionSubTitle}>
            Select all features available for this plot
          </Text>

          {[
            { key: "readyToConstruct", label: "Ready to Construct" },
            { key: "waterConnection", label: "Water Connection" },
            { key: "electricityConnection", label: "Electricity Connection" },
            { key: "cornerPlot", label: "Corner Plot" },
            { key: "fencing", label: "Fencing" },
          ].map((item) => {
            const enabled = Boolean(land[item.key]);

            return (
              <Pressable
                key={item.key}
                onPress={() =>
                  dispatch(
                    setProfileField({
                      propertyType: "land",
                      key: item.key,
                      value: !enabled,
                    })
                  )
                }
                style={[styles.featureRow, enabled && styles.featureRowActive]}
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
                  onChange={(val) =>
                    dispatch(
                      setProfileField({
                        propertyType: "land",
                        key: item.key,
                        value: val,
                      })
                    )
                  }
                />
              </Pressable>
            );
          })}
        </View>

        {/* PRICE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <Text style={styles.sectionSubTitle}>
            Enter pricing and area details for this property
          </Text>
          <View style={styles.row}>
            <View style={styles.sectionRow}>
              <InputField
                label="Total Price"
                value={land.price || ""}
                placeholder="e.g. 75,00,000"
                keyboardType="numeric"
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "land",
                      key: "price",
                      value: value.replace(/\D/g, ""),
                    })
                  )
                }
              />
            </View>
            <View style={styles.sectionRow}>
              <InputField
                label="Price Per Sqft"
                value={land.pricePerSqft || ""}
                placeholder="e.g. 6250"
                keyboardType="numeric"
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "land",
                      key: "pricePerSqft",
                      value: value.replace(/\D/g, ""),
                    })
                  )
                }
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.sectionRow}>
              <InputWithUnit
                label="Plot Area"
                value={land.plotArea}
                unit={land.areaUnit} // ✅ CORRECT
                units={[{ label: "SQ.FT", value: "sqft" }]}
                placeholder="1200"
                onValueChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "land",
                      key: "plotArea",
                      value,
                    })
                  )
                }
                onUnitChange={(unit) =>
                  dispatch(
                    setProfileField({
                      propertyType: "land",
                      key: "areaUnit",
                      value: unit,
                    })
                  )
                }
              />
            </View>
            <View style={styles.sectionRow}>
              <InputField
                label="Road Width (ft)"
                type="number"
                value={land.roadWidthFt ?? ""}
                placeholder="e.g. 40"
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "land",
                      key: "roadWidthFt",
                      value,
                    })
                  )
                }
              />
            </View>
          </View>
        </View>

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
                color: land.isPriceNegotiable ? "green" : "gray",
              }}
            >
              {land.isPriceNegotiable ? "YES" : "NO"}
            </Text>
            <Toggle
              enabled={land.isPriceNegotiable || false}
              onChange={(val) =>
                dispatch(
                  setProfileField({
                    propertyType: "land",
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
          value={land.description || ""}
          placeholder="e.g. This plot is located in a prime area with easy access to main roads..."
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "land",
                key: "description",
                value,
              })
            )
          }
        />

        {/* SUBMIT */}
        <Pressable style={styles.submitBtn} onPress={handleSubmitProperty}>
          <Text style={styles.submitText}>Submit Property</Text>
        </Pressable>

        {/* <Pressable
          style={styles.submitBtn}
          onPress={() => {
            dispatch(submitPropertyThunk("land"));
          }}
        >
          <Text style={styles.submitText}>Submit Property</Text>
        </Pressable> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LandProfile;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 15,
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
  card: {
    backgroundColor: "#ecfdf5",
    borderColor: "#22c55e",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardSubTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  sectionRow: {
    width: "48%",
  },
  subrow: {
    width: "45%",
  },

  label: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 8,
  },
  multiplyContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  multiply: {
    // alignSelf: "center",
    fontSize: 22,
    marginBottom: 10,
    opacity: 0.5,
  },
  block: {
    marginBottom: 12,
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  choiceBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  choiceBtnActive: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },
  choiceText: {
    fontSize: 13,
    color: "#374151",
  },
  choiceTextActive: {
    color: "#15803d",
    fontWeight: 500,
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
