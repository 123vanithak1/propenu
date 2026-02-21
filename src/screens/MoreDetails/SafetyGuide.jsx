import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const SafetyGuide = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();


  {/* -----------------------Static data------------------------*/}
  const protection = [
    "Verified Users",
    "Genuine Properties",
    "No Fake Listings",
    "Zero Spam",
    "Secure Data Handling",
  ];
  const threat = [
    "While Propenu blocks fake profiles and properties, caution is important during site visits, meetings, and transactions outside the platform.",
    "That’s why we’ve created safety tips for every type of user.",
  ];
  const pay = [
    "Always visit the property in person.",
    "Match the address, photos, and details with what’s shared on the listing page.",
  ];
  const cautions = [
    "Do not send booking amounts, tokens, or deposits before document checks.",
    "Be cautious if someone pressures you with urgency or limited time offers.",
  ];

  const docs = [
    "Avoid sending Aadhaar, PAN, bank details, or OTPs unless legally required for a verified transaction.",
  ];

  const redFlags = [
    "Requests for “registration fees” or “gate passes.",
    "Refusal to meet or show original documents.",
  ];
  const tenants = [
    "Refuse to meet in person or avoid site visits",
    "Delay decisions while repeatedly asking for documents",
    "Request property papers for vague “loan” or “verification” reasons",
  ];


    {/* -----------------------UI------------------------*/}

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 6,
      }}
    >
      <Text style={styles.title}>
        1. Built on Trust. Designed for Your Protection
      </Text>

      <Text style={styles.content}>
        At Propenu, safety is not an afterthought. Every user is KYC-verified.
        Every property is screened and approved. Interactions are monitored to
        help prevent spam and fraud.
      </Text>
      {protection.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <View style={{ paddingTop: 5 }}>
            <Entypo name="check" size={14} color="#27AE60" />
          </View>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}
      <Text style={styles.content}>
        {"\n"}
        Still, real estate decisions don’t stop at a platform. This guide exists
        to help you stay safe even beyond the Propenu ecosystem.
      </Text>
      <Text
        style={[
          styles.subContent,
          { backgroundColor: "#edf6f7", fontWeight: 500 },
        ]}
      >
        Fraud is actively prevented here. This guide is for your extra
        protection in the real world. {"\n"}
        {threat.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
              {item}
            </Text>
          </View>
        ))}
      </Text>
      <Text style={styles.title}>2. For Buyers & Tenants</Text>
      <Text style={styles.content}>
        Your dream home is close, but stay alert to ensure a smooth and secure
        process.
      </Text>
      <Text style={styles.subTitle}>
        1. Never Pay Anything without Seeing the Property
      </Text>
      {pay.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}

      <Text style={styles.subTitle}>2. Verify Before You Transfer Money</Text>
      {cautions.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}

      <Text style={styles.subTitle}>3. Don’t Share Sensitive Documents</Text>
      {docs.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}

      <Text
        style={[
          styles.subContent,
          { backgroundColor: "#eff7ed", fontWeight: 500 },
        ]}
      >
        Watch for Red Flags{"\n"}
        {redFlags.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
              {item}
            </Text>
          </View>
        ))}
      </Text>
      <Text style={styles.title}>3. For Owners & Agents</Text>
      <Text style={styles.content}>
        Protect your property and your information from fraudulent inquiries.
      </Text>

      <Text style={[styles.subTitle]}>1. Avoid Fake Buyers or Tenants</Text>
      <Text style={styles.content}>Be cautious of people who:</Text>
      {tenants.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
            {item}
          </Text>
        </View>
      ))}

      <Text style={[styles.subTitle]}>
        2. Never Share Legal or Financial Details
      </Text>

      <View style={styles.listItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
          Do not share sale deeds, bank details, or ownership papers unless
          legal purpose.
        </Text>
      </View>

      <Text style={[styles.subTitle]}>3. Report Suspicious Behaviour</Text>
      <View style={styles.listItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
          If someone tries to misuse your listing or documents, report them to
          us immediately.
        </Text>
      </View>

      <Text style={styles.title}>4. Why Propenu Is Different</Text>
      <Text style={styles.content}>
        Unlike traditional portals, Propenu prevents fraud before it reaches
        you. You’re not just browsing; you’re operating inside a trusted
        ecosystem.
      </Text>

      <Text style={[styles.subTitle]}>
        {" "}
        <Entypo name="check" size={14} color="#27AE60" /> KYC-Verified Users
        Only
      </Text>
      <View style={[styles.listItem, { paddingLeft: 10 }]}>
        <Text style={styles.bullet}>•</Text>
        <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
          We confirm the identity of every user so you connect only with real
          people.
        </Text>
      </View>

      <Text style={[styles.subTitle]}>
        {" "}
        <Entypo name="check" size={14} color="#27AE60" /> Screened Properties
      </Text>
      <View style={[styles.listItem, { paddingLeft: 10 }]}>
        <Text style={styles.bullet}>•</Text>
        <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
          Every property is reviewed by our team to ensure it’s genuine.
        </Text>
      </View>

      <Text style={[styles.subTitle]}>
        {" "}
        <Entypo name="check" size={14} color="#27AE60" /> Zero Spam & No Bots
      </Text>
      <View style={[styles.listItem, { paddingLeft: 10 }]}>
        <Text style={styles.bullet}>•</Text>
        <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
          Our systems actively block fake listings and suspicious activity.
        </Text>
      </View>

      <Text style={[styles.subTitle]}>
        {" "}
        <Entypo name="check" size={14} color="#27AE60" /> Secure Communication &
        Data
      </Text>
      <View style={[styles.listItem, { paddingLeft: 10 }]}>
        <Text style={styles.bullet}>•</Text>
        <Text style={[styles.content, { paddingLeft: 10, width: "95%" }]}>
          Your data is protected and continuously monitored for unusual
          activity.
        </Text>
      </View>
      <Text style={[styles.subContent, { backgroundColor: "#f9efe0" }]}>
        Something Feels Wrong?{"\n"}
        If you ever notice misleading information or suspicious behaviour, use
        <Text
          style={{ color: "#7b7020", paddingTop: 4 }}
        //   onPress={() => navigation.navigate("upComingScreen")}
        >
          {" "}
          Report an Issue.
        </Text>
        {"\n"}
        We investigate every report to keep Propenu safe for everyone.
      </Text>

      <Text
        style={[
          styles.subContent,
          { backgroundColor: "#e4e5e4", textAlign: "center", marginTop: 20 },
        ]}
      >
        Your safety is our priority. Thank you for choosing Propenu.
      </Text>
    </ScrollView>
  );
};
export default SafetyGuide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    marginVertical: 12,
  },
  content: {
    fontSize: 13,
    textAlign: "justify",
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    // marginBottom: 4,
    marginLeft: 5,
    marginTop: 5,
  },
  bullet: {
    fontSize: 18,
    marginRight: 2,
  },

  subContent: {
    fontSize: 13,
    textAlign: "justify",
    lineHeight: 22,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginVertical: 5,
  },
});
