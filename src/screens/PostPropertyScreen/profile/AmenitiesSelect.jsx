import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";

const AmenitiesSelect = ({
  label = "Amenities",
  value = [],
  options = [],
  onChange,
  error,
}) => {
  const [open, setOpen] = useState(false);

  const toggleAmenity = (amenity) => {
    const exists = value.some((a) => a.key === amenity.key);

    if (exists) {
      onChange(value.filter((a) => a.key !== amenity.key));
    } else {
      onChange([...value, amenity]);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input Box */}
      <Pressable
        onPress={() => setOpen(!open)}
        style={[
          styles.inputBox,
          error ? styles.errorBorder : styles.normalBorder,
        ]}
      >
        {value.length === 0 ? (
          <Text style={styles.placeholder}>Select amenities</Text>
        ) : (
          <View style={styles.chipsContainer}>
            {value.map((amenity, idx) => (
              <View
                key={amenity.key ?? amenity.title ?? idx}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{amenity.title}</Text>
                <Pressable onPress={() => toggleAmenity(amenity)}>
                  <Text style={styles.chipRemove}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </Pressable>

      {/* Dropdown */}
      {open && (
        <ScrollView style={styles.dropdown} nestedScrollEnabled>
          <View style={styles.grid}>
            {options.map((amenity, idx) => {
              const checked = value.some(
                (a) => a.key === amenity.key
              );

              return (
                <Pressable
                  key={amenity.key ?? amenity.title ?? idx}
                  onPress={() => toggleAmenity(amenity)}
                  style={[
                    styles.option,
                    checked && styles.optionChecked,
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      checked && styles.checkboxChecked,
                    ]}
                  />
                  <Text style={styles.optionText}>
                    {amenity.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AmenitiesSelect;
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },

  inputBox: {
    minHeight: 52,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  normalBorder: {
    borderColor: "#D1D5DB",
  },

  errorBorder: {
    borderColor: "#EF4444",
  },

  placeholder: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  chipText: {
    fontSize: 12,
    color: "#15803D",
    marginRight: 6,
  },

  chipRemove: {
    fontSize: 12,
    color: "#15803D",
  },

  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#fff",
    maxHeight: 220,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },

  option: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },

  optionChecked: {
    borderColor: "#22C55E",
    backgroundColor: "#ECFDF5",
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    marginRight: 8,
  },

  checkboxChecked: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },

  optionText: {
    fontSize: 13,
    color: "#374151",
  },

  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
});
