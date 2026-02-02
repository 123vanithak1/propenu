import { View, Image, StyleSheet } from "react-native";
import upcomingPage2 from "../../../assets/coming2.png";
import upcomingPage from "../../../assets/upcomingPage.png";

const UpcomingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={upcomingPage2} style={styles.image} resizeMode="contain" />
    </View>
  );
};

export default UpcomingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "70%",
    height: "100%",
  },
});
