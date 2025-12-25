import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import useDimensions from "../components/CustomHooks/UseDimension";
import { apiService } from "../services/apiService";

export default function Login({navigation}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const { width, height, isLandscape } = useDimensions();

  const validate = () => {
    let newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    console.log(Object.keys(newErrors).length === 0, ":");

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      console.log("Login Success", { username, email });

      const loginResponse = await apiService.login({
        name: username,
        email: email,
      });
      if (loginResponse.status === 200) {
        navigation.navigate("OTPLogin", { email ,username});
      }
    } catch (error) {
      console.log("Login Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: isLandscape ? width * 0.5 : width * 0.85,
          height: height * 0.6,
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>Login</Text>

        {/* Username */}
        <TextInput
          style={[
            styles.input,
            errors.username ? styles.errorInput : { marginBottom: 10 },
          ]}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}

        {/* Email */}
        <TextInput
          style={[
            styles.input,
            errors.email ? styles.errorInput : { marginBottom: 10 },
          ]}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Login Button */}
        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            { width: isLandscape ? width * 0.3 : width * 0.65 },
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    // borderWidth: 1,
    // borderColor: "#12536dff",
    backgroundColor: "#0d385c11",
    borderRadius: 6,
    padding: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    paddingLeft: 5,
    marginBottom: 10,
  },
  loginButton: {
    alignSelf: "center",
    backgroundColor: "#2785e9ff",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
