import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AboutUs = () => {
  const insets = useSafeAreaInsets();
  const features = [
    "Verified and curated property listings",
    "Guided buying and enquiry support",
    "Lead management and analytics for real estate professionals",
    "Access to home finance and post-purchase services",
  ];
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 6,
      }}
    >
      <Text style={styles.title}>About Us</Text>

      <Text style={styles.content}>
        Propenu is a next-generation real estate technology platform that makes
        buying, selling, and managing properties easier through verified data,
        trusted services, and secure transactions. We connect property seekers
        with genuine owners, builders, and agents through a unified digital
        ecosystem that supports every stage of the property journey, from
        verification and discovery to home loan assistance and post-purchase
        services.
      </Text>
      <Text style={styles.title}>Trust & Verification</Text>

      <Text style={styles.content}>
        Trust is at the core of Propenu. Every user and property listing on the
        platform goes through a structured KYC and verification process. This
        helps prevent fraudulent listings and helps ensures zero spam
        interactions, enabling users to make informed and confident property
        decisions.
      </Text>
      <Text style={styles.title}>What We Offer</Text>
      <Text style={styles.content}>
        Propenu goes beyond traditional listing platforms by offering end-to-end
        support across the property journey, including:
      </Text>

      {features.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}

      <View>
        <Text style={styles.title}>Our Vision</Text>
        <Text style={styles.content}>
          Our aim is to create a trusted real estate ecosystem where verified
          users and properties, along with secure transactions, are the
          standard, not optional. Propenu enables users to engage with real
          estate confidently, knowing that every interaction on the platform is
          designed to be safe, purposeful, and valuable.
        </Text>
      </View>
    </ScrollView>
  );
};
export default AboutUs;

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
    marginTop: 7,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
  },
});
