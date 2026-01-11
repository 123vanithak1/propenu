import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { apiService } from "../services/apiService";
import useDimensions from "../components/CustomHooks/UseDimension";
import { setItem } from "../utils/Storage";

const OTPLoginModal = ({ visible, onClose, email, username }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { width, isLandscape } = useDimensions();

  const inputs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      alert("Please enter 4 digit OTP");
      return;
    }

    try {
      setLoading(true);
      const otpResult = await apiService.verifyOtp({
        // name: username,
        email,
        otp: otpValue,
      });
      console.log("otp Result :", otpResult);

      if (otpResult?.status !== 200) {
        throw new Error("OTP verification failed");
      }

      const token = otpResult?.data?.token;
      if (!token) {
        throw new Error("Token not received");
      }

      const tokenResult = await apiService.verifyToken(token);

      if (tokenResult?.status !== 200) {
        throw new Error("Token verification failed");
      }
      await setItem("user", tokenResult?.data);
      console.log("Login successful", tokenResult);

      onClose();
    } catch (error) {
      console.log("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      // onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Confirm OTP</Text>
          <Text style={styles.subtitle}>OTP sent to {email}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              { width: isLandscape ? width * 0.3 : width * 0.5 },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleVerifyOtp}
          >
            <Text style={styles.loginText}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0e49a1ff",
    marginBottom: 6,
  },
  subtitle: {
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#2785e9ff",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 12,
  },
  closeText: {
    color: "#2785e9ff",
    fontWeight: "500",
  },
});

export default OTPLoginModal;
