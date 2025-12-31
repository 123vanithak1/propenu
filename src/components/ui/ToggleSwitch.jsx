import React from "react";
import { Pressable, View, StyleSheet } from "react-native";

const Toggle = ({ enabled, onChange }) => {
  return (
    <Pressable
      onPress={() => onChange(!enabled)}
      style={[
        styles.container,
        enabled ? styles.enabled : styles.disabled,
      ]}
    >
      <View
        style={[
          styles.circle,
          enabled ? styles.circleEnabled : styles.circleDisabled,
        ]}
      />
    </Pressable>
  );
};

export default Toggle;
const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 2,
  },

  enabled: {
    backgroundColor: "#22C55E", // green-500
  },

  disabled: {
    backgroundColor: "#E5E7EB", // gray-200
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  circleEnabled: {
    alignSelf: "flex-end",
  },

  circleDisabled: {
    alignSelf: "flex-start",
  },
});
