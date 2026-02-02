import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { apiService } from "../../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import RemoteSvg from "../../lib/RemoteSVG";
import { LocationIcon, Logo } from "../../../assets/svg/Logo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AmenitiesWithModal from "../../screens/PropertyDetails/detailProperty/AmenitiesWithModal";
import NearByLocations from "../../screens/PropertyDetails/detailProperty/NearByLocation";
import AvailableProperties from "../../screens/PropertyDetails/detailProperty/AvailableProperties";
import Gallery from "../../screens/PropertyDetails/detailProperty/Gallary";

const MoreOwnerPropertyDetail = ({ route }) => {
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);
  const [showNav, setShowNav] = useState(false);
  console.log("Property id :", propertyId);

  const scrollRef = useRef(null);
  const sectionPositions = useRef({
    properties: 0,
    gallery: 0,
    amenities: 0,
    location: 0,
    about: 0,
  });

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 220 && !showNav) {
      setShowNav(true);
    }
    // else setShowNav(false)
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  useEffect(() => {
    return () => setShowNav(false);
  }, []);

  const fetchPropertyDetails = async () => {
    try {
      const res = await apiService.ownerProjectById(propertyId);
      console.log("response :", res.data);
      setProperty(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // if (!property) {
  //   return (
  //     <SafeAreaView style={styles.center}>
  //       <Text>No property found</Text>
  //     </SafeAreaView>
  //   );
  // }

  const formatMonthYear = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text>Need more clarity</Text>
    </SafeAreaView>
  );
};

export default MoreOwnerPropertyDetail;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingBottom: 16,
  },
  image: {
    width: "100%",
    height: 220,
    // paddingHorizontal: 5,

    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  stickyNav: {
    position: "absolute",
    top: 32,
    left: 0,
    right: 0,
    height: 56,
    zIndex: 1000,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 7,
    gap: 10,
  },
  title: {
    justifyContent: "center",
    // alignItems:"center"
  },
  logo: {
    width: 200,
    // height: 200,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 500,
  },
  location: {
    fontSize: 12,
    paddingTop: 5,
    color: "#545454",
  },
  price: {
    color: "#FFAC1D",
    fontWeight: 500,
  },
  rera: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 4,
  },
  reraText: {
    fontSize: 12,
    color: "#3d3d3dff",
  },
  section: {
    // margin:5,
    gap: 20,
    marginHorizontal: 10,
    backgroundColor: "#ebebebff",
    height: 140,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    gap: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 500,
  },
  sectionData: {
    fontSize: 12,
    color: "#3d3d3dff",
  },
  homePageImage: {
    width: "100%",
    height: 150,
    opacity: 0.8,
    borderRadius: 10,
  },

  homepage: {
    alignItems: "center",
    width: "93%",
    margin: 12,
    marginVertical: 18,
  },

  imageWrapper: {
    width: "100%",
    position: "relative",
  },

  overlayText: {
    position: "absolute",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    left: 16,
    top: 12,
  },
  about: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    marginTop: 17,
    paddingHorizontal: 7,
    textAlign: "justify",
  },
  aboutUs: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginLeft: 16,
  },
  placeRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    gap: 4,
    // justifyContent: "space-between",
    // paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    marginRight: 17,
    marginVertical: 12,
  },

  placeName: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
    fontWeight: 500,
  },
  mapBox: {
    height: 220,
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
});
