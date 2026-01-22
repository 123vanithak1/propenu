import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ResidentialCard from "./Cards/ResidentialCard";
import CommercialCard from "./Cards/CommercialCard";
import LandCard from "./Cards/LandCard";
import AgriculturalCard from "./Cards/AgriculturalCard";

import { apiService } from "../../services/apiService";

const PropertyListScreen = ({ route }) => {
  const { id, title } = route.params;

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.category_search({
        category: title,
      });
      setDetails(Array.isArray(result) ? result : []);
    } catch (error) {
      console.log("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title]);

  const renderPropertyCard = useCallback(
    ({ item }) => {
      switch (id) {
        case "residential":
          return <ResidentialCard item={item} />;
        case "commercial":
          return <CommercialCard item={item} />;
        case "land":
          return <LandCard item={item} />;
        case "agricultural":
          return <AgriculturalCard item={item} />;
        default:
          return <Text>No card found</Text>;
      }
    },
    [id],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading... </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {details.length === 0 && (
        <View style={styles.loadingContainer}>
          <Text style={styles.empty}>No properties available.</Text>
        </View>
      )}

      <FlatList
        data={details}
        keyExtractor={(item, index) => String(item.id || item._id || index)}
        renderItem={renderPropertyCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
});
