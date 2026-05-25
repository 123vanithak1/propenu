import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ToastError, ToastInfo, ToastSuccess } from "../../utils/Toast";
import { useAuth } from "../../context/AuthContext";
import { setItem, getItem, clearStorage } from "../../utils/Storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Keychain from "react-native-keychain";
import { useQuery } from "@tanstack/react-query";

import { ENV } from "../../../config";
import { userServices } from "../../services/userServices";
import KycWebViewModal from "../../components/ui/KycWebViewModal";
import KycStatusBadge from "../../components/ui/KycStatusBadge";

const SettingsScreen = () => {
  const { isLoggedIn, updateUserDetails, userDetails, refreshAuth, saveTokenAndRefresh } = useAuth();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: userDetails?.name || "",
    phone: userDetails?.phone || "",
    email: userDetails?.email || "",
    city: userDetails?.city || "",
  });

  const [image, setImage] = useState(null);

  // ── KYC state ─────────────────────────────────────────────────────────────
  const [kycModalVisible, setKycModalVisible] = useState(false);
  const [kycAuthUrl, setKycAuthUrl] = useState("");
  const [kycLoading, setKycLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ── Membership history ────────────────────────────────────────────────────
  const { data: membershipData, isLoading: historyLoading } = useQuery({
    queryKey: ["membership-history-settings"],
    queryFn: userServices.getMembershipHistory,
    enabled: isLoggedIn,
  });

  const handleOpenInvoice = async (url) => {
    try {
      if (!url) return;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Invoice open error:", error);
    }
  };

  const refreshUserProfile = async (showToast = false) => {
    try {
      setRefreshing(true);
      const data = await userServices.getUserProfile();
      if (data?.user) {
        await updateUserDetails(data.user);
        if (showToast) {
          ToastSuccess("KYC status updated successfully");
        }
      }
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
      if (showToast) {
        ToastError("Failed to refresh KYC status");
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Inline "update details" for rejected KYC
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [kycForm, setKycForm] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    city: userDetails?.city || "",
    state: userDetails?.state || "",
    locality: userDetails?.locality || "",
    pincode: userDetails?.pincode || "",
  });
  const [kycUpdateLoading, setKycUpdateLoading] = useState(false);

  // ── Derived KYC values from context ───────────────────────────────────────
  const kycStatus = userDetails?.kyc?.status;
  const kycRemark = userDetails?.kyc?.remarks;

  // ── Image picker ──────────────────────────────────────────────────────────
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      ToastInfo("Allow photo access to continue");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await setItem("profileImage", uri);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    if (userDetails != null) {
      await clearStorage();
      await Keychain.resetGenericPassword();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshAuth();
      ToastSuccess("Logged out successfully");
      navigation.navigate("HomeStack", { screen: "Home" });
    } else {
      ToastSuccess("You are already logged out");
    }
  };

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadImage = async () => {
      const savedImage = await getItem("profileImage");
      if (savedImage) setImage(savedImage);
    };
    loadImage();
  }, []);

  useEffect(() => {
    if (userDetails) {
      setForm({
        name: userDetails?.name || "",
        phone: userDetails?.phone || "",
        email: userDetails?.email || "",
        city: userDetails?.city || "",
      });
      setKycForm({
        name: userDetails?.name || "",
        email: userDetails?.email || "",
        city: userDetails?.city || "",
        state: userDetails?.state || "",
        locality: userDetails?.locality || "",
        pincode: userDetails?.pincode || "",
      });
    }
  }, [userDetails]);

  useEffect(() => {
    if (isLoggedIn) {
      refreshUserProfile(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (isLoggedIn) {
        refreshUserProfile(false);
      }
    });
    return unsubscribe;
  }, [navigation, isLoggedIn]);

  // ── KYC handlers ──────────────────────────────────────────────────────────

  /** Called when user taps "Verify KYC" or "Retry KYC" */
  const handleStartKyc = async () => {
    if (!isLoggedIn) {
      ToastInfo("Please log in to verify KYC");
      return;
    }
    try {
      setKycLoading(true);
      const { url } = await userServices.startKyc();
      setKycAuthUrl(url);
      setKycModalVisible(true);
    } catch (err) {
      console.error("Start KYC error:", err);
      ToastError("Could not start KYC. Please try again.");
    } finally {
      setKycLoading(false);
    }
  };

  /** WebView intercepted a successful redirect */
  const handleKycSuccess = async ({ token, kycStatus: status, remark }) => {
    setKycModalVisible(false);

    // Build a minimal kycUser object so the context updates immediately
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
  };

  /** WebView reported a failure */
  const handleKycFailure = (msg) => {
    setKycModalVisible(false);
    ToastError(msg || "KYC verification failed. Please try again.");
  };

  /** Save updated KYC details (inline edit on rejected flow) */
  const handleSaveKycDetails = async () => {
    try {
      setKycUpdateLoading(true);
      const data = await userServices.updateKycDetails(kycForm);
      // Backend returns a new token + user with status reset to kyc_pending
      await saveTokenAndRefresh(data.token, data.user);
      setIsEditingKyc(false);
      ToastSuccess("Details updated. You can now retry KYC.");
    } catch (err) {
      console.error("Update KYC details error:", err);
      ToastError(err?.message || "Failed to update details.");
    } finally {
      setKycUpdateLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ── Profile Card ── */}
      <View style={styles.profileCard}>
        <Pressable style={styles.avatarWrapper} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <FontAwesome name="user-circle" size={50} color="#585858" />
          )}
          <View style={styles.cameraIcon}>
            <MaterialIcons name="photo-camera" size={14} color="#666" />
          </View>
        </Pressable>

        <View>
          <Text style={styles.userName}>{userDetails?.name || "Guest"}</Text>
          <Text style={styles.userCity}>
            {userDetails?.city ? userDetails.city : "Hyderabad"}
          </Text>
        </View>
      </View>

      {/* ── Personal Information ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal information</Text>

          <Pressable style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
            <Feather name="edit-2" size={14} color="#666" />
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoGrid}>
            <InfoField
              label="Name"
              value={form.name}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <InfoField
              label="Phone Number"
              value={form.phone}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, phone: v })}
            />

            <InfoField
              label="Email Address"
              value={form.email}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            <InfoField
              label="Address"
              value={form.city}
              editing={isEditing}
              onChange={(v) => setForm({ ...form, city: v })}
            />

            {isEditing && (
              <View style={styles.actions}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => {
                    setIsEditing(false);
                    setForm({
                      name: userDetails?.name || "",
                      phone: userDetails?.phone || "",
                      email: userDetails?.email || "",
                      city: userDetails?.city || "",
                    });
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.saveBtn}
                  onPress={async () => {
                    await updateUserDetails(form);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.saveText}>Save</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── KYC Verification ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>KYC Verification</Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            {isLoggedIn && (
              <Pressable
                style={styles.editBtn}
                onPress={() => refreshUserProfile(true)}
                disabled={refreshing}
              >
                <MaterialIcons name="refresh" size={14} color="#666" />
                <Text style={styles.editText}>
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Text>
              </Pressable>
            )}

            {/* Show "Update Details" edit toggle only on rejected status */}
            {kycStatus === "rejected" && !isEditingKyc && (
              <Pressable
                style={styles.editBtn}
                onPress={() => setIsEditingKyc(true)}
              >
                <Text style={styles.editText}>Update Details</Text>
                <Feather name="edit-2" size={14} color="#666" />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.kycCard}>
          {/* Status badge / verify button */}
          <KycStatusBadge
            kycStatus={kycStatus}
            kycRemark={kycRemark}
            onVerify={handleStartKyc}
            loading={kycLoading}
          />

          {/* Inline "Update Details" form — only for rejected status */}
          {kycStatus === "rejected" && isEditingKyc && (
            <View style={styles.kycEditForm}>
              <Text style={styles.kycEditTitle}>
                Update your details to match Aadhaar, then retry KYC.
              </Text>

              <View style={styles.infoGrid}>
                <InfoField
                  label="Full Name (as on Aadhaar)"
                  value={kycForm.name}
                  editing
                  onChange={(v) => setKycForm({ ...kycForm, name: v })}
                />
                <InfoField
                  label="Email"
                  value={kycForm.email}
                  editing
                  onChange={(v) => setKycForm({ ...kycForm, email: v })}
                />
                <InfoField
                  label="City"
                  value={kycForm.city}
                  editing
                  onChange={(v) => setKycForm({ ...kycForm, city: v })}
                />
                <InfoField
                  label="State"
                  value={kycForm.state}
                  editing
                  onChange={(v) => setKycForm({ ...kycForm, state: v })}
                />
                <InfoField
                  label="Locality"
                  value={kycForm.locality}
                  editing
                  onChange={(v) => setKycForm({ ...kycForm, locality: v })}
                />
                <InfoField
                  label="Pincode"
                  value={kycForm.pincode}
                  editing
                  onChange={(v) => setKycForm({ ...kycForm, pincode: v })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => {
                    setIsEditingKyc(false);
                    setKycForm({
                      name: userDetails?.name || "",
                      email: userDetails?.email || "",
                      city: userDetails?.city || "",
                      state: userDetails?.state || "",
                      locality: userDetails?.locality || "",
                      pincode: userDetails?.pincode || "",
                    });
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.saveBtn, kycUpdateLoading && styles.saveBtnDisabled]}
                  onPress={handleSaveKycDetails}
                  disabled={kycUpdateLoading}
                >
                  <Text style={styles.saveText}>
                    {kycUpdateLoading ? "Saving…" : "Save & Retry KYC"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ── Membership History ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Membership History</Text>
        </View>

        {historyLoading ? (
          <View style={styles.historyLoadingBox}>
            <ActivityIndicator size="small" color="#27A361" />
            <Text style={styles.historyLoadingText}>Loading history…</Text>
          </View>
        ) : !membershipData?.history?.length ? (
          <View style={styles.historyEmptyBox}>
            <AntDesign name="inbox" size={32} color="#ccc" />
            <Text style={styles.historyEmptyText}>No subscription history yet</Text>
          </View>
        ) : (
          membershipData.history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              {/* Top row: plan name + status badge */}
              <View style={styles.historyTopRow}>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.historyPlanName}>{item.planName}</Text>
                  <View style={styles.historyTagRow}>
                    <View style={styles.historyChip}>
                      <Text style={styles.historyChipText}>{item.category}</Text>
                    </View>
                    {item.tier && (
                      <View style={[styles.historyChip, styles.historyTierChip]}>
                        <Text style={styles.historyChipText}>{item.tier}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <HistoryStatusBadge status={item.status} />
              </View>

              {/* Date row */}
              <View style={styles.historyDateRow}>
                <AntDesign name="calendar" size={12} color="#888" />
                <Text style={styles.historyDateText}>
                  {formatHistoryDate(item.startDate)} → {formatHistoryDate(item.endDate)}
                </Text>
              </View>

              {/* Price row */}
              <View style={styles.historyPriceRow}>
                <Text style={styles.historyPrice}>₹{item.price}/-</Text>
                <Text style={styles.historyPurchased}>
                  Purchased {formatHistoryDate(item.purchasedAt)}
                </Text>
              </View>

              {/* Invoice button */}
              {item.invoiceUrl ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.invoiceBtn,
                    pressed && styles.invoiceBtnPressed,
                  ]}
                  onPress={() => handleOpenInvoice(item.invoiceUrl)}
                >
                  <AntDesign name="cloud-download" size={15} color="#27A361" />
                  <Text style={styles.invoiceBtnText}>Download Invoice</Text>
                </Pressable>
              ) : null}
            </View>
          ))
        )}
      </View>

      {/* ── Logout ── */}
      <Pressable onPress={handleLogout} style={[styles.menuItem]}>
        <AntDesign name="logout" size={19} color="#E53935" />
        <Text style={[styles.label, styles.logoutLabel]}>Logout</Text>
      </Pressable>

      {/* ── DigiLocker WebView Modal ── */}
      <KycWebViewModal
        visible={kycModalVisible}
        authUrl={kycAuthUrl}
        frontendUrl={ENV.FRONTEND_URL}
        onSuccess={handleKycSuccess}
        onFailure={handleKycFailure}
        onClose={() => setKycModalVisible(false)}
      />
    </ScrollView>
  );
};

