import {
  View,
  Image,
  FlatList,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import useDimensions from "../../components/CustomHooks/UseDimension";
import HomePageImage from "../../../assets/HomePageImage.png";
import CardHome from "./CardHome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FeaturedCard from "../../components/FeaturedCard/FeatureCard";
import HighLightProjects from "../../components/HighlightProjects/HighLightProjects";
import OwnerProperties from "../../components/OwnersProperties/OwnerProperties";
import Button from "../../components/Button";
import AgentProperties from "../../components/Agent/AgentProperties";

const HomeScreen = ({ navigation }) => {
  const { width, height, isLandscape } = useDimensions();

  const HOME_CARDS = [
    {
      id: "buy",
      title: "Buy",
      icon: (
        <MaterialCommunityIcons name="home-plus" size={26} color="#27AE60" />
      ),
      onPress: () => console.log("Buy pressed"),
    },
    {
      id: "rent",
      title: "Rent",
      icon: <MaterialIcons name="add-home" size={26} color="#27AE60" />,
      onPress: () => console.log("Rent pressed"),
    },
    {
      id: "residential",
      title: "Residential",
      icon: <MaterialIcons name="add-home" size={26} color="#27AE60" />,
      onPress: () => console.log("Residential pressed"),
    },
    {
      id: "commercial",
      title: "Commercial",
      icon: <MaterialIcons name="add-home" size={26} color="#27AE60" />,
      onPress: () => console.log("Commercial pressed"),
    },
    {
      id: "land",
      title: "Land",
      icon: <MaterialIcons name="add-home" size={26} color="#27AE60" />,
      onPress: () => console.log("Land pressed"),
    },
    {
      id: "agriculture",
      title: "Agriculture",
      icon: <MaterialIcons name="add-home" size={26} color="#27AE60" />,
      onPress: () => console.log("Agriculture pressed"),
    },
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      <Image
        source={HomePageImage}
        style={{
          width: "100%",
          height: height * 0.25,
          resizeMode: "cover",
          // opacity: 0.8,
        }}
      />
      <View style={styles.searchWrapper}>
        <SearchBar />
        <View style={{ marginTop: 20, marginHorizontal: 10, marginBottom: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Get Started with
          </Text>
          <Text style={{ fontSize: 12, color: "#6b6965ff" }}>
            Explore real estate options in top cities
          </Text>
          <FlatList
            data={HOME_CARDS}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
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
        <AgentProperties/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    position: "relative",
    top: -15,
  },
});

export default HomeScreen;
