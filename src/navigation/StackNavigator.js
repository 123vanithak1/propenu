import { Pressable, View, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostProperty from "../screens/PostPropertyScreen/PostProperty";
import PropertyDetailsScreen from "../screens/PropertyDetails/PropertyDetailsScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import DrawerNavigator from "./DrawerNavigator";
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
import { LocationIcon } from "../../assets/svg/Logo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { toggleDropdown, setCity } from "../redux/slice/DropDownSlice";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ShortListedScreen from "../screens/ShortListedScreen/ShortListedScreen";
import MyProperties from "../screens/Account/MyProperties";
import Membership from "../screens/Account/Membership";
import MoreOwnerPropertyDetail from "../components/OwnersProperties/MoreOwnerPropertyDetails";
import UpcomingScreen from "../components/ui/UpComingPage";
import useCity from "../components/CustomHooks/useCity";
import MoreAgentDetails from "../components/Agent/MoreAgentDetails";
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.dropdown.isOpen);
  // const selectedCity = useSelector((state) => state.dropdown.selectedCity);
  const { selectedCity } = useCity();

  const handleCity = () => {
    dispatch(toggleDropdown());
  };

  const renderMenuButton = (navigation) => (
    <View style={styles.locationBar}>
      <Pressable onPress={navigation.openDrawer} hitSlop={10}>
        <MaterialIcons name="menu" size={26} color="#000" />
      </Pressable>

      <Pressable style={styles.select} onPress={handleCity}>
        <LocationIcon width={20} height={20} />
        <Text>
          {selectedCity?.city
            ? selectedCity.city.length > 13
              ? selectedCity.city.slice(0, 13) + "..."
              : selectedCity.city
            : "Hyderabad"}
        </Text>
        <AntDesign name={isOpen ? "up" : "down"} size={10} />
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
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="ShortListedProperties"
        component={ShortListedScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="MyProperties"
        component={MyProperties}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Membership"
        component={Membership}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="PostProperty"
        component={PostProperty}
         options={{ headerShown: false }}
        // options={({ navigation }) => ({
        //   headerBackVisible: false, // Make this true for back option
        //   headerStyle: {
        //     elevation: 0,
        //     shadowColor: "transparent",
        //     borderBottomWidth: 0,
        //   },

        //   headerLeft: () => (
        //     <Pressable onPress={() => navigation.openDrawer()} hitSlop={10}>
        //       <MaterialIcons name="menu" size={26} color="#000" />
        //     </Pressable>
        //   ),

        //   headerTitle: () => (
        //     <View style={{ marginLeft: 20 }}>
        //       <Text style={{ fontSize: 16, fontWeight: "600" }}>
        //         Post Your Property
        //       </Text>
        //       <Text style={{ fontSize: 12, color: "gray" }}>
        //         Sell or rent your property
        //       </Text>
        //     </View>
        //   ),

        //   headerRight: () => null,
        // })}
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
        name="MoreOwnerProperties"
        component={MoreOwnerPropertyDetail}
        options={{ headerShown: false }}
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
        name="MoreAgentDetails"
        component={MoreAgentDetails}
        // options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryFilter"
        component={CategoryFilterScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="ContactedProperties"
        component={ContactedProperties}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="upComingScreen"
        component={UpcomingScreen}
        options={{ headerShown: true }}
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
