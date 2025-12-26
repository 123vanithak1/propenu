import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CardHome = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 80,
    padding: 10,
    marginVertical:10,
    borderRadius: 7,
    backgroundColor: "#fff",
    alignItems: "center",
    marginRight: 5,
    elevation: 3,
  },
  iconContainer: {
    borderRadius:"50%",
    padding:5,
    backgroundColor: "#d4e0ecff",
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    // fontWeight: "500",
  },
}); 

export default CardHome;
