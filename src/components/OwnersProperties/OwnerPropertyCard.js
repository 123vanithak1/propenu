import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import HomePageImage from "../../../assets/HomePageImage.png";
import LikedIconContainer from "../LikedIconContainer";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const OwnerPropertyCard = ({ details }) => {

  const imageSource =
    details?.gallery?.length > 0
      ? { uri: details.gallery[0].url }
      : HomePageImage;

  const formatPrice = (price) => {
    if (!price) return "";

    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    }

    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(0)} L`;
    }

    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.likeIcon}>
        <LikedIconContainer />
      </View>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.detailsSection}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {details.title}
        </Text>
        <Text style={styles.propertyLocation}>
          {details.city}
        </Text>
        {details?.superBuiltUpArea && (
          <Text style={styles.area}>{details.superBuiltUpArea} sqft</Text>
        )}
        <Text style={styles.propertyPrice}>{formatPrice(details.price)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 15,
    marginLeft: 2,
  },
  detailsSection: {
    paddingHorizontal: 10,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },
  area: {
    fontSize: 12,
    color: "#666",
  },
  likeIcon: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 250,
    marginRight: 12,
    borderRadius: 8,
  },
  propertyLocation: {
    fontSize: 12,
    color: "#000",
    marginBottom: 2,
  },
  propertyPrice: {
    fontSize: 12,
    fontWeight: "500",
    color: "#27AE60",
  },
});
export default OwnerPropertyCard;
