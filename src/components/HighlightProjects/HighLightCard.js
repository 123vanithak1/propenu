import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React from "react";
import HomePageImage from "../../../assets/HomePageImage.png";
import LikedIconContainer from "../LikedIconContainer";

const HighLightCard = ({ details }) => {
  // console.log("details", details);

  const { title, city, heroImage, priceFrom, priceTo, currency } = details;

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
      <ImageBackground
        source={heroImage ? { uri: heroImage } : HomePageImage}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <View style={styles.lowerCard}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.city}>{city}</Text> 
<Text style={styles.price}>
          {formatPrice(priceFrom)} – {formatPrice(priceTo)}
        </Text>
          {/* <Text style={styles.price}>{formatPrice(details.price)}</Text> */}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginRight: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",

    // Shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  likeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },

  imageBackground: {
    width: 200,
    height: 250,
  },

  image: {
    borderRadius: 14,
  },

  lowerCard: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -75 }], // half of width
    width: 150,

    backgroundColor: "#fff",
    borderRadius: 10,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    padding: 8,

    alignItems: "center",
    justifyContent: "center",

    // shadow for floating effect
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    fontSize: 12,
    fontWeight:500,
    color: "#27AE60",
    marginTop: 4,
  },
  city: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
});

export default HighLightCard;
