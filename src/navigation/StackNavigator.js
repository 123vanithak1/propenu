import React, { useState, useEffect } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostProperty from "../screens/PostPropertyScreen/PostProperty";
import PropertyDetailsScreen from "../screens/PropertyDetails/PropertyDetailsScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DrawerNavigator from "./DrawerNavigator";
import Entypo from "@expo/vector-icons/Entypo";
import PropertyListScreen from "../screens/PropertyListScreen/PropertyListScreen";
import MoreResidentialDetails from "../screens/PropertyListScreen/MoreDetails/MoreResidentialDetails";
import CategoryFilterScreen from "../screens/SearchFilter/CategoryFilterScreen";
import SettingsScreen from "../screens/Account/SettingsScreen";
import LoginModal from "../auth/LoginModal";
import CreateLogin from "../auth/CreateLogin";
import OTPLoginModal from "../auth/OTPLoginScreen";
import MoreCommercialDetails from "../screens/PropertyListScreen/MoreDetails/MoreCommercialDetails";
import MoreLandDetails from "../screens/PropertyListScreen/MoreDetails/MoreLandDetails";
import MoreAgriculturalDetails from "../screens/PropertyListScreen/MoreDetails/MoreAgriculturalDetails";
import ContactedProperties from "../screens/Account/ContactedProperties";
import useCity from "../components/CustomHooks/useCity";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LocationIcon } from "../../assets/svg/Logo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const navigation = useNavigation();
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
  console.log("popular :", popularCities);

  const renderMenuButton = (navigation) => (
    <View style={styles.locationBar}>
      <Pressable onPress={navigation.openDrawer} hitSlop={10}>
        <MaterialIcons name="menu" size={26} color="#000" />
      </Pressable>

      {/* <Pressable style={styles.select} onPress={handleCity}>
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
      </Pressable> */}
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
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitle: () => null,

        headerShadowVisible: false,

        headerStyle: {
          elevation: 0,
          shadowColor: "transparent",
          shadowOpacity: 0,
          borderBottomWidth: 0,
          backgroundColor: "#fff",
        },

        headerLeft: () => renderMenuButton(navigation),
        headerLeftContainerStyle: styles.headerLeft,

        headerRight: () => (
          <View style={styles.headerRight}>
            {renderPostPropertyButton(navigation)}
          </View>
        ),
      })}
    >
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PostProperty"
        component={PostProperty}
        options={{
          headerBackVisible: true,
          headerStyle: {
            elevation: 0, 
            shadowColor: "transparent", 
            borderBottomWidth: 0,
          },
          headerLeft: () => null,
          headerTitle: () => (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Post Your Property
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Sell or rent your property
              </Text>
            </View>
          ),
          headerRight: () => null,
          // headerRight: ({ navigation }) => (
          //   <Pressable
          //     onPress={() => navigation.navigate("Drawer")}
          //     hitSlop={10}
          //     style={{ marginRight: 16 }}
          //   >
          //     <Entypo name="cross" size={24} color="#363636ff" />
          //   </Pressable>
          // ),
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginModal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateLogin"
        component={CreateLogin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTPLogin"
        component={OTPLoginModal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PropertyList"
        component={PropertyListScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="MoreResidentialDetails"
        component={MoreResidentialDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreCommercialDetails"
        component={MoreCommercialDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreLandDetails"
        component={MoreLandDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreAgriculturalDetails"
        component={MoreAgriculturalDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryFilter"
        component={CategoryFilterScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        // options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactedProperties"
        component={ContactedProperties}
        // options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 15,
  },

  dropdownWrapper: {
    position: "absolute",
    top: 35,
    zIndex: 1,
    elevation: 10,
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
});
