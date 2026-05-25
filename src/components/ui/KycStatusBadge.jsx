/**
 * KycStatusBadge
 *
 * Renders the correct badge / button based on the user's KYC status.
 *
 * | kyc.status      | Display                                           |
 * |-----------------|---------------------------------------------------|
 * | "verified"      | 🟢 Green "KYC Verified" badge                     |
 * | "pending"       | 🟡 Yellow "Under Review" badge                    |
 * | "rejected"      | 🔴 Red badge + remark text                        |
 * | anything else   | Green "Verify KYC" button                         |
 *
 * Props:
 *   kycStatus   — string | undefined
 *   kycRemark   — string | undefined  (shown on rejected)
 *   onVerify    — () => void          (called on "Verify KYC" / "Retry KYC")
 *   loading     — bool                (shows spinner on the button)
 */

import React from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function KycStatusBadge({ kycStatus, kycRemark, onVerify, loading }) {
  // ── Verified ──────────────────────────────────────────────────────────────
  if (kycStatus === "verified") {
    return (
      <View style={[styles.badge, styles.verifiedBadge]}>
        <MaterialIcons name="verified" size={16} color="#15803d" />
        <Text style={styles.verifiedText}>KYC Verified</Text>
      </View>
    );
  }

  // ── Pending ───────────────────────────────────────────────────────────────
  if (kycStatus === "pending") {
    return (
      <View style={[styles.badge, styles.pendingBadge]}>
        <MaterialIcons name="hourglass-top" size={16} color="#92400e" />
        <Text style={styles.pendingText}>Under Review</Text>
      </View>
    );
  }

  // ── Rejected ──────────────────────────────────────────────────────────────
  if (kycStatus === "rejected") {
    return (
      <View style={styles.rejectedContainer}>
        <View style={[styles.badge, styles.rejectedBadge]}>
          <MaterialIcons name="cancel" size={16} color="#991b1b" />
          <Text style={styles.rejectedText}>KYC Rejected</Text>
        </View>

        {!!kycRemark && (
          <Text style={styles.remarkText}>Reason: {kycRemark}</Text>
        )}

        <Pressable
          onPress={onVerify}
          style={({ pressed }) => [
            styles.verifyBtn,
            pressed && styles.verifyBtnPressed,
          ]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialIcons name="refresh" size={16} color="#fff" />
              <Text style={styles.verifyBtnText}>Retry KYC</Text>
            </>
          )}
        </Pressable>
      </View>
    );
  }

  // ── Not started / unknown ─────────────────────────────────────────────────
  return (
    <Pressable
      onPress={onVerify}
      style={({ pressed }) => [
        styles.verifyBtn,
        pressed && styles.verifyBtnPressed,
      ]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <>
          <MaterialIcons name="shield" size={16} color="#fff" />
          <Text style={styles.verifyBtnText}>Verify KYC</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  // Verified
  verifiedBadge: {
    backgroundColor: "#dcfce7",
  },
  verifiedText: {
    color: "#15803d",
    fontSize: 13,
    fontWeight: "600",
  },

  // Pending
  pendingBadge: {
    backgroundColor: "#fef3c7",
  },
  pendingText: {
    color: "#92400e",
    fontSize: 13,
    fontWeight: "600",
  },

  // Rejected
  rejectedContainer: {
    gap: 8,
    alignItems: "flex-start",
  },
  rejectedBadge: {
    backgroundColor: "#fee2e2",
  },
  rejectedText: {
    color: "#991b1b",
    fontSize: 13,
    fontWeight: "600",
  },
  remarkText: {
    fontSize: 12,
    color: "#b91c1c",
    maxWidth: 260,
  },

  // Verify / Retry button
  verifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#27A361",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  verifyBtnPressed: {
    backgroundColor: "#1e8a51",
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
