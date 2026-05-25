import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { agentServices } from "../../services/agentServices";
import PromoBanner from "../../components/ui/PromoBanner";
import Icon from "react-native-vector-icons/MaterialIcons";

// Category Map
const categoryLabelMap = {
  buy: "Buy view",
  rent_view: "Rent view",
};

// Date Formatter
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Animated Card Component
const AnimatedPlanCard = ({ plan, index, navigation }) => {
  // Animation values
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100, // Staggered animation effect
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacityAnim, translateYAnim]);

  // Date Math
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const now = Date.now();

  const totalDays = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 1);
  const elapsedDays =
    now < startDate ? 0 : (now - startDate) / (1000 * 60 * 60 * 24);
  const planProgress = Math.min((elapsedDays / totalDays) * 100, 100);
  const remainingDays = Math.max(
    Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)),
    0,
  );

  const usageProgress =
    plan.total > 0 ? Math.min((plan.used / plan.total) * 100, 100) : 0;

  const isExpired = now > endDate;
  const isExpiringSoon = !isExpired && remainingDays <= 7;
  const isPropertyPlan = plan.unit === "properties";

  // Status Colors
  let badgeStyle = styles.activeBadge;
  let statusTextColor = "#10B981"; // Emerald
  let statusText = "Active";

  if (isExpired) {
    badgeStyle = styles.expiredBadge;
    statusTextColor = "#EF4444"; // Red
    statusText = "Expired";
  } else if (isExpiringSoon) {
    badgeStyle = styles.expiringBadge;
    statusTextColor = "#F59E0B"; // Amber
    statusText = "Expiring Soon";
  }

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      {/* Top Section */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Icon name="workspace-premium" size={28} color="#10B981" />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.planName}>{plan.planName}</Text>
          <Text style={styles.subText}>
            {plan.userType} • {categoryLabelMap[plan.category] ?? plan.category}
          </Text>
          <Text style={styles.dateText}>
            Purchased {formatDate(plan.startDate)}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, badgeStyle]}>
          <Text style={[styles.statusText, { color: statusTextColor }]}>
            {statusText}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Progress Section */}
      <View style={styles.progressPanel}>
        {/* Duration Progress */}
        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Plan Duration</Text>
            <Text style={styles.progressSubtitle}>
              {remainingDays} days left
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBar,
                { width: `${planProgress}%` },
                isExpiringSoon && { backgroundColor: "#F59E0B" },
                isExpired && { backgroundColor: "#EF4444" },
              ]}
            />
          </View>
        </View>

        {/* Usage Progress */}
        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              {isPropertyPlan ? "Property Listings" : "Owner Contacts"}
            </Text>
            <Text style={styles.progressSubtitle}>
              {plan.used} / {plan.total} used
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBar,
                { width: `${usageProgress}%` },
                usageProgress >= 90 && { backgroundColor: "#F59E0B" },
                usageProgress >= 100 && { backgroundColor: "#EF4444" },
              ]}
            />
          </View>
          <Text style={styles.remainingText}>
            {plan.remaining} {plan.unit} remaining
          </Text>
        </View>
      </View>

      {/* Upgrade Action */}
      <Pressable
        style={({ pressed }) => [
          styles.upgradeButton,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => navigation.navigate("OwnerRentPlans")}
      >
        <Text style={styles.upgradeText}>Upgrade Plan</Text>
        <Icon name="arrow-forward" size={16} color="#10B981" />
      </Pressable>
    </Animated.View>
  );
};

// Main Component
const Membership = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { data: plans, isLoading: PlansLoading } = useQuery({
    queryKey: ["owner_seller"],
    queryFn: () =>
      agentServices.getMyPlans({
        userType: "owner",
        category: "sell",
      }),
  });

  const { data: my_subscription, isLoading: subsciptionLoading } = useQuery({
    queryKey: ["my-subscrpition"],
    queryFn: agentServices.getMySubscription,
  });

  if (PlansLoading || subsciptionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading Memberships...</Text>
      </View>
    );
  }

  if (!my_subscription?.active || !my_subscription?.plans?.length) {
    return <PromoBanner />;
  }

  return (
    <View style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={my_subscription.plans}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <AnimatedPlanCard plan={item} index={index} navigation={navigation} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Membership;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Modern off-white/gray background
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Modern shadow implementation
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBox: {
    height: 52,
    width: 52,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 10,
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  dateText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    position: "absolute",
    right: 0,
    top: 0,
  },
  activeBadge: {
    backgroundColor: "#ECFDF5",
  },
  expiringBadge: {
    backgroundColor: "#FEF3C7",
  },
  expiredBadge: {
    backgroundColor: "#FEF2F2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 16,
  },
  progressPanel: {
    marginBottom: 8,
  },
  progressBlock: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  progressSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  progressBarBg: {
    height: 6, // Thicker bar
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981", // Modern Emerald Green
    borderRadius: 10,
  },
  remainingText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
    fontWeight: "500",
  },
  upgradeButton: {
    flexDirection: "row",
    backgroundColor: "#ECFDF5",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  upgradeText: {
    color: "#10B981",
    fontWeight: "700",
    fontSize: 14,
  },
});
