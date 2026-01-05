import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import useDimensions from "../../components/CustomHooks/UseDimension";


const CardHome = ({ title, icon, onPress }) => {
  const { width, height, isLandscape } = useDimensions();
const CARD_WIDTH = width / 4 - 12; 

  return (
    <TouchableOpacity style={[styles.card,{width: width * 0.2}]} onPress={onPress}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
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