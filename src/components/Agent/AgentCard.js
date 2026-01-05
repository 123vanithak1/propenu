import { View, Text, StyleSheet, Image } from "react-native";
import HomePageImage from "../../../assets/HomePageImage.png";
import LikedIconContainer from "../LikedIconContainer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Logo, LocationIcon } from "../../../assets/svg/Logo";
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
        <View style={styles.VerifiedBadge}>
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
        <Text style={{ color: "#27AE60", fontSize: 12, paddingVertical: 2 }}>
          {details.agencyName}
        </Text>
        <Text style={styles.subtitle}>{details.bio}</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <LocationIcon width={14} height={16} />
          <Text style={styles.area}> {details?.areasServed?.join(", ")}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.color}>{details.stats.publishedCount}</Text>
          <Text style={styles.info}>For Sale</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.color}>{details.stats.totalProperties}</Text>
          <Text style={styles.info}>Total Properties</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.color}>{details.dealsClosed}</Text>
          <Text style={styles.info}>Closed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 15,
    marginLeft: 2,
    paddingBottom: 13,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  color: {
    color: "#27AE60",
  },
  info: { fontSize: 12, color: "#000" },
  area: {
    fontSize: 12,
    color: "#363535ff",
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
  },
  divider: {
    height: 1,
    alignSelf: "center",
    backgroundColor: "#E0E0E0",
    width: 220,
    marginHorizontal: "30",
    marginVertical: 13,
  },
  VerifiedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
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
  subtitle: {
    fontSize: 12,
    color: "#797773ff",
    marginBottom: 6,
    marginTop: 2,
  },
  imageWrapper: {
    position: "relative",
  },
  propertyDetails: {
    paddingLeft: 15,
    paddingTop: 40,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
});
export default AgentCard;
