import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Switch,
} from "react-native";
import { useSelector } from "react-redux";
import DateInputField from "../../../components/ui/DateInputField";
import { setProfileField } from "../../../redux/slice/PostPropertySlice";
import { submitPropertyThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { useAppDispatch } from "../../../redux/store/store";
import { useNavigation } from "@react-navigation/native";
import InputField from "../../../components/ui/InputField";
import CounterField from "../../../components/ui/CounterField";
import Dropdownui from "../../../components/ui/DropDownUI";
import Toggle from "../../../components/ui/ToggleSwitch";
import TextArea from "../../../components/ui/TextArea";
import AmenitiesSelect from "./AmenitiesSelect";
import { AMENITIES } from "../constants/amenities";
import { ToastError, ToastSuccess } from "../../../utils/Toast";

export const WALL_FINISH_STATUS = [
  "no-partitions",
  "brick-walls",
  "cement-block-walls",
  "plastered-walls",
];
export const PANTRY_TYPES = ["none", "shared", "no-shared"];
export const FLOORING_TYPES = [
  "bare-cement",
  "vitrified-tiles",
  "ceramic-tiles",
  "marble",
  "granite",
  "carpet",
  "epoxy",
  "wooden-laminate",
];

const FIRE_DATA = [
  { key: "fireExtinguisher", label: "Fire Extinguisher" },
  { key: "fireSprinklerSystem", label: "Sprinkler System" },
  { key: "fireHoseReel", label: "Fire Hose Reel" },
  { key: "fireHydrant", label: "Fire Hydrant" },
  { key: "smokeDetector", label: "Smoke Detector" },
  { key: "fireAlarmSystem", label: "Fire Alarm System" },
  { key: "fireControlPanel", label: "Fire Control Panel" },
  { key: "emergencyExitSignage", label: "Fire Exit Signs" },
];

const CommercialProfile = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { commercial } = useSelector((state) => state.postProperty);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  /** Auto calculate price per sqft */
  useEffect(() => {
    const price = Number(commercial.price || commercial.expectedPrice);
    const area = Number(commercial.carpetArea);

    if (price > 0 && area > 0) {
      dispatch(
        setProfileField({
          propertyType: "commercial",
          key: "pricePerSqft",
          value: String(Math.round(price / area)),
        })
      );
    }
  }, [commercial.price, commercial.expectedPrice, commercial.carpetArea]);

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

  const OptionButtons = ({ title, options, value, onSelect }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionRow}>
        {options.map((item) => {
          const active = value === item.value;
          return (
            <Pressable
              key={item.value}
              onPress={() => onSelect(item.value)}
              style={[styles.optionBtn, active && styles.optionBtnActive]}
            >
              <Text
                style={active ? styles.optionTextActive : styles.optionText}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
  const ToggleRow = ({ label, value, onChange }) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={!!value}
        onValueChange={onChange}
        trackColor={{ false: "#d1d5db", true: "#16a34a" }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    // <ScrollView contentContainerStyle={styles.container}>
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
        {/* Cabins & Seats */}
        <View style={styles.row}>
          <View style={styles.counteItem}>
            <CounterField
              label="Cabins"
              value={commercial.cabins || 0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "cabins",
                    value,
                  })
                )
              }
            />
          </View>

          <View style={styles.counteItem}>
            <CounterField
              label="Seats"
              value={commercial.seats || 0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "seats",
                    value,
                  })
                )
              }
            />
          </View>
        </View>

        {/* Furnishing */}
        <Text style={styles.sectionTitle}>Furnishing</Text>
        <View style={styles.furnishing}>
          {[
            { label: "Furnished", value: "fully-furnished" },
            { label: "Semi furnished", value: "semi-furnished" },
            { label: "Un-furnished", value: "unfurnished" },
          ].map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.optionBtn,
                commercial.furnishing === item.value && styles.optionActive,
              ]}
              onPress={() =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "furnishing",
                    value: item.value,
                  })
                )
              }
            >
              <Text
                style={[
                  commercial.furnishing === item.value &&
                    styles.optionActiveText,
                  { color: "#374151" },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Wall Finish */}
        <Dropdownui
          label="Wall Finish"
          value={commercial.wallFinishStatus}
          options={WALL_FINISH_STATUS.map((v) => ({
            label: v.replace("-", " "),
            value: v,
          }))}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "wallFinishStatus",
                value,
              })
            )
          }
        />

        {/* Amenities */}
        <AmenitiesSelect
          label="Amenities"
          options={AMENITIES}
          value={commercial.amenities || []}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "amenities",
                value,
              })
            )
          }
        />

        {/* Parking */}
        <Text style={styles.sectionTitle}>Parking Details (Optional)</Text>
        <View style={styles.row}>
          <View style={styles.counteItem}>
            <CounterField
              label="Two Wheeler"
              value={commercial.parkingDetails?.twoWheeler || 0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "parkingDetails",
                    value: { ...commercial.parkingDetails, twoWheeler: value },
                  })
                )
              }
            />
          </View>
          <View style={styles.counteItem}>
            <CounterField
              label="Four Wheeler"
              value={commercial.parkingDetails?.fourWheeler || 0}
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "parkingDetails",
                    value: { ...commercial.parkingDetails, fourWheeler: value },
                  })
                )
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floor Details</Text>
          <Dropdownui
            label="Flooring Type"
            value={commercial.flooringType}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "flooringType",
                  value,
                })
              )
            }
            options={FLOORING_TYPES.map((t) => ({
              label: t.replace("-", " "),
              value: t,
            }))}
          />

          <View style={styles.row}>
            <View style={styles.counteItem}>
              <CounterField
                label="Floor Number"
                min={0}
                value={commercial.floorNumber ?? 0}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "floorNumber",
                      value,
                    })
                  )
                }
              />
            </View>
            <View style={styles.counteItem}>
              <CounterField
                label="Total Floors"
                min={0}
                value={commercial.totalFloors ?? 0}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "totalFloors",
                      value,
                    })
                  )
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.rowWrap}>
          <Dropdownui
            label="Pantry Type"
            value={commercial.pantry?.type}
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "pantry",
                  value: { ...commercial.pantry, type: value },
                })
              )
            }
            options={PANTRY_TYPES.map((t) => ({
              label: t.toUpperCase(),
              value: t,
            }))}
          />
          <View style={styles.row}>
            <View style={styles.counteItem}>
              <ToggleRow
                label="Inside Premises"
                value={commercial.pantry?.insidePremises}
                onChange={(val) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "pantry",
                      value: { ...commercial.pantry, insidePremises: val },
                    })
                  )
                }
              />
            </View>
            <View style={styles.counteItem}>
              <ToggleRow
                label="Shared Pantry"
                value={commercial.pantry?.shared}
                onChange={(val) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "pantry",
                      value: { ...commercial.pantry, shared: val },
                    })
                  )
                }
              />
            </View>
          </View>
        </View>
        <OptionButtons
          title="Availability Status"
          value={commercial.constructionStatus}
          options={[
            { label: "Ready to Move", value: "ready-to-move" },
            { label: "Under Construction", value: "under-construction" },
          ]}
          onSelect={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "constructionStatus",
                value,
              })
            )
          }
        />
        <OptionButtons
          title="Transaction Type"
          value={commercial.transactionType}
          options={[
            { label: "New Sale", value: "new-sale" },
            { label: "Resale", value: "resale" },
          ]}
          onSelect={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "transactionType",
                value,
              })
            )
          }
        />
        {commercial.constructionStatus === "ready-to-move" && (
          <OptionButtons
            title="Property Age"
            value={commercial.propertyAge}
            options={[
              { label: "0-1 Year", value: "0-1-year" },
              { label: "1-5 Years", value: "1-5-years" },
              { label: "5-10 Years", value: "5-10-years" },
              { label: "10+ Years", value: "10-plus-years" },
            ]}
            onSelect={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "propertyAge",
                  value,
                })
              )
            }
          />
        )}

        {/* Possession Date using datetimepicker */}
        {commercial.constructionStatus === "under-construction" && (
          <DateInputField
            label="Expected Possession Date"
            value={commercial.possessionDate}
            required
            minimumDate={new Date()} // future only
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "possessionDate",
                  value,
                })
              )
            }
          />
        )}

        {/* ========== BUILDING MANAGEMENT ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Building Management</Text>
          <Text style={styles.sectionSubtitle}>
            Provide building management details
          </Text>

          <InputField
            label="Building Management Company"
            value={commercial.buildingManagement?.managedBy || ""}
            placeholder="e.g. ABC Property Management"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "buildingManagement",
                  value: {
                    ...commercial.buildingManagement,
                    managedBy: value,
                  },
                })
              )
            }
          />

          <InputField
            label="Management Contact"
            value={commercial.buildingManagement?.contact || ""}
            placeholder="e.g. +91-XXXXXXXXXX"
            keyboardType="phone-pad"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "buildingManagement",
                  value: {
                    ...commercial.buildingManagement,
                    contact: value,
                  },
                })
              )
            }
          />
        </View>
        {/* ========== ZONING ========== */}
        <View style={styles.section}>
          <InputField
            label="Zoning Information"
            value={commercial.zoning || ""}
            placeholder="e.g. Commercial Zone B2"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "zoning",
                  value,
                })
              )
            }
          />
        </View>
        {/* ========== TENANT INFORMATION ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tenant Information</Text>
          <Text style={styles.sectionSubtitle}>
            Add details about current or previous tenants
          </Text>

          {(commercial.tenantInfo || []).map((tenant, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Tenant #{index + 1}</Text>
                <Pressable
                  onPress={() => {
                    const updated = commercial.tenantInfo.filter(
                      (_, i) => i !== index
                    );
                    dispatch(
                      setProfileField({
                        propertyType: "commercial",
                        key: "tenantInfo",
                        value: updated,
                      })
                    );
                  }}
                >
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>

              <InputField
                label="Tenant Name"
                value={tenant.currentTenant || ""}
                placeholder="e.g. ABC Corporation"
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = { ...tenant, currentTenant: value };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    })
                  );
                }}
              />

              <InputField
                label="Monthly Rent"
                value={tenant.rent || ""}
                placeholder="e.g. 50,000"
                keyboardType="numeric"
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = {
                    ...tenant,
                    rent: value.replace(/\D/g, ""),
                  };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    })
                  );
                }}
              />

              <DateInputField
                label="Lease Start Date"
                value={tenant.leaseStart}
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = { ...tenant, leaseStart: value };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    })
                  );
                }}
              />

              <DateInputField
                label="Lease End Date"
                value={tenant.leaseEnd}
                onChange={(value) => {
                  const updated = [...commercial.tenantInfo];
                  updated[index] = { ...tenant, leaseEnd: value };
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "tenantInfo",
                      value: updated,
                    })
                  );
                }}
              />
            </View>
          ))}

          <Pressable
            style={styles.addButton}
            onPress={() =>
              dispatch(
                setProfileField({
                  propertyType: "commercial",
                  key: "tenantInfo",
                  value: [
                    ...(commercial.tenantInfo || []),
                    {
                      currentTenant: "",
                      rent: "",
                      leaseStart: "",
                      leaseEnd: "",
                    },
                  ],
                })
              )
            }
          >
            <Text style={styles.addButtonText}>+ Add Tenant</Text>
          </Pressable>
        </View>
        {/* ========== FIRE SAFETY ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fire Safety & Compliance</Text>
          <Text style={styles.sectionSubtitle}>
            Select all fire safety measures available
          </Text>

          {FIRE_DATA.map((item) => {
            const enabled = !!commercial.fireSafety?.[item.key];

            return (
              <ToggleRow
                key={item.key}
                label={item.label}
                value={enabled}
                onChange={(val) =>
                  dispatch(
                    setProfileField({
                      propertyType: "commercial",
                      key: "fireSafety",
                      value: {
                        ...commercial.fireSafety,
                        [item.key]: val,
                      },
                    })
                  )
                }
              />
            );
          })}
        </View>

        {/* {(commercial.tenantInfo || []).map((tenant, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tenant #{index + 1}</Text>
              <Pressable onPress={() => removeTenant(index)}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>

            <InputField
              label="Tenant Name"
              value={tenant.currentTenant}
              onChange={(v) => updateTenant(index, "currentTenant", v)}
            />

            <InputField
              label="Monthly Rent"
              value={tenant.rent}
              keyboardType="numeric"
              onChange={(v) =>
                updateTenant(index, "rent", v.replace(/\D/g, ""))
              }
            />

            <DateInputField
              label="Lease Start Date"
              value={tenant.leaseStart}
              onChange={(v) => updateTenant(index, "leaseStart", v)}
            />

            <DateInputField
              label="Lease End Date"
              value={tenant.leaseEnd}
              onChange={(v) => updateTenant(index, "leaseEnd", v)}
            />
          </View>
        ))} */}

        {/* Price */}
        <Text style={styles.sectionTitle}>Price Details</Text>

        <InputField
          label="Total Price"
          value={commercial.price}
          placeholder="e.g. 75,00,000"
          keyboardType="numeric"
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "price",
                value: value.replace(/\D/g, ""),
              })
            )
          }
        />

        <InputField
          label="Carpet Area (sqft)"
          value={commercial.carpetArea}
          keyboardType="numeric"
          placeholder="e.g. 1200"
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "carpetArea",
                value: value.replace(/\D/g, ""),
              })
            )
          }
        />

        <InputField
          label="Price / sqft"
          value={commercial.pricePerSqft}
          editable={false}
          placeholder="Auto calculated"
          disabled
        />
        <InputField
          label="Built-up (sq ft)"
          value={commercial.builtUpArea || ""}
          placeholder="Optional"
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "builtUpArea",
                value,
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
                color: commercial.isPriceNegotiable ? "green" : "gray",
              }}
            >
              {commercial.isPriceNegotiable ? "YES" : "NO"}
            </Text>
            <Toggle
              enabled={commercial.isPriceNegotiable || false}
              onChange={(val) =>
                dispatch(
                  setProfileField({
                    propertyType: "commercial",
                    key: "isPriceNegotiable",
                    value: val,
                  })
                )
              }
            />
          </View>
        </View>

        {/* Description */}
        <TextArea
          label="Property Description"
          placeholder="e.g. Well-maintained commercial space with ample natural light, power backup, and easy access to main road."
          value={commercial.description}
          maxLength={500}
          onChange={(value) =>
            dispatch(
              setProfileField({
                propertyType: "commercial",
                key: "description",
                value,
              })
            )
          }
        />

        {/* Submit */}
        <Pressable
          style={styles.submitBtn}
          // onPress={() => dispatch(submitPropertyThunk())}
          onPress={() => {
            dispatch(submitPropertyThunk())
              .unwrap()
              .then((response) => {
                if (response.status) {
                  ToastSuccess("Property posted successfully");
                  console.log("Property Submission Successful:", response.status);
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

export default CommercialProfile;
const styles = StyleSheet.create({
  container: {
    padding: 10,
    // paddingBottom: 120,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
  },
  furnishing: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 15,
  },
  counteItem: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 8,
    color: "#374151",
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

  optionActive: {
    borderColor: "#22C55E",
    backgroundColor: "#e8f5e9",
  },
  optionActiveText: {
    fontSize: 14,
    fontWeight: 500,
  },

  section: { marginBottom: 10 },

  sectionSubtitle: { fontSize: 12, color: "#6b7280", marginBottom: 12 },

  card: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  cardTitle: { fontSize: 13, fontWeight: "500" },

  addButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#4b5563", fontSize: 14 },

  fireCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  fireCardActive: {
    borderColor: "#16a34a",
    backgroundColor: "#dcfce7",
  },
  fireText: { fontSize: 14, color: "#374151" },
  fireTextActive: { color: "#15803d", fontWeight: "600" },
  rowWrap: { gap: 12 },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 13,
  },
  toggleLabel: {
    color: "#374151",
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  optionBtnActive: {
    borderColor: "#16a34a",
    backgroundColor: "#dcfce7",
  },
  optionText: { color: "#374151" },
  optionTextActive: { color: "#16a34a", fontWeight: "600" },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  remove: { color: "#dc2626", fontSize: 12 },

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
