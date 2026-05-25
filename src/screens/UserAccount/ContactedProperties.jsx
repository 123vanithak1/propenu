import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { userServices } from "../../services/userServices";
import { LocationIcon } from "../../../assets/svg/Logo";
import formatINR from "../../utils/FormatINR";
import { useQuery } from "@tanstack/react-query";

const ORDERED_CATEGORIES = [
  { label: "Residential", value: "residentials" },
  { label: "Commercial", value: "commercials" },
  { label: "Plots", value: "landplots" },
  { label: "Agricultural", value: "agriculturals" },
  { label: "Projects", value: "featuredprojects" },
];

const normalizeCategory = (type) => {
  if (!type) return null;
  const normalized = type.toLowerCase().trim();
  if (normalized.includes("residential"))
    return { label: "Residential", value: "residentials" };
  if (normalized.includes("commercial"))
    return { label: "Commercial", value: "commercials" };
  if (normalized.includes("land") || normalized.includes("plot"))
    return { label: "Plots", value: "landplots" };
  if (normalized.includes("agricultural"))
    return { label: "Agricultural", value: "agriculturals" };
  if (normalized.includes("project") || normalized.includes("featured"))
    return { label: "Projects", value: "featuredprojects" };
  return { label: type, value: normalized };
};

const ContactedProperties = () => {
  const [selectedTab, setSelectedTab] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["contactedProperties"],
    queryFn: userServices.getContactedProperties,
  });

  const contactedProperties = data?.properties ?? [];

  const activeCategories = useMemo(() => {
    const seen = new Set();
    contactedProperties.forEach((item) => {
      const cat = normalizeCategory(item?.propertyType);
      if (cat) {
        seen.add(cat.value);
      }
    });
    return ORDERED_CATEGORIES.filter((cat) => seen.has(cat.value));
  }, [contactedProperties]);

  useEffect(() => {
    if (activeCategories.length > 0) {
      const exists = activeCategories.some((cat) => cat.value === selectedTab);
      if (!exists) {
        setSelectedTab(activeCategories[0].value);
      }
    }
  }, [activeCategories, selectedTab]);

  const filteredProperties = useMemo(() => {
    return contactedProperties.filter(
      (item) =>
        item?.propertyType &&
        normalizeCategory(item.propertyType)?.value === selectedTab,
    );
  }, [contactedProperties, selectedTab]);

  const displayProperties = useMemo(() => {
    if (activeCategories.length <= 1) {
      return contactedProperties;
    }
    return filteredProperties;
  }, [activeCategories, contactedProperties, filteredProperties]);

  if (isLoading)
    return <ActivityIndicator size="large" style={{ color: "#27AE60" }} />;
  if (error) return console.log("failed to get contacted properties :", error);

  const PropertyCard = ({ item }) => {
    console.log("item.propetry : ", JSON.stringify(item?.heroImage, null, 2));
    return (
      <View style={styles.propertyCard}>
        {(item?.heroImage || item?.gallery) && (
          <Image
            source={{ uri: item?.heroImage || item?.gallery }}
            style={styles.image}
          />
        )}

        <Text style={styles.sale}>{item.listingType}</Text>

        <View style={styles.content}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.price}>
            <View>
              <View style={styles.locations}>
                <LocationIcon width={14} height={14} />
                <Text style={styles.propertyDetails}>
                  {item.locality}, {item.city}
                </Text>
              </View>
              {item?.owner?.name ? (
                <Text style={styles.ownerName}>
                  Owner : {item?.owner?.name}
                </Text>
              ) : null}
            </View>

            {item?.price ? (
              <Text style={styles.priceText}>{formatINR(item.price)}</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {contactedProperties.length === 0 ? (
        <View style={styles.noContent}>
          <Text style={styles.noContentText}>No properties are contacted.</Text>
        </View>
      ) : (
        <>
          {activeCategories.length > 1 && (
            <>
              <Text style={styles.label}>Property Type</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabsScrollView}
                contentContainerStyle={styles.tabsContainer}
              >
                {activeCategories.map((item) => {
                  const active = selectedTab === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => setSelectedTab(item.value)}
                      style={[styles.chip, active && styles.activeChip]}
                    >
                      <Text
                        style={[styles.tabText, active && styles.activeTabText]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}

          <FlatList
            data={displayProperties}
            keyExtractor={(item) => item.leadId}
            renderItem={({ item }) => <PropertyCard item={item} />}
          />
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 3,
    backgroundColor: "white",
  },
  tabsScrollView: {
    marginTop: 12,
    marginBottom: 8,
    maxHeight: 45,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  activeChip: {
    borderColor: "#27AE60",
  },
  tabText: {
    fontSize: 13,
  },
  activeTabText: {
    borderBottomWidth: 1,
    borderColor: "#27AE60",
    color: "#27AE60",
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 5,
  },
  propertyCard: {
    position: "relative",
    width: "98%",
    backgroundColor: "white",
    alignSelf: "center",
    marginHorizontal: 2,
    borderRadius: 8,
    marginVertical: 12,
    elevation: 2,
    padding: 8,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
  },
  sale: {
    backgroundColor: "#27AE60",
    margin: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: "absolute",
    top: 18,
    left: 18,
    borderRadius: 8,
    color: "white",
  },
  propertyDetails: {
    fontSize: 12,
    color: "#555",
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
    paddingTop: 4,
  },
  image: {
    height: 150,
    padding: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
  },
  noContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noContentText: {
    fontSize: 14,
    color: "gray",
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  ownerName: {
    fontSize: 12,
    marginTop: 5,
  },
  locations: {
    flexDirection: "row",
    gap: 5,
  },
  price: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 14,
    color: "#27AE60",
    fontWeight: 600,
    backgroundColor: "#d7f0e1",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 7,
  },
  label: {
    marginBottom: 8,
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  segmentedControl: {
    marginBottom: 15,
  },
});
export default ContactedProperties;
