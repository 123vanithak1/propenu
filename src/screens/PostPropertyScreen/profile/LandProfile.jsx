import React, { useEffect } from "react";
import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/store/store";
import { setProfileField } from "../../../redux/slice/PostPropertySlice";
import { submitPropertyThunk } from "../../../redux/thunk/SubmitPropertyThunk";

import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import Dropdownui from "../../../components/ui/DropDownUI";
import AmenitiesSelect from "./AmenitiesSelect";
import { AMENITIES } from "../constants/amenities";

const AREA_UNITS = ["sqft"];
const FACING_OPTIONS = [
  "East", "West", "North", "South",
  "North-East", "North-West", "South-East", "South-West",
];

const LAND_APPROVAL_AUTHORITIES = [
  "dtcp", "hmda", "cmda", "bda", "panchayat"
];

const LandProfile = () => {
  const { land } = useSelector((state) => state.postProperty);
  const dispatch = useAppDispatch();

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

 const SwitchRow = ({ label, value, onChange }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
    <Switch value={!!value} onValueChange={onChange} />
    <Text style={{ marginLeft: 8 }}>{label}</Text>
  </View>
);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>

      {/* Plot Area */}
      <InputField
        label="Plot Area"
        keyboardType="numeric"
        value={land.plotArea || ""}
        onChangeText={(value) =>
          dispatch(setProfileField({ propertyType: "land", key: "plotArea", value }))
        }
      />

      <Dropdownui
        label="Unit"
        options={AREA_UNITS.map((u) => ({ label: u.toUpperCase(), value: u }))}
        value={land.areaUnit}
        onChange={(value) =>
          dispatch(setProfileField({ propertyType: "land", key: "areaUnit", value }))
        }
      />

      <InputField
        label="Price"
        keyboardType="numeric"
        value={land.price || ""}
        onChangeText={(value) =>
          dispatch(setProfileField({ propertyType: "land", key: "price", value }))
        }
      />

      {/* Dimensions */}
      <Text style={{ fontWeight: "600", marginVertical: 8 }}>
        Plot Dimensions
      </Text>

      <InputField
        label="Length"
        keyboardType="numeric"
        value={land.dimensions?.length || ""}
        onChangeText={(value) =>
          dispatch(
            setProfileField({
              propertyType: "land",
              key: "dimensions",
              value: { ...land.dimensions, length: value },
            })
          )
        }
      />

      <InputField
        label="Width"
        keyboardType="numeric"
        value={land.dimensions?.width || ""}
        onChangeText={(value) =>
          dispatch(
            setProfileField({
              propertyType: "land",
              key: "dimensions",
              value: { ...land.dimensions, width: value },
            })
          )
        }
      />

      {/* Facing */}
      <Dropdownui
        label="Facing"
        options={FACING_OPTIONS.map((f) => ({ label: f, value: f }))}
        value={land.facing}
        onChange={(value) =>
          dispatch(setProfileField({ propertyType: "land", key: "facing", value }))
        }
      />

      {/* Approved By */}
      <Dropdownui
        label="Approved By"
        options={LAND_APPROVAL_AUTHORITIES.map((a) => ({
          label: a.toUpperCase(),
          value: a,
        }))}
        value={land.approvedByAuthority}
        onChange={(value) =>
          dispatch(
            setProfileField({
              propertyType: "land",
              key: "approvedByAuthority",
              value,
            })
          )
        }
      />

      {/* Switches */}
      <View style={{ marginVertical: 12 }}>
        <SwitchRow
          label="Ready to Build"
          value={land.readyToConstruct}
          onChange={(v) =>
            dispatch(setProfileField({ propertyType: "land", key: "readyToConstruct", value: v }))
          }
        />

        <SwitchRow
          label="Water Supply"
          value={land.waterConnection}
          onChange={(v) =>
            dispatch(setProfileField({ propertyType: "land", key: "waterConnection", value: v }))
          }
        />
      </View>

      {/* Amenities */}
      <AmenitiesSelect
        label="Amenities"
        options={AMENITIES}
        value={land.amenities || []}
        onChange={(value) =>
          dispatch(setProfileField({ propertyType: "land", key: "amenities", value }))
        }
      />

      {/* Description */}
      <TextArea
        label="Description"
        value={land.description || ""}
        onChangeText={(value) =>
          dispatch(setProfileField({ propertyType: "land", key: "description", value }))
        }
      />

      {/* Submit */}
      <Pressable
        onPress={() => dispatch(submitPropertyThunk("land"))}
        style={{
          marginTop: 24,
          backgroundColor: "#16a34a",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Submit Property
        </Text>
      </Pressable>

    </ScrollView>
  );
};

export default LandProfile;
