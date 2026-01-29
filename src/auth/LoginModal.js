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
import Dropdownui from "../components/ui/DropDownUI";
import { BigLogo } from "../../assets/svg/LogoPropenu";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginModal({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const { width, height, isLandscape } = useDimension();

  const Roles = ["User", "Builder", "Agent"];

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

  const handleLogin = async () => {
    try {
      const res = await apiService.login({
        // name: username,
        email,
      });

      if (res?.status === 200) {
        navigation.navigate("OTPLogin", { email: email });
        // onOtpSuccess({
        //   email,
        //   // username,
        // });
      }
    } catch (err) {
      console.log("Login error:", err);
    }
  };
  const isFormValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <SafeAreaView style={styles.overlay}>
      <Pressable style={styles.backOption}   onPress={() => navigation.goBack()} hitSlop={10}>
        <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
      </Pressable >
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subTitle}>
              Enter your details to access your account
            </Text>

            <InputField
              label="Email Address"
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChange={setEmail}
            />
            {/* {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )} */}

            <Pressable
              style={[
                styles.loginButton,
                !isFormValid && styles.disabledButton,
              ]}
              disabled={!isFormValid}
              onPress={handleLogin}
            >
              <Text
                style={[styles.loginText, !isFormValid && styles.disabledText]}
              >
                Get OTP
              </Text>
            </Pressable>
            <View style={{ paddingTop: 15, alignItems: "center" }}>
              <Text style={styles.subTitle}>
                New to Propenu?
                <Text
                  style={{ color: "#27AE60", fontSize: 12, fontWeight: "500" }}
                  onPress={() => navigation.navigate("CreateLogin")}
                >
                  Create an account
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
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    // marginBottom:5
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 15,
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
    width: 200,
    alignSelf: "center",
    backgroundColor: "#27AE60",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: "#51b37a",
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
