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
        Services tailored for {selectedCity?.city ?? "Hyderabad"} residents
      </Text>

      <View style={styles.subContainer}>
        <Pressable style={styles.homeLoans} onPress={handleClick}>
          {/* <HomeLoans width={30} height={30} /> */}
          <View style={styles.row}>
            <HomeLoans width={32} height={32} />

            <TopRightArrow
              width={30}
              height={30}
              color="#AE276B"
              style={styles.arrowIcon}
            />
          </View>

          <Text style={[styles.bodyTitle]}>
            Easy Home Loans with Expert Support
          </Text>
          <Text style={styles.bodyText}>
            Quick approvals, low interest, zero hassle.
          </Text>
          {/* <Pressable
            style={styles.knowButton}
            onPress={() => navigation.navigate("upComingScreen")}
          >
            <Text style={{ color: "#AE276B", fontWeight: 500, lineHeight: 18 }}>
              Know More{" "}
            </Text> */}
          {/* <View style={styles.arrowIcon}>
              <ArrowIcon width={24} height={24} />
            </View> 
          </Pressable>*/}
        </Pressable>

        <View style={styles.devider}>
          <Pressable style={styles.homeCare} onPress={handleClick}>
            <View style={styles.row}>
              <HomeCare width={35} height={35} />

              <TopRightArrow width={30} height={30} style={styles.arrowIcon} />
            </View>

            <Text style={styles.bodyTitle}>Professional Home Care</Text>
            <Text style={styles.bodyText}>
              Reliable cleaning, repairs and maintenance
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
              Transforming your space with expert creativity.
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
    // width: "100%",
    margin: 10,
    marginBottom: 25,
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
    marginBottom: 7,
    marginTop: 4,
  },
  subContainer: {
    position: "relative",
    marginVertical: 10,
    // width: "100%",
    // flexDirection: "row",
  },
  homeLoans: {
    // width: "92%",
    // marginHorizontal:10,
    backgroundColor: "#faf6f8",
    borderRadius: 8,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    marginBottom: 12,
  },
  devider: {
    //  width: "92%",
    marginBottom: 12,
  },
  homeCare: {
    backgroundColor: "#fafbf6",
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    borderRadius: 8,
    marginBottom: 10,
  },
  interior: {
    backgroundColor: "#fbf8fb",
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    borderRadius: 8,
    // marginBottom:10
  },
  bodyTitle: {
    paddingVertical: 4,
    color: "#000",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: 600,
  },
  bodyText: {
    color: "#8C8989",
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 20,
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