// ── Sub-component ─────────────────────────────────────────────────────────────

const InfoField = ({ label, value, editing, onChange, keyboardType }) => (
  <View style={styles.infoField}>
    <Text style={styles.infoLabel}>{label}</Text>

    {editing ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholder={`Enter ${label}`}
        placeholderTextColor="gray"
        keyboardType={keyboardType || "default"}
      />
    ) : (
      <Text style={styles.infoValue}>{value || "--"}</Text>
    )}
  </View>
);

// ── Helpers ────────────────────────────────────────────────────────────────────────────────
const formatHistoryDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── HistoryStatusBadge ───────────────────────────────────────────────────────────────────
const HistoryStatusBadge = ({ status }) => {
  const isActive = status === "active";
  return (
    <View
      style={[
        styles.historyBadge,
        { backgroundColor: isActive ? "#f0fdf4" : "#fef2f2" },
      ]}
    >
      <View
        style={[
          styles.historyBadgeDot,
          { backgroundColor: isActive ? "#27A361" : "#ef4444" },
        ]}
      />
      <Text
        style={[
          styles.historyBadgeText,
          { color: isActive ? "#15803d" : "#b91c1c" },
        ]}
      >
        {isActive ? "Active" : "Expired"}
      </Text>
    </View>
  );
};

