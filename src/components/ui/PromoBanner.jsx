import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const  PromoBanner = () =>{
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>
          Unlock more owner contacts & more opportunities with subscriptions
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Upgrade your Plan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://illustrations.popsy.co/emerald/customer-support.svg",
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export default PromoBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8F5EE",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D1E7DD",
    flexDirection: width > 768 ? "row" : "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: width > 768 ? "flex-start" : "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: width > 768 ? "left" : "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  imageContainer: {
    marginTop: width > 768 ? 0 : 12,
    height: 100,
  },
  image: {
    height: "100%",
    width: 120,
  },
});