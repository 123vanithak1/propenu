/**
 * KycPromptModal
 *
 * Full-screen interstitial shown to new users immediately after sign-up.
 * Prompts them to start KYC or skip (once). It embeds the DigiLocker
 * WebView flow inline so the user never has to navigate anywhere.
 *
 * Props:
 *   visible      — controls visibility
 *   onDismiss    — called when user skips or completes KYC
 */

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import KycWebViewModal from "./KycWebViewModal";
import { userServices } from "../../services/userServices";
import { useAuth } from "../../context/AuthContext";
import { ToastError, ToastInfo, ToastSuccess } from "../../utils/Toast";
import { ENV } from "../../../config";

export default function KycPromptModal({ visible, onDismiss }) {
  const { saveTokenAndRefresh } = useAuth();
  const [kycWebViewVisible, setKycWebViewVisible] = useState(false);
  const [kycAuthUrl, setKycAuthUrl] = useState("");
  const [kycLoading, setKycLoading] = useState(false);

  const handleStartKyc = async () => {
    try {
      setKycLoading(true);
      const { url } = await userServices.startKyc();
      setKycAuthUrl(url);
      setKycWebViewVisible(true);
    } catch (err) {
      console.error("Start KYC error:", err);
      ToastError("Could not start KYC. Please try again.");
    } finally {
      setKycLoading(false);
    }
  };

  const handleKycSuccess = async ({ token, kycStatus: status, remark }) => {
    setKycWebViewVisible(false);

    const kycUser = {
      kyc: {
        status,
        remarks: remark,
        provider: "digilocker",
      },
    };

    await saveTokenAndRefresh(token, kycUser);

    if (status === "verified") {
      ToastSuccess("🎉 KYC Verified successfully!");
    } else if (status === "pending") {
      ToastInfo("KYC is under review. We'll notify you soon.");
    } else {
      ToastError(`KYC not approved. ${remark || "Please update your details."}`);
    }

    // Close the prompt after KYC is handled
    onDismiss();
  };

  const handleKycFailure = (msg) => {
    setKycWebViewVisible(false);
    ToastError(msg || "KYC verification failed. Please try again.");
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={onDismiss}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.card}>
              {/* Shield icon */}
              <View style={styles.iconWrapper}>
                <MaterialIcons name="shield" size={44} color="#27A361" />
              </View>

              {/* Heading */}
              <Text style={styles.heading}>Verify Your Identity</Text>
              <Text style={styles.subtitle}>
                Complete your KYC to unlock all features on Propenu. It only
                takes a minute using your Aadhaar via DigiLocker.
              </Text>

              {/* Benefits */}
              <View style={styles.benefitsList}>
                <BenefitRow icon="home" text="Post & manage your properties" />
                <BenefitRow icon="contacts" text="View owner contact details" />
                <BenefitRow icon="workspace-premium" text="Buy premium plans" />
                <BenefitRow
                  icon="verified-user"
                  text="Build trust with verified badge"
                />
              </View>

              {/* DigiLocker label */}
              <View style={styles.poweredRow}>
                <MaterialIcons name="lock" size={12} color="#888" />
                <Text style={styles.poweredText}>
                  Securely powered by DigiLocker (Govt. of India)
                </Text>
              </View>

              {/* CTA */}
              <Pressable
                style={({ pressed }) => [
                  styles.verifyBtn,
                  pressed && styles.verifyBtnPressed,
                  kycLoading && styles.verifyBtnDisabled,
                ]}
                onPress={handleStartKyc}
                disabled={kycLoading}
              >
                {kycLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="verified-user" size={17} color="#fff" />
                    <Text style={styles.verifyBtnText}>Verify Now with DigiLocker</Text>
                  </>
                )}
              </Pressable>

              {/* Skip */}
              <Pressable style={styles.skipBtn} onPress={onDismiss}>
                <Text style={styles.skipText}>Skip for now</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* DigiLocker WebView — opened on top of the prompt */}
      <KycWebViewModal
        visible={kycWebViewVisible}
        authUrl={kycAuthUrl}
        frontendUrl={ENV.FRONTEND_URL}
        onSuccess={handleKycSuccess}
        onFailure={handleKycFailure}
        onClose={() => setKycWebViewVisible(false)}
      />
    </>
  );
}

const BenefitRow = ({ icon, text }) => (
  <View style={styles.benefitRow}>
    <View style={styles.benefitIconBox}>
      <MaterialIcons name={icon} size={15} color="#27A361" />
    </View>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  safeArea: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
    alignItems: "center",
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  benefitsList: {
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
  },
  benefitText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  poweredRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 18,
  },
  poweredText: {
    fontSize: 11,
    color: "#888",
  },
  verifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#27A361",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    marginBottom: 10,
  },
  verifyBtnPressed: {
    backgroundColor: "#1e8a51",
  },
  verifyBtnDisabled: {
    backgroundColor: "#a3d9b8",
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "underline",
  },
});
