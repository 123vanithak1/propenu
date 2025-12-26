import { View, Text, TextInput, StyleSheet } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const SearchBar = () => {

  return (
    <View style={styles.search}>
      <EvilIcons style={{ width: 20 }} name="search" size={24} color="gray" />
      <TextInput style={styles.input} value="" placeholder="Search... " placeholderTextColor="gray"/>
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "75%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#8ee2b1ff",
    borderRadius: 10,
    backgroundColor:"white"
  },
  input: {
    width: "88%",
    borderWidth: 0,
    paddingVertical: 5,
    borderColor: "red",
    
  },
});
export default SearchBar;
