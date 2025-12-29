import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows = 3,
  maxLength,
}) => {
  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* TextArea */}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          placeholder={placeholder}
          editable={!disabled}
          multiline
          numberOfLines={rows}
          maxLength={maxLength}
          onChangeText={onChange}
          style={[
            styles.textArea,
            disabled && styles.disabled,
            error && styles.errorBorder,
            maxLength && styles.withCounter,
          ]}
          placeholderTextColor="#9ca3af"
          textAlignVertical="top"
        />

        {/* Counter */}
        {maxLength ? (
          <Text style={styles.counter}>
            {String(value?.length || 0)}/{maxLength}
          </Text>
        ) : null}
      </View>

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default TextArea;
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
  inputWrapper: {
    position: "relative",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#ffffff",
    minHeight: 80,
  },
  withCounter: {
    paddingBottom: 28,
  },
  disabled: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
  },
  errorBorder: {
    borderColor: "#ef4444",
  },
  counter: {
    position: "absolute",
    bottom: 6,
    right: 10,
    fontSize: 11,
    color: "#9ca3af",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#ef4444",
  },
});