export default SettingsScreen;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexGrow: 1,
    backgroundColor: "#F9F9F9",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: "#ccc",
    backgroundColor: "#eeeeee",
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 3,
    borderRadius: 20,
    elevation: 2,
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  userCity: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  editText: {
    fontSize: 13,
    color: "#666",
  },

  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
  },

  infoField: {
    width: "48%",
  },

  infoLabel: {
    fontSize: 12,
    color: "#818181",
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },

  // KYC card
  kycCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    gap: 16,
  },

  kycEditForm: {
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },

  kycEditTitle: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },

  // Shared action row
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },

  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#27A361",
  },

  saveBtnDisabled: {
    backgroundColor: "#a3d9b8",
  },

  cancelText: {
    color: "#333",
    fontWeight: "500",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
    fontSize: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 23,
    marginTop: 25,
    borderRadius: 14,
  },

  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: 400,
  },

  logoutLabel: {
    color: "#E53935",
    fontWeight: "500",
  },

  // ── Membership History ──────────────────────────────────────────────────
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8f5ee",
    padding: 14,
    marginBottom: 12,
    gap: 10,
    elevation: 1,
  },
  historyTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  historyPlanName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  historyTagRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 4,
  },
  historyChip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  historyTierChip: {
    backgroundColor: "#eff6ff",
  },
  historyChipText: {
    fontSize: 10,
    color: "#555",
    textTransform: "capitalize",
  },
  historyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  historyBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  historyBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  historyDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  historyDateText: {
    fontSize: 11,
    color: "#666",
  },
  historyPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#27A361",
  },
  historyPurchased: {
    fontSize: 11,
    color: "#999",
  },
  invoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    paddingVertical: 8,
    borderRadius: 8,
  },
  invoiceBtnPressed: {
    backgroundColor: "#dcfce7",
  },
  invoiceBtnText: {
    fontSize: 13,
    color: "#27A361",
    fontWeight: "600",
  },
  historyLoadingBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
    elevation: 1,
  },
  historyLoadingText: {
    fontSize: 12,
    color: "#999",
  },
  historyEmptyBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: "center",
    gap: 10,
    elevation: 1,
  },
  historyEmptyText: {
    fontSize: 13,
    color: "#aaa",
  },
});
