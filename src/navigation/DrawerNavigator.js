// src/navigation/DrawerNavigator.js
import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import useDimensions from "../components/CustomHooks/UseDimension";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { getItem, clearStorage } from "../utils/Storage";
import AntDesign from "@expo/vector-icons/AntDesign";
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
import { useNavigation, useRoute } from "@react-navigation/native";

const menuItems = [
  {
    label: "Account & Settings",
    route: "Settings",
    icon: TabBarProfile,
  },
  {
    label: "My Properties",
    route: "MyProperties",
    icon: TabBarDomain,
  },
  {
    label: "Shortlisted Properties",
    route: "PostProperty",
    icon: TabBarFavourite,
  },
  {
    label: "Contacted Properties",
    route: "ContactedProperties",
    icon: PhoneIcon,
  },
  {
    label: "Membership",
    route: "Membership",
    icon: BellIcon,
  },
];

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, state }) => {
  const [userData, setUserData] = useState(null);
  const route = useRoute();

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const getUserInfo = async () => {
    try {
      const data = await getItem("user");
      if (data) {
        const parsedData = JSON.parse(data);
        console.log("userdata :", parsedData);
        setUserData(parsedData);
      }
    } catch (error) {
      console.log("Error when getting user Data : ", error);
    }
  };

  const handleNavigate = () => {
    if (userData) navigation.navigate("Settings");
    else navigation.navigate("Login");
  };

  const handleLogout = async () => {
    await clearStorage();
    setUserData(null);
    console.log("Logout clicked");
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.drawerContent}>
      {userData ? (
        <View
          style={[
            styles.drawerHeader,
            // { height: height * 0.15 }
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome name="user-circle" size={28} color="black" />
            <View>
              <Text style={styles.userName}>
                Welcome back, {capitalize(userData?.name)} 👋
              </Text>
              <Text style={styles.userName}>
                {capitalize(userData?.roleName)}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <FontAwesome name="user-circle" size={30} color="#585858" />
            <Text style={[styles.userName]}>
              Sign in to get more {"\n"}personalised feed!
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={[styles.loginButton]}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              Login
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.hrline} />
      <View style={styles.dataContainer}>
        {/* {userData?.roleName === "user" ? ( */}
        <View>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = route.name === item.route;

            return (
              <Pressable
                key={item.route}
                onPress={handleNavigate}
                // onPress={() => navigation.navigate(item.route)}
                style={[styles.menuItem, isActive && styles.activeItem]}
              >
                <Icon size={22} color={isActive ? "#27A361" : "#181818"} />

                <Text style={[styles.label, isActive && styles.activeLabel]}>
                  {item.label}
                </Text>

                {isActive && <View style={styles.dot} />}
              </Pressable>
            );
          })}

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
      </View>
    </SafeAreaView>
  );
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          // top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  drawerContent: { flex: 1 },
  drawerHeader: {
    justifyContent: "center",
    // borderBottomColor: "gray",
    // borderBottomWidth: 1,
    // backgroundColor: "#27AE60",
    width: "100%",
    paddingLeft: 30,
    padding: 20,
    gap: 10,
  },
  userName: {
    // color: "#27AE60",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
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
    paddingVertical: 15,
  },
  hrline: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.4,
    marginHorizontal: 15,
    marginVertical: 3,
  },
  dataContainer: {
    // paddingHorizontal: 16,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 35,
    paddingVertical: 14,
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
    fontSize: 15,
    // color: "#82868d",
    color: "#000",
  },
  activeLabel: {
    color: "#27A361",
    fontWeight: "600",
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
