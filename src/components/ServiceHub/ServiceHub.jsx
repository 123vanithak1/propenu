import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import {
  HomeCare,
  HomeLoans,
  HomeInterior,
  ArrowIcon,
  TopRightArrow,
} from "../../../assets/svg/Logo";
import useCity from "../CustomHooks/useCity";
import upcomingPage from "../../../assets/upcomingPage.png";
import { useNavigation } from "@react-navigation/native";

const ServiceHub = () => {
  const { selectedCity } = useCity();
  const navigation = useNavigation();

  const handleClick = () => {
    console.log("haiiii");
    navigation.navigate("upComingScreen");
  };

  const UpComingPageWithImage = () => {
    return (
      <View style={styles.upcomingPage}>
        <Image source={upcomingPage} style={{ height: 200, width: "100%" }} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Our Services</Text>
      <Text style={styles.subtitle}>
        Building excellence in {selectedCity?.city ?? "Hyderabad"}
      </Text>

      <View style={styles.subContainer}>
        <Pressable style={styles.homeLoans} onPress={handleClick}>
          <HomeLoans width={30} height={30} />
          <Text style={[styles.bodyTitle]}>
            Easy Home Loans with Expert Support
          </Text>
          <Text style={styles.bodyText}>
            Get easy access to home loans with fast approvals and competitive
            interest rates. Our experts guide you through eligibility,
            documentation, and lender selection.
          </Text>
          <Pressable
            style={styles.knowButton}
            onPress={() => navigation.navigate("upComingScreen")}
          >
            <Text style={{ color: "#AE276B", fontWeight: 500, lineHeight: 18 }}>
              Know More{" "}
            </Text>
            <View style={styles.arrowIcon}>
              <ArrowIcon width={24} height={24} />
            </View>
          </Pressable>
        </Pressable>

        <View style={styles.devider}>
          <Pressable style={styles.homeCare} onPress={handleClick}>
            <View style={styles.row}>
              <HomeCare width={35} height={35} />
              <TopRightArrow width={30} height={30} style={styles.arrowIcon} />
            </View>

            <Text style={styles.bodyTitle}>Professional Home Care</Text>
            <Text style={styles.bodyText}>
              Quick approvals, low interest, zero hassle End-to-End Support.
            </Text>
          </Pressable>

          <Pressable style={styles.interior} onPress={handleClick}>
            <View style={styles.row}>
              <HomeInterior width={30} height={30} />
              <TopRightArrow
                width={30}
                height={30}
                color="#8F3AFF"
                style={styles.arrowIcon}
              />
            </View>
            <Text style={styles.bodyTitle}>Modern Interior Designers</Text>
            <Text style={styles.bodyText}>
              Quick approvals, low interest, zero hassle End-to-End Support.
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default ServiceHub;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    margin: 10,
    marginBottom: 25
  },

  upcomingPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "#8f8d87ff",
    marginBottom: 5,
    marginTop: 2,
  },
  subContainer: {
    position: "relative",
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  homeLoans: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
  },
  devider: {
    width: "48%",
    gap: 8,
  },
  homeCare: {
    backgroundColor: "#fff",
    padding: 5,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    borderRadius: 8,
  },
  interior: {
    backgroundColor: "#fff",
    padding: 5,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    borderRadius: 8,
  },
  bodyTitle: {
    paddingVertical: 9,
    color: "#000",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 600,
  },
  bodyText: {
    color: "#8C8989",
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 21,
  },
  knowButton: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  arrowIcon: {
    top: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
