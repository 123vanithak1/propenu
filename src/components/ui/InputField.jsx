import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  keyboardType,
  required = false,
  disabled = false,
  error,
}) => {
  /* keyboard based on type */
  const getKeyboardType = () => {
    if (keyboardType) return keyboardType;
    switch (type) {
      case "number":
        return "numeric";
      case "email":
        return "email-address";
      default:
        return "default";
    }
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input */}
      <TextInput
        value={String(value ?? "")}
        placeholder={placeholder}
        editable={!disabled}
        keyboardType={getKeyboardType()}
        onChangeText={onChange}
        style={[
          styles.input,
          disabled && styles.disabled,
          error && styles.errorBorder,
        ]}
        placeholderTextColor="#9ca3af"
      />

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
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
  disabled: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
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

export default InputField;
