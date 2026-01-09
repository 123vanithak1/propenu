import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.toast, styles.success]}>
      {text1 ? <Text style={styles.title}>{text1}</Text> : null}
      <Text style={styles.message}>{text2}</Text>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={[styles.toast, styles.error]}>
      {text1 ? <Text style={styles.title}>{text1}</Text> : null}
      <Text style={styles.message}>{text2}</Text>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View style={[styles.toast, styles.info]}>
      {text1 ? <Text style={styles.title}>{text1}</Text> : null}
      <Text style={styles.message}>{text2}</Text>
    </View>
  ),
};
const styles = StyleSheet.create({
  toast: {
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 16,
    borderLeftWidth:5,
    backgroundColor:"white"
  },
  success: {
   borderColor: "#16a34a",
   
  },
  error: {
    borderColor: "#dc2626",
  },
  info: {
     borderColor: "#2563eb",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  message: {
    fontSize: 14,   
    color: "#0f0f0fff",
     fontWeight: "500",
    marginTop: 4,
    lineHeight: 22,
  },
});
