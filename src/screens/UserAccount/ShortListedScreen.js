import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";

import { userServices } from "../../services/userServices";
import ResidentialCard from "../PropertyListScreen/Cards/ResidentialCard";
import LandCard from "../PropertyListScreen/Cards/LandCard";
import AgriculturalCard from "../PropertyListScreen/Cards/AgriculturalCard";
import CommercialCard from "../PropertyListScreen/Cards/CommercialCard";
import ProjectCard from "../PropertyListScreen/Cards/ProjectCard";
import { useQuery } from "@tanstack/react-query";

const ORDERED_CATEGORIES = [
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Plots", value: "Land" },
  { label: "Agricultural", value: "Agricultural" },
  { label: "Projects", value: "FeaturedProject" },
];

const normalizeCategory = (type) => {
  if (!type) return null;
  const normalized = type.toLowerCase().trim();
  if (normalized.includes("residential"))
    return { label: "Residential", value: "Residential" };
  if (normalized.includes("commercial"))
    return { label: "Commercial", value: "Commercial" };
  if (normalized.includes("land") || normalized.includes("plot"))
    return { label: "Plots", value: "Land" };
  if (normalized.includes("agricultural"))
    return { label: "Agricultural", value: "Agricultural" };
  if (normalized.includes("project") || normalized.includes("featured"))
    return { label: "Projects", value: "FeaturedProject" };
  return null;
};

const ShortListedScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["shortlistedProperties"],
    queryFn: userServices.getShortlistedProperties,
  });

  const likedProperties = data?.data ?? [];

  const activeCategories = useMemo(() => {
    const seen = new Set();
    likedProperties.forEach((item) => {
      const cat = normalizeCategory(item?.propertyType);
      if (cat) {
        seen.add(cat.value);
      }
    });
    return ORDERED_CATEGORIES.filter((cat) => seen.has(cat.value));
  }, [likedProperties]);

  useEffect(() => {
    if (activeCategories.length > 0) {
      const exists = activeCategories.some((cat) => cat.value === selectedTab);
      if (!exists) {
        setSelectedTab(activeCategories[0].value);
      }
    }
  }, [activeCategories, selectedTab]);

  const filteredProperties = useMemo(() => {
    return likedProperties.filter(
      (item) =>
        item?.propertyType &&
        normalizeCategory(item.propertyType)?.value === selectedTab,
    );
  }, [likedProperties, selectedTab]);

  const displayProperties = useMemo(() => {
    if (activeCategories.length <= 1) {
      return likedProperties;
    }
    return filteredProperties;
  }, [activeCategories, likedProperties, filteredProperties]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Failed to load shortlisted properties</Text>
      </View>
    );
  }

  const CARD_COMPONENT = {
    Residential: ResidentialCard,
    Commercial: CommercialCard,
    Land: LandCard,
    Agricultural: AgriculturalCard,
    FeaturedProject: ProjectCard,
  };

  return (
    <View style={styles.mainContainer}>
      {likedProperties.length === 0 ? (
        <View style={styles.noDataText}>
          <Text>Not shortlisted any property</Text>
        </View>
      ) : (
        <>
          {activeCategories.length > 1 && (
            <>
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
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const normalizedVal = normalizeCategory(
                item?.propertyType,
              )?.value;
              const Card = CARD_COMPONENT[normalizedVal];

              if (!Card || !item?.property) return null;

              const propertyWithId = {
                ...item.property,
                id: item.property.id || item.property._id,
                type: item.propertyType || item.property.type,
                gallery: item.property.gallery || item.property.gallerySummary,
              };

              return <Card item={propertyWithId} />;
            }}
          />
        </>
      )}
    </View>
  );
};

export default ShortListedScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  label: {
    marginBottom: 8,
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
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
  noDataText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
