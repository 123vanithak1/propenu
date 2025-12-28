import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { apiService } from "../services/apiService";
import useDimension from "../components/CustomHooks/UseDimension";
import OTPLoginModal from "./OTPLoginScreen";
import Entypo from "@expo/vector-icons/Entypo";

export default function LoginModal({ visible, onClose, onOtpSuccess }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const { width, height, isLandscape } = useDimension();

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
    if (!validate()) return;

    try {
      const res = await apiService.login({
        name: username,
        email,
      });

      if (res?.status === 200) {
        onOtpSuccess({
          email,
          username,
        });
      }
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        //  onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            style={[
              styles.modal,
              { width: isLandscape ? width * 0.6 : width * 0.8 },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Entypo name="cross" size={24} color="#202020ff" />
            </Pressable>
            <Text style={styles.title}>Login</Text>

            <TextInput
              style={[
                styles.input,
                errors.username && styles.errorInput,
                { marginBottom: errors.username ? 0 : 12 },
              ]}
              placeholder="Enter Your Name"
              placeholderTextColor={"gray"}
              value={username}
              onChangeText={setUsername}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                errors.email && styles.errorInput,
                { marginBottom: errors.email ? 0 : 12 },
              ]}
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={"gray"}
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
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
    backgroundColor: "#2785e9",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
