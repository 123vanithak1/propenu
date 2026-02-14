import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { userServices } from "../../services/userServices";
import * as Keychain from "react-native-keychain";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ResidentialCard from "../PropertyListScreen/Cards/ResidentialCard";
import LandCard from "../PropertyListScreen/Cards/LandCard";
import AgriculturalCard from "../PropertyListScreen/Cards/AgriculturalCard";
import CommercialCard from "../PropertyListScreen/Cards/CommercialCard";
import { useNavigation } from "@react-navigation/native";
import defaultImage from "../../../assets/defaultImage.png";
import { LocationIcon } from "../../../assets/svg/Logo";
import formatINR from "../../utils/FormatINR";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const TAB_KEY_MAP = {
  Residential: "residential",
  Commercial: "commercial",
  Plot: "land",
  Agriculture: "agricultural",
};

const categories = ["Residential", "Commercial", "Plot", "Agriculture"];

const MyProperties = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Residential");
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("sale");
  const [status, setStatus] = useState("All");
  const [menuVisible, setMenuVisible] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["myProperties"],
    queryFn: userServices.getMyProperties,
  });

  /* ================= FILTER ================= */

  const filteredProperties = useMemo(() => {
    if (!data) return [];

    let list = data[TAB_KEY_MAP[activeTab]] ?? [];

    if (listingType) {
      list = list.filter((p) => p.listingType === listingType);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q),
      );
    }

    if (status !== "All") {
      list = list.filter((p) => p.status === status);
    }

    return list;
  }, [data, activeTab, search, status, listingType]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading your properties…</Text>
      </View>
    );
  }

  const handleEdit = () => {
    console.log("EDITTTTTTTTTTTTTTT");
  };

  /* ================= RENDER CARD ================= */

  const renderItem = ({ item }) => {
    const imageSource = item?.gallery?.[0]?.url
      ? { uri: item.gallery[0].url }
      : defaultImage;

    return (
      <Pressable
        style={styles.card}
        onPress={() =>{
          navigation.navigate("PropertyDetails", { id: item?._id })

        }
        }
      >
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.menu}>{item.status}</Text>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title}
          </Text>
          <View style={styles.location}>
            <LocationIcon width={17} height={17} color="green" />
            <Text style={styles.address} numberOfLines={1}>
              {item?.address}
            </Text>
          </View>
          <View style={styles.hrLine} />
          <View style={styles.row}>
            <Text style={styles.price}>
              {item.price ? formatINR(item.price) : "—"}
            </Text>
            <Text style={styles.price}>
              {item.carpetArea ? `${item.carpetArea} sq.ft.` : "—"}
            </Text>

            {/* {item.status && (
              <Text style={[styles.badge, getStatusStyle(item.status)]}>
                {item.status}
              </Text>
            )} */}
          </View>
          <View style={styles.hrLine} />
          <View>
            <Text style={[styles.price, { paddingTop: 7 }]}>
              Property ID :{" "}
              <Text style={styles.value}>
                {item._id.slice(-8).toUpperCase()}
              </Text>
            </Text>
            <Text style={[styles.price, { paddingTop: 7 }]}>
              Posted On:{" "}
              <Text style={styles.value}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </Text>
            </Text>
          </View>
          <View style={[styles.hrLine, { marginTop: 10 }]} />
          <View style={styles.meta}>
            <Text>
              Views:{" "}
              <Text style={styles.value}>{item.meta?.views ?? 0}</Text>{" "}
            </Text>
            <Text>
              Enquiries:{" "}
              <Text style={styles.value}>{item.meta?.enquiries ?? 0}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable style={styles.editOption} onPress={handleEdit}>
            <MaterialIcons name="mode-edit" size={18} color="white" />
            <Text style={{ color: "white", fontWeight: 600 }}>Edit</Text>
          </Pressable>

          <Pressable style={styles.responseOption}>
            <Ionicons name="chatbox-outline" size={18} color="black" />
            <Text style={{ fontSize:14, fontWeight: 500 }}>Responses</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.tabs}>
        {categories.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={
          <TextInput
            placeholder="Enter locality"
            value={search}
            onChangeText={setSearch}
            style={styles.search}
            placeholderTextColor="gray"
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No properties found in {activeTab}</Text>
          </View>
        }
      />
    </View>
  );
};
export default MyProperties;

/* ================= STATUS COLOR ================= */

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":
      return { backgroundColor: "#DCFCE7", color: "#27AE60" };
    case "Draft":
      return { backgroundColor: "#FEF9C3", color: "#a16207" };
    default:
      return { backgroundColor: "#eee", color: "#555" };
  }
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabText: { color: "#000", fontSize: 14, fontWeight: 500 },
  activeTab: {
    color: "#27AE60",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#27AE60",
    paddingBottom: 5,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    // gap: 2,
  },

  menu: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems:"center",
    backgroundColor: "#fff",
    color:"green",
    fontWeight:500,
    paddingVertical:3,
    paddingHorizontal:10,
    borderRadius: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 6,
    fontSize: 14,
  },

  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    margin: 12,
    padding: 8,
    borderRadius: 6,
  },

  count: { marginHorizontal: 12, marginBottom: 10, color: "#666" },

  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    overflow: "hidden",
    padding: 10,
    elevation: 2,
  },
  hrLine: {
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
    marginVertical: 5,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    position: "relative",
  },

  content: { flex: 1, paddingHorizontal: 10, paddingVertical: 15 },

  title: { fontWeight: "bold", fontSize: 15 },
  address: { color: "gray", width: "93%" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },

  price: { fontSize: 13, fontWeight: 400, color: "#000" },
  value: {
    color: "#000",
    fontSize: 13,
    fontWeight: 500,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },

  meta: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:6
  },
  editOption: {
    flexDirection: "row",
    backgroundColor: "#27AE60",
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  responseOption: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
});
