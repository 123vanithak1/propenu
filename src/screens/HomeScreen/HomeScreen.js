import {
  View,
  Image,
  FlatList,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import SearchBar from "../../components/ui/SearchBar";
import useDimensions from "../../components/CustomHooks/UseDimension";
import HomePage from "../../../assets/HomePage.png";
import CardHome from "./CardHome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FeaturedCard from "../../components/FeaturedCard/FeatureCard";
import HighLightProjects from "../../components/HighlightProjects/HighLightProjects";
import OwnerProperties from "../../components/OwnersProperties/OwnerProperties";
import Button from "../../components/Button";
import AgentProperties from "../../components/Agent/AgentProperties";
import ServiceHub from "../../components/ServiceHub/ServiceHub";
import {
  BellIcon,
  Commercial,
  Residential,
  Land,
  Agriculture,
} from "../../../assets/svg/Logo";

const HomeScreen = ({ navigation }) => {
  const { width, height, isLandscape } = useDimensions();

  const HOME_CARDS = [
    {
      id: "residential",
      title: "Residential",
      icon: <Residential width={24} height={24} />,
      onPress: () => console.log("Residential pressed"),
    },
    {
      id: "commercial",
      title: "Commercial",
      icon: <Commercial width={24} height={24} />,
      onPress: () => console.log("Commercial pressed"),
    },
    {
      id: "land",
      title: "Plot/Land",
      icon: <Land width={24} height={24} />,
      onPress: () => console.log("Land pressed"),
    },
    {
      id: "agriculture",
      title: "Agriculture",
      icon: <Agriculture width={24} height={24} />,
      onPress: () => console.log("Agriculture pressed"),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.searchWrapper}>
        <SearchBar placeholder='Search "Hyderabad" '  value="" />
        <View style={styles.bellIcon}>
          <BellIcon width={18} height={18} />
        </View>
      </View> 
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {/* */}
      <View style={styles.imageContainer}>
        <Image
          source={HomePage}
          style={[styles.homePageImage, { height: height * 0.2 }]}
        />
      </View>

      <View style={{ marginTop: 20, marginHorizontal: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Get Started with
        </Text>
        {/*<Text style={{ fontSize: 12, color: "#6b6965ff" }}>
          Explore real estate options 
           in top cities
        </Text> */}
        <FlatList
          data={HOME_CARDS}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{ paddingHorizontal: 2 }}
          renderItem={({ item }) => (
            <CardHome
              title={item.title}
              icon={item.icon}
              onPress={item.onPress}
            />
          )}
        />
      </View>
      <FeaturedCard />
      <HighLightProjects />
      <OwnerProperties />
      <AgentProperties />
      <ServiceHub />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  bellIcon: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ADADAD",
  },
  imageContainer: {
    paddingTop:5,
    paddingHorizontal: 10,
  },

  homePageImage: {
    width: "100%",
    borderRadius: 10,
  },
  // homePageImage: {
  //   width: "97%",
  //   // resizeMode: "cover",
  //   borderRadius: 10,
  //   marginHorizontal: 6,
  //   // opacity: 0.8
  // },
});

export default HomeScreen;
