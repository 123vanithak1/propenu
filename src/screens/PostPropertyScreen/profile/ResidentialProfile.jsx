import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
  StyleSheet,
  Switch,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
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
        })
      );
    }
  }, [residential.price, residential.expectedPrice, residential.carpetArea]);

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
        style={styles.container}
        contentContainerStyle={{ paddingBottom: keyboardOpen ? 135 : 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Configuration Section */}
        <View style={styles.section}>
          {/* Counter Fields */}
          <View style={styles.counterGrid}>
            <View style={styles.counterItem}>
              <CounterField
                label="BHK"
                value={residential.bhk || 1}
                min={1}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "bhk",
                      value,
                    })
                  )
                }
              />
            </View>

            <View style={styles.counterItem}>
              <CounterField
                label="Bedrooms"
                value={residential.bedrooms || residential.bhk || 1}
                min={1}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "bedrooms",
                      value,
                    })
                  )
                }
              />
            </View>

            <View style={styles.counterItem}>
              <CounterField
                label="Bathrooms"
                value={residential.bathrooms || 1}
                min={1}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "bathrooms",
                      value,
                    })
                  )
                }
              />
            </View>

            <View style={styles.counterItem}>
              <CounterField
                label="Balconies"
                value={residential.balconies || 0}
                min={0}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "balconies",
                      value,
                    })
                  )
                }
              />
            </View>

            <View style={styles.facingDropDown}>
              <Dropdownui
                label="Facing"
                value={residential.facing || null}
                onChange={(value) =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "facing",
                      value,
                    })
                  )
                }
                options={FACING_TYPES.map((t) => ({ value: t, label: t }))}
                placeholder="Select"
              />
            </View>
          </View>
          <Text style={styles.furnish}>Furnishing </Text>
          <View style={styles.row}>
            {[
              { label: "Furnished", value: "fully-furnished" },
              { label: "Semi Furnished", value: "semi-furnished" },
              { label: "Unfurnished", value: "unfurnished" },
            ].map((item) => (
              <OptionButton
                key={item.value}
                label={item.label}
                active={residential.furnishing === item.value}
                onPress={() =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "furnishing",
                      value: item.value,
                    })
                  )
                }
              />
            ))}
          </View>
        </View>

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
              })
            )
          }
        />

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
                  })
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
                      })
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
                      })
                    )
                  }
                />
              </View>
            </View>
          </View>
        </View>

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
                  })
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
                      })
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
                      })
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
                })
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
          <Toggle
            enabled={residential.isModularKitchen || false}
            onChange={(val) =>
              dispatch(
                setProfileField({
                  propertyType: "residential",
                  key: "isModularKitchen",
                  value: val,
                })
              )
            }
          />
        </View>

        {/* Availability Status */}
        <View style={[styles.section, { marginBottom: 15 }]}>
          <Text style={styles.label}>Availability Status</Text>
          <View style={styles.side}>
            {[
              { label: "Ready to Move", value: "ready-to-move" },
              { label: "Under Construction", value: "under-construction" },
            ].map((item) => (
              <OptionButton
                key={item.value}
                label={item.label}
                active={residential.constructionStatus === item.value}
                onPress={() =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "constructionStatus",
                      value: item.value,
                    })
                  )
                }
              />
            ))}
          </View>
        </View>

        {/* Transaction Type */}
        <View style={[styles.section, { marginBottom: 15 }]}>
          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.side}>
            {[
              { label: "New Sale", value: "new-sale" },
              { label: "Resale", value: "resale" },
            ].map((item) => (
              <OptionButton
                key={item.value}
                label={item.label}
                active={residential.transactionType === item.value}
                onPress={() =>
                  dispatch(
                    setProfileField({
                      propertyType: "residential",
                      key: "transactionType",
                      value: item.value,
                    })
                  )
                }
              />
            ))}
          </View>
        </View>

        {/* Property Age */}
        {residential.constructionStatus === "ready-to-move" && (
          <View style={styles.section}>
            <Text style={styles.label}>Property Age</Text>
            <View style={styles.buttonGroupWrap}>
              {[
                { label: "0-1 Year", value: "0-1-year" },
                { label: "1-5 Years", value: "1-5-years" },
                { label: "5-10 Years", value: "5-10-years" },
                { label: "10+ Years", value: "10-plus-years" },
              ].map((item) => (
                <OptionButton
                  key={item.value}
                  label={item.label}
                  active={residential.propertyAge === item.value}
                  onPress={() =>
                    dispatch(
                      setProfileField({
                        propertyType: "residential",
                        key: "propertyAge",
                        value: item.value,
                      })
                    )
                  }
                />
              ))}
            </View>
          </View>
        )}

        {/* Possession Date using datetimepicker */}
        {residential.constructionStatus === "under-construction" && (
          <DateInputField
            label="Expected Possession Date"
            value={residential.possessionDate}
            required
            minimumDate={new Date()} // future only
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType: "residential",
                  key: "possessionDate",
                  value,
                })
              )
            }
          />
        )}

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.grid4}>
            <InputField
              label="Total Price"
              value={residential.price || ""}
              placeholder="e.g. 75,00,000"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "residential",
                    key: "price",
                    value: value.replace(/\D/g, ""),
                  })
                )
              }
            />
            <InputField
              label="Carpet Area (sq ft)"
              value={residential.carpetArea || ""}
              placeholder="e.g. 1200"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "residential",
                    key: "carpetArea",
                    value: value.replace(/\D/g, ""),
                  })
                )
              }
            />
            <InputField
              label="Price / sq ft"
              value={residential.pricePerSqft || ""}
              placeholder="Auto calculated"
              disabled
            />
            <InputField
              label="Built-up (sq ft)"
              value={residential.builtUpArea || ""}
              placeholder="Optional"
              onChange={(value) =>
                dispatch(
                  setProfileField({
                    propertyType: "residential",
                    key: "builtUpArea",
                    value,
                  })
                )
              }
            />
          </View>
        </View>

        {/* Price Negotiable */}
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
                  })
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
              })
            )
          }
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            dispatch(submitPropertyThunk())
              .unwrap()
              .then((response) =>
                console.log("Property submission successful:", response)
              )
              .catch((error) =>
                console.error("Property submission failed:", error)
              );
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center",fontSize:16, fontWeight: 600 }}>
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
    padding: 16,
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

  section: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
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
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginBottom: 15,
  },

  grid3: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  grid4: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
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
  submitButton: {
    padding: 12,
    backgroundColor: "#22C55E",
    borderRadius: 8,
    width: "60%",
    alignSelf: "center",
  },
});
