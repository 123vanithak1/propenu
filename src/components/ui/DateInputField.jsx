import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

const DateInputField = ({
  label,
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  required = false,
  error,
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {/* {required && <Text style={styles.required}> *</Text>} */}
        </Text>
      )}

      {/* Fake input */}
      <Pressable onPress={() => setShowPicker(true)}>
        <View pointerEvents="none">
          <TextInput
            value={formatDate(value)}
            placeholder={placeholder}
            editable={false}
            style={[styles.input, error && styles.errorBorder]}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </Pressable>

      {/* Picker */}
      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          themeVariant={Platform.OS === "android" ? "light" : undefined}
          textColor={Platform.OS === "android" ? "#000" : undefined}
          style={
            Platform.OS === "ios" ? { backgroundColor: "#fff" } : undefined
          }
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate.toISOString());
            }
          }}
        />
      )}

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default DateInputField;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },
  errorBorder: {
    borderColor: "#ef4444",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#ef4444",
  },
});
