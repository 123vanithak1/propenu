import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.toast, styles.success]}>
      {text1 ? <Text style={styles.title}>{text1}</Text> : null}
      <MaterialIcons name="check-circle" size={16} color="#27AE60" />
      <Text style={[styles.message, { color: "#27AE60" }]}>{text2}</Text>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={[styles.toast, styles.error]}>
      {text1 ? <Text style={styles.title}>{text1}</Text> : null}
      <MaterialCommunityIcons name="close-circle" size={16} color="#dc2626" />
      <Text style={[styles.message, { color: "#dc2626" }]}>{text2}</Text>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View style={[styles.toast, styles.info]}>
      {text1 ? <Text style={styles.title}>{text1}</Text> : null}
      <MaterialIcons name="error" size={16} color="#dd8717" />
      <Text style={[styles.message, { color: "#dd8717" }]}>{text2}</Text>
    </View>
  ),
};
const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    // borderWidth:1,
    // borderLeftWidth:5,
    // backgroundColor:"white"
  },
  success: {
    // borderWidth:1,
    borderColor: "#16a34a",
    backgroundColor: "#E9F7EF",
  },
  error: {
    borderColor: "#dc2626",
    backgroundColor: "#f7ece9",
  },
  info: {
    backgroundColor: "#f5eee2",
    borderColor: "#dd8717",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  message: {
    fontSize: 13,
    color: "#0f0f0fff",
    //  fontWeight: "500",
    // marginTop: 4,
    lineHeight: 22,
  },
});
