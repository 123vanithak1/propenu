import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CounterField = ({
  label,
  value,
  min = 0,
  max,
  onChange,
  error,
  required = false,
}) => {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (max === undefined || value < max) onChange(value + 1);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {/* Counter Box */}
      <View
        style={[
          styles.counterBox,
          error ? styles.errorBorder : styles.normalBorder,
        ]}
      >
        {/* Decrease */}
        <Pressable
          onPress={decrease}
          disabled={value <= min}
          style={({ pressed }) => [
            styles.iconButton,
            value <= min && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <MaterialIcons name="remove" size={18} color="#4B5563" />
        </Pressable>

        {/* Value */}
        <Text style={styles.value}>{value}</Text>

        {/* Increase */}
        <Pressable
          onPress={increase}
          disabled={max !== undefined && value >= max}
          style={({ pressed }) => [
            styles.iconButton,
            max !== undefined && value >= max && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <MaterialIcons name="add" size={18} color="#4B5563" />
        </Pressable>
      </View>

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CounterField;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },

  required: {
    color: "#EF4444",
  },

  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  normalBorder: {
    borderColor: "#D1D5DB",
  },

  errorBorder: {
    borderColor: "#EF4444",
  },

  iconButton: {
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },

  pressed: {
    backgroundColor: "#F3F4F6",
  },

  disabled: {
    opacity: 0.3,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#EF4444",
  },
});
