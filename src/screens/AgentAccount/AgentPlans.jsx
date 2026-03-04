import { useQuery } from "@tanstack/react-query";
import { agentServices } from "../../services/agentServices";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PromoBanner from "../../components/ui/PromoBanner";

const AgentPlans = () => {
    const navigation = useNavigation();

  const { data: plans, isLoading: PlansLoading } = useQuery({
    queryKey: ["agent-plan-table"],
    queryFn: () =>
      agentServices.getMyPlans({
        userType: "agent",
      }),
  });

  const { data: my_subscription, isLoading: subsciptionLoading } = useQuery({
    queryKey: ["my-subscrpition"],
    queryFn: agentServices.getMySubscription,
  });

  const categoryLabelMap = {
    buy: "Buy view",
    rent_view: "Rent view",
  };

  if (!my_subscription?.active || !my_subscription?.plans?.length) {
    return <PromoBanner />;
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (PlansLoading || subsciptionLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!plans) {
    return (
      <View style={styles.container}>
        <Text>No Active Plans</Text>
      </View>
    );
  }

  const renderPlanCard = ({ item: plan }) => {
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    const now = Date.now();

    const totalDays = Math.max(
      (endDate - startDate) / (1000 * 60 * 60 * 24),
      1,
    );

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

    return (
      <View style={styles.card}>
        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            isExpired
              ? styles.expired
              : isExpiringSoon
                ? styles.expiring
                : styles.active,
          ]}
        >
          <Text style={styles.statusText}>
            {isExpired
              ? "Expired"
              : isExpiringSoon
                ? "Expiring Soon"
                : "Active"}
          </Text>
        </View>

        {/* Left Section */}
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Icon name="workspace-premium" size={28} color="#27AE60" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.planName}>{plan.planName}</Text>
            <Text style={styles.subText}>
              {plan.userType} •{" "}
              {categoryLabelMap[plan.category] ?? plan.category}
            </Text>

            <Text style={styles.dateText}>
              Purchased on {formatDate(plan.startDate)}
            </Text>
          </View>
        </View>

        <View style={styles.hrline} />
        {/* Right Section (Progress Panel) */}
        <View style={styles.progressPanel}>
          {/* Duration */}
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Plan duration ({remainingDays} days left)
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBar, { width: `${planProgress}%` }]}
              />
            </View>
          </View>

          {/* Usage */}
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                {isPropertyPlan ? "Property listings" : "Owner contacts"} (
                {plan.used}/{plan.total})
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBar,
                  usageProgress >= 100 && {
                    backgroundColor: "red",
                  },
                  { width: `${usageProgress}%` },
                ]}
              />
            </View>

            <Text style={styles.remainingText}>
              {plan.remaining} remaining {plan.unit}
            </Text>
          </View>
        </View>
        <Pressable
          style={styles.upgradeButton}
          onPress={() => navigation.navigate("BuyPlans")}
          //     if (plan.category === "buy") {
          //       navigation.navigate("BuyPlans");
          //     } else if (plan.category === "rent_view") {
          //       navigation.navigate("RentPlans");
          //     } else {
          //       navigation.navigate("Pricing");
          //     }
          //   }}
        >
          <Text style={styles.upgradeText}>Upgrade Plan</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={my_subscription.plans}
        keyExtractor={(item) => item.code}
        renderItem={renderPlanCard}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 5 }}
      />
    </View>
  );
};
export default AgentPlans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginBottom: 15,
    borderColor: "#E0F2E9",
    // elevation: 2,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  hrline: {
    height: 1,
    marginBottom: 7,
    backgroundColor: "#faf3f3",
  },
  iconBox: {
    height: 56,
    width: 56,
    borderRadius: 10,
    backgroundColor: "#F4FBF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  subText: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: "gray",
    marginTop: 3,
  },
  upgradeButton: {
    // width:"60%",
    // alignSelf:"flex-end",
    backgroundColor: "#e7f8ec",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 5,
    alignItems: "center",
  },
  upgradeText: {
    color: "#27AE60",
    fontWeight: "600",
    fontSize: 15,
  },
  progressPanel: {
    // backgroundColor: "#F4FBF6",
    borderRadius: 8,
    // padding: 12,
  },
  progressBlock: {
    marginBottom: 12,
  },
  progressHeader: {
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: "#555",
  },
  progressBarBg: {
    height: 3,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#27AE60",
  },
  remainingText: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  active: {
    backgroundColor: "#edf7f1",
  },
  expired: {
    backgroundColor: "#fdf1f1",
  },
  expiring: {
    backgroundColor: "#fcf9f2",
  },
  statusText: {
    fontSize: 10,
    color: "#27AE60",
    fontWeight: "600",
  },
});
