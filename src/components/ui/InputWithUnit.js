import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InputWithUnit = ({
  label,
  value,
  unit,
  units = [],
  placeholder = "0.00",
  onValueChange,
  onUnitChange,
  required = false,
  disabled = false,
  error,
}) => {
  const [open, setOpen] = useState(false);

  const selectedUnit =
    units.find((u) => u.value === unit) || units[0];

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {/* Input Wrapper */}
      <View
        style={[
          styles.inputWrapper,
          error ? styles.errorBorder : styles.normalBorder,
          disabled && styles.disabledWrapper,
        ]}
      >
        {/* Input */}
        <TextInput
          value={value !== undefined && value !== null ? String(value) : ""}
          placeholder={placeholder}
          keyboardType="numeric"
          editable={!disabled}
          onChangeText={onValueChange}
          placeholderTextColor="#9ca3af"
          style={[styles.input, disabled && styles.disabledText]}
        />

        <View style={styles.divider} />

        {/* Unit Button */}
        <Pressable
          disabled={disabled}
          style={styles.unitContainer}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.unitText}>
            {selectedUnit?.label}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6b7280" />
        </Pressable>
      </View>

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* ===== UNIT MODAL ===== */}
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modal}>
            {units.map((u) => {
              const active = u.value === selectedUnit?.value;
              return (
                <TouchableOpacity
                  key={u.value}
                  style={[
                    styles.unitOption,
                    active && styles.activeUnit,
                  ]}
                  onPress={() => {
                    onUnitChange(u.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.unitOptionText,
                      active && styles.activeUnitText,
                    ]}
                  >
                    {u.label}
                  </Text>
                  {active && (
                    <Ionicons name="checkmark" size={18} color="#16a34a" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default InputWithUnit;
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  required: {
    color: "#ef4444",
  },
  inputWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  normalBorder: {
    borderColor: "#d1d5db",
  },
  errorBorder: {
    borderColor: "#ef4444",
  },
  disabledWrapper: {
    backgroundColor: "#f3f4f6",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#111827",
  },
  divider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 6,
  },
  unitContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginRight: 4,
  },
  disabledText: {
    color: "#9ca3af",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#ef4444",
  },

  /* Modal */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
  },
  unitOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  activeUnit: {
    backgroundColor: "#ecfdf5",
  },
  unitOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  activeUnitText: {
    color: "#16a34a",
    fontWeight: "600",
  },
});
