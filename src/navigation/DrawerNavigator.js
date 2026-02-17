// src/navigation/DrawerNavigator.js
import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { getItem, clearStorage } from "../utils/Storage";
import Octicons from "@expo/vector-icons/Octicons";
import {
  Logo,
  BellIcon,
  LocationIcon,
  TabBarHome,
  TabBarProfile,
  TabBarFavourite,
  TabBarDomain,
  PhoneIcon,
} from "../../assets/svg/Logo";
import HomeExterior from "../../assets/images/HomeExterior.png";
import HouseSearch from "../../assets/images/HouseSearch.png";
import HouseSell from "../../assets/images/HouseSell.png";
import {
  calling,
  PrivacyPolicy,
  TermsAndConditions,
  ReportIssue,
  SafetyGuide,
  AboutUs,
  ShortList,
  Dollar,
  Leads,
  MyProperties,
} from "../../assets/svg/UserProfile";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { ToastSuccess } from "../utils/Toast";
import * as Keychain from "react-native-keychain";
import { useAuth } from "../context/AuthContext";
import { Image } from "react-native";
const userMenuItems = [
  {
    label: "My Properties",
    route: "MyProperties",
    icon: MyProperties,
  },
  {
    label: "Shortlisted Properties",
    route: "ShortListedProperties",
    icon: ShortList,
  },
  {
    label: "Contacted Properties",
    route: "ContactedProperties",
    icon: calling,
  },
  {
    label: "Membership",
    route: "Membership",
    icon: Dollar,
  },
];

const agentMenuItems = [
  {
    label: "DashBoard   ",
    route: "AgentDashBoard",
    icon: Dollar,
  },
  {
    label: "My Properties",
    route: "MyProperties",
    icon: MyProperties,
  },
  {
    label: "Leads",
    route: "Membership",
    icon: Leads,
  },
  {
    label: "My Plans",
    route: "Membership",
    icon: Dollar,
  },
];

const builderMenuItems = [
  {
    label: "DashBoard   ",
    route: "Membership",
    icon: Dollar,
  },
  {
    label: "My Properties",
    route: "MyProperties",
    icon: MyProperties,
  },
  {
    label: "Leads",
    route: "Membership",
    icon: Leads,
  },
];

