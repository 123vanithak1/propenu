import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const KpiCard = ({
  title,
  value,
  icon, // icon name string like "home"
  bgColor = "#F9FAFB",
  iconBgColor = "#E5E7EB",
}) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      {/* Left Content */}
      <View >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      {/* Right Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
         {icon}
      </View>
    </View>
  );
};

export default KpiCard;

const styles = StyleSheet.create({
  card: {
    width:"48%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal:10,
    marginBottom: 14,

    backgroundColor: "#fff",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    // Android shadow
    elevation: 3,
  },
  title: {
    fontSize: 14,
    color: "#000",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginTop: 4,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});