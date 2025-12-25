import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import {UserProfile} from "../../../assets/svg/UserProfile"

const ProfileScreen = ({navigation  }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = ({ type, value }) => {
    console.log(`Login with ${type}:`, value);
    setModalVisible(false);
  };

  return (
    <View style={styles.mainProfile}>
      <View style={styles.profile}>
        <UserProfile width={120} height={140} />
        <Pressable  onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Login / Register</Text>
        </Pressable>

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
    color: "#007AFF",
    fontWeight: "500",
    paddingVertical: 5,
  },
  loginText2: {
    textAlign: "center",
  },
});

export default ProfileScreen;
