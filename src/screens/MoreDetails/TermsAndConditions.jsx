import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TermsAndConditions = () => {
  const insets = useSafeAreaInsets();
    {/* -----------------------Static data------------------------*/}
  const features = [
    "Users may create, upload, and manage property listings on the Propenu Platform",
    "All listings must contain accurate, complete, lawful, and up-to-date information",
    "Propenu follows a KYC-based verification process and applies verification checks to reduce spam and fraud",
  ];
  const actions = [
    "Users must not copy, reproduce, modify, distribute, sell, or create derivative works from any part of the Platform without prior written permission from Propenu.",
    "Use of Propenu’s name, logo, branding, or trademarks without authorization is strictly prohibited.",
  ];

  const responsibilities = [
    "Lead and analytics data is provided only for the user’s internal use in relation to their listings or business",
    "Users must not share, sell, distribute, or misuse lead data or analytics information without proper consent or legal basis.",
    "Decisions made based on leads or analytics are the sole responsibility of the user",
  ];
  const details = [
    "Fees paid are non-refundable, unless otherwise stated in a specific refund or cancellation policy",
    "Users agree to pay all fees associated with the services they choose to use.",
    "A subscription is valid for one property only and is non-transferable to another property or another user; once the listed property is sold or rented, the remaining subscription period cannot be reused and a new subscription will be required for new property.",
    "Failure to complete payment may result in restricted access, suspension, or termination of paid features or services.",
  ];

  const activities = [
    "Posting false, misleading, fraudulent, or unlawful property information or content.",
    "Using the Platform for any illegal purpose or in violation of applicable laws or regulations.",
    "Attempting to hack, disrupt, damage, or interfere with the Platform, servers, networks, or security systems.",
    "Misusing, copying, scraping, selling, or distributing Platform data, leads, or content without authorization.",
    "Impersonating another person, entity, or misrepresenting identity or authority.",
    "Uploading content that infringes third-party rights, including ownership, contractual, or intellectual property rights.",
    "Using automated tools, bots, or scripts to access or interact with the Platform without permission.",
    "Engaging in abusive, harmful, defamatory, or offensive behaviour toward other users or Propenu.",
  ];
  
    {/* -----------------------UI------------------------*/}
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 6,
      }}
    >
      <Text style={styles.title}>Welcome to Propenu</Text>

      <Text style={styles.content}>
        By accessing or using our platform, you agree to these Terms &
        Conditions and our Privacy Policy. Please read carefully.{"\n"}
        {"\n"}
        These Terms & Conditions ("Terms") govern your access to and use of the
        Propenu website, mobile application, and all related features, tools,
        and services (collectively referred to as the "Platform" or "Services").
        {"\n"}
        {"\n"}
        Propenu ("we", "our", "us") provides a technology-driven real estate
        platform that enables users to list, search, discover, and enquire about
        properties, and to communicate with other users including buyers,
        sellers, owners, agents, builders, and developers.{"\n"}
        {"\n"}
        By accessing, browsing, registering on, or using the Propenu Platform or
        Services, you agree to be bound by these Terms, along with our Privacy
        Policy and any other applicable policies. If you do not agree to these
        Terms, you should not access or use the Platform or Services.{"\n"}
        {"\n"}
        These Terms apply to all users of the Platform, including but not
        limited to owners, buyers, sellers, landlords, tenants, agents,
        builders, developers, advertisers, and general website visitors.{"\n"}
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#ebf5f7" }]}>
        Propenu reserves the right to modify or update these Terms at any time.
        Changes will be effective upon posting on the Platform, and continued
        use of the Services constitutes acceptance of the updated Terms.
      </Text>
      <Text style={styles.title}>1. Acceptance of Terms</Text>

      <Text style={styles.content}>
        Trust is at the core of Propenu. Every user and property listing on the
        By accessing or using the Propenu Platform or Services, you agree to be
        bound by these Terms & Conditions and all applicable policies, including
        the Privacy Policy.{"\n"}
        {"\n"}
        If you do not agree to these Terms, you must not access or use the
        Platform.{"\n"}
        {"\n"}
        Your continued use of Propenu after any updates or changes to these
        Terms constitutes your acceptance of the revised Terms.
      </Text>
      <Text style={styles.title}>2. User Accounts</Text>

      <Text style={styles.content}>
        Some features of the Propenu Platform require users to create an
        account. Users must provide accurate, current, and complete information
        during registration and keep their account details updated.{"\n"}
        {"\n"} You are responsible for maintaining the confidentiality of your
        login credentials and for all activities carried out under your account.{" "}
        {"\n"}
        {"\n"}Users may choose to deactivate their account at any time. Propenu
        is not responsible for any loss or damage resulting from unauthorized
        access to your account due to your failure to secure your credentials.
        {"\n"}
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#faefe6" }]}>
        Propenu reserves the right to suspend, restrict, or terminate accounts
        that violate these Terms, applicable laws, or engage in fraudulent,
        misleading, or harmful activities.
      </Text>
      <Text style={styles.title}>3. Listings & Content</Text>
      <Text style={styles.subTitle}>Key Requirements:</Text>
      {features.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
        </View>
      ))}
      <Text style={styles.content}>
        {"\n"}
        While Propenu takes reasonable steps to verify users and listings, the
        responsibility for accuracy, legality, and validity remains solely with
        the user who posts it. {"\n"}
        {"\n"}Users must ensure that their listings do not infringe any
        third-party rights, including ownership, contractual, or intellectual
        property rights. {"\n"}
        {"\n"}Propenu is not a party to any transaction between users and does
        not guarantee the outcome, completion, or quality of any property deal
        arising from listings on the Platform.{"\n"}
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#f4f7ed" }]}>
        Propenu may review, approve, modify, restrict, or remove any listing or
        content that violates these Terms, applicable laws, or platform
        policies, or that is misleading, incomplete, or har mful.
      </Text>
      <Text style={styles.title}>4. Ads & Sponsored Listings</Text>
      <Text style={styles.content}>
        Propenu may display advertisements, promoted content, sponsored
        listings, banners, or featured placements across the Platform.{"\n"}{" "}
        {"\n"}Sponsored or promoted listings may receive higher visibility, such
        as priority placement in search results, locality pages, or homepage
        sections.{"\n"}
        {"\n"}
        Advertisers may include owners, agents, builders, developers, banks, or
        other real estate–related service providers.{"\n"}
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#f5edf7" }]}>
        <Text style={styles.subTitle}>Important Notice:</Text>
        {"\n"}
        Participation in paid promotions or sponsored placements does not
        guarantee leads, enquiries, or transaction outcomes.{"\n"}
        {"\n"}
        Propenu does not endorse or guarantee the accuracy, quality, or legality
        of any advertised or sponsored content, including advertisements from
        banks or service providers.
        {"\n"}
        {"\n"}
        Users acknowledge that sponsored content is part of Propenu’s business
        model and agree to the display of such content while using the Platform.
      </Text>

      <Text style={styles.title}>5. Intellectual Property</Text>
      <Text style={styles.content}>
        All content, software, design, logos, trademarks, and materials
        available on the Propenu Platform are owned by or licensed to Propenu,
        unless stated otherwise.
        {"\n"}
        {"\n"}Users are granted a limited, non-exclusive, non-transferable right
        to access and use the Platform for personal or business purposes in
        accordance with these Terms.{"\n"}
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#edf7ee" }]}>
        <Text style={styles.subTitle}>Prohibited Actions:</Text>
        {"\n"}

        {actions.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
          </View>
        ))}
      </Text>

      <Text style={[styles.content, { paddingTop: 10 }]}>
        {"\n"}Any feedback, suggestions, or ideas shared with Propenu may be
        used by Propenu without obligation or compensation to the user.
      </Text>

      <Text style={styles.title}>6. Lead Management & Analytics</Text>
      <Text style={styles.content}>
        Propenu provides tools that allow users to receive, view, manage, and
        respond to enquiries or leads generated through the Platform.
        {"\n"}
        {"\n"}
        Analytics and insights may be provided to help users understand listing
        performance, engagement, and response activity.{"\n"}
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#f7edf7" }]}>
        <Text style={styles.subTitle}>Your Responsibilities:</Text>
        {"\n"}

        {responsibilities.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
          </View>
        ))}
      </Text>

      <Text style={styles.content}>
        {"\n"}Propenu does not guarantee the volume of leads, user intent, or
        conversion outcomes, and analytics data reflects user interactions and
        trends, not guaranteed results.
      </Text>

      <Text style={styles.title}>7. Fees and Payments</Text>
      <Text style={styles.content}>
        Certain features or services on Propenu may require payment, including
        subscription plans or promotional services.
        {"\n"}
        {"\n"}
        All applicable fees, pricing, and payment terms will be clearly
        communicated at the time of purchase.
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#f7efed" }]}>
        <Text style={styles.subTitle}>Subscription Details:</Text>
        {"\n"}

        {details.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
          </View>
        ))}
      </Text>

      <Text style={styles.content}>
        {"\n"}Propenu reserves the right to modify pricing, subscription plans,
        or payment structures, with prior notice where applicable.
      </Text>
      <Text style={styles.title}>8. Privacy</Text>
      <Text style={styles.content}>
        Propenu respects user privacy and is committed to protecting personal
        data.{"\n"}
        {"\n"}
        The collection, use, storage, and processing of personal information is
        governed by Propenu's Privacy Policy.{"\n"}
        {"\n"}
        By using the Propenu Platform, users consent to the handling of their
        information in accordance with the Privacy Policy.
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#edf0f7" }]}>
        Users are encouraged to review the Privacy Policy to understand how
        their data is managed and protected.
      </Text>

      <Text style={styles.title}>9. Prohibited Activities</Text>
      <Text style={styles.subTitle}>
        Users agree not to engage in any of the following activities:
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#f5f7ed" }]}>
        {activities.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.content, { width: "95%" }]}>{item}</Text>
          </View>
        ))}
      </Text>

      <Text style={styles.title}>10. Disclaimers & Liability</Text>

      <Text style={[styles.subContent, { backgroundColor: "#f7edf3" }]}>
        <Text style={styles.subTitle}>Limitation of Liability:</Text>
        {"\n"}
        Propenu provides the Platform and Services on an "as is" and "as
        available" basis without warranties of any kind.{"\n"}
        To the maximum extent permitted by law, Propenu shall not be liable for
        any direct, indirect, incidental, consequential, or special damages
        arising out of the use or inability to use the Platform.
      </Text>

      <Text style={styles.content}>
        {"\n"}Propenu does not guarantee uninterrupted access, error-free
        operation, or specific results from using the Platform.{"\n"}
        {"\n"}
        Propenu is not responsible for any losses, damages, delays, or disputes
        arising from interactions or transactions between users.{"\n"}
        {"\n"}
        Property listings, analytics, leads, and other content are provided for
        informational purposes only and don't constitute professional, legal, or
        financial advice.{"\n"}
        {"\n"}
        Users acknowledge and agree that they are solely responsible for their
        use of the Platform.
      </Text>

      <Text style={styles.title}>10. Disclaimers & Liability</Text>
      <Text style={styles.content}>
        Propenu may suspend or terminate a user's account if the user violates
        these Terms, applicable laws, or platform policies.
        {"\n"}
        {"\n"}
        Accounts may also be restricted or terminated in cases of fraudulent,
        misleading, abusive, or harmful activities.
      </Text>

      <Text style={[styles.subContent, { backgroundColor: "#edf0f7" }]}>
        Users may deactivate their account at any time, and Propenu may
        terminate accounts for policy violations; in either case, any
        obligations or responsibilities that arose while the account was active
        will continue to apply.
      </Text>
      <Text style={styles.title}>12. Governing Law or Jurisdiction</Text>

      <Text style={styles.content}>
        These Terms & Conditions shall be governed by and interpreted in
        accordance with the laws of India.
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#f7eeed" }]}>
        <Text style={styles.subTitle}>Jurisdiction:{"\n"}</Text>
        All disputes, claims, or legal proceedings arising out of or relating to
        the use of the Propenu Platform or Services shall be subject to the
        exclusive jurisdiction of the courts located in Hyderabad, Telangana,
        India.
      </Text>
      <Text style={styles.title}>13. Changes to Terms</Text>
      <Text style={styles.content}>
        Propenu may update or modify these Terms & Conditions from time to time.
        {"\n"}
        {"\n"}
        Any changes will be effective once posted on the Platform with a revised
        effective date.
      </Text>
      <Text style={[styles.subContent, { backgroundColor: "#eff7ed" }]}>
        Continued use of the Propenu Platform after such changes constitutes
        acceptance of the updated Terms.
        {"\n"}
        Users are encouraged to review these Terms periodically to stay
        informed.{"\n"}
      </Text>
      <Text
        style={[
          styles.subContent,
          { backgroundColor: "#e4e3e6", textAlign: "center", },
        ]}
      >
        If you have questions about these Terms & Conditions, please contact us.
      </Text>
    </ScrollView>
  );
};
export default TermsAndConditions;

  {/* -----------------------Styles-----------------------*/}
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

  subTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginVertical: 5,
  },
  content: {
    fontSize: 13,
    textAlign: "justify",
    lineHeight: 22,
  },
  subContent: {
    fontSize: 13,
    textAlign: "justify",
    lineHeight: 22,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
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
    marginRight: 8,
  },
});
