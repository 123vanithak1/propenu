import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

{
  /*-----------------static data------------------ */
}
const FAQ_DATA = [
  {
    id: "1",
    title: "FAQs",
    subtitle: "Core support layer",
    subcategories: [
      {
        id: "1-1",
        title: "General FAQs",
        faqs: [
          {
            id: "1-1-1",
            question: "Do I need to create an account to post my property?",
            answer:
              "Yes. You'll need to sign up or log in to create and manage your property listing. This helps keep your information secure and ensures only you can update or respond to enquiries.",
          },
          {
            id: "1-1-2",
            question:
              "How long does it take for my property to go live after posting?",
            answer:
              "After you submit your property details, the listing goes through a verification process.\n\nProperty verification is typically completed within 24 hours, after which the property is published on the platform.\n\nIn rare cases, verification may take longer due to additional checks or incomplete information. You will be notified once your property is approved.",
          },
          {
            id: "1-1-3",
            question: "Can I list my property for free on Propenu?",
            answer:
              "Yes. Property owners, agents, and builders can post a limited number of properties for free.\n\nTo list more than this limit, a subscription is required.",
          },
          {
            id: "1-1-4",
            question:
              "What is top search visibility, and why should I upgrade?",
            answer:
              "Top search visibility places your property higher in relevant search results.\n\nThis increases exposure, brings more enquiries, and helps close deals faster.",
          },
          {
            id: "1-1-5",
            question: "Does Propenu require KYC to register?",
            answer:
              "Yes. All users including buyers, tenants, owners, agents, and builders must complete KYC verification.\n\nThis helps create a trusted and secure platform.",
          },
        ],
      },

      {
        id: "1-2",
        title: "Buyer FAQs",
        faqs: [
          {
            id: "1-2-1",
            question: "Do I need to complete KYC to enquire about a property?",
            answer:
              "Yes. Buyers must complete KYC verification to contact property owners, agents, or builders.\n\nThis ensures genuine interactions.",
          },
          {
            id: "1-2-2",
            question: "Are all properties listed verified?",
            answer:
              "Yes. All properties are verified before being published to ensure authenticity and prevent fraudulent listings.",
          },
        ],
      },
    ],
  },

  {
    id: "2",
    title: "How Propenu Works",
    subtitle: "Explains the platform clearly",
    subcategories: [
      {
        id: "2-1",
        title: "How listing & searching works",
        faqs: [
          {
            id: "2-1-1",
            question: "How listing & searching works",
            answer:
              "Buyers, tenants, property owners, agents, and builders can use Propenu after completing KYC verification.\n\nProperty owners, agents, and builders can list properties after completing property verification.\n\nOnce verified, listings go live and become visible to buyers and tenants.\n\nBuyers and tenants can search using filters such as location, budget, property type, and purpose (buy or rent).",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Account & Profile Help",
    subtitle: "Important, agreed",
    subcategories: [
      {
        id: "3-1",
        title: "Creating an account",
        faqs: [
          {
            id: "3-1-1",
            question: "Creating an account",
            answer:
              "To use Propenu’s features, users must create an account by signing up with a valid mobile number and email address.\n\nDuring registration, users are required to complete KYC verification to access platform services.\n\nOnce registered, users can log in to their account, manage their profile, and use features relevant to their role — buyer, tenant, property owner, agent, or builder.",
          },
        ],
      },
      {
        id: "3-2",
        title: "Login / OTP issues",
        faqs: [
          {
            id: "3-2-1",
            question: "Login / OTP issues",
            answer:
              "If you’re unable to log in or are not receiving an OTP, ensure that the mobile number or email address entered is correct and active.\n\nCheck your network connection and allow a few moments for the OTP to arrive.\n\nIf the issue persists, try requesting the OTP again or contact Propenu support for assistance.",
          },
        ],
      },
      {
        id: "3-3",
        title: "Updating profile details",
        faqs: [
          {
            id: "3-3-1",
            question: "Updating profile details",
            answer:
              "You can update your profile details at any time by logging into your Propenu account and accessing the Profile or Account Settings section.\n\nThis includes updating your name, contact information, and other relevant details.\n\nKeeping your profile information accurate helps ensure smooth communication and a better experience on the platform.",
          },
        ],
      },
      {
        id: "3-4",
        title: "Account deactivation / deletion",
        faqs: [
          {
            id: "3-4-1",
            question: "Account deactivation / deletion",
            answer:
              "To deactivate your Propenu account, follow these steps:\n\n1. Log in to your Propenu account.\n2. Go to Account Settings or Profile Settings.\n3. Select the Deactivate Account option.\n4. Confirm your request when prompted.\n\nOnce deactivated, your profile and listings will no longer be visible on the platform.\n\nIf you need further assistance, you can contact Propenu support.",
          },
        ],
      },
      {
        id: "3-5",
        title: "Account Re-activation",
        faqs: [
          {
            id: "3-5-1",
            question: "Account Re-activation",
            answer:
              "If your Propenu account has been deactivated, you can request re-activation by contacting the Propenu support team using your registered email address or phone number.\n\nOnce your request is reviewed and verified, your account will be re-activated.\n\nYou will regain access to your profile and listings using the same subscription that was active before deactivation.",
          },
        ],
      },
    ],
  },

  {
    id: "4",
    title: "Verification & Trust",
    subtitle: "Propenu's USP",
    subcategories: [
      {
        id: "4-2",
        title: "Documents required",
        faqs: [
          {
            id: "4-2-1",
            question: "Documents required",
            answer:
              "To complete property verification, upload ANY ONE of the following:\n\n• Encumbrance Certificate\n• Municipal Tax Receipt\n• Water Bill or Electricity Bill\n• Sale Deed\n\nSubmitting any one of these documents is sufficient.",
          },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Subscriptions & Payments",
    subtitle: "High-impact, high-queries",
    subcategories: [
      {
        id: "5-1",
        title: "Plans & pricing",
        faqs: [
          {
            id: "5-1-1",
            question: "Plans & pricing",
            answer:
              "Propenu offers subscription plans based on user needs and property usage.\n\nOwners, agents, and builders can post a limited number of properties for free.\n\nTo list more than the free limit, a subscription is required.\n\nSubscriptions provide access to additional features such as increased visibility and extended enquiry access.",
          },
        ],
      },
      {
        id: "5-2",
        title: "Subscription Usage & Property Limits",
        faqs: [
          {
            id: "5-2-1",
            question: "Subscription Usage & Property Limits",
            answer:
              "Each Propenu subscription allows listing a limited number of properties.\n\nOnce the properties listed under a subscription are rented or sold, the remaining subscription validity cannot be transferred to another property.\n\nFor example:\n\nIf an owner, agent, or builder takes a one-month subscription and the listed properties are rented or sold within 15 days, the remaining subscription period cannot be transferred to another property.\n\nA new subscription is required to list a new property.\n\nThis policy applies uniformly to property owners, agents, and builders to ensure fair usage across the platform.",
          },
        ],
      },
      {
        id: "5-3",
        title: "Validity & expiry",
        faqs: [
          {
            id: "5-3-1",
            question: "Validity & expiry",
            answer:
              "Each subscription on Propenu is valid for the duration specified at the time of purchase (for example, one month).\n\nThe subscription period starts from the date it is activated for a specific property.\n\nOnce the subscription expires, the associated property will no longer receive subscription benefits such as enhanced visibility or extended enquiry access.\n\nUsers must renew or purchase a new subscription to continue benefiting from these features.",
          },
        ],
      },
      {
        id: "5-4",
        title: "Refund & billing",
        faqs: [
          {
            id: "5-4-1",
            question: "Refund & billing",
            answer:
              "All subscription payments on Propenu are processed securely through the platform.\n\nSubscription fees are non-refundable once the payment is completed.\n\nUsers can view their subscription history in the dashboard, which shows all past and active subscriptions.",
          },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Contact Support",
    subtitle: "Final safety net",
    subcategories: [
      {
        id: "6-1",
        title: "Support channels",
        faqs: [
          {
            id: "6-1-1",
            question: "Support channels",
            answer:
              "If you need assistance, you can reach the Propenu support team through:\n\n•  Email: contact@propenu.com\n•  Helpline Number: Call our support helpline\n\nOur team will respond and resolve your issue as quickly as possible.",
          },
        ],
      },
    ],
  },
];

const HelpCenter = () => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  {
    /*-----------------UI------------------ */
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 6,
      }}
    >
      <Text style={styles.maintitle}>Hello, we are here to help you!</Text>
      <Text style={styles.smallText}>
        These are the most commonly asked questions to us
      </Text>
      {FAQ_DATA.map((category) => {
        const isCategoryOpen = activeCategory === category.id;

        return (
          <View key={category.id} style={styles.card}>
            {/*-----------------Category------------------ */}
            <TouchableOpacity
              onPress={() =>
                setActiveCategory(isCategoryOpen ? null : category.id)
              }
              style={styles.categoryBtn}
            >
              <Text
                style={[
                  styles.categoryTitle,
                  isCategoryOpen && styles.textColor,
                ]}
              >
                {category.title}
              </Text>

              <Ionicons
                name={isCategoryOpen ? "chevron-up" : "chevron-down"}
                size={17}
                color={isCategoryOpen ? "#27AE60" : "#000"}
              />
            </TouchableOpacity>

            <Collapsible collapsed={!isCategoryOpen}>
              {category.subcategories.map((sub) => {
                const isSubOpen = activeSubcategory === sub.id;

                return (
                  <View key={sub.id} style={styles.subContainer}>
                    {/*{/*-----------------SUBCATEGORY------------------ */}
                    <TouchableOpacity
                      onPress={() =>
                        setActiveSubcategory(isSubOpen ? null : sub.id)
                      }
                      style={styles.subBtn}
                    >
                      <Text
                        style={[
                          styles.subTitle,
                          isSubOpen && { color: "#2ECC71" },
                        ]}
                      >
                        {sub.title}
                      </Text>

                      <Ionicons
                        name={isSubOpen ? "chevron-up" : "chevron-down"}
                        size={15}
                        color={isSubOpen ? "#2ECC71" : "#555"}
                      />
                    </TouchableOpacity>

                    <Collapsible collapsed={!isSubOpen}>
                      {sub.faqs.map((faq) => {
                        const isQuestionOpen = activeQuestion === faq.id;

                        return (
                          <View key={faq.id}>
                            {/*{/*-----------------Questions------------------ */}
                            <TouchableOpacity
                              onPress={() =>
                                setActiveQuestion(
                                  isQuestionOpen ? null : faq.id,
                                )
                              }
                              style={styles.questionBtn}
                            >
                              <Text
                                style={[
                                  styles.questionText,
                                  isQuestionOpen && { color: "#58d98c" },
                                ]}
                              >
                                {faq.question}
                              </Text>

                              <Ionicons
                                name={
                                  isQuestionOpen ? "chevron-up" : "chevron-down"
                                }
                                size={12}
                                color={isQuestionOpen ? "#4ce589" : "#777"}
                              />
                            </TouchableOpacity>
                            <Collapsible collapsed={!isQuestionOpen}>
                              <View style={styles.answerBox}>
                                <Text style={styles.answerText}>
                                  {typeof faq.answer === "string"
                                    ? faq.answer
                                    : " "}
                                </Text>
                              </View>
                            </Collapsible>
                          </View>
                        );
                      })}
                    </Collapsible>
                  </View>
                );
              })}
            </Collapsible>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  maintitle: {
    fontSize: 15,
    fontWeight: 600,
  },
  smallText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    marginBottom: 20,
  },

  categoryBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  subBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  questionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "500",
    // color: "#27AE60",
  },
  textColor: {
    color: "#27AE60",
  },
  subContainer: {
    marginTop: 10,
  },

  subTitle: {
    fontSize: 13,
    fontWeight: "500",
    // color: "#333",
  },

  questionText: {
    fontSize: 13,
    // color: "#444",
  },
  answerBox: {
    paddingVertical: 6,
  },
  answerText: {
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 20,
    color: "#666",
  },
});
