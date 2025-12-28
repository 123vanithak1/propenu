import { View, Text, StyleSheet, Image } from "react-native";
import HomePageImage from "../../../assets/HomePageImage.png";
import LikedIconContainer from "../LikedIconContainer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const AgentCard = ({ details }) => {
  const imageSource = details?.coverImage?.url
    ? { uri: details.coverImage.url }
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
      {details?.rera?.isVerified && (
        <View style={styles.likeIcon}>
          <MaterialIcons name="verified-user" size={16} color="white" />
          <Text style={{ color: "white", fontSize: 12 }}>Verified</Text>
        </View>
      )}
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} />

        <Image source={{ uri: details?.avatar?.url }} style={styles.avatar} />
      </View>
      <View style={styles.propertyDetails}>
        <Text style={styles.name}>{details.name}</Text>
        <Text style={{ color: "#27AE60", fontSize: 12 }}>
          {details.agencyName}
        </Text>

        <Text>{details?.areasServed?.join(", ")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: "#fff",
    // padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 12,
    paddingBottom: 20,
  },
  area: {
    fontSize: 12,
    color: "#666",
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
  },
  likeIcon: {
    position: "absolute",
    top: 10,
    right: 18,
    zIndex: 10,
    backgroundColor: "#27AE60",
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  imageWrapper: {
    position: "relative",
  },
  propertyDetails: {
    paddingLeft: 20,
    paddingTop: 30,
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  avatar: {
    position: "absolute",
    left: 12,
    top: "100%",
    transform: [{ translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
});
export default AgentCard;
