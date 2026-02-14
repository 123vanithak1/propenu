import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { apiService } from "../services/apiService";
import useDimension from "../components/CustomHooks/UseDimension";
import OTPLoginModal from "./OTPLoginScreen";
import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/ui/InputField";
import CountryPicker from "react-native-country-picker-modal";
import Dropdownui from "../components/ui/DropDownUI";
import { BigLogo } from "../../assets/svg/LogoPropenu";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ToastSuccess } from "../utils/Toast";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CreateLogin({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("User");
  const [errors, setErrors] = useState({});
  const { width, height, isLandscape } = useDimension();

  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [phone, setPhone] = useState("");
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const Roles = [
    { value: "User", key: "user", icon:"user-o" },
    { value: "Builder", key: "builder", icon:"building-o"},
    { value: "Agent", key: "agent" , icon:"vcard-o" },
  ];

  const validate = () => {
    let newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Minimum 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSelect = (country) => {
    setIsOpen(!isOpen);
    console.log("country :", country);
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };
  const handleLogin = async () => {
    try {
      const res = await apiService.createAccount({
        name: username,
        // email: email,
        phone: phone,
        role: role,
      });

      if (res?.status === 200) {
        ToastSuccess("OTP sent successfully");
        navigation.navigate("OTPLogin", {
          phone: phone,
          name: username,
          role: role,
        });
      }
    } catch (err) {
      console.log("Login error:", err);
    }
  };
  // console.log("details :", username, phone, role);
  const isFormValid = username.trim().length >= 3 && phone.length == 10 && role;

  return (
    <SafeAreaView style={styles.overlay}>
      <Pressable
        style={styles.backOption}
        onPress={() => navigation.goBack()}
        hitSlop={10}
      >
        <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
      </Pressable>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputFields}>
            <BigLogo width={200} height={90} />
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subTitle}>
              Join Propenu to find your perfect property.
            </Text>

            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={username}
              onChange={setUsername}
            />
            {/* {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )} */}

            <Text style={[styles.whatsappText]}>Enter Whatsapp Number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.sheet}>
                <CountryPicker
                  // disableNativeModal
                  countryCode={countryCode}
                  withFilter
                  withCallingCode
                  withFlag
                  onSelect={onSelect}
                  modalProps={{
                    statusBarTranslucent: true,
                  }}
                  // containerButtonStyle
                />
              </View>
              {/* <AntDesign name={isOpen ? "down" : "up"} size={10} color="#000" /> */}

              <Text style={styles.codeText}>+{callingCode}</Text>

              <TextInput
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.phoneinput}
                maxLength={10}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {/* {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )} */}
            {/* <Dropdownui
              label="Role"
              value={role}
              options={Roles.map((t) => ({
                value: t,
                label: t,
              }))}
              onChange={setRole}
            /> */}
            <Text style={[styles.whatsappText]}>Roles</Text>
            <View style={styles.roles}>
              {Roles.map((option) => {
                const isActive = role === option.value;

                return (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.optionBtn,
                      isActive && styles.optionBtnActive,
                    ]}
                    onPress={() => setRole(option.value)}
                  >
                    <FontAwesome name={option.icon} size={16} color= {isActive ? "#27AE60"  : "#374151" }/>
                    <Text
                      style={[
                        styles.optionText,
                        isActive && styles.optionTextActive,
                      ]}
                    >
                      {option.value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.loginButton,
                !isFormValid && styles.disabledButton,
              ]}
              disabled={!isFormValid}
              onPress={handleLogin}
            >
              <FontAwesome name="whatsapp" size={20} color="white" />
              <Text style={[styles.loginText]}>Get OTP</Text>
            </Pressable>
            <View style={{ paddingTop: 15, alignItems: "center" }}>
              <Text style={styles.subTitle}>
                Already have an account?{" "}
                <Text
                  style={{ color: "#27AE60", fontSize: 12, fontWeight: "500" }}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(243, 255, 245, 0.5)",
    // justifyContent: "center",
    // alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  backOption: {
    marginTop: 20,
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    // marginBottom:5
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  inputFields: {
    marginHorizontal: 30,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#0d385c11",
    borderRadius: 6,
    padding: 10,
    // marginBottom: 10,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    backgroundColor: "white",
    marginBottom: 10,
  },
  whatsappText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  roles: {
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-around",
    gap: 15,
    marginBottom: 10,
  },
  sheet: {
    // borderWidth:1,
    padding: 0,
  },
  codeText: {
    fontSize: 16,
    marginLeft: 5,
  },
  optionBtn: {
    flexDirection:"row",
    alignItems:"center",
    gap:6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  optionBtnActive: {
    borderColor: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  optionTextActive: {
    color: "#16A34A",
    fontWeight: "600",
  },
  phoneinput: {
    flex: 1,
    // height: 50,
  },
  roleName: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  cancelButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 5,
  },
  loginButton: {
    width: "60%",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
    backgroundColor: "#27AE60",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#6aca92",
  },

  disabledText: {
    color: "#E0E0E0",
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});
