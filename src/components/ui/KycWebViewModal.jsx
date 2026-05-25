/**
 * KycWebViewModal — Option A: In-App WebView (active implementation)
 *
 * Opens a full-screen modal with a WebView pointing at the DigiLocker
 * OAuth authorization URL. When DigiLocker redirects back to FRONTEND_URL
 * (which the backend sets as process.env.FRONTEND_URL), the WebView
 * intercepts the URL, extracts { token, kyc, remark }, and calls onSuccess.
 *
 * Option B (expo-web-browser + deep linking) would replace the entire
 * WebView block but use the same onSuccess / onFailure / onClose contract.
 * See the comment block at the bottom of this file for the Option B snippet.
 */

import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";

/**
 * Props:
 *  visible      — controls modal visibility
 *  authUrl      — DigiLocker OAuth URL from GET /api/users/kyc/start
 *  frontendUrl  — ENV.FRONTEND_URL (e.g. "https://propenu.com")
 *  onSuccess    — ({ token, kycStatus, remark }) => void
 *  onFailure    — (errorMessage: string) => void
 *  onClose      — () => void  (user cancelled)
 */
export default function KycWebViewModal({
  visible,
  authUrl,
  frontendUrl,
  onSuccess,
  onFailure,
  onClose,
}) {
  const handledRef = useRef(false); // prevent double-firing

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (!url) return;

    // Detect the redirect back from DigiLocker → our backend → web frontend
    const isCallback =
      url.startsWith(frontendUrl) ||
      (url.includes("token=") && url.includes("kyc="));

    if (isCallback && !handledRef.current) {
      handledRef.current = true;

      try {
        const queryString = url.split("?")[1];

        if (queryString) {
          const params = new URLSearchParams(queryString);
          const token = params.get("token");
          const kycStatus = params.get("kyc");
          const remark = params.get("remark") || "";

          if (token && kycStatus) {
            onSuccess({
              token,
              kycStatus,
              remark: decodeURIComponent(remark),
            });
            return;
          }
        }

        // Backend redirected without valid params → treat as failure
        if (url.includes("kyc=failed")) {
          onFailure("KYC verification failed. Please try again.");
        } else {
          onFailure("Unexpected response from DigiLocker.");
        }
      } catch {
        onFailure("Error reading KYC response. Please try again.");
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>KYC Verification</Text>
            <Text style={styles.subtitle}>Powered by DigiLocker</Text>
          </View>

          <Pressable
            onPress={onClose}
            style={styles.cancelBtn}
            android_ripple={{ color: "#fee2e2", radius: 20 }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>

        {/* Info strip */}
        <View style={styles.infoStrip}>
          <Text style={styles.infoText}>
            🔒 Your data is securely handled by DigiLocker (Govt. of India)
          </Text>
        </View>

        {/* WebView — Option A */}
        {authUrl ? (
          <WebView
            source={{ uri: authUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#27A361" />
                <Text style={styles.loadingText}>Loading DigiLocker…</Text>
              </View>
            )}
            style={{ flex: 1 }}
            // Allow DigiLocker's redirects (they use custom schemes internally)
            originWhitelist={["*"]}
            // On Android, mixed-content images inside DigiLocker may require this
            {...(Platform.OS === "android" && {
              mixedContentMode: "compatibility",
            })}
          />
        ) : (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#27A361" />
            <Text style={styles.loadingText}>Preparing DigiLocker…</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },

  headerLeft: {
    gap: 2,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  subtitle: {
    fontSize: 11,
    color: "#888",
  },

  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fca5a5",
    backgroundColor: "#fff1f1",
  },

  cancelText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "600",
  },

  infoStrip: {
    backgroundColor: "#f0fdf4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dcfce7",
  },

  infoText: {
    fontSize: 11,
    color: "#166534",
  },

  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
  },

  loadingText: {
    fontSize: 14,
    color: "#555",
  },
});

/* ─────────────────────────────────────────────────────────────────────────────
 * OPTION B — expo-web-browser + deep linking (future upgrade, no backend change
 * needed if we use the "Frontend Redirect Bridge" sub-option):
 *
 * 1. Add to app.json:   "scheme": "propenu"
 * 2. In the web frontend's TokenHandler.tsx, detect mobile and do:
 *      window.location.href = `propenu://kyc-callback?token=${token}&kyc=${kyc}&remark=${remark}`;
 * 3. Replace the WebView usage above with:
 *
 *   import * as WebBrowser from "expo-web-browser";
 *   import * as Linking from "expo-linking";
 *   WebBrowser.maybeCompleteAuthSession();
 *
 *   const redirectUrl = Linking.createURL("kyc-callback"); // propenu://kyc-callback
 *   const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
 *   if (result.type === "success" && result.url) {
 *     const parsed = Linking.parse(result.url);
 *     const { token, kyc, remark } = parsed.queryParams;
 *     onSuccess({ token, kycStatus: kyc, remark: decodeURIComponent(remark || "") });
 *   }
 * ───────────────────────────────────────────────────────────────────────────── */
