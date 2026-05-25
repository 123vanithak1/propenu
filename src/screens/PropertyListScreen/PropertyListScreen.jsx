import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import useCity from "../../components/CustomHooks/useCity";
import ResidentialCard from "./Cards/ResidentialCard";
import CommercialCard from "./Cards/CommercialCard";
import LandCard from "./Cards/LandCard";
import AgriculturalCard from "./Cards/AgriculturalCard";
import ProjectCard from "./Cards/ProjectCard";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { apiService } from "../../services/apiService";
import SearchBar from "../../components/ui/SearchBar";
import { useAppSelector } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { normalizeCity, normalizeState } from "../../utils/locationNormalizer";

const PropertyListScreen = ({ navigation }) => {
  // const { id, title } = route.params;
  const insets = useSafeAreaInsets();
  const { category } = useAppSelector((s) => s.filters);
  const filtersState = useSelector((state) => state.filters);
  const { residential, commercial, land, agricultural, listingTypeValue } = filtersState;

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCity } = useCity();
  const [value, setValue] = useState("");

  const buildSearchParams = (category, filters) => {
    const params = { category };

    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          params[key] = Array.isArray(value) ? value.join(",") : value;
        }
      });
    }

    return params;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Resolve category-specific filters
      const filters =
        category === "Residential"
          ? residential
          : category === "Commercial"
            ? commercial
            : category === "Land"
              ? land
              : category === "Agricultural"
                ? agricultural
                : {};

      // 2. Normalize city and state from the selected city object
      const rawCity  = selectedCity?.city  ?? "";
      const rawState = selectedCity?.state ?? "";
      const city     = normalizeCity(rawCity);    // trims + title-cases + alias resolves
      const state    = normalizeState(rawState);  // fuzzy matches to canonical Indian state

      // 3. Build params — omit empty/null values
      const params = buildSearchParams(category, {
        ...filters,
        listingType: listingTypeValue,  // "sale" or "rent"
        ...(city  ? { city }  : {}),
        ...(state ? { state } : {}),
      });

      console.log("Search Params :", params);

      const result = await apiService.category_search(params);
      console.log("Result :", result);
      setDetails(Array.isArray(result) ? result : []);
    } catch (error) {
      console.log("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = details?.[0]?.__meta?.total;
  const properties = details?.filter(item => !item.__meta);

  useEffect(() => {
    fetchData();
  }, [category, selectedCity, residential, commercial, land, agricultural, listingTypeValue]);


  const renderPropertyCard = useCallback(
    ({ item }) => {
      if (item?.type === "FeaturedProject") {
        return <ProjectCard item={item} />;
      }
      switch (category.toLowerCase()) {
        case "residential":
          return <ResidentialCard item={item} />;
        case "commercial":
          return <CommercialCard item={item} />;
        case "land":
          return <LandCard item={item} />;
        case "agricultural":
          return <AgriculturalCard item={item} />;
        default:
          return null;
      }
    },
    [category],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading... </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Pressable onPress={() => navigation.navigate("CategoryFilter")}>
        <View pointerEvents="none" style={styles.search}>
          <EvilIcons
            style={{ width: 20 }}
            name="search"
            size={24}
            color="gray"
          />
          <TextInput
            style={styles.input}
            value={value}
            placeholder={`Search in ${selectedCity?.city ?? "City"} `}
            placeholderTextColor="gray"
            onChange={setValue}
          />
        </View>
      </Pressable>

      {total === 0 && (
        <View style={styles.loadingContainer}>
          <Text style={styles.empty}>No properties available.</Text>
        </View>
      )}

      {total > 0 && (
        <Text style={styles.lengthText} numberOfLines={1}>
          {total} Properties for {listingTypeValue}{" "}
          {selectedCity?.city ? `in ${selectedCity.city}` : ""}
        </Text>
      )}
      {total > 0 && (
        <FlatList
          data={properties}
          keyExtractor={(item, index) => String(item.id || item._id || index)}
          renderItem={renderPropertyCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default PropertyListScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    //  backgroundColor: "rgba(243, 255, 245, 0.5)",
    backgroundColor: "#fff",
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  list: {
    paddingBottom: 20,
  },
  search: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ADADAD",
    borderRadius: 10,
    // paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: "white",
    marginBottom: 8,
  },
  input: {
    // width: "100%",
    borderWidth: 0,
    // paddingLeft: 10,
    paddingVertical: 7,
    borderColor: "red",
  },
  lengthText: {
    fontSize: 15,
    fontWeight: 500,
    paddingVertical: 10,
    paddingLeft: 5,
  },
});
