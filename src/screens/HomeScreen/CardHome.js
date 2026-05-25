import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import useDimensions from "../../components/CustomHooks/UseDimension";
import { apiService } from "../../services/apiService";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setListingType } from "../../redux/slice/FilterSlice";

const CardHome = ({ title, icon, id }) => {
  const navigation = useNavigation();
  const { width, height, isLandscape } = useDimensions();
    const dispatch = useDispatch();

  const handlePress = () => {
    console.log("Sending... ", id, title);
    dispatch(setCategory(title));
    dispatch(setListingType({ label: "Sale", value: "sale" }));
    navigation.navigate("PropertyList");
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: width * 0.2 }]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    // paddingHorizontal: 6,
    marginVertical: 10,
    marginHorizontal: 8,
    borderRadius: 7,
    backgroundColor: "#F1FCF5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
});
export default CardHome;
