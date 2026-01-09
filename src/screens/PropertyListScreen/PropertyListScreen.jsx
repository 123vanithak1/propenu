import React, { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ResidentialCard from "./Cards/ResidentialCard";
import CommercialCard from "./Cards/CommercialCard";
import LandCard from "./Cards/LandCard";
import AgriculturalCard from "./Cards/AgriculturalCard";

import { SafeAreaView } from "react-native-safe-area-context";

const PropertyListScreen = ({ route, navigation }) => {
  const { id, items } = route.params;
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
    [id]
  );

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 && (
        <Text style={styles.empty}>No properties found.</Text>
      )}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPropertyCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default PropertyListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  loading: {
    textAlign: "center",
    marginVertical: 12,
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
