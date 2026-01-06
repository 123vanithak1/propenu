import { useEffect, useState } from "react";
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
import AmenitiesWithModal from "./AmenitiesWithModal";
import MapScreen from "../../components/location/MapScreen";

const PropertyDetailsScreen = ({ route }) => {
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);
  const [selectedBhk, setSelectedBhk] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      const res = await apiService.featuredProjectById(propertyId);
      // console.log("response :", res.data.heroTagline);
      setProperty(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  if (!property) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No property found</Text>
      </SafeAreaView>
    );
  }

  const formatPrice = (price) => {
    if (!price) return "";
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(0)} L`;
    return `₹ ${price.toLocaleString("en-IN")}`;
  };
  const activeBhk = selectedBhk ?? property?.bhkSummary?.[0] ?? null;

  const activeUnits = activeBhk?.units ?? [];
  const activeUnit = selectedUnit ?? activeUnits?.[0] ?? null;

  const visibleAmenities = showAllAmenities
    ? property.amenities
    : property.amenities.slice(0, 5);

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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {property?.heroImage ? (
          <Image
            source={{ uri: property.heroImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text>No Image</Text>
          </View>
        )}
        <View style={styles.row}>
          <View
            style={{
              width: 100,
              height: 80,
              borderRadius: 10,
              // backgroundColor: "#eee",
            }}
          >
            {property?.logo?.url ? (
              (() => {
                const url = property.logo.url;
                const extension = url.split(".").pop().toLowerCase();

                if (extension === "svg") {
                  // Remote SVG
                  return <RemoteSvg url={url} width={100} height={80} />;
                } else {
                  // PNG, JPG, etc.
                  return (
                    <Image
                      source={{ uri: url }}
                      style={{
                        width: 100,
                        height: 80,
                        borderRadius: 10,
                        // backgroundColor: "#eee",
                      }}
                      resizeMode="contain"
                    />
                  );
                }
              })()
            ) : (
              <View
                style={{
                  width: 100,
                  height: 80,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  // backgroundColor: "#eee",
                }}
              >
                <Logo width={44} height={44} />
              </View>
            )}
          </View>
          <View style={styles.title}>
            <Text numberOfLines={1} style={styles.titleText}>
              {property?.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <LocationIcon width={14} height={14} color={"#545454"} />
              <Text numberOfLines={1} style={styles.location}>
                {property.address}
              </Text>
            </View>
          </View>
        </View>

        {/* <Text style={styles.price}>
          {formatPrice(property.priceFrom)} – {formatPrice(property.priceTo)}
        </Text> */}

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                2 - {property.bhkSummary.length + 1} BHK
              </Text>
              <Text style={styles.sectionTitle}>Configuration</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                {property.amenities.length}
              </Text>
              <Text style={styles.sectionTitle}>Amenities</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.sectionData}>{property.projectArea}</Text>
              <Text style={styles.sectionTitle}>Total Area</Text>
            </View>
          </View>
          <View style={styles.sectionRow}>
            <View style={styles.center}>
              <Text style={styles.sectionData}>
                {formatMonthYear(property.possessionDate)}
              </Text>
              <Text style={styles.sectionTitle}>Ready To Move</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.sectionData}>{property.totalUnits}</Text>
              <Text style={styles.sectionTitle}>Units</Text>
            </View>
            <View style={styles.center}>
              {/* <Text style={styles.sectionData}>2,3 BHK</Text> */}
              {property?.reraNumber ? (
                <View style={styles.rera}>
                  <MaterialIcons
                    name="check-circle"
                    size={13}
                    color="#545454"
                  />
                  <Text style={styles.reraText}>RERA</Text>
                </View>
              ) : (
                <Text style={styles.reraText}>RERA</Text>
              )}
              <Text style={styles.sectionTitle}>Approved</Text>
            </View>
          </View>
        </View>

        <Text style={styles.aboutUs}>About US</Text>
        {property?.aboutSummary?.map((item, index) => (
          <View key={index} style={styles.homepage}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.url }} style={styles.homePageImage} />
              <Text style={styles.overlayText}>Why Choose Us</Text>
            </View>

            <Text style={styles.about}>{item.aboutDescription}</Text>
          </View>
        ))}
        <AmenitiesWithModal amenities={property.amenities} />

        <View style={styles.gallery}>
          <Text numberOfLines={1} style={styles.galleryText}>
            Gallery
          </Text>

          <FlatList
            data={property?.gallerySummary}
            horizontal
            keyExtractor={(item) => item.order.toString()}
            renderItem={({ item }) => (
              <View style={styles.galleryItem}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />

                {/* Overlay */}
                <View style={styles.overlay}>
                  <Text style={styles.overlayImageText}>{item.category}</Text>
                </View>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        {property?.nearbyPlaces && (
          <View style={styles.gallery}>
            <Text style={styles.aboutUs}>Location & Landmarks</Text>

            <FlatList
              data={property.nearbyPlaces}
              horizontal
              keyExtractor={(item) => item.order.toString()}
              renderItem={({ item }) => (
                <View style={styles.placeRow}>
                  <LocationIcon color="#FFAC1D" width={16} height={16} />
                  <Text style={styles.placeName}>
                    {item.name} : {item.distanceText}
                  </Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.mapBox}>
              {Platform.OS === "web" ? (
                <Text>Map is available on mobile only</Text>
              ) : (
                <MapScreen />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyDetailsScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    // padding: 16,
  },
  image: {
    width: "100%",
    height: 220,
    paddingHorizontal: 5,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
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
  gallery: {
    marginVertical: 10,
  },

  galleryText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  galleryItem: {
    width: 260,
    height: 180,
    marginRight: 18,
    borderRadius: 12,
    overflow: "hidden", // IMPORTANT for rounded overlay
  },

  galleryImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(53, 53, 53, 0.75)", // light background
    borderRadius: 8,
  },

  overlayImageText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize",
  },
  aboutUs: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
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
    marginVertical: 8,
  },

  placeName: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
    fontWeight: 500,
  },
  mapBox: {
    height: 180,
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
});
