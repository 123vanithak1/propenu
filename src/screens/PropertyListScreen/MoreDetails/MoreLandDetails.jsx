import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
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
import { AreaIcon, BedIcon, PhoneIcon, ImageListIcon  } from "../../../../assets/svg/Logo";
import { ToastSuccess, ToastInfo } from "../../../utils/Toast";

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

  const handleContactOwner = async () => {
    const userData = await getItem("user");
    if (!userData || !userData.user) {
      ToastInfo("User not authenticated");
    } else ToastSuccess("We Will contact you shortly");
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          height={height * 0.5}
          width={width}
        />

        {/* PRICE + TITLE */}
        <View style={styles.header}>
          <Text style={styles.title}>{details?.title}</Text>
          <Text style={styles.price}>{formatINR(details?.price)}</Text>
        </View>

        {/* META INFO */}
        <View style={styles.metaRow}>
          <MetaItem
            Icon={<AreaIcon width={24} height={24} />}
            label="Area"
            value={`${details?.builtUpArea} sqft`}
          />
          <MetaItem
            Icon={<BedIcon width={24} height={24} />}
            label="BHK"
            value={`${details?.bhk}`}
          />
          {details?.bathrooms !== undefined && (
            <MetaItem
              Icon={<MaterialIcons name="bathtub" size={23} color="#8BEAB2" />}
              label="Bath"
              value={`${details.bathrooms}`}
            />
          )}
          <MetaItem
            Icon={<MaterialIcons name="balcony" size={23} color="#8BEAB2" />}
            label="Balcony"
            value={`${details?.balconies}`}
          />
        </View>

        {/* DETAILS */}
        <Section title="More Details">
          <DetailRow label="Furnishing" value={details?.furnishing} />
          <DetailRow label="Facing" value={details?.facing} />
          <DetailRow
            label="Floor"
            value={`${details?.floorNumber}/${details?.totalFloors}`}
          />
          <DetailRow label="Kitchen Type" value={details?.kitchenType} />
          <DetailRow
            label="Transaction Type"
            value={details?.transactionType}
          />
          <DetailRow
            label="Property Ownership"
            value={details?.listingSource}
          />
          <DetailRow label="Flooring" value={details?.flooringType} />
        </Section>

        {/* AMENITIES */}
        <Section title="Amenities">
          {details?.amenities?.length ? (
            <View style={styles.amenities}>
              {details?.amenities.map((item) => (
                <View key={item.key} style={styles.amenityItem}>
                  <Text>{item.title}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text>No amenities available</Text>
          )}
        </Section>

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
          <PhoneIcon width={18} height={18} color="white"/>
          <Text style={styles.contactText}>Contact</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: { padding: 16 },
  price: { fontSize: 16, fontWeight: "700", color: "#27AE60", marginTop: 7 },
  title: { fontSize: 16, fontWeight: "600", marginTop: 4 },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#ebebebff",
    borderRadius: 8,
  },

  metaItem: { alignItems: "center" },
  metaLabel: { fontSize: 12, color: "#777" },
  metaValue: { fontSize: 14, fontWeight: "600" },

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