const More_Details = [
  {
    label: "About Us",
    route: "ShortListedProperties",
    icon: AboutUs,
  },
  {
    label: "Safety Guide",
    route: "ShortListedProperties",
    icon: SafetyGuide,
  },
  {
    label: "Report an Issue",
    route: "ShortListedProperties",
    icon: ReportIssue,
  },
  {
    label: "Terms & Conditions",
    route: "ShortListedProperties",
    icon: TermsAndConditions,
  },
  {
    label: "Privacy Policy",
    route: "ShortListedProperties",
    icon: PrivacyPolicy,
  },
  {
    label: "Help Line",
    route: "ShortListedProperties",
    icon: calling,
  },
];

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, state }) => {
  const { isLoggedIn, userDetails, refreshAuth } = useAuth();
  console.log("is login:", isLoggedIn, userDetails);

  const capitalize = (str) =>
    str
      ?.split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ") || "";

  const handleNavigate = (route) => {
    console.log("Route in left menu : ", route);
    if (userDetails != null) {
      navigation.navigate("HomeStack", { screen: route });
    } else {
      navigation.navigate("HomeStack", { screen: "Login" });
    }
  };

  const handleLogout = async () => {
    if (userDetails != null) {
      await clearStorage();
      await Keychain.resetGenericPassword();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshAuth();
      // setUserData(null);
      ToastSuccess("Logged out successfully");
      navigation.navigate("HomeStack", { screen: "Home" });
    } else {
      ToastSuccess("You are already logged out");
    }
  };

  return (
    <SafeAreaView style={styles.drawerContent}>
      {userDetails ? (
        <Pressable
          onPress={() =>
            navigation.navigate("HomeStack", { screen: "Settings" })
          }
        >
          <View
            style={[
              styles.drawerHeader,
              // { height: height * 0.15 }
            ]}
          >
            <View style={styles.nameContainer}>
              <View style={styles.icon}>
                <Text style={styles.nameIcon}>{userDetails?.name[0]}</Text>
              </View>
              <View>
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>
                    {capitalize(userDetails?.name)}
                  </Text>
                  <Octicons name="pencil" size={15} color="black" />
                </View>
                <Text style={styles.role}>
                  {capitalize(userDetails?.roleName)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.loginContainer}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <FontAwesome name="user-circle" size={30} color="#585858" />
            <Text style={[styles.userName]}>
              Sign in to get more{"\n"}personalised feed!
            </Text>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate("HomeStack", { screen: "Login" })
            }
            style={[styles.loginButton]}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              Login
            </Text>
          </Pressable>
        </View>
      )}

      {/* <View style={styles.hrline} /> */}
      <ScrollView style={styles.dataContainer}>
        {userDetails?.roleName === "agent" && (
          <View style={styles.userDataContainer}>
            <Text style={[styles.headingData, { paddingTop: 10 }]}>
              Agent Workspace
            </Text>
            {agentMenuItems.map((item, index) => {
              const Icon = item.icon;
              // const isActive = route.name === item.route;

              return (
                <Pressable
                  key={index}
                  onPress={() => handleNavigate(item.route)}
                  style={[styles.menuItem]}
                >
                  <Icon />

                  <Text style={[styles.label]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {userDetails?.roleName === "builder" && (
          <View style={styles.userDataContainer}>
            <Text style={[styles.headingData, { paddingTop: 10 }]}>
              Builder Workspace
            </Text>
            {builderMenuItems.map((item, index) => {
              const Icon = item.icon;
              // const isActive = route.name === item.route;

              return (
                <Pressable
                  key={index}
                  onPress={() => handleNavigate(item.route)}
                  style={[styles.menuItem]}
                >
                  <Icon />

                  <Text style={[styles.label]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {userDetails == null || userDetails?.roleName === "user" ? (
          <View style={styles.userDataContainer}>
            <Text style={[styles.headingData, { paddingTop: 10 }]}>
              Profile & Activity
            </Text>
            {userMenuItems.map((item, index) => {
              const Icon = item.icon;
              // const isActive = route.name === item.route;

              return (
                <Pressable
                  key={index}
                  onPress={() => handleNavigate(item.route)}
                  style={[styles.menuItem]}
                >
                  <Icon />

                  <Text style={[styles.label]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.userDataContainer}>
          <Text style={[styles.headingData]}>More Details</Text>
          {More_Details.map((item, index) => {
            const Icon = item.icon;
            // const isActive = route.name === item.route;

            return (
              <Pressable
                key={index}
                onPress={() => handleNavigate(item.route)}
                style={[styles.menuItem]}
              >
                <Icon />

                <Text style={[styles.label]}>{item.label}</Text>
              </Pressable>
            );
          })}
          <View style={[styles.card, { marginTop: 25 }]}>
            <View style={{ paddingLeft: 5 }}>
              <Text style={styles.textPost}>Post Property</Text>
              <Text style={styles.subTitle}>
                Sell / Rent Faster with Propenu
              </Text>
            </View>

            <Image source={HouseSell} style={{ width: 40, height: 40 }} />
          </View>
          {/* <View style={styles.card}>
            <View style={{ paddingLeft: 5 }}>
              <Text style={styles.textPost}>Search Property</Text>
              <Text style={styles.subTitle}>
                Explore Properties & find your home
              </Text>
            </View>

            <Image source={HouseSearch} style={{ width: 40, height: 40 }} />
          </View> */}
          {/* <View style={styles.card}>
            <View style={{paddingLeft:5}}>
              <Text style={styles.textPost}>Owner Property</Text>
              <Text style={styles.subTitle}>Connect directly & simplify home</Text>
            </View>

            <Image
              source={HomeExterior}
              style={{ width: 40, height: 40 }}
            />
          </View> */}
          {/* <View style={styles.hrline} /> */}
          {/* LOGOUT BUTTON */}
          {/* <Pressable
            onPress={handleLogout}
            style={[styles.menuItem, styles.logoutItem]}
          >
            <AntDesign name="logout" size={19} color="#E53935" />
            <Text style={[styles.label, styles.logoutLabel]}>Logout</Text>
          </Pressable> */}
        </View>

        {/* ) : null} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          // backgroundColor:"red",
          // top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 0,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="HomeStack"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      {/* <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      /> */}
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  drawerContent: { flex: 1, backgroundColor: "#DEFAEA" },
  drawerHeader: {
    justifyContent: "center",
    // borderBottomColor: "gray",
    // borderBottomWidth: 1,
    // backgroundColor: "#DEFAEA",
    width: "100%",
    paddingLeft: 35,
    // padding: 20,
    paddingTop: 15,
    paddingBottom: 7,
    gap: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27AE60",
  },
  nameIcon: {
    color: "#27AE60",
    fontWeight: 600,
    fontSize: 16,
  },
  userName: {
    // color: "#27AE60",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
  },

  role: {
    marginTop: 3,
    fontSize: 12,
    color: "gray",
  },
  userDataContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headingData: {
    fontSize: 15,
    fontWeight: 500,
    paddingLeft: 10,
    // paddingTop: 5,
    // color:"#6e6e6e"
  },
  textPost: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#27AE60",
    borderRadius: 8,
  },
  categories: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  hrline: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.4,
    marginHorizontal: 15,
    marginVertical: 3,
  },
  dataContainer: {
    // paddingHorizontal: 16,
    backgroundColor: "white",
    marginTop: 10,
    height: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 23,
    marginTop: 22,
    // paddingVertical: 14,
    borderRadius: 14,
  },
  activeItem: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: 400,
    // color: "#82868d",
  },

  activeLabel: {
    color: "#27A361",
    fontWeight: "600",
  },
  card: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    // backgroundColor: "#f6faf6",
    backgroundColor: "white",
    shadowColor: "#333232",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,

    flexDirection: "row",
    justifyContent: "space-between",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#27A361",
  },

  logoutLabel: {
    color: "#E53935",
    fontWeight: "500",
  },
});
