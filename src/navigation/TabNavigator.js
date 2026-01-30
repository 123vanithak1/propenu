// src/navigation/TabNavigator.js
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, Text, StyleSheet, View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import ShortListedScreen from "../screens/ShortListedScreen/ShortListedScreen";
import InsightScreen from "../screens/Insights/InsightScreen";
import {
  Logo,
  LocationIcon,
  TabBarHome,
  TabBarProfile,
  TabBarFavourite,
  TabBarDomain,
} from "../../assets/svg/Logo";
import useCity from "../components/CustomHooks/useCity";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCity, locations, selectCity } = useCity();
  const [openState, setOpenState] = useState(null);
    const insets = useSafeAreaInsets();

  const handleCity = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (item) => {
    console.log("Selected city: ", item);
    selectCity(item);
    setIsOpen(false); 
  };

  const popularCities = locations.filter(
    (loc) => loc.category?.toLowerCase() === "popular",
  );
  const groupedByState = locations.reduce((acc, loc) => {
    if (!acc[loc.state]) {
      acc[loc.state] = [];
    }

    acc[loc.state].push(loc);
    return acc;
  }, {});

  const renderMenuButton = (navigation) => (
    <View style={styles.locationBar}>
      <Pressable onPress={navigation.openDrawer} hitSlop={10}>
        <MaterialIcons name="menu" size={26} color="#000" />
      </Pressable>

      <Pressable style={styles.select} onPress={handleCity}>
        <LocationIcon width={20} height={20} />
        <Text> {selectedCity?.city ?? "Select City"}</Text>
        {isOpen ? (
          <AntDesign name="up" size={10} color="black" />
        ) : (
          <AntDesign name="down" size={10} color="black" />
        )}
        {isOpen && (
          <Pressable style={styles.dropdownWrapper}>
            <View style={styles.selectCitySpace}>
              <Text style={styles.stateTitle}>Popular Cities</Text>

              {popularCities.map((item) => (
                <Pressable
                  key={item._id || item.city}
                  onPress={() => {
                    onSelect(item);
                  }}
                  style={styles.cityItem}
                >
                  <Text style={styles.cityText}>{item.city}</Text>
                </Pressable>
              ))}

              {Object.entries(groupedByState).map(([stateName, cities]) => {
                const isStateOpen = openState === stateName;

                return (
                  <View key={stateName} style={styles.stateBlock}>
                    {/* STATE HEADER */}
                    <Pressable
                      onPress={() =>
                        setOpenState(isStateOpen ? null : stateName)
                      }
                      style={styles.stateHeader}
                    >
                      <Text style={styles.stateTitle}>{stateName}</Text>
                      <AntDesign
                        name={isStateOpen ? "minus" : "plus"}
                        size={10}
                      />
                    </Pressable>

                    {/* CITIES */}
                    {isStateOpen &&
                      cities.map((c) => (
                        <Pressable
                          key={c._id}
                          onPress={() => {
                            onSelect(c);
                            setIsOpen(false); 
                          }}
                          style={styles.cityItem}
                        >
                          <Text style={styles.cityText}>{c.city}</Text>
                        </Pressable>
                      ))}
                  </View>
                );
              })}
            </View>
          </Pressable>
        )}
      </Pressable>
    </View>
  );

  const renderPostPropertyButton = (navigation) => (
    <Pressable
      onPress={() => navigation.navigate("PostProperty")}
      style={styles.postBtn}
    >
      <Text style={styles.postText}>Post Property</Text>
      <Text style={styles.freeBadge}>Free</Text>
    </Pressable>
  );

  const getTabIcon = (routeName, focused) => {
    const color = focused ? "white" : "#27AE60";

    const icons = {
      Home: TabBarHome,
      Insights: TabBarDomain,
      ShortListed: TabBarFavourite,
      Profile: TabBarProfile,
    };

    const IconComponent = icons[routeName];

    return <IconComponent width={24} height={24} color={color} />;
  };
  return (
 
      <Tab.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitle: () => null,

          //  REMOVE HEADER SHADOW / ELEVATION
          headerStyle: {
            elevation: 0, // Android
            shadowOpacity: 0, // iOS
            borderBottomWidth: 0,
          },

          headerLeft: () => renderMenuButton(navigation),
          headerLeftContainerStyle: styles.headerLeft,

          headerRight: () => (
            <View style={styles.headerRight}>
              {renderPostPropertyButton(navigation)}
            </View>
          ),

          tabBarShowLabel: false,

           tabBarStyle: [
          styles.tabBar,
          {
           bottom: insets.bottom +5,
          },
        ],

          //  REMOVE TAB BAR SHADOW / ELEVATION
          // tabBarStyle: styles.tabBar,

          tabBarItemStyle: styles.tabItem,

          tabBarIcon: ({ focused }) => (
            <View
              style={[styles.tabIconContainer, focused && styles.tabIconActive]}
            >
              {getTabIcon(route.name, focused, "#27AE60")}
              {focused && (
                <Text style={styles.tabActiveLabel}>{route.name}</Text>
              )}
            </View>
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Insights" component={InsightScreen} />
        <Tab.Screen name="ShortListed" component={ShortListedScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 15,
  },

  dropdownWrapper: {
    position: "absolute",
    top: 35,
    zIndex: 3,
    elevation: 3,
  },

  selectCitySpace: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  locationBar: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    zIndex: 3,
    elevation: 3, // 👈 ANDROID FIX
  },

  select: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },

  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#27AE60",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },

  postText: {
    color: "#27AE60",
    fontSize: 13,
    fontWeight: "500",
  },
  stateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 5,
  },

  arrow: {
    fontSize: 14,
    paddingLeft: 10,
  },

  stateBlock: {
    width: "100%",
    marginTop: 12,
  },
  stateTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
    // marginTop: 10,
  },
  cityItem: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    // alignItems: "center",
  },
  cityText: {
    fontSize: 12,
    color: "#000",
  },

  freeBadge: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 4,
    borderRadius: 3,
    color: "#fff",
    fontSize: 12,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  tabIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 34,
    paddingHorizontal: 2,
    minWidth: 92, // ✅ prevents wrapping / clipping
    borderRadius: 20,
    paddingTop: 2,
  },

  tabIconActive: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27AE60",
    paddingHorizontal: 2,
  },

  tabActiveLabel: {
    // marginLeft: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "white",
    numberOfLines: 1,
  },
  tabBar: {
    height: 50,
    backgroundColor: "#fff",
    position: "absolute",
    left: 5,
    right: 5,
    // bottom: 20,
    borderRadius: 30,
    // elevation: 0,
    // shadowOpacity: 0,
    // shadowColor: "transparent",
    borderTopWidth: 0,
    paddingBottom: 10,
    paddingTop: 6,
  },
});
