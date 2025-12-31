import React from "react";
import { View, Text, TextInput, ScrollView, Button, Switch } from "react-native";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { setProfileField } from "../../../redux/slice/PostPropertySlice";
import { submitPropertyThunk } from "../../../redux/thunk/SubmitPropertyThunk";
import { useAppDispatch } from "../../../redux/store/store";
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

const SOIL_TYPES = ["clay", "sandy", "loamy", "red-soil", "black-soil", "alluvial"];
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
const AgriculturalProfile = () => {
  const dispatch = useAppDispatch();
  const { agricultural } = useSelector((state) => state.postProperty);

  const setField = (key, value) => {
    dispatch(
      setProfileField({
        propertyType: "agricultural",
        key,
        value,
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Property Name */}
      <Text>Property / Farm Name</Text>
      <TextInput
        value={agricultural.title || ""}
        placeholder="Green Valley Farm"
        onChangeText={(v) => setField("title", v)}
        style={styles.input}
      />

      {/* Total Area */}
      <Text>Total Area</Text>
      <TextInput
        keyboardType="numeric"
        value={String(agricultural.totalArea?.value || "")}
        onChangeText={(v) =>
          setField("totalArea", {
            value: Number(v) || 0,
            unit: agricultural.totalArea?.unit,
          })
        }
        style={styles.input}
      />

      <Picker
        selectedValue={agricultural.totalArea?.unit || ""}
        onValueChange={(v) =>
          setField("totalArea", {
            value: agricultural.totalArea?.value || 0,
            unit: v,
          })
        }
      >
        <Picker.Item label="Select unit" value="" />
        {AREA_UNITS.map((u) => (
          <Picker.Item key={u} label={u.toUpperCase()} value={u} />
        ))}
      </Picker>

      {/* Road Width */}
      <Text>Road Width</Text>
      <TextInput
        keyboardType="numeric"
        value={String(agricultural.roadWidth?.value || "")}
        onChangeText={(v) =>
          setField("roadWidth", {
            value: Number(v) || 0,
            unit: agricultural.roadWidth?.unit || "ft",
          })
        }
        style={styles.input}
      />

      <Picker
        selectedValue={agricultural.roadWidth?.unit || ""}
        onValueChange={(v) =>
          setField("roadWidth", {
            value: agricultural.roadWidth?.value || 0,
            unit: v,
          })
        }
      >
        {ROAD_WIDTH_UNITS.map((u) => (
          <Picker.Item key={u} label={u.toUpperCase()} value={u} />
        ))}
      </Picker>

      {/* Soil Type */}
      <Text>Soil Type</Text>
      <Picker
        selectedValue={agricultural.soilType || ""}
        onValueChange={(v) => setField("soilType", v)}
      >
        <Picker.Item label="Select" value="" />
        {SOIL_TYPES.map((t) => (
          <Picker.Item key={t} label={t.toUpperCase()} value={t} />
        ))}
      </Picker>

      {/* Boundary Wall */}
      <View style={styles.switchRow}>
        <Text>Boundary Wall</Text>
        <Switch
          value={agricultural.boundaryWall || false}
          onValueChange={(v) => setField("boundaryWall", v)}
        />
      </View>

      {/* Electricity */}
      <View style={styles.switchRow}>
        <Text>Electricity Connection</Text>
        <Switch
          value={agricultural.electricityConnection || false}
          onValueChange={(v) => setField("electricityConnection", v)}
        />
      </View>

      {/* Description */}
      <Text>Description</Text>
      <TextInput
        multiline
        numberOfLines={4}
        value={agricultural.description || ""}
        onChangeText={(v) => setField("description", v)}
        style={[styles.input, { height: 100 }]}
      />

      {/* Submit */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Submit Property"
          onPress={() => dispatch(submitPropertyThunk())}
        />
      </View>
    </ScrollView>
  );
};

export default AgriculturalProfile;
const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
};
