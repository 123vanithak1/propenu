import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const CardDetails = ({ details }) => {
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
      <Image source={{ uri: heroImage }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.city}>{city}</Text>

        <Text style={styles.price}>
          {formatPrice(priceFrom)} – {formatPrice(priceTo)}
        </Text>
        {/* <Text style={styles.price}>
          {currency} {priceFrom?.toLocaleString()} – {priceTo?.toLocaleString()}
        </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    alignItems: "center",

    // Shadow (Android)
    elevation: 3,

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  infoContainer: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    color: "#222",
  },

  city: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },

  price: {
    fontSize: 12,
    marginTop: 4,
    fontWeight:500,
    color: "#27AE60",
  },
});

export default CardDetails;
