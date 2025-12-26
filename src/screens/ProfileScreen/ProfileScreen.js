import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { UserProfile } from "../../../assets/svg/UserProfile";
import LoginModal from "../../auth/LoginModal";
import OTPLoginModal from "../../auth/OTPLoginScreen";

const ProfileScreen = ({ navigation }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    username: "",
  });

  return (
    <View style={styles.mainProfile}>
      <View style={styles.profile}>
        <UserProfile width={120} height={140} />
        <Pressable onPress={() => setShowLoginModal(true)}>
          <Text style={styles.loginText}>Login / Register</Text>
        </Pressable>
        <LoginModal
          visible={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onOtpSuccess={({ email, username }) => {
            setLoginData({ email, username });
            setShowLoginModal(false);
            setShowOtpModal(true);
          }}
        />

        <OTPLoginModal
          visible={showOtpModal}
          email={loginData.email}
          username={loginData.username}
          onClose={() => setShowOtpModal(false)}
        />

        <Text style={styles.loginText2}>
          Login and access millions of advertiser details on single click
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainProfile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    width: "70%",
    alignItems: "center",
  },
  loginText: {
    color: "#27AE60",
    fontWeight: "500",
    paddingVertical: 5,
  },
  loginText2: {
    textAlign: "center",
  },
});

export default ProfileScreen;
