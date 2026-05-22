import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { userServices } from "../../services/userServices";
import { LocationIcon } from "../../../assets/svg/Logo";
import formatINR from "../../utils/FormatINR";
import { useQuery } from "@tanstack/react-query";

const tabTypes = [
  { label: "Plots", value: "landplots" },
  { label: "Projects", value: "featuredprojects" },
];

const ContactedProperties = () => {
  const [selectedTab, setSelectedTab] = useState("landplots");

  const { data, isLoading, error } = useQuery({
    queryKey: ["contactedProperties"],
    queryFn: userServices.getContactedProperties,
  });

  const contactedProperties = data?.properties ?? [];
  const total = data?.total ?? 0;
  // console.log("Properties : ", JSON.stringify(contactedProperties, null, 2));

  if (isLoading)
    return <ActivityIndicator size="large" style={{ color: "#27AE60" }} />;
  if (error) return console.log("failed to get contacted properties :", error);

  const filteredProperties = contactedProperties.filter(
    (item) => item?.propertyType === selectedTab,
  );

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

              <Text style={styles.ownerName}>Owner : {item?.owner?.name}</Text>
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
      {/* <Text style={styles.title}>My Contact Listing</Text>
      <Text style={styles.subTitle}>
        Properties you have contacted ({filteredProperties?.length ?? 0})
      </Text> */}

      <View style={styles.tabsContainer}>
        {tabTypes.map((item) => {
          const active = selectedTab === item.value;
          return (
            <Pressable
              key={item.value}
              onPress={() => setSelectedTab(item.value)}
              style={[styles.chip, active && styles.activeChip]}
            >
              <Text style={[styles.tabText, active && styles.activeTabText]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredProperties?.length > 0 ? (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => {
            console.log("item : ", JSON.stringify(item, null, 2));
            return item.leadId;
          }}
          renderItem={({ item }) => <PropertyCard item={item} />}
        />
      ) : (
        <View style={styles.noContent}>
          <Text>No contacted properties available</Text>
        </View>
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
  tabsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
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
});
export default ContactedProperties;
