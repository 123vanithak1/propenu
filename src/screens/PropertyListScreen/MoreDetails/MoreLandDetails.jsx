import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import AutoImageSlider from "../../../components/ui/AutoImageSlider";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../../../services/apiService";
import formatINR from "../../../utils/FormatINR";
import useDimensions from "../../../components/CustomHooks/UseDimension";
import Entypo from "@expo/vector-icons/Entypo";
import { getItem } from "../../../utils/Storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  AreaIcon,
  BedIcon,
  PhoneIcon,
  ImageListIcon,
  LocationIcon,
} from "../../../../assets/svg/Logo";
import { ToastSuccess, ToastInfo } from "../../../utils/Toast";
import AmenitiesWithModal from "../../PropertyDetails/detailProperty/AmenitiesWithModal";
import NearByLocations from "../../PropertyDetails/detailProperty/NearByLocation";

const MoreLandDetails = ({ route }) => {
  const { width, height } = useDimensions();
  const { id } = route.params;

  //   const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiService.land_category_search(id);
      const data = res?.[0]?.data;
      if (!data) {
        ToastInfo("Property details not found");
        return;
      }
      setDetails(data);
    } catch (error) {
      console.log("Error when getting more details :", error);
    } finally {
      setLoading(false);
    }
  };
  const handleContactOwner = async()=> {
    const storedUser = await getItem("user");
  
    if (!storedUser) {
      ToastInfo("User not authenticated");
      return;
    }
  
    const userData = JSON.parse(storedUser);
  
    if (!userData?.name) {
      ToastInfo("User not authenticated");
    } else ToastSuccess("We will contact you shortly");
  };

  useEffect(() => {
    fetchData();
  }, []);

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading... </Text>
        </SafeAreaView>
      );
    }

  const MetaItem = ({ Icon, label, value }) => (
    <View style={styles.metaItem}>
      {Icon}
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE GALLERY */}
        <AutoImageSlider
          images={details?.gallery?.map((img) => ({ uri: img.url })) || []}
          height={height * 0.3}
          width={width}
        />

        {/* PRICE + TITLE */}
        <View style={styles.header}>
          <Text style={styles.title}>{details?.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.price}>{formatINR(details?.price)}</Text>
            <Text style={styles.pricePer}>
              {" "}
              / ₹ {details?.pricePerSqft} per sq.ft.
            </Text>
          </View>
        </View>
        {/* META INFO */}
        <View style={styles.metaRow}>
          <View style={styles.rowcontainer}>
            <MetaItem label="Area" value={`${details?.plotArea ?? "—"} sqft`} />
            <MetaItem label="Facing" value={details?.facing || "East"} />
          </View>
          <View style={styles.rowcontainer}>
            <MetaItem label="Property Type" value={details?.propertyType} />
            <MetaItem label="Fencing" value="Available" />
          </View>
          <View style={styles.rowcontainer}>
            <MetaItem label="Availability Status" value="Ready To Construct" />
            <MetaItem
              label="Approved By"
              value={details?.approvedByAuthority[0]}
            />
          </View>
        </View>

        {/* DETAILS */}
        <Section title="More Details">
          <DetailRow
            label="Water Connection"
            value={details?.waterConnection ? "Provided" : "Not Provided"}
          />
          <DetailRow
            label="Property Ownership"
            value={details?.listingSource}
          />
          <DetailRow label="Land Name" value={details?.landName} />
          <DetailRow label="Land Zone" value={details?.landUseZone} />
          <DetailRow
            label="Electricity Connection"
            value={
              details?.electricityConnection ? "Connected" : "Not Connected"
            }
          />
        </Section>

        <AmenitiesWithModal amenities={details?.amenities} />

        {details?.nearbyPlaces && (
          <View style={styles.gallery}>
            <Text style={styles.title}>Location & Landmarks</Text>

            <FlatList
              data={details?.nearbyPlaces}
              horizontal
              keyExtractor={(item, index) => `${item.name}-${index}`}
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
                <NearByLocations nearbyPlaces={details?.nearbyPlaces} location={details?.location}/>
              )}
            </View>
          </View>
        )}

        {/* ADDRESS */}
        <Section title="Address">
          <Text style={styles.text}>{details?.address}</Text>
        </Section>

        {/* DESCRIPTION */}
        <Section title="Description">
          <Text style={styles.text}>{details?.description}</Text>
        </Section>

        {/* CONTACT OWNER */}
        <Pressable style={styles.contactBtn} onPress={handleContactOwner}>
          <PhoneIcon width={18} height={18} color="white" />
          <Text style={styles.contactText}>Contact</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
    loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: { padding: 16, gap: 6 },
  price: { fontSize: 16, fontWeight: "700", color: "#27AE60" },
  title: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  pricePer: { fontSize: 16, fontWeight: "500" },
  metaRow: {
    marginHorizontal: 10,
    backgroundColor: "#ebebebff",
    borderRadius: 8,
    paddingVertical: 15,

    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowcontainer: {
    gap: 13,
    paddingHorizontal: 18,
  },

  // metaItem: { alignItems: "center" },
  metaLabel: { fontSize: 12, color: "#777" },
  metaValue: { fontSize: 13, fontWeight: "500" },

  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },

  text: { fontSize: 14, color: "#555", lineHeight: 20 },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  //   detailLabel: { color: "#777" },
  detailValue: { fontWeight: "500" },
  placeRow: {
    flexDirection: "row",
    paddingHorizontal: 5,
    alignItems: "center",
    gap: 4,
    // justifyContent: "space-between",
    // paddingVertical: 8,
    // borderBottomWidth: 0.5,
    // borderColor: "#eee",
    marginRight: 17,
    marginVertical: 8,
  },

  placeName: {
    fontSize: 13,
    color: "#333",
    flexShrink: 1,
    fontWeight: 500,
  },
  amenities: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  amenityItem: {
    backgroundColor: "#EAF8F0",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
  },

  gallery: {
    marginHorizontal: 12,
  },

  mapBox: {
    height: 210,
    marginHorizontal: 2,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  contactBtn: {
    flexDirection: "row",
    margin: 16,
    padding: 14,
    borderRadius: 8,
    paddingHorizontal: 30,
    backgroundColor: "#27AE60",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  contactText: {
    color: "#fff",
    fontWeight: "600",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default MoreLandDetails;
