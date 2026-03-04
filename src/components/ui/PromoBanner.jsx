import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const PromoBanner = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>
          Haven’t subscribed yet? Upgrade now to unlock more leads and grow your
          property reach.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BuyPlans")}
        >
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
};

export default PromoBanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    // flexDirection: width > 768 ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: width > 768 ? "flex-start" : "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: width > 768 ? "left" : "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 23,
  },
  button: {
    backgroundColor: "#27AE60",
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
    height: "90%",
    width: 120,
  },
});
